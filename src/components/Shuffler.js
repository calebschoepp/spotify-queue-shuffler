import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import LoadingIcon from "./LoadingIcon";
import LoadingText from "./LoadingText";
import { algorithm, outcomes } from "../util/algorithm";
import { parseHash, parseSearch, randNonce } from "../util/helper";
import CancellationToken from "../util/CancellationToken";

const oauthStateCookie = "oauth-state";

const randomState = randNonce(20);

const cancelToken = new CancellationToken();

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
    setLoadingText("Shuffling queue. You may hear noises as it works.");
    let { outcome, count } = await algorithm(accessToken, cancelToken);
    switch (outcome) {
      case outcomes.UNAUTHENTICATED: {
        setAccessToken("");
        setLoadingText("Please login again.");
        break;
      }
      case outcomes.ERROR: {
        setLoadingText(
          "Something went wrong on Spotify's end. Please try again."
        );
        break;
      }
      case outcomes.SUCCESS: {
        if (count === 0) {
          setLoadingText(`No songs in your queue to shuffle.`);
        } else {
          setLoadingText(`Shuffled ${count} songs in your queue.`);
        }
        break;
      }
      case outcomes.NOTHING_PLAYING: {
        setLoadingText(
          "Nothing is playing right now. Start by opening Spotify and playing a song."
        );
        break;
      }
      default: {
        setLoadingText("Something went wrong. Please reload the page.");
      }
    }
    setIsLoading(false);
    cancelToken.reset();
  };

  // TODO use correct URL for prod
  // Build primary button
  const buttonText = accessToken ? "Shuffle Your Queue" : "Login With Spotify";
  const css =
    "w-64 flex flex-row justify-around items-center py-2 bg-green-500 text-white text-xl rounded-full px-4 py-1 select-none focus:outline-none";
  let primaryButton = null;
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
    primaryButton = (
      <a className={css} href={loginUrl}>
        <img src="/Spotify.png" className="inline" />
        {buttonText}
      </a>
    );
  } else {
    primaryButton = (
      <button className={css} onClick={handleShuffleQueue}>
        {buttonText}
      </button>
    );
  }

  // Build secondary button
  let secondaryButton = null;
  if (isLoading) {
    secondaryButton = (
      <button
        className="text-red-400 underline pt-8 select-none focus:outline-none"
        onClick={() => {
          let msg =
            "Are you sure you would like to stop shuffling your queue? This may leave your queue in an undesirable state.";
          if (window.confirm(msg)) {
            console.log("Setting cancelled");
            cancelToken.cancel();
          }
        }}
      >
        Stop
      </button>
    );
  }

  return (
    <div className="h-full max-w-md mx-auto flex flex-col justify-center items-center">
      <div className="spacer h-1/6 w-full p-1" />
      <div className="h-1/3 w-full p-1 flex flex-col justify-center items-center">
        <LoadingIcon isLoading={isLoading} />
      </div>
      <div className="h-1/6 w-full p-1 flex flex-col justify-center items-center">
        <LoadingText text={loadingText} />
      </div>
      <div className="flex flex-col justify-top items-center h-1/4 w-full p-1">
        {primaryButton}
        {secondaryButton}
      </div>
      <div className="spacer h-1/6 w-full p-1" />
    </div>
  );
}

export default Shuffler;
