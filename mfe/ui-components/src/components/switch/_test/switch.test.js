import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Switch } from "../Switch";

const handleToggle = jest.fn();

const MockSwitch = (props) => {
  return (
    <Switch
      handleToggle={handleToggle}
      id="mySwitch"
      value={false}
      {...props}
    />
  );
};

describe("Switch Component", () => {
  it("renders correctly with default props", () => {
    render(<MockSwitch />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it("toggles the switch on user interaction", () => {
    render(<MockSwitch />);
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    expect(handleToggle).toBeCalled();
  });

  it("toggles the switch on Enter key press", () => {
    render(<MockSwitch />);
    const switchElement = screen.getByRole("switch");
    fireEvent.keyPress(switchElement, { key: "Enter", code: 13, charCode: 13 });
    expect(handleToggle).toBeCalled();
    expect(switchElement).toBeChecked();
  });

  it("check if switch is disabled", () => {
    render(<MockSwitch disabled={true} />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeDisabled();
  });

  it("check if label is displayed", () => {
    render(<MockSwitch disabled={true} label="test" />);
    const switchElement = screen.getByText("test");
    expect(switchElement).toBeInTheDocument();
  });

  it("check if label is hidden", async () => {
    render(<MockSwitch label="" />);
    const elem = screen.queryByTestId("id");
    expect(elem).not.toBeInTheDocument();
  });
});
