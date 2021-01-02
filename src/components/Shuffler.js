import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import LoadingIcon from "./LoadingIcon";
import LoadingText from "./LoadingText";
import { algorithm } from "../util/algorithm";
import { parseHash, parseSearch, randNonce } from "../util/helper";

const oauthStateCookie = "oauth-state";
const shuffledMsgTimeout = 5000; // ms

const randomState = randNonce(20);

function Shuffler() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(""); // TODO better default
  const [accessToken, setAccessToken] = useState("");
  const [cookies, setCookie] = useCookies([oauthStateCookie]);

  // Set state cookie
  useEffect(() => {
    // TODO set domain for security reasons
    setCookie(oauthStateCookie, randomState, { path: "/", maxAge: 7200 });
  }, [setCookie]);

  // Run once when app loads
  useEffect(() => {
    // Handle a successful authentication
    let isValid, state, token, error;
    [isValid, state, token] = parseHash(window.location.hash);
    if (isValid && cookies[oauthStateCookie] === state) {
      setAccessToken(token);
      setLoadingText("");
      window.history.pushState("", document.title, window.location.pathname);
      return;
    } else if (isValid && cookies[oauthStateCookie] !== state) {
      // State mismatch, possible security issue, show error
      setLoadingText("Something went wrong.");
      setAccessToken("");
      window.history.pushState("", document.title, window.location.pathname);
      return;
    }

    // Handle a failed authentication
    [isValid, state, error] = parseSearch(window.location.search);
    if (isValid && cookies[oauthStateCookie] === state) {
      setLoadingText(error);
      window.history.pushState("", document.title, window.location.pathname);
    } else if (isValid && cookies[oauthStateCookie] !== state) {
      // State mismatch, possible security issue, show error
      setLoadingText("Something went wrong.");
      setAccessToken("");
      window.history.pushState("", document.title, window.location.pathname);
    }
  }, [cookies]);

  const handleShuffleQueue = async () => {
    // TODO force loading icon to update
    setIsLoading(true);
    setLoadingText(
      "Shuffling queue. You will hear songs being skipped as it works."
    );
    await algorithm(accessToken);
    setLoadingText("Shuffled 11 songs in your queue.");
    setTimeout(() => {
      setLoadingText("");
    }, shuffledMsgTimeout);
    setIsLoading(false);
  };

  // TODO use correct URL for prod
  // Build primary button
  const buttonText = accessToken ? "Shuffle Queue" : "Login With Spotify";
  const css =
    "bg-green-500 text-white text-xl rounded-full px-4 py-1 select-none focus:outline-none";
  let button = null;
  if (!accessToken) {
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
    <div className="h-full flex flex-col justify-center items-center">
      <div className="spacer h-1/6 w-full p-1" />
      <div className="h-1/3 w-full p-1 flex flex-col justify-center items-center">
        <LoadingIcon isLoading={isLoading} />
      </div>
      <div className="h-1/6 w-full p-1 flex flex-col justify-center items-center">
        <LoadingText text={loadingText} />
      </div>
      <div className="flex flex-col justify-top items-center h-1/4 w-full p-1">
        {button}
      </div>
      <div className="spacer h-1/6 w-full p-1" />
    </div>
  );
}

export default Shuffler;
