import React, { useState } from "react";
import LoadingIcon from "./LoadingIcon";
import LoadingText from "./LoadingText";
import SpotifyWebApi from "spotify-web-api-js";

function Shuffler(props) {
  // Props
  let { hasAuthenticatedBefore, accessToken } = props;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("This is some loading text!");

  // Spotify authorization constants
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const clientId = "8a69875eeccc494fbed3d7b97fbc5c34"; // TODO get this from configuration
  const responseType = "token";
  const redirectUri = "http://localhost:3000"; // TODO get this from configuration to support prod
  const state = "123"; // TODO generate randomly and use cookies
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "streaming",
  ];

  const handleShuffleQueue = async () => {
    // TODO make sure all error handling leaves everything in a stable state
    if (accessToken === "") {
      // This is an error and should never occur
      // TODO handle in some way?
      return;
    }

    // Setup Spotify client
    let client = new SpotifyWebApi();
    client.setAccessToken(accessToken);

    // Get current song and seek position
    let playerState, currentSongUri, currentSongPosition, currentSongIsPaused;
    try {
      playerState = await client.getMyCurrentPlaybackState();
    } catch (error) {
      console.log(error);
      return;
    }
    currentSongUri = playerState.item.uri;
    currentSongPosition = playerState.progress_ms;
    currentSongIsPaused = playerState.is_playing;

    // Pause the player
    try {
      await client.pause();
    } catch (error) {
      console.log(error);
      return;
    }

    // Add sentienl song to the queue
    let sentinelTrackUri = "spotify:track:4uLU6hMCjMI75M1A2tKUQC";
    try {
      await client.queue(sentinelTrackUri);
    } catch (error) {
      console.log(error);
      return;
    }

    // Log and skip songs until sentinel song is found
    let queuedSongs = [];
    while (true) {
      // Skip to next song
      try {
        await client.skipToNext();
      } catch (error) {
        console.log(error);
        return;
      }

      // Pause the player
      try {
        await client.pause();
      } catch (error) {
        console.log(error);
        return;
      }

      // Grab next song
      try {
        playerState = await client.getMyCurrentPlaybackState();
      } catch (error) {
        console.log(error);
        return;
      }

      // Check if the sentinel song was found
      if (playerState.item.uri === sentinelTrackUri) {
        break;
      }

      // Add the song id to a list that will be shuffled
      queuedSongs.push(playerState.item.uri);
    }

    // Shuffle queued songs
    shuffleArray(queuedSongs);

    // Reset player by:
    // Queueing current song
    try {
      await client.queue(currentSongUri);
    } catch (error) {
      console.log(error);
      return;
    }

    // Skipping to current song
    try {
      await client.skipToNext();
    } catch (error) {
      console.log(error);
      return;
    }

    // Seeking to correct spot in song
    try {
      await client.seek(currentSongPosition);
    } catch (error) {
      console.log(error);
      return;
    }

    // Starting the player if necessary
    if (!currentSongIsPaused) {
      try {
        await client.play();
      } catch (error) {
        console.log(error);
        return;
      }
    }

    // Add shuffled songs to queue
    for (let song of queuedSongs) {
      try {
        await client.queue(song);
      } catch (error) {
        console.log(error);
        return;
      }
    }
  };

  // Build primary button
  const buttonText = hasAuthenticatedBefore
    ? "Shuffle Queue"
    : "Login With Spotify";
  const css = "bg-green-500 text-white text-xl rounded-full px-4 py-1";
  let button = null;
  if (accessToken === "") {
    let loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes.join(
      "%20"
    )}&response_type=${responseType}`;
    button = (
      <a className={css} href={loginUrl}>
        {buttonText}
      </a>
    );
  } else {
    button = (
      <button
        className={css}
        onClick={() => {
          // TODO force loading icon to update
          setIsLoading(true);
          handleShuffleQueue();
          setIsLoading(false);
        }}
      >
        {buttonText}
      </button>
    );
  }

  return (
    <div>
      <LoadingIcon isLoading={isLoading} />
      <LoadingText text={loadingText} />
      {button}
    </div>
  );
}

// TODO test and move somewhere
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default Shuffler;
