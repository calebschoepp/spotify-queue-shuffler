import React from "react";
import ReactDOM from "react-dom";
import Help from "./Help";
import { render } from "@testing-library/react";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Help />, div);
});

it("renders image", () => {
  render(<Help />);
  expect(document.querySelector("img").getAttribute("src")).toBe("/Help.png");
});

// I theoretically should test the QnA box appears but I don't think that
// this is worth the effort right now.
