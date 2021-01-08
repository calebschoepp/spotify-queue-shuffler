import {
  algorithm,
  outcomes,
  shuffleArray,
  sentinelTrackUri,
} from "./algorithm";
import CancellationToken from "./CancellationToken";
import SpotifyWebApi from "spotify-web-api-js";

test("that shuffle does not return same array", () => {
  let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  shuffleArray(a);
  expect(a).not.toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("that shuffle maintains array length", () => {
  let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  shuffleArray(a);
  expect(a.length).toEqual(10);
});

test("that algorithm with empty access token fails", async () => {
  const client = new SpotifyWebApi();
  const accessToken = "";
  const cancelToken = new CancellationToken();

  let { outcome, count } = await algorithm(client, accessToken, cancelToken);
  expect(outcome).toEqual(outcomes.UNAUTHENTICATED);
  expect(count).toBe(null);
});

test("that algorithm with invalid access token fails", async () => {
  const client = new SpotifyWebApi();
  const accessToken = "asd8dfD9dlasf732wld8s9fasDF8";
  const cancelToken = new CancellationToken();

  const setAccessTokenMock = jest.fn();
  SpotifyWebApi.prototype.setAccessToken = setAccessTokenMock;

  const getMyCurrentPlaybackStateMock = jest.fn();
  SpotifyWebApi.prototype.getMyCurrentPlaybackState = getMyCurrentPlaybackStateMock;
  getMyCurrentPlaybackStateMock.mockRejectedValue({ status: 401 });

  let { outcome, count } = await algorithm(client, accessToken, cancelToken);

  expect(setAccessTokenMock.mock.calls[0][0]).toEqual(accessToken);

  expect(outcome).toEqual(outcomes.UNAUTHENTICATED);
  expect(count).toBe(null);
});

test("that algorithm handles nothing playing correctly", async () => {
  const client = new SpotifyWebApi();
  const accessToken = "asd8dfD9dlasf732wld8s9fasDF8";
  const cancelToken = new CancellationToken();

  const setAccessTokenMock = jest.fn();
  SpotifyWebApi.prototype.setAccessToken = setAccessTokenMock;

  const getMyCurrentPlaybackStateMock = jest.fn();
  SpotifyWebApi.prototype.getMyCurrentPlaybackState = getMyCurrentPlaybackStateMock;
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({ item: undefined });

  let { outcome, count } = await algorithm(client, accessToken, cancelToken);

  expect(setAccessTokenMock.mock.calls[0][0]).toEqual(accessToken);

  expect(outcome).toEqual(outcomes.NOTHING_PLAYING);
  expect(count).toBe(null);
});

test("that algorithm handles an empty queue correctly", async () => {
  const client = new SpotifyWebApi();
  const accessToken = "asd8dfD9dlasf732wld8s9fasDF8";
  const cancelToken = new CancellationToken();
  const currentSongUri = "spotify:track:1IF5UcqRO42D12vYwceOY6";
  const currentSongProgress = 1000;

  const setAccessTokenMock = jest.fn();
  SpotifyWebApi.prototype.setAccessToken = setAccessTokenMock;

  const getMyCurrentPlaybackStateMock = jest.fn();
  SpotifyWebApi.prototype.getMyCurrentPlaybackState = getMyCurrentPlaybackStateMock;
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: currentSongUri },
    progress_ms: currentSongProgress,
    is_playing: true,
  });

  const pauseMock = jest.fn();
  SpotifyWebApi.prototype.pause = pauseMock;
  pauseMock.mockResolvedValue();

  const queueMock = jest.fn();
  SpotifyWebApi.prototype.queue = queueMock;
  queueMock.mockResolvedValue();

  const skipToNextMock = jest.fn();
  SpotifyWebApi.prototype.skipToNext = skipToNextMock;
  skipToNextMock.mockResolvedValue();

  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: sentinelTrackUri },
  });

  const seekMock = jest.fn();
  SpotifyWebApi.prototype.seek = seekMock;
  seekMock.mockResolvedValue();

  const playMock = jest.fn();
  SpotifyWebApi.prototype.play = playMock;
  playMock.mockResolvedValue();

  let { outcome, count } = await algorithm(client, accessToken, cancelToken);

  expect(setAccessTokenMock.mock.calls[0][0]).toEqual(accessToken);

  expect(outcome).toEqual(outcomes.SUCCESS);
  expect(count).toBe(0);

  expect(pauseMock.mock.calls.length).toEqual(3);
  expect(getMyCurrentPlaybackStateMock.mock.calls.length).toEqual(2);
  expect(queueMock.mock.calls.length).toEqual(2);
  expect(queueMock.mock.calls[0][0]).toEqual(sentinelTrackUri);
  expect(queueMock.mock.calls[1][0]).toEqual(currentSongUri);
  expect(seekMock.mock.calls.length).toEqual(1);
  expect(seekMock.mock.calls[0][0]).toEqual(currentSongProgress);
  expect(playMock.mock.calls.length).toEqual(1);
});

