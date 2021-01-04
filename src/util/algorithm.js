import SpotifyWebApi from "spotify-web-api-js";

const sentinelTrackUri = "spotify:track:4uLU6hMCjMI75M1A2tKUQC";
const sameSongTimeout = 500; // ms
const outcomes = {
  SUCCESS: "success",
  UNAUTHENTICATED: "unauthenticated",
  ERROR: "error",
  CANCELLED: "cancelled",
  NOTHING_PLAYING: "nothing_playing",
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleFatalError(error) {
  // Returns [outcome, null]
  try {
    console.log(error);
    if (error.status === 401) {
      return { outcome: outcomes.UNAUTHENTICATED, count: null };
    }
  } catch (error) {
    console.log("Failed to parse error object");
  }
  return { outcome: outcomes.ERROR, count: null };
}

async function algorithm(accessToken, cancelToken) {
  // Returns [outcome, count]
  // TODO make sure all error handling leaves everything in a stable state
  if (accessToken === "") {
    // This is an error and should never occur
    return { outcome: outcomes.UNAUTHENTICATED, count: null };
  }

  // Setup Spotify client
  let client = new SpotifyWebApi();
  client.setAccessToken(accessToken);

  // Get current song and seek position
  let playerState, currentSongUri, currentSongPosition, currentSongIsPaused;
  try {
    playerState = await client.getMyCurrentPlaybackState();
    if (playerState.item === undefined) {
      return { outcome: outcomes.NOTHING_PLAYING, count: null };
    }
    currentSongUri = playerState.item.uri;
    currentSongPosition = playerState.progress_ms;
    currentSongIsPaused = playerState.is_playing;
  } catch (error) {
    return handleFatalError(error);
  }

  // Pause the player
  try {
    await client.pause();
  } catch (error) {
    // Log the error but don't return, not a huge deal if we don't pause.
    console.log(error);
  }

  // Add sentienl song to the queue
  try {
    await client.queue(sentinelTrackUri);
  } catch (error) {
    return handleFatalError(error);
  }

  // Log and skip songs until sentinel song is found
  let queuedSongs = [];
  let prevUri = currentSongUri;
  while (true) {
    if (cancelToken.isCancellationRequested) {
      console.log("Cancelled");
      return [outcomes.CANCELLED, null];
    }
    // Skip to next song
    try {
      await client.skipToNext();
    } catch (error) {
      return handleFatalError(error);
    }

    // Pause the player
    try {
      await client.pause();
    } catch (error) {
      // Log the error but don't return, not a huge deal if we don't pause.
      console.log(error);
    }

    // Grab next song
    try {
      playerState = await client.getMyCurrentPlaybackState();
    } catch (error) {
      return handleFatalError(error);
    }

    // If the next song is the same then it is plausible that the Spotify web API hasn't updated
    // quickly enough after the song skip. Wait for a bit and check again. If the song is still
    // the same then we assume that a duplicate song was in fact queued.
    if (playerState.item.uri === prevUri) {
      // TODO log how often this happens so I can better tune the timeout value
      await timeout(sameSongTimeout);
      try {
        playerState = await client.getMyCurrentPlaybackState();
      } catch (error) {
        return handleFatalError(error);
      }
    }

    // Check if the sentinel song was found
    if (playerState.item.uri === sentinelTrackUri) {
      break;
    }

    // Add the song id to a list that will be shuffled
    queuedSongs.push(playerState.item.uri);
    prevUri = playerState.item.uri;
  }

  // Shuffle queued songs
  shuffleArray(queuedSongs);

  // Reset player by:
  // Queueing current song
  try {
    await client.queue(currentSongUri);
  } catch (error) {
    return handleFatalError(error);
  }

  // Skipping to current song
  try {
    await client.skipToNext();
  } catch (error) {
    return handleFatalError(error);
  }

  // Seeking to correct spot in song
  try {
    await client.seek(currentSongPosition);
  } catch (error) {
    return handleFatalError(error);
  }

  // Add shuffled songs to queue
  for (let song of queuedSongs) {
    if (cancelToken.isCancellationRequested) {
      console.log("Cancelled");
      return [outcomes.CANCELLED, null];
    }
    try {
      await client.queue(song);
    } catch (error) {
      return handleFatalError(error);
    }
  }

  // Starting the player if necessary
  if (!currentSongIsPaused) {
    try {
      await client.play();
    } catch (error) {
      return handleFatalError(error);
    }
  }

  return { outcome: outcomes.SUCCESS, count: queuedSongs.length };
}

export { algorithm, shuffleArray, outcomes };
