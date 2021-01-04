import { algorithm, outcomes, shuffleArray } from "./algorithm";
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

// test("that algorithm handles nothing playing correctly", async () => {
//   const client = new SpotifyWebApi();
//   const accessToken = "asd8dfD9dlasf732wld8s9fasDF8";
//   const cancelToken = new CancellationToken();

//   const setAccessTokenMock = jest.fn();
//   SpotifyWebApi.prototype.setAccessToken = setAccessTokenMock;

//   const getMyCurrentPlaybackStateMock = jest.fn();
//   SpotifyWebApi.prototype.getMyCurrentPlaybackState = getMyCurrentPlaybackStateMock;
//   getMyCurrentPlaybackStateMock.mockRejectedValue({ status: 401 });

//   let { outcome, count } = await algorithm(client, accessToken, cancelToken);

//   expect(setAccessTokenMock.mock.calls[0][0]).toEqual(accessToken);
//   expect(outcome).toEqual(outcomes.UNAUTHENTICATED);
//   expect(count).toBe(null);
// });

// Spotify not playing anything
// No songs in queue
// Some songs in queue
// Duplicate songs in queue
// Duplicate songs with currently playing
// Sentinel song is in queue (change sentinel song)
// Cancellation at different points
// Random failures
// Pause failures
