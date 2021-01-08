import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import InfoCard from "./InfoCard";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<InfoCard />, div);
});

it("renders the text", () => {
  const div = document.createElement("div");
  const text = "Hello, World!";
  render(<InfoCard text={text} />, div);
  expect(screen.getByText(text)).toBeInTheDocument();
});

it("is invisible with no text", () => {
  const div = document.createElement("div");
  render(<InfoCard />, div);
  expect(document.querySelector("div.invisible")).toBeInTheDocument();
});
