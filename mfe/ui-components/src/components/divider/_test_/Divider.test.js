import React from "react";
import { render, screen } from "@testing-library/react";
import { Divider } from "../Divider";

describe("Divider", () => {
  test("Should render divider component", async () => {
    render(<Divider />);
    const dom = screen.getByTestId("divider");
    expect(dom).toBeInTheDocument();
  });
});
