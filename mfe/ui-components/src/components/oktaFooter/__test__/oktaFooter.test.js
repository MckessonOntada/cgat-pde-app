import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { OktaFooter } from "../OktaFooter";

describe("Okta Footer", () => {
  it("renders okta footer component", async () => {
    render(<OktaFooter />);
    const element = screen.getByTestId("okta-footer-container");
    expect(element).toBeTruthy();
  });

  it("render Terms of Use link", async () => {
    render(
      <OktaFooter tncLabel={"Terms of Use"} tncUrl={"https://www.test.com/"} />
    );
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "https://www.test.com/"
    );
  });

  it("render Privacy Notice link", async () => {
    render(
      <OktaFooter pnLabel={"Privacy Notice"} pnUrl={"https://www.test.com/"} />
    );
    expect(
      screen.getByRole("link", { name: "Privacy Notice" })
    ).toHaveAttribute("href", "https://www.test.com/");
  });

  it("render Donot sell my Information link", async () => {
    render(
      <OktaFooter
        dnsmiLabel={"Donot Sell My Information"}
        dnsmiUrl={"https://www.test.com/"}
      />
    );
    expect(
      screen.getByRole("link", { name: "Donot Sell My Information" })
    ).toHaveAttribute("href", "https://www.test.com/");
  });

  it("render Conact Us and contact no link", async () => {
    render(
      <OktaFooter
        supportNumber={"1-855-887-6788"}
        supportNumberLabel={"Contact Us:"}
      />
    );
    expect(
      screen.getByRole("link", { name: "Contact Us: 1-855-887-6788" })
    ).toHaveAttribute("href", "tel:1-855-887-6788");
  });

  it("renders copyright label", async () => {
    render(<OktaFooter copyrightLabel={"All rights reserved"} />);
    const element = screen.getByText("All rights reserved");
    expect(element).toBeTruthy();
  });
});
