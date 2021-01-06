import React from "react";

function LoadingText(props) {
  let { text } = props;
  return (
    <div
      className={
        "bg-warmgray-100 shadow-xl py-5 px-2 mb-10 sm:mt-20 w-80 h-20 flex justify-center items-center " +
        (text ? "block" : "invisible")
      }
    >
      <p className="text-offblack text-center font-body">{text}</p>
    </div>
  );
}

export default LoadingText;
