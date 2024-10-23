import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  prettyDOM,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MaskedInput } from "../MaskedInput";

describe("Masked Input", () => {
  it("should render masked input component", async () => {
    render(<MaskedInput dataTestId={"mask-input-component"} />);
    const dom = screen.getByTestId("mask-input-component");
    expect(dom).toBeTruthy();
  });

  it("should render masked input value (Phone no. mask)", async () => {
    render(
      <MaskedInput
        dataTestId={"mask-input-component"}
        mask={"XXX-XXX-XXXX"}
        onChangeFn={(e) => {}}
        onBlurFn={(e) => {}}
      />
    );
    const dom = screen.getByTestId("mask-input-component");
    fireEvent.change(dom, { target: { value: "1234567890" } });
    screen.debug(dom);
    expect(dom).toHaveDisplayValue("123-456-7890");
  });

  it("should render masked input value (Date mask)", async () => {
    render(
      <MaskedInput
        dataTestId={"mask-input-component"}
        mask={"XX/XX/XXXX"}
        onChangeFn={(e) => {}}
        onBlurFn={(e) => {}}
      />
    );
    const dom = screen.getByTestId("mask-input-component");
    fireEvent.change(dom, { target: { value: "12302000" } });
    screen.debug(dom);
    expect(dom).toHaveDisplayValue("12/30/2000");
  });

  it("should only let allowed characters to be typed", async () => {
    let { container } = render(
      <MaskedInput
        dataTestId={"mask-input-component"}
        mask={"XX/XX/XXXX"}
        onChangeFn={(e) => {}}
        onBlurFn={(e) => {}}
      />
    );
    const dom = screen.getByTestId("mask-input-component");
    fireEvent.keyDown(dom, { code: 49, key: 1, code: "Digit1" }); // number 1
    fireEvent.keyDown(dom, { code: 50, key: 2, code: "Digit2" }); // number 2
    fireEvent.keyDown(dom, { code: 51, key: 3, code: "Digit3" }); // number 3
    waitFor(() => {
      screen.debug(dom);
      console.log(prettyDOM(dom));
      expect(dom).toHaveDisplayValue("12/3");
    }, 1000);
    fireEvent.keyDown(dom, { code: 8, key: "Backspace", code: "Backspace" }); //backspace
    waitFor(() => {
      screen.debug(dom);
      console.log(prettyDOM(dom));
      expect(dom).toHaveDisplayValue("12");
    }, 1000);
    fireEvent.keyDown(dom, { code: 65, key: "a", code: "KeyA" }); //alphabet a
    waitFor(() => {
      screen.debug(dom);
      console.log(prettyDOM(dom));
      expect(dom).toHaveDisplayValue("12");
    }, 1000);
  });
});
