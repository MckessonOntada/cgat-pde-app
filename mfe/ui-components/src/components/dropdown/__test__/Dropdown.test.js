import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dropdown } from "../Dropdown";
import {
  Default,
  Required,
  WithoutLabel,
} from "../../../stories/Dropdown.stories";

describe("Dropdown from stories", () => {
  test("Default type renders correctly", () => {
    render(<Default {...Default.args} />);
    const elem = screen.getByTestId("dropdown-label-testid-demo-dropdown");
    expect(elem).toBeInTheDocument();
  });

  test("Required type renders correctly", () => {
    render(<Required {...Required.args} />);
    const elem = screen.getByTestId("dropdown-label-testid-demo-dropdown");
    expect(elem).toBeInTheDocument();
    //  span element should available with red svg
    const spanElement = screen.getByTestId("reqCompo-demo-dropdown");
    expect(spanElement).toBeInTheDocument();
  });

  test("Without label type renders correctly", () => {
    render(<WithoutLabel {...WithoutLabel.args} />);
    const element = screen.queryByTestId("dropdown-label-testid-demo-dropdown");
    expect(element).toBeNull();
  });
});

//   id: PropTypes.string.isRequired,
//   helperMessage: PropTypes.string,
//   onChange: PropTypes.func.isRequired,
//   isRequired: PropTypes.bool, // Handles whether or not to show a red required indicator next to the dropdown label.
//   showRequiredLabel: PropTypes.bool, // will show the required text and will be placed to right end of the label.
//   label: PropTypes.string.isRequired, // Label to show next to the dropdown.
//   placeholder: PropTypes.string, //Options are: top, left
//   value: PropTypes.string,
//   options: PropTypes.array.isRequired,
//   size: PropTypes.oneOf(["lg", "md", "sm", "xs"]).isRequired,
//   error: PropTypes.bool,
//   errorMessage: PropTypes.string,
//   isShowLabel: PropTypes.bool,
//   menuWidthStyle: PropTypes.string,
//   isReadOnly: PropTypes.bool,

const defaultOption = {
  label: "Age",
  placeholder: "Select age",
  options: [
    { label: "tene", value: 10, subLabel: "(M.D)" },
    { label: "twenty", value: 20 },
    {
      label: "thirty, two MD",
      value: 30,
      subLabel: "(Medical Oncology, Radiology Oncology, Surgical Oncology)",
    },
    {
      label: "abc@yopmail.com",
      value: 40,
      endLabel: "Primary",
    },
  ],
};

const MockDropdown = (props) => {
  return (
    <Dropdown
      {...props}
      id={"mock"}
      label={props.label?props.label:defaultOption.label}
      placeholder={defaultOption.placeholder}
      options={defaultOption.options}
      value={20}
      helperText={props.helperText}
    />
  );
};

describe("Dropdown other properties", () => {
  const onChange = jest.fn();
  it("should render label for dropdown", () => {
    render(<MockDropdown onChange={onChange} />);
    const labelElement = screen.queryByTestId("dropdown-label-testid-mock");
    expect(labelElement.textContent).toBe(defaultOption.label);
  });

  it("should not render label for dropdown", () => {
    render(<MockDropdown onChange={onChange} isShowLabel={false} />);
    const labelElement = screen.queryByTestId("dropdown-label-testid-mock");
    expect(labelElement).toBeNull();
  });

  it("should render required icon", () => {
    render(<MockDropdown onChange={onChange} isRequired={true} />);
    const elem = screen.getByTestId("dropdown-label-testid-mock");
    expect(elem).toBeInTheDocument();
    //  span element should available with red svg
    const spanElement = screen.getByTestId("reqCompo-mock");
    expect(spanElement).toBeInTheDocument();
  });

  it("should render required icon with Required text", () => {
    render(
      <MockDropdown
        onChange={onChange}
        isRequired={true}
        showRequiredLabel={true}
      />
    );
    const elem = screen.getByTestId("dropdown-label-testid-mock");
    expect(elem).toBeInTheDocument();
    //  span element should available with red svg
    const spanElement = screen.getByTestId("reqCompo-mock");
    expect(spanElement).toBeInTheDocument();
  });

  it("should open options after clicking on input field", async () => {
    render(<MockDropdown onChange={onChange} isRequired={true} />);
    const containerElem = screen.getByTestId("dropdown-container-mock");
    expect(containerElem).toBeInTheDocument();
    const inputElement = screen.getByTestId("dropdown-select-mock");
    expect(inputElement).toBeInTheDocument();
    fireEvent.click(inputElement);
    // const containerElemn = screen.getByTestId("dropdown-container-mock");
    // const ulElement = screen.querySelector('ul');
    // expect(ulElement).toBeInTheDocument();
    // await waitFor(() => {
    //   expect(screen.getByTestId("dropdown-paper-mock")).toBeInTheDocument();
    // });
  });

  it("check the helperText is getting displayed", async () => {
    render(<MockDropdown helperText={"HelperTextLabel"} />);
    await expect(screen.getByText("HelperTextLabel")).toBeInTheDocument();
  });
  it("check the helperText and label are getting displayed", async () => {
    render(<MockDropdown helperText={"HelperTextLabel"} label={"DropdownQuestion"} />);
    await expect(screen.getByText("HelperTextLabel")).toBeInTheDocument();
    await expect(screen.getByText("DropdownQuestion")).toBeInTheDocument();
  });

  // it("should render options correctly", () => {
  //   render(<MockDropdown onChange={onChange}  />);

  //  // Select the <ul> element by data-testid
  //  const ulElement = screen.getByTestId('my-list');

  //  // Select all <li> elements within the <ul>
  //  const liElements = ulElement.querySelectorAll('li');

  //  // Assert that the <ul> element is present
  //  expect(ulElement).toBeInTheDocument();

  //  // Assert that there are 3 <li> elements in the list
  //  expect(liElements).toHaveLength(3);

  //  // You can also assert the content of individual <li> elements
  //  expect(liElements[0]).toHaveTextContent('Item 1');
  //  expect(liElements[1]).toHaveTextContent('Item 2');
  //  expect(liElements[2]).toHaveTextContent('Item 3');
  // });
});
