import { algorithm, outcomes } from "../util/algorithm";
import { parseHash, parseSearch, randNonce } from "../util/helper";
import { useCookies } from "react-cookie";
import BuyMeACoffee from "./BuyMeACoffee";
import CancellationToken from "../util/CancellationToken";
import Help from "./Help";
import Hero from "./Hero";
import InfoCard from "./InfoCard";
import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const oauthStateCookie = "oauth-state";
const randomState = randNonce(20);
const cancelToken = new CancellationToken();

function Shuffler() {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
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
    setLoadingText("Shuffling queue. You may hear some noises as it works.");
    let { outcome, count } = await algorithm(
      new SpotifyWebApi(),
      accessToken,
      cancelToken
    );
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
          // TODO show how long it took to shuffle the queue?
          setLoadingText(`Shuffled your queue of ${count} songs.`);
        }
        break;
      }
      case outcomes.NOTHING_PLAYING: {
        setLoadingText(
          "Nothing is playing right now. Start by opening Spotify and playing a song."
        );
        break;
      }
      case outcomes.CANCELLED: {
        setLoadingText(
          "You cancelled the operation. Songs may be missing from your queue."
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
  const primaryCss =
    "font-body font-semibold w-64 flex flex-row justify-around items-center py-2 bg-spotifygreen text-white text-xl rounded-full px-4 py-1 select-none focus:outline-none " +
    (isLoading ? "opacity-50" : "shadow-xl");
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
      <a className={primaryCss} href={loginUrl}>
        <img
          src="/Spotify.png"
          width="30"
          height="30"
          alt=""
          className="inline"
        />
        {buttonText}
      </a>
    );
  } else {
    primaryButton = (
      <button className={primaryCss} onClick={handleShuffleQueue}>
        {buttonText}
      </button>
    );
  }

  // Build secondary button
  const secondaryCss =
    "text-red-400 font-body underline py-8 select-none focus:outline-none " +
    (isLoading ? "block" : "invisible");
  let secondaryButton = (
    <button
      className={secondaryCss}
      onClick={() => {
        let msg =
          "Are you sure you would like to stop shuffling your queue? This may leave your queue in an undesirable state.";
        if (window.confirm(msg)) {
          cancelToken.cancel();
        }
      }}
    >
      Stop
    </button>
  );

  return (
    <div className="max-w-xl w-full h-full sm:h-auto flex flex-col justify-end items-center">
      <div className="w-full flex-grow">
        <Hero isLoading={isLoading} isAuthenticated={accessToken !== ""} />
      </div>
      <InfoCard text={loadingText} />
      <div className="flex flex-col justify-start items-center">
        {primaryButton}
        {secondaryButton}
      </div>
      <div className="w-full flex flex-row justify-between sm:justify-center items-center">
        <Help />
        <BuyMeACoffee />
      </div>
    </div>
  );
}

export default Shuffler;
