import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

function Hero(props) {
  let { isLoading, isAuthenticated } = props;
  let content;
  if (!isAuthenticated) {
    content = (
      <div className="font-header font-black text-offblack text-3xl text-center max-w-xs">
        <h1>Want to shuffle your Spotify Queue?</h1>
        <h1 className="mt-8">Login to get started!</h1>
      </div>
    );
  } else if (isLoading) {
    content = (
      <div style={{ width: "180px", height: "180px" }}>
        <BounceLoader color={"#1DB954"} loading={isLoading} size={180} />
      </div>
    );
  } else {
    content = (
      <div className="font-header font-black text-offblack text-3xl text-center max-w-xs">
        <h1>Go ahead, click the button.</h1>
        <h1 className="mt-8">It really is that easy.</h1>
      </div>
    );
  }
  return (
    <div className="w-full h-full px-8 flex justify-center items-center">
      {content}
    </div>
  );
}

export default Hero;
