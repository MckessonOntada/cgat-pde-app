import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { ProgressButton } from "../ProgressButton";

describe("Progress Bar", () => {
  it("renders progress button", async () => {
    render(<ProgressButton id={"test"} />);
    const element = screen.getByTestId("ProgressButton-test");
    expect(element).toBeTruthy();
  });

  it("Render Default state", async () => {
    render(<ProgressButton id={"test"} children={"Sample Button"} />);
    let element = screen.getByText("Sample Button");
    expect(element).toBeTruthy();
    // check if correct background color applied
    element = screen.getByTestId("ProgressButton-test");
    expect(element).toHaveStyle({
      "background-color": "#007cc1",
      color: "#fff",
    });
  });

  it("disable progress button when processing and display processing text (Processing state)", async () => {
    render(
      <ProgressButton
        id={"test"}
        isProcessing={true}
        processingText={"Processing"}
      />
    );
    let element = screen.getByTestId("ProgressButton-test");
    expect(element).toHaveAttribute("disabled");
    element = screen.getByText("Processing");
    expect(element).toBeTruthy();

    // check if correct background color applied
    element = screen.getByTestId("ProgressButton-test");
    expect(element).toHaveStyle({
      "background-color": "#E7F4E4",
      color: "#48A463",
    });
  });

  it("disable progress button when completed and display completed text (Completed state)", async () => {
    render(
      <ProgressButton
        id={"test"}
        isCompleted={true}
        processingText={"Completed"}
      />
    );
    let element = screen.getByTestId("ProgressButton-test");
    expect(element).toHaveAttribute("disabled");
    element = screen.getByText("Completed");
    expect(element).toBeTruthy();

    // check if correct background color applied
    element = screen.getByTestId("ProgressButton-test");
    expect(element).toHaveStyle({
      "background-color": "#E7F4E4",
      color: "#48A463",
    });
  });
});
