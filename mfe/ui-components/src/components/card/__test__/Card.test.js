import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Card } from "../Card";
import CARD_TYPE from "../constants/CardConstants";

const MockCard = (props) => {
  return <Card {...props} />;
};

describe("Card", () => {
  let props;
  beforeEach(() => {
    props = {};
  });

  it("should render Card Component", async () => {
    render(<MockCard />);
    const dom = screen.getByTestId("cardcomp");
    expect(dom).toBeTruthy();
  });
  it("should render card header component", async () => {
    render(<MockCard />);
    const dom = screen.getByTestId("cardHeaderComp");
    expect(dom).toBeTruthy();
  });
  it("should render card header Title", async () => {
    render(<MockCard header={<h2>Card Header</h2>} />);
    const dom = screen.getByText("Card Header");
    expect(dom).toBeTruthy();
  });

  it("should render card by default if no type is passed", async () => {
    render(<MockCard />);
    const dom = screen.getByTestId("checkcard");
    expect(dom).toBeTruthy();
  });
  it("should render card if type is card", async () => {
    render(<MockCard type={CARD_TYPE.CARD} />);
    const dom = screen.getByTestId("checkcard");
    expect(dom).toBeTruthy();
  });
  it("should render card if type is accordion", async () => {
    render(<MockCard type={CARD_TYPE.ACCORDION} />);
    const dom = screen.getByTestId("expandBtn");
    fireEvent.click(dom);
    const accordionComp = screen.getByTestId("checkcard");
    expect(accordionComp).toBeTruthy();
  });
  it("should render card body Component", async () => {
    render(<MockCard type={CARD_TYPE.ACCORDION} />);
    const dom = screen.getByTestId("expandBtn");
    fireEvent.click(dom);
    let bodyComp = screen.getByTestId("cardBody");
    expect(bodyComp).toBeTruthy();
  });
  it("should render card Footer Component", async () => {
    render(<MockCard type={CARD_TYPE.ACCORDION} />);
    const dom = screen.getByTestId("expandBtn");
    fireEvent.click(dom);
    let bodyComp = screen.getByTestId("cardFooter");
    expect(bodyComp).toBeTruthy();
  });
});
