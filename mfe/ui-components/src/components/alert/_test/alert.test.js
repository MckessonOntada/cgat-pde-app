import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  Default,
  Error,
  Info,
  Large,
  Small,
} from "../../../stories/Alert.stories";

describe("Alert", () => {
  test("Default type renders correctly", () => {
    render(<Default {...Default.args} />);
    const elem = screen.getByTestId("alert-title");
    expect(elem).toBeInTheDocument();
  });

  test("title should be visible", () => {
    const title = "New Alert";
    render(<Default {...Default.args} title={title} />);
    const elem = screen.getByText(title);
    expect(elem).toHaveTextContent(title);
  });

  test("of type info renders correctly", () => {
    render(<Info {...Info.args} />);
    const elem = screen.getByTestId("alert-container");
    expect(elem).toBeInTheDocument();
  });

  test("of type error renders correctly", () => {
    render(<Error {...Error.args} />);
    const elem = screen.getByTestId("alert-container");
    expect(elem).toBeInTheDocument();
  });

  test("of type Large renders correctly", () => {
    render(<Large {...Large.args} />);
    const elem = screen.getByTestId("alert-container");
    expect(elem).toBeInTheDocument();
  });

  test("of type small renders correctly", () => {
    render(<Small {...Small.args} />);
    const elem = screen.getByTestId("alert-container");
    expect(elem).toBeInTheDocument();
  });

  test("On Click on Cross Icon Called onClose", () => {
    const onClose = jest.fn();
    render(<Default {...Default.args} onClose={onClose} />);
    const elem = screen.getByTestId("close-button");
    fireEvent.click(elem);
    expect(onClose).toHaveBeenCalled();
  });
});
