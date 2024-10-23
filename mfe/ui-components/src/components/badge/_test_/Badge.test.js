import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";
import { BADGE_TYPE } from "../assets/constants/BadgeConstants";
import {
  Default,
  Error,
  Warning,
  Success,
  Info,
  Error_High,
  Warning_High,
  Success_High,
  Info_Default,
  Primary,
  Primary_High,
  Primary_Default,
} from "../../../stories/Badge.stories";

describe("Badge", () => {
  test("Should render Default Badge Component", async () => {
    render(<Default {...Default.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Default.args.text);
  });

  test("Should render Error Badge Component", async () => {
    render(<Error {...Error.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Error.args.text);
  });

  test("Should render Warning Badge Component", async () => {
    render(<Warning {...Warning.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Warning.args.text);
  });

  test("Should render Success Badge Component", async () => {
    render(<Success {...Success.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Success.args.text);
  });

  test("Should render Info Badge Component", async () => {
    render(<Info {...Info.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Info.args.text);
  });

  test("Should render Error_High Badge Component", async () => {
    render(<Error_High {...Error_High.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Error_High.args.text);
  });

  test("Should render Warning_High Badge Component", async () => {
    render(<Warning_High {...Warning_High.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Warning_High.args.text);
  });

  test("Should render Success_High Badge Component", async () => {
    render(<Success_High {...Success_High.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Success_High.args.text);
  });

  test("Should render Info_Default Badge Component", async () => {
    render(<Info_Default {...Info_Default.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Info_Default.args.text);
  });

  test("Should render Primary Badge Component", async () => {
    render(<Primary {...Primary.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Primary.args.text);
  });

  test("Should render Primary_High Badge Component", async () => {
    render(<Primary_High {...Primary_High.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Primary_High.args.text);
  });

  test("Should render Primary_Default Badge Component", async () => {
    render(<Primary_Default {...Primary_Default.args} />);
    const badgeDom = screen.getByTestId("badgeComp");
    expect(badgeDom).toBeInTheDocument();
    expect(badgeDom).toHaveTextContent(Primary_Default.args.text);
  });
});

const MockBadge = (props) => {
  return <Badge text={props.text} type={props.type} />;
};

describe("BadgeComponent", () => {
  let props;
  beforeEach(() => {
    props = {};
  });

  it("Should render INFO_HIGH Badge Component", async () => {
    render(
      <MockBadge text={BADGE_TYPE.INFO_HIGH} type={BADGE_TYPE.INFO_HIGH} />
    );
    const dom = screen.getByTestId("badgeComp");
    expect(dom).toBeTruthy();
  });

  it("Should render ERROR_DEAFULT Badge Component", async () => {
    render(
      <MockBadge
        text={BADGE_TYPE.ERROR_DEAFULT}
        type={BADGE_TYPE.ERROR_DEAFULT}
      />
    );
    const dom = screen.getByTestId("badgeComp");
    expect(dom).toBeTruthy();
  });

  it("Should render SUCCESS_DEAFULT Badge Component", async () => {
    render(
      <MockBadge
        text={BADGE_TYPE.SUCCESS_DEAFULT}
        type={BADGE_TYPE.SUCCESS_DEAFULT}
      />
    );
    const dom = screen.getByTestId("badgeComp");
    expect(dom).toBeTruthy();
  });

  it("Should render WARNING_DEAFULT Badge Component", async () => {
    render(
      <MockBadge
        text={BADGE_TYPE.WARNING_DEAFULT}
        type={BADGE_TYPE.WARNING_DEAFULT}
      />
    );
    const dom = screen.getByTestId("badgeComp");
    expect(dom).toBeTruthy();
  });

  it("Should render INFO_HIGH_DEAFULT Badge Component", async () => {
    render(
      <MockBadge
        text={BADGE_TYPE.INFO_HIGH_DEAFULT}
        type={BADGE_TYPE.INFO_HIGH_DEAFULT}
      />
    );
    const dom = screen.getByTestId("badgeComp");
    expect(dom).toBeTruthy();
  });

  it("Should render ERROR_HIGH_DEFAULT Badge Component", async () => {
    render(
      <MockBadge
        text={BADGE_TYPE.ERROR_HIGH_DEFAULT}
        type={BADGE_TYPE.ERROR_HIGH_DEFAULT}
      />
    );
    const dom = screen.getByTestId("badgeComp");
    expect(dom).toBeTruthy();
  });

  it("Should render INFO_HIGH_GREY Badge Component", async () => {
    render(
      <MockBadge
        text={BADGE_TYPE.INFO_HIGH_GREY}
        type={BADGE_TYPE.INFO_HIGH_GREY}
      />
    );
    const dom = screen.getByTestId("badgeComp");
    expect(dom).toBeTruthy();
  });
});
