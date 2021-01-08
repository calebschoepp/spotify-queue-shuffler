import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import Shuffler from "./Shuffler";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Shuffler />, div);
});

// TODO write some good solid tests for this component
