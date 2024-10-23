import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { Address } from "../Address";

const MockAddress = (props) => {
  return <Address {...props} />;
};

describe("Address", () => {
  it("Should render Address component", async () => {
    render(<MockAddress />);
    const element = screen.getByTestId("address-wrapper");
    expect(element).toBeTruthy();
  });
  it("Should render Address with directions", async () => {
    render(
      <MockAddress
        addressWithDirections={true}
        addressLine1={"addressLine1"}
        addressLine2={"addressLine2"}
        addressLine3={"addressLine3"}
        addressHeader={"addressHeader"}
        state={"testState"}
        city={"testCity"}
        zip={"testZip"}
        phoneNumber={"+1 123456789"}
        link={"www.abc.com"}
      />
    );
    let element = screen.getByTestId("address-header");
    expect(element).toBeTruthy();
    element = screen.getByTestId("city");
    expect(element).toBeTruthy();
    element = screen.getByTestId("phoneNo");
    expect(element).toBeTruthy();
    element = screen.getByTestId("phoneLink");
    expect(element).toBeTruthy();
    element = screen.getByText("www.abc.com");
    expect(element).toBeTruthy();
  });
  it("Should render Address", async () => {
    render(
      <MockAddress
        addressWithDirections={false}
        addressLine1={"addressLine1"}
        addressLine2={"addressLine2"}
        addressLine3={"addressLine3"}
        addressHeader={"addressHeader"}
        state={"testState"}
        city={"testCity"}
        zip={"testZip"}
        phoneNumber={"+1 123456789"}
      />
    );
    let element = screen.getByTestId("address-header");
    expect(element).toBeTruthy();
    element = screen.getByTestId("city");
    expect(element).toBeTruthy();
    element = screen.getByTestId("phoneNo");
    expect(element).toBeTruthy();
    element = screen.getByTestId("phoneLink");
    expect(element).toBeTruthy();
    element = screen.getByTestId("addressLines");
    expect(element).toBeTruthy();
  });
});
