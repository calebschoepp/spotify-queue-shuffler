import React, { useState } from "react";
import LoadingIcon from "./LoadingIcon";
import LoadingText from "./LoadingText";

function Shuffler(props) {
  // Props
  let { hasAuthenticatedBefore, accessToken } = props;

  // State
  const [isLoading, setIsLoading] = useState(false);

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

  const handleShuffleQueue = () => {
    if (accessToken === null) {
      // We need user to authenticate us. Generate redirect url and send user there.
    }
  };

  // Build primary button
  const buttonText = hasAuthenticatedBefore
    ? "Shuffle Queue"
    : "Login With Spotify";
  const buttonClasses =
    "bg-green-500 text-white text-xl rounded-full px-4 py-1";
  let button = null;
  if (accessToken == null) {
    let loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes.join(
      "%20"
    )}&response_type=${responseType}`;
    button = (
      <a className={buttonClasses} href={loginUrl}>
        {buttonText}
      </a>
    );
  } else {
    button = (
      <button className={buttonClasses} onClick={handleShuffleQueue}>
        {buttonText}
      </button>
    );
  }

  return (
    <div>
      <LoadingIcon isLoading={isLoading} />
      <LoadingText text={"This is some loading text!"} />
      {button}
    </div>
  );
}

export default Shuffler;

// TODO implement
// Get access token

// Build api client

// Shuffle queue
