import React from "react";

// TODO improve this component to offer a countdown timer that hides the card
// https://spin.atomicobject.com/2018/11/08/countdown-timer-react-typescript/

function InfoCard(props) {
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

export default InfoCard;
