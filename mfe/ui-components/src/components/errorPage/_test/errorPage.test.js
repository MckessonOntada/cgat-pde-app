import { render, screen } from "@testing-library/react";
import React from "react";
import { ErrorPage } from "../ErrorPage";

describe("Error Page", () => {
  const props = {
    errorTitle: "Something Unexpected Happened",
    errorSubtitle: "Sorry, an error has occurred.",
  };
  it("component render correctly", () => {
    render(<ErrorPage {...props} />);
    const titleElem = screen.getByText("Something Unexpected Happened");
    const subTitle = screen.getByText("Sorry, an error has occurred.");
    expect(titleElem).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });

  it("does not display title or subtitle, if title or subtitle is empty", () => {
    render(<ErrorPage {...props} errorTitle="" errorSubtitle="" />);
    const titleElem = screen.getByRole("heading", { level: 1 });
    const subTitle = screen.getByTestId("subtitle");
    expect(titleElem).not.toHaveTextContent();
    expect(subTitle).not.toHaveTextContent();
  });
});