test("that algorithm handles queue of songs correctly", async () => {
  const client = new SpotifyWebApi();
  const accessToken = "asd8dfD9dlasf732wld8s9fasDF8";
  const cancelToken = new CancellationToken();
  const currentSongUri = "spotify:track:1IF5UcqRO42D12vYwceOY6";
  const currentSongProgress = 1000;
  const queuedSongs = [
    "spotify:track:5LABCxgmP7DATATIJXOh6n",
    "spotify:track:5Ohxk2dO5COHF1krpoPigN",
    "spotify:track:33bURv895AN4FkBvgFo2dx",
  ];

  const setAccessTokenMock = jest.fn();
  SpotifyWebApi.prototype.setAccessToken = setAccessTokenMock;

  const getMyCurrentPlaybackStateMock = jest.fn();
  SpotifyWebApi.prototype.getMyCurrentPlaybackState = getMyCurrentPlaybackStateMock;
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: currentSongUri },
    progress_ms: currentSongProgress,
    is_playing: true,
  });

  const pauseMock = jest.fn();
  SpotifyWebApi.prototype.pause = pauseMock;
  pauseMock.mockResolvedValue();

  const queueMock = jest.fn();
  SpotifyWebApi.prototype.queue = queueMock;
  queueMock.mockResolvedValue();

  const skipToNextMock = jest.fn();
  SpotifyWebApi.prototype.skipToNext = skipToNextMock;
  skipToNextMock.mockResolvedValue();

  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[0] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[1] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[2] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: sentinelTrackUri },
  });

  const seekMock = jest.fn();
  SpotifyWebApi.prototype.seek = seekMock;
  seekMock.mockResolvedValue();

  const playMock = jest.fn();
  SpotifyWebApi.prototype.play = playMock;
  playMock.mockResolvedValue();

  let { outcome, count } = await algorithm(client, accessToken, cancelToken);

  expect(setAccessTokenMock.mock.calls[0][0]).toEqual(accessToken);

  expect(outcome).toEqual(outcomes.SUCCESS);
  expect(count).toBe(3);

  expect(pauseMock.mock.calls.length).toEqual(6);
  expect(getMyCurrentPlaybackStateMock.mock.calls.length).toEqual(5);
  expect(queueMock.mock.calls.length).toEqual(5);
  expect(queueMock.mock.calls[0][0]).toEqual(sentinelTrackUri);
  expect(queueMock.mock.calls[1][0]).toEqual(currentSongUri);
  // Shuffled queue
  const shuffledQueue = queueMock.mock.calls.reduce((accumulator, current) => {
    accumulator.push(current[0]);
    return accumulator;
  }, []);
  expect(shuffledQueue.includes(queuedSongs[0])).toBe(true);
  expect(shuffledQueue.includes(queuedSongs[1])).toBe(true);
  expect(shuffledQueue.includes(queuedSongs[2])).toBe(true);
  expect(seekMock.mock.calls.length).toEqual(1);
  expect(seekMock.mock.calls[0][0]).toEqual(currentSongProgress);
  expect(playMock.mock.calls.length).toEqual(1);
});

