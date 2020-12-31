import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import LoadingIcon from "./LoadingIcon";
import LoadingText from "./LoadingText";
import { algorithm } from "../util/algorithm";
import { parseHash, parseSearch, randNonce } from "../util/helper";

const hasAuthedBeforeCookie = "has-authed-before";
const oauthStateCookie = "oauth-state";

const randomState = randNonce(20);

function Shuffler() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(""); // TODO better default
  const [accessToken, setAccessToken] = useState("");
  const [cookies, setCookie] = useCookies([
    hasAuthedBeforeCookie,
    oauthStateCookie,
  ]);

  // Run once when app loads
  useEffect(() => {
    // Set state cookie
    // TODO set domain
    setCookie(oauthStateCookie, randomState, { path: "/", maxAge: 7200 });

    // Handle a successful authentication
    // TODO should I remove hash fragment so I don't get weird bugs when user reloads page and would use same token again?
    let isValid, state, token, error;
    [isValid, state, token] = parseHash(window.location.hash);
    if (isValid && cookies[oauthStateCookie] === state) {
      setAccessToken(token);
      setCookie(hasAuthedBeforeCookie, "true");
      return;
    }

    // Handle a failed authentication
    [isValid, state, error] = parseSearch(window.location.search);
    if (isValid && cookies[oauthStateCookie] === state) {
      // TODO do something about the authentication error
      console.log("FAILURE TO AUTH.");
    }
  }, []);

  // Spotify authorization constants
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const clientId = "8a69875eeccc494fbed3d7b97fbc5c34"; // TODO get this from configuration
  const responseType = "token";
  const redirectUri = "http://localhost:3000"; // TODO get this from configuration to support prod
  const scopes = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "streaming",
  ];
  const handleShuffleQueue = async () => {
    // TODO force loading icon to update
    setIsLoading(true);
    setLoadingText("Shuffling queue. You may hear something.");
    await algorithm(accessToken);
    setLoadingText("");
    setIsLoading(false);
  };

  // Build primary button
  const buttonText = cookies[hasAuthedBeforeCookie]
    ? "Shuffle Queue"
    : "Login With Spotify";
  const css = "bg-green-500 text-white text-xl rounded-full px-4 py-1";
  let button = null;
  if (accessToken === "") {
    let loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${randomState}&scope=${scopes.join(
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

  // TODO https://www.davidhu.io/react-spinners/
  return (
    <div>
      <LoadingIcon isLoading={isLoading} />
      <LoadingText text={loadingText} />
      {button}
    </div>
  );
}

export default Shuffler;

// TODO it is weird to show "Shuffle Queue" after the first log in and then make them click it twice to actually shuffle
// TODO https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-deads maybe find an alternative auth flow?
