import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { TextareaInput } from "../TextareaInput";

const MockTextareaInput = (props) => {
  return (
    <TextareaInput
      id={"FirstNme"}
      label="First name"
      maxCharLimit={100}
      maxCharWarningLimit={90}
      maxLimitReachedHelpertext={"Character limit reached"}
      maxCharHelperText={"Maximum 100 Characters"}
      tooltipText=""
      {...props}
    />
  );
};

describe("TextareaInput", () => {
  it("should render TextareaInput", async () => {
    render(<MockTextareaInput />);
    const element = screen.getByTestId("textarea-testid-FirstNme");
    expect(element).toBeTruthy();
  });
  it("should render TextareaInput label", async () => {
    render(<MockTextareaInput />);
    const element = screen.getByTestId("label-testid-FirstNme");
    expect(element).toHaveTextContent(`First name`);
  });
  it("should render max char helper text", async () => {
    render(<MockTextareaInput />);
    const element = screen.getByTestId("charlimithelper-testid-FirstNme");
    expect(element).toHaveTextContent(`Maximum 100 Characters`);
  });
  it("should render max char helper text when user enters some content", async () => {
    render(<MockTextareaInput value={"Hello"} />);
    const element = screen.getByTestId("charlimithelper-testid-FirstNme");
    const element2 = screen.getByTestId("charcount-testid-FirstNme");
    expect(element).toHaveTextContent(`Maximum 100 Characters`);
    expect(element2).toHaveTextContent(`(5/100)`);
  });
  it("should render max char limit reached helper text", async () => {
    render(
      <MockTextareaInput
        value={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce iaculis vulputate sapien, at sapientn"
        }
      />
    );
    await waitFor(
      () => {
        const element = screen.getByTestId("charlimithelper-testid-FirstNme");
        const element2 = screen.getByTestId("charcount-testid-FirstNme");
        expect(element).toHaveTextContent(`Character limit reached`);
        expect(element2).toHaveTextContent(`(100/100)`);
      },
      {
        timeout: 1000,
      }
    );
  });

  it("should displays the placeholder text correctly", () => {
    const placeholder = "Type Something";
    render(<MockTextareaInput placeholder={placeholder} />);
    const textarea = screen.getByTestId("textarea-testid-FirstNme");
    expect(textarea).toHaveAttribute("placeholder", placeholder);
  });

  // it("should render required icon when isRequired is true", () => {
  //   const { container } = render(
  //     <MockTextareaInput isRequired={true} isSingleFormField={true} />
  //   );
  //   const elem = container.getElementsByClassName("requiredIcon");
  //   expect(elem.length).toBe(1);
  // });

  it("check if TextareaInput is disabled", () => {
    render(<MockTextareaInput isDisabled={true} />);
    const elem = screen.getByTestId("textarea-testid-FirstNme");
    expect(elem).toBeDisabled();
  });

  // it("should not display required icon when isRequired is false", () => {
  //   const { container } = render(<MockTextareaInput />);
  //   const elem = container.getElementsByClassName("requiredIcon");
  //   expect(elem.length).toBe(0);
  // });

  it("calls the onChangeFn when the content changes", () => {
    const onChangeFn = jest.fn();
    render(<MockTextareaInput onChangeFn={onChangeFn} />);
    const elem = screen.getByTestId("textarea-testid-FirstNme");
    fireEvent.change(elem, { target: { value: "Test text" } });
    expect(onChangeFn).toHaveBeenCalledTimes(1);
  });

  // it("should render underline textareaInput type", () => {
  //   const { container } = render(<MockTextareaInput displayType="underline" />);
  //   const elem = container.getElementsByClassName("underline");
  //   expect(elem.length).toBe(2);
  // });
});
