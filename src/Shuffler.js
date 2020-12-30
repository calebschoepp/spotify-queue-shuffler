import React, { useState } from "react";
import LoadingIcon from "./LoadingIcon";
import LoadingText from "./LoadingText";

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

  const handleShuffleQueue = () => {
    if (accessToken === null) {
      // This is an error and should never occur
      // TODO handle in some way?
      return;
    }

    // Get current song and seek position

    // Pause the player

    // Add sentienl song to the queue

    // Log and skip songs until sentinel song is found

    // Skip to next song

    // Pause the player

    // Grab next song

    // Check if the sentinel song was found

    // Add the song id to a list that will be shuffled

    // Shuffle queued songs

    // Reset player by:
    // Queueing current song

    // Skipping to current song

    // Seeking to correct spot in song

    // Starting the player if necessary

    // Add shuffled songs to queue
  };

  // Build primary button
  const buttonText = hasAuthenticatedBefore
    ? "Shuffle Queue"
    : "Login With Spotify";
  const css = "bg-green-500 text-white text-xl rounded-full px-4 py-1";
  let button = null;
  if (accessToken == null) {
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
      <button className={css} onClick={handleShuffleQueue}>
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

export default Shuffler;

// TODO implement
// Get access token

// Build api client

// Shuffle queue
