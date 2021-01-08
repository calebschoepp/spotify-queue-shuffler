import React from "react";
import ReactDOM from "react-dom";
import InfoCard from "./InfoCard";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<InfoCard />, div);
});
