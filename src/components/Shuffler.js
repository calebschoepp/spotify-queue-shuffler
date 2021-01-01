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
    // TODO set domain for security reasons
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

  const handleShuffleQueue = async () => {
    // TODO force loading icon to update
    setIsLoading(true);
    setLoadingText("Shuffling queue. You may hear something.");
    await algorithm(accessToken);
    setLoadingText("");
    setIsLoading(false);
  };

  // TODO use correct URL for prod
  // Build primary button
  const buttonText = cookies[hasAuthedBeforeCookie]
    ? "Shuffle Queue"
    : "Login With Spotify";
  const css = "bg-green-500 text-white text-xl rounded-full px-4 py-1";
  let button = null;
  if (accessToken === "") {
    let loginUrl =
      process.env.REACT_APP_AUTH_ENDPOINT +
      "?client_id=" +
      process.env.REACT_APP_CLIENT_ID +
      "&redirect_uri=" +
      process.env.REACT_APP_REDIRECT_URI +
      "&state=" +
      randomState +
      "&scope=" +
      process.env.REACT_APP_SCOPES +
      "&response_type=token";
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
