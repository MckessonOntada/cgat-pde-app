import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CheckboxWrapper } from "../CheckboxWrapper";
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
  {
    isDisabled: false,
    isChecked: true,
    otherValue: "",
    label: "Phone",
    phoneNumberField: true,
    isOther: true,
    optionAttribute: {
      placeholder: "phone input",
    },
    value: "4",
  },
];

export const MockCheckbox = () => {
  const onChnage = (item) => jest.fn();
  return (
    <CheckboxWrapper
      id="test"
      items={items}
      direction="column"
      showFlexWrap={true}
      onOtherTextChange={onChnage}
      caption="Test caption"
    ></CheckboxWrapper>
  );
};

describe("CheckboxGroup", () => {
  it("check the default selectedValue", async () => {
    render(<MockCheckbox />);
    await expect(screen.getByLabelText("Normal")).not.toBeChecked();
    await expect(screen.getByLabelText("Selected")).toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });
  it("check the disabled value", async () => {
    render(<MockCheckbox />);
    fireEvent.click(screen.getByTestId("test-wrapitem-2"));
    await expect(screen.getByLabelText("Normal")).not.toBeChecked();
    await expect(screen.getByLabelText("Selected")).toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });
  it("check the other option is getting selected or not", async () => {
    render(<MockCheckbox />);
    fireEvent.click(screen.getByLabelText("Normal"));
    await expect(screen.getByLabelText("Normal")).toBeChecked();
    await expect(screen.getByLabelText("Selected")).toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });
});
