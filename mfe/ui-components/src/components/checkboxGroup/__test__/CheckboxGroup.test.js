import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CheckboxGroup } from "../CheckboxGroup";

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

const MockCheckbox = (props) => {
  const getSelectedItem = (item) => {};
  return (
    <CheckboxGroup
      id="test"
      items={props.items ? props.items : items}
      direction={props?.direction ? props?.direction : "column"}
      onChangeValue={getSelectedItem}
      {...props}
    ></CheckboxGroup>
  );
};

describe("Checkbox", () => {
  let props;
  beforeEach(() => {
    props = {};
  });
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

  it("check the if option is disabled", async () => {
    render(<MockCheckbox />);
    const checkbox = screen.getByLabelText("Disabled");
    expect(checkbox).toBeDisabled();
  });

  it("check the other option is getting selected or not", async () => {
    render(<MockCheckbox />);
    fireEvent.click(screen.getByLabelText("Normal"));
    await expect(screen.getByLabelText("Normal")).toBeChecked();
    await expect(screen.getByLabelText("Selected")).toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });

  it("check if all option is unselected", async () => {
    const list = [...items];
    list[1]["isChecked"] = false;
    render(<MockCheckbox items={list} />);
    await expect(screen.getByLabelText("Normal")).not.toBeChecked();
    await expect(screen.getByLabelText("Selected")).not.toBeChecked();
    await expect(screen.getByLabelText("Disabled")).not.toBeChecked();
  });

  it("check if caption is present", async () => {
    const caption = "Select Item";
    render(<MockCheckbox caption={caption} />);
    const elem = screen.getByText(caption);
    expect(elem).toBeInTheDocument();
  });

  // it("check if checkbox is horizontally align", async () => {
  //   render(<MockCheckbox direction={"row"} />);
  //   const elem = screen.getByTestId("checkbox-container");
  //   expect(elem).toHaveClass("direction-row");
  // });
});
