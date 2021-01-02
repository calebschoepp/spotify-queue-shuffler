import React from "react";

function LoadingText(props) {
  let { text } = props;
  return <p className="text-center w-2/3">{text}</p>;
}

export default LoadingText;
