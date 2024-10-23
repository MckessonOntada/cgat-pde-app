import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RadioboxWrapper } from "../RadioboxWrapper";
const items = [
  {
    isDisabled: false,
    label: "Normal",
    value: "1",
  },
  {
    isDisabled: false,
    isChecked: true,
    label: "Selected",
    value: "2",
  },
  {
    isDisabled: true,
    label: "Disabled",
    value: "3",
  },
];

export const MockRadio = (props) => {
  const { value, items } = props;
  const getSelectedItem = (item) => {};
  return (
    <RadioboxWrapper
      value={value}
      items={items}
      direction="column"
      onChangeValue={getSelectedItem}
      id="test"
    ></RadioboxWrapper>
  );
};

describe("MockRadio", () => {
  it("check the default selectedValue", async () => {
    render(<MockRadio items={items} value={"2"} />);
    await expect(screen.getByLabelText("Normal")).not.toBeChecked();
    await expect(screen.getByLabelText("Selected")).toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });
  it("check the disabled value", async () => {
    render(<MockRadio items={items} />);
    fireEvent.click(screen.getByTestId("test-item-2"));
    await expect(screen.getByLabelText("Normal")).not.toBeChecked();
    await expect(screen.getByLabelText("Selected")).not.toBeChecked();
    await expect(screen.getByLabelText("Disabled")).toBeDisabled();
  });
  it("check the other option is getting selected or not", async () => {
    render(<MockRadio items={items} value={"1"} />);
    fireEvent.click(screen.getByLabelText("Normal"));
    await expect(screen.getByLabelText("Normal")).toBeChecked();
    await expect(screen.getByLabelText("Selected")).not.toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });
});
