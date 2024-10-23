import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { TabList } from "../TabList";

const options = [
  { id: 1, configName: "Tab 1", isActiveTab: false, path: "/tab1" },
  { id: 2, configName: "Tab 2", isActiveTab: true, path: "/tab2" },
  { id: 3, configName: "Tab 3", isActiveTab: false, path: "/tab3" },
];

const MockTabList = (props) => {
  return (
    <TabList
      options={options}
      alignment="center"
      onTabClick={() => {}}
      {...props}
    />
  );
};

describe("TabList Component", () => {
  it("renders tab option correctly", () => {
    const { getAllByTestId } = render(<MockTabList />);
    const tabButtons = getAllByTestId("tabItem");
    expect(tabButtons.length).toBe(options.length);
  });

  it("navigates when a tab is clicked", () => {
    const { getByText } = render(<MockTabList />);
    const tabItem = getByText("Tab 1");
    fireEvent.click(tabItem);
    expect(tabItem).toHaveAttribute("href", options[0].path);
  });

  it("renders as buttons when useAsButton is set to true", () => {
    render(<MockTabList useAsButton={true} />);
    expect(screen.getAllByRole("button")).toHaveLength(options.length);
  });

  it("calls onTabClick when a tab is clicked if tab is use as button", () => {
    const mockOnTabClick = jest.fn();
    const { getByText } = render(
      <MockTabList onTabClick={mockOnTabClick} useAsButton={true} />
    );
    const tabItem = getByText("Tab 1");
    fireEvent.click(tabItem);
    expect(mockOnTabClick).toHaveBeenCalled();
  });

  // it("renders with the center alignment by default", () => {
  //   const { container } = render(<MockTabList />);
  //   expect(container.querySelector(".justify-center")).toBeInTheDocument();
  // });

  // it("renders with left alignment", () => {
  //   const { container } = render(<MockTabList alignment="left" />);
  //   expect(container.querySelector(".justify-left")).toBeInTheDocument();
  // });

  // it("renders without a shadow when showShadow is set to false", () => {
  //   const { container } = render(<MockTabList showShadow={false} />);
  //   expect(
  //     container.querySelector(".secondaryNavNoShadaow")
  //   ).toBeInTheDocument();
  // });
});
