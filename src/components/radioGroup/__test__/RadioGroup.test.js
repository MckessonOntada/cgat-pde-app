import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RadioGroup } from "../RadioGroup";
const items = [
  {
    isDisabled: false,
    label: "Normal",
    value: "1",
  },
  {
    isDisabled: false,
    isSelected: true,
    label: "Selected",
    value: "2",
  },
  {
    isDisabled: true,
    label: "Disabled",
    value: "3",
  },
];

const MockRadio = (props) => {
  const { value } = props;
  const getSelectedItem = (item) => {};
  return (
    <RadioGroup
      value={value}
      items={items}
      direction="column"
      onChangeValue={getSelectedItem}
      id="test"
      {...props}
    ></RadioGroup>
  );
};

describe("MockRadio", () => {
  it("check the default selectedValue", async () => {
    render(<MockRadio value="2" />);
    await expect(screen.getByLabelText("Normal")).not.toBeChecked();
    await expect(screen.getByLabelText("Selected")).toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });
  it("check the disabled value", async () => {
    render(<MockRadio value="3" />);
    fireEvent.click(screen.getByTestId("test-item-2"));
    await expect(screen.getByLabelText("Normal")).not.toBeChecked();
    await expect(screen.getByLabelText("Selected")).not.toBeChecked();
    await expect(screen.getByLabelText("Disabled")).toBeDisabled();
  });
  it("check the other option is getting selected or not", async () => {
    render(<MockRadio value="1" />);
    fireEvent.click(screen.getByLabelText("Normal"));
    await expect(screen.getByLabelText("Normal")).toBeChecked();
    await expect(screen.getByLabelText("Selected")).not.toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });

  it("check the if option is disabled", async () => {
    render(<MockRadio />);
    const checkbox = screen.getByLabelText("Disabled");
    expect(checkbox).toBeDisabled();
  });
  // it("check if radio button group is horizontally align", async () => {
  //   render(<MockRadio direction={"row"} />);
  //   const elem = screen.getByTestId("radio-container");
  //   expect(elem).toHaveClass("direction-row");
  // });
});
