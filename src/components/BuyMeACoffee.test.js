import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import BuyMeACoffee from "./BuyMeACoffee";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<BuyMeACoffee />, div);
});

it("renders link", () => {
  render(<BuyMeACoffee />);
  expect(document.querySelector("a").getAttribute("href")).toBe(
    "https://www.buymeacoffee.com/calebschoepp"
  );
});

it("renders image", () => {
  render(<BuyMeACoffee />);
  expect(document.querySelector("img").getAttribute("src")).toBe(
    "/BuyMeACoffee.png"
  );
});
