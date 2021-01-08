import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import Hero from "./Hero";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Hero />, div);
});

it("renders login text", () => {
  const div = document.createElement("div");
  render(<Hero isLoading={false} isAuthenticated={false} />, div);
  expect(
    screen.getByText(/Want to shuffle your Spotify queue\?/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/Login to get started!/i)).toBeInTheDocument();
});

it("renders login text even when loading", () => {
  const div = document.createElement("div");
  render(<Hero isLoading={true} isAuthenticated={false} />, div);
  expect(
    screen.getByText(/Want to shuffle your Spotify queue\?/i)
  ).toBeInTheDocument();
  expect(screen.getByText(/Login to get started!/i)).toBeInTheDocument();
});

it("renders shuffle text", () => {
  const div = document.createElement("div");
  render(<Hero isLoading={false} isAuthenticated={true} />, div);
  expect(screen.getByText(/Go ahead, click the button./i)).toBeInTheDocument();
});

it("renders loading icon", () => {
  const div = document.createElement("div");
  render(<Hero isLoading={true} isAuthenticated={true} />, div);
  expect(document.querySelector("div.loader").getAttribute("style")).toBe(
    "width: 180px; height: 180px;"
  );
});
