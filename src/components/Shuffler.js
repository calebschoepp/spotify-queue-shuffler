import React, { useState } from "react";
import { useCookies } from "react-cookie";
import LoadingIcon from "./LoadingIcon";
import LoadingText from "./LoadingText";
import algorithm from "../util/algorithm";

const hasAuthedBeforeCookie = "has-authed-before";
const oauthStateCookie = "oauth-state";

function Shuffler(props) {
  // Props - TODO remove this
  let { accessToken } = props;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("This is some loading text!");
  const [TODOTOKEN, setAccessToken] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies([
    hasAuthedBeforeCookie,
    oauthStateCookie,
  ]);

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

  const handleShuffleQueue = async () => {
    // TODO force loading icon to update
    setIsLoading(true);
    await algorithm(accessToken);
    setIsLoading(false);
  };

  // Build primary button
  const buttonText = cookies[hasAuthedBeforeCookie]
    ? "Shuffle Queue"
    : "Login With Spotify";
  const css = "bg-green-500 text-white text-xl rounded-full px-4 py-1";
  let button = null;
  if (accessToken === "") {
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
