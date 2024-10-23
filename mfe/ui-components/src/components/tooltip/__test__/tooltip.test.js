import { render, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Tooltip } from "../Tooltip";

describe("Tooltip", () => {
  it("Should render tooltip", async () => {
    const tooltipBody = "This is the tooltip body";
    const element = render(
      <Tooltip body={tooltipBody} defaultIsOpen={false}>
        <div data-testid="hover-tooltip">Hover for tooltip</div>
      </Tooltip>
    );
    fireEvent.mouseEnter(element.getByText("Hover for tooltip"));
    await waitFor(() => {
      expect(element.queryByText(tooltipBody)).toBeInTheDocument();
    });
  });

  it("Should not render tooltip by default without hover", async () => {
    const element = render(
      <Tooltip body={<div>Tooltip</div>} defaultIsOpen={false}>
        <div data-testid="hover-tooltip">Hover for tooltip</div>
      </Tooltip>
    );
    expect(element.queryByText("Tooltip")).not.toBeInTheDocument();
  });

  it("Should not render tooltip when disabled", async () => {
    const tooltipBody = "This is the tooltip body";
    const element = render(
      <Tooltip body={tooltipBody} isDisabled={true}>
        <div data-testid="hover-tooltip">Hover for tooltip</div>
      </Tooltip>
    );
    fireEvent.mouseEnter(element.getByText("Hover for tooltip"));
    expect(element.queryByText("Tooltip")).not.toBeInTheDocument();
  });
});
