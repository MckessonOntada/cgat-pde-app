import React from "react";
import { Loader } from "../Loader";
import { render, screen } from "@testing-library/react";

const MockLoader = (props) => {
  const customProps = {
    type: "screen",
    variant: "circular",
    loaderText: "Loading...",
    id: "custom-id",
    containerHeight: "200px",
  };
  return <Loader {...customProps} {...props} />;
};
describe("Loader", () => {
  it("render screen type circular loader", () => {
    render(<MockLoader />);
    const elem = screen.getByTestId("content-loader");
    expect(elem).toBeInTheDocument();
    const cirElem = screen.getByRole("progressbar");
    expect(cirElem).toBeInTheDocument();
  });

  it("render screen type text loader", () => {
    render(<MockLoader variant="text" />);
    const elem = screen.getByTestId("content-loader");
    expect(elem).toBeInTheDocument();
    const textElem = screen.getByText("Loading...");
    expect(textElem).toBeInTheDocument();
  });

  it("render inline type circular loader", () => {
    render(<MockLoader type="inline" />);
    const elem = screen.queryByTestId("content-loader");
    expect(elem).not.toBeInTheDocument();
    const cirElem = screen.getByRole("progressbar");
    expect(cirElem).toBeInTheDocument();
  });

  it("render inline type text loader", () => {
    render(<MockLoader variant="text" type="inline" />);
    const elem = screen.queryByTestId("content-loader");
    expect(elem).not.toBeInTheDocument();
    const textElem = screen.getByText("Loading...");
    expect(textElem).toBeInTheDocument();
  });

  it("render screen type circular with text loader", () => {
    render(
      <MockLoader
        variant="circularWithText"
        type="screen"
        loaderText="We are processing the update. Please do not close this tab."
        loaderSize="75px"
      />
    )
    const elem = screen.queryByTestId("content-loader")
    expect(elem).toBeInTheDocument()
    const textElem = screen.getByText(
      "We are processing the update. Please do not close this tab."
    )
    expect(textElem).toBeInTheDocument()
  })
});
