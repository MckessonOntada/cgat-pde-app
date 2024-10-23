import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Stepper } from "../Stepper";

const stepData = [
  {
    label: "Step 1",
  },
  {
    label: "Step 2",
  },
  {
    label: "Step 3",
  },
  {
    label: "Step 4",
  },
];

const MockStepper = (props) => {
  return (
    <Stepper
      activeIndex={1}
      dividerText="of"
      mobileLabel="Step"
      mobileViewCount={false}
      stepHeaders={stepData}
      {...props}
    />
  );
};

describe("Stepper", () => {
  it("Should render Stepper Mobile UI", async () => {
    render(<MockStepper mobileView={true} />);
    const element = screen.getByTestId("stepper-mobile-ui");
    expect(element).toBeTruthy();
  });
  it("Should render Stepper Desktop UI", async () => {
    render(<MockStepper mobileView={false} />);
    let element = screen.getByTestId("stepper-mobile-ui");
    expect(element).toBeTruthy();
    element = screen.getByTestId("stepper-menu");
    expect(element).toBeTruthy();
  });
  it("Should render current active step", async () => {
    render(<MockStepper mobileView={true} />);
    const element = screen.getByText("Step - 1 of 4");
    expect(element).toBeTruthy();
  });
  it("Should render correct number of steps", async () => {
    render(<MockStepper mobileView={false} />);
    const steps = screen.getAllByTestId("step");
    expect(steps.length).toBe(stepData.length);
  });
  it("Should render stepper labels", async () => {
    render(<MockStepper mobileView={false} />);
    let element = screen.getByTestId("stepper-item-" + stepData[0].label);
    expect(element).toBeTruthy();
    element = screen.getByTestId("stepper-item-" + stepData[1].label);
    expect(element).toBeTruthy();
    element = screen.getByTestId("stepper-item-" + stepData[2].label);
    expect(element).toBeTruthy();
    element = screen.getByTestId("stepper-item-" + stepData[3].label);
    expect(element).toBeTruthy();
  });
});
