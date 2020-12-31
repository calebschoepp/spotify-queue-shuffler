import SpotifyWebApi from "spotify-web-api-js";

let sentinelTrackUri = "spotify:track:4uLU6hMCjMI75M1A2tKUQC";

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

async function algorithm(accessToken) {
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
    // TODO return here? Not sure why this could ever error. I'm confused
  }

  // Add sentienl song to the queue
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
}

export default algorithm;
