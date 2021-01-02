import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

function LoadingIcon(props) {
  let { isLoading } = props;
  return isLoading ? (
    <BounceLoader color={"#1DB954"} loading={isLoading} size={150} />
  ) : null;
}

export default LoadingIcon;
