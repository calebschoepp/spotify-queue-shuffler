import React from "react";

function LoadingIcon(props) {
  let { isLoading } = props;
  return isLoading ? <p>Loading</p> : null;
}

export default LoadingIcon;