test("that algorithm handles queue of songs with duplicates correctly", async () => {
  const client = new SpotifyWebApi();
  const accessToken = "asd8dfD9dlasf732wld8s9fasDF8";
  const cancelToken = new CancellationToken();
  const currentSongUri = "spotify:track:1IF5UcqRO42D12vYwceOY6";
  const currentSongProgress = 1000;
  const queuedSongs = [
    "spotify:track:33bURv895AN4FkBvgFo2dx",
    "spotify:track:5LABCxgmP7DATATIJXOh6n",
    "spotify:track:5LABCxgmP7DATATIJXOh6n",
    "spotify:track:33bURv895AN4FkBvgFo2dx",
  ];

  const setAccessTokenMock = jest.fn();
  SpotifyWebApi.prototype.setAccessToken = setAccessTokenMock;

  const getMyCurrentPlaybackStateMock = jest.fn();
  SpotifyWebApi.prototype.getMyCurrentPlaybackState = getMyCurrentPlaybackStateMock;
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: currentSongUri },
    progress_ms: currentSongProgress,
    is_playing: true,
  });

  const pauseMock = jest.fn();
  SpotifyWebApi.prototype.pause = pauseMock;
  pauseMock.mockResolvedValue();

  const queueMock = jest.fn();
  SpotifyWebApi.prototype.queue = queueMock;
  queueMock.mockResolvedValue();

  const skipToNextMock = jest.fn();
  SpotifyWebApi.prototype.skipToNext = skipToNextMock;
  skipToNextMock.mockResolvedValue();

  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[0] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[1] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[2] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[2] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: queuedSongs[3] },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: sentinelTrackUri },
  });

  const seekMock = jest.fn();
  SpotifyWebApi.prototype.seek = seekMock;
  seekMock.mockResolvedValue();

  const playMock = jest.fn();
  SpotifyWebApi.prototype.play = playMock;
  playMock.mockResolvedValue();

  let { outcome, count } = await algorithm(client, accessToken, cancelToken);

  expect(setAccessTokenMock.mock.calls[0][0]).toEqual(accessToken);

  expect(outcome).toEqual(outcomes.SUCCESS);
  expect(count).toBe(4);

  expect(pauseMock.mock.calls.length).toEqual(7);
  expect(getMyCurrentPlaybackStateMock.mock.calls.length).toEqual(7);
  expect(queueMock.mock.calls.length).toEqual(6);
  expect(queueMock.mock.calls[0][0]).toEqual(sentinelTrackUri);
  expect(queueMock.mock.calls[1][0]).toEqual(currentSongUri);
  // Shuffled queue
  const shuffledQueue = queueMock.mock.calls
    .reduce((accumulator, current) => {
      accumulator.push(current[0]);
      return accumulator;
    }, [])
    .sort();
  expect(shuffledQueue[0]).toEqual("spotify:track:1IF5UcqRO42D12vYwceOY6");
  expect(shuffledQueue[1]).toEqual("spotify:track:33bURv895AN4FkBvgFo2dx");
  expect(shuffledQueue[2]).toEqual("spotify:track:33bURv895AN4FkBvgFo2dx");
  expect(shuffledQueue[3]).toEqual(sentinelTrackUri);
  expect(shuffledQueue[4]).toEqual("spotify:track:5LABCxgmP7DATATIJXOh6n");
  expect(shuffledQueue[5]).toEqual("spotify:track:5LABCxgmP7DATATIJXOh6n");

  expect(seekMock.mock.calls.length).toEqual(1);
  expect(seekMock.mock.calls[0][0]).toEqual(currentSongProgress);
  expect(playMock.mock.calls.length).toEqual(1);
});

test("that algorithm handles queue of songs with duplicate of current song", async () => {
  const client = new SpotifyWebApi();
  const accessToken = "asd8dfD9dlasf732wld8s9fasDF8";
  const cancelToken = new CancellationToken();
  const currentSongUri = "spotify:track:1IF5UcqRO42D12vYwceOY6";
  const currentSongProgress = 1000;

  const setAccessTokenMock = jest.fn();
  SpotifyWebApi.prototype.setAccessToken = setAccessTokenMock;

  const getMyCurrentPlaybackStateMock = jest.fn();
  SpotifyWebApi.prototype.getMyCurrentPlaybackState = getMyCurrentPlaybackStateMock;
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: currentSongUri },
    progress_ms: currentSongProgress,
    is_playing: true,
  });

  const pauseMock = jest.fn();
  SpotifyWebApi.prototype.pause = pauseMock;
  pauseMock.mockResolvedValue();

  const queueMock = jest.fn();
  SpotifyWebApi.prototype.queue = queueMock;
  queueMock.mockResolvedValue();

  const skipToNextMock = jest.fn();
  SpotifyWebApi.prototype.skipToNext = skipToNextMock;
  skipToNextMock.mockResolvedValue();

  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: currentSongUri },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: currentSongUri },
  });
  getMyCurrentPlaybackStateMock.mockResolvedValueOnce({
    item: { uri: sentinelTrackUri },
  });

  const seekMock = jest.fn();
  SpotifyWebApi.prototype.seek = seekMock;
  seekMock.mockResolvedValue();

  const playMock = jest.fn();
  SpotifyWebApi.prototype.play = playMock;
  playMock.mockResolvedValue();

  let { outcome, count } = await algorithm(client, accessToken, cancelToken);

  expect(setAccessTokenMock.mock.calls[0][0]).toEqual(accessToken);

  expect(outcome).toEqual(outcomes.SUCCESS);
  expect(count).toBe(1);

  expect(pauseMock.mock.calls.length).toEqual(4);
  expect(getMyCurrentPlaybackStateMock.mock.calls.length).toEqual(4);
  expect(queueMock.mock.calls.length).toEqual(3);
  expect(queueMock.mock.calls[0][0]).toEqual(sentinelTrackUri);
  expect(queueMock.mock.calls[1][0]).toEqual(currentSongUri);
  expect(queueMock.mock.calls[2][0]).toEqual(currentSongUri);
  expect(seekMock.mock.calls.length).toEqual(1);
  expect(seekMock.mock.calls[0][0]).toEqual(currentSongProgress);
  expect(playMock.mock.calls.length).toEqual(1);
});

// Spotify not playing anything - DONE
// No songs in queue - DONE
// Some songs in queue - DONE
// Duplicate songs in queue - DONE
// Duplicate songs with currently playing - DONE
// Sentinel song is in queue (change sentinel song)
// Cancellation at different points
// Random failures
// Pause failures
// Paused when shuffling vs playing when shuffling
// Freemium user
