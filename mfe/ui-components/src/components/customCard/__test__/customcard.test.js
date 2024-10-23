import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { CustomCard } from "../CustomCard";

describe("Custom Card", () => {
  it("renders custom card component", async () => {
    render(<CustomCard />);
    const element = screen.getByTestId("custom-card");
    expect(element).toBeTruthy();
  });

  it("renders custom content passed", async () => {
    render(<CustomCard children={<div data-testid="children">Content</div>} />);
    const element = screen.getByTestId("children");
    expect(element).toBeTruthy();
  });

  it("renders component with class passed", async () => {
    const { container } = render(<CustomCard className="customClass" />);
    expect(container.getElementsByClassName("customClass").length).toBe(1);
  });
});
