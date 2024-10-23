import React from "react";
import { Icon } from "../Icon";
import { render, screen } from "@testing-library/react";

describe("Icon", () => {
  test("should renders Icon component", () => {
    render(<Icon />);
    const iconComponent = screen.getByTestId("iconComponent");
    expect(iconComponent).toBeInTheDocument();
  });

  test("renders with default props", () => {
    render(<Icon />);
    console.log(Icon);
    screen.debug();
    const iconComponent = screen.getByTestId("iconComponent");
    const svgIcon = screen.getByTestId("svgIcon");
    expect(iconComponent).toBeInTheDocument();

    // Default props
    expect(iconComponent).toHaveStyle("color: #000000");
    expect(svgIcon).toHaveAttribute("height", "24px");
    expect(svgIcon).toHaveAttribute("width", "24px");
  });

  test("renders with custom props", () => {
    render(<Icon src="DownArrow" size="s" fill="#FF0000" />);

    const iconComponent = screen.getByTestId("iconComponent");
    const svgIcon = screen.getByTestId("svgIcon");
    expect(iconComponent).toBeInTheDocument();

    // Custom props
    expect(iconComponent).toHaveStyle("color: #FF0000");
    expect(svgIcon).toHaveAttribute("height", "16px");
    expect(svgIcon).toHaveAttribute("width", "16px");
  });

  test("renders with a different fill color", () => {
    render(<Icon src="DownArrow" size="xl" fill="#FF00FF" />);

    const iconComponent = screen.getByTestId("iconComponent");
    const svgIcon = screen.getByTestId("svgIcon");
    expect(iconComponent).toBeInTheDocument();

    // Custom props
    expect(iconComponent).toHaveStyle("color: #FF00FF");
    expect(svgIcon).toHaveAttribute("height", "40px");
    expect(svgIcon).toHaveAttribute("width", "40px");
  });

  test("renders null for an invalid src", () => {
    render(<Icon src="NonExistentIcon" />);
    expect(screen.queryByTestId("iconComponent")).toBeNull();
  });
});
