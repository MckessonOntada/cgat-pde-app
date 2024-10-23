import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { SnackBar } from "../SnackBar";

const MockSnackbar = (props) => {
  const customProps = {
    title: "Custom Title",
    description: "Custom Description",
    type: "success",
    duration: "5000",
  };
  return <SnackBar {...customProps} {...props} />;
};

describe("SnackBar Component", () => {
  it("renders correctly with default props", () => {
    const { getByTestId } = render(<MockSnackbar />);
    expect(getByTestId("SnackBar-title")).toBeInTheDocument();
    expect(getByTestId("close-button")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    const { getByText } = render(<MockSnackbar />);
    expect(getByText("Custom Title")).toBeInTheDocument();
    expect(getByText("Custom Description")).toBeInTheDocument();
    // expect(
    //   getByTestId("snackbar-container").childNodes[0].classList.contains(
    //     "success"
    //   )
    // ).toBe(true);
  });

  it("calls onClose when the close button is clicked", () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(<MockSnackbar onClose={onCloseMock} />);
    const closeButton = getByTestId("close-button");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("closes after the specified duration", async () => {
    jest.useFakeTimers();
    const onCloseMock = jest.fn();
    const duration = "3000";
    render(<MockSnackbar duration={duration} onClose={onCloseMock} />);
    expect(onCloseMock).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(onCloseMock).toHaveBeenCalled();
  });

  // it("renders error snackbar", () => {
  //   const { getByTestId } = render(<MockSnackbar type="error" />);
  //   expect(
  //     getByTestId("snackbar-container").childNodes[0].classList.contains(
  //       "error"
  //     )
  //   ).toBe(true);
  // });
});
