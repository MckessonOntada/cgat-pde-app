import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { AutoSuggestDropdown } from "../AutoSuggestDropdown";

const MockAutoSuggestDropdown = (props) => {
  return <AutoSuggestDropdown {...props} />;
};

describe("Auto Suggest Dropdown", () => {
  it("renders dropdown container", async () => {
    render(<MockAutoSuggestDropdown />);
    const element = screen.getByTestId("dropdown-container");
    expect(element).toBeTruthy();
  });

  it("renders input text in search bar", async () => {
    render(<MockAutoSuggestDropdown selectedVal={"sample text"} />);
    const element = screen.getByTestId("search-input");
    fireEvent.change(element, { target: { value: "sample text" } });
    expect(element).toBeTruthy();
  });

  it("renders search placeholder", async () => {
    render(<MockAutoSuggestDropdown placeHolder={"Placeholder text"} />);
    const element = screen.getByPlaceholderText("Placeholder text");
    expect(element).toBeTruthy();
  });

  it("dropdown is disabled", async () => {
    render(<MockAutoSuggestDropdown isDisabled={true} />);
    const element = screen.getByTestId("search-input");
    expect(element).toHaveAttribute("disabled");
  });

  it("renders suggestion list when text is entered", async () => {
    let data = { searchText: "text" };
    let suggestionList = [{ label: "result 1" }, { label: "result 2" }];
    render(
      <MockAutoSuggestDropdown
        suggestionList={suggestionList}
        jestTestData={data}
      />
    );
    const element = screen.getByTestId("suggestionListContainer");
    expect(element).toBeTruthy();
    let list = screen.getAllByTestId("suggestion-list-item");
    expect(list.length).toBe(2);
  });

  it("renders refine filter message", async () => {
    let suggestionList = [{ label: "result 1" }, { label: "result 2" }];
    let data = { searchText: "text" };
    render(
      <MockAutoSuggestDropdown
        jestTestData={data}
        suggestionList={suggestionList}
        isShowRefineQueryMessage={true}
        refineFilterMessage={"Sample refine message"}
      />
    );
    const element = screen.getByText("Sample refine message");
    expect(element).toBeTruthy();
  });

  it("No results found is displayed when suggestion list is empty", async () => {
    let data = { searchText: "text" };
    render(<MockAutoSuggestDropdown jestTestData={data} />);
    let element = screen.getByText("No Result Found!");
    expect(element).toBeTruthy();
  });

  it("renders suggestion list according to given width", async () => {
    let data = { searchText: "text" };
    let suggestionList = [{ label: "result 1" }, { label: "result 2" }];
    render(
      <MockAutoSuggestDropdown
        suggestionList={suggestionList}
        jestTestData={data}
        suggestionListContainerWidth={"100px"}
      />
    );
    const element = screen.getByTestId("suggestionListContainer");
    const styles = getComputedStyle(element);
    expect(styles.width).toBe("100px");
  });
  it("check the label is getting displayed", async () => {
    render(<MockAutoSuggestDropdown label={"AutoSuggestDropdownQuestion"} />);
    await expect(screen.getByText("AutoSuggestDropdownQuestion")).toBeInTheDocument();
  });
  it("check the helperText is getting displayed", async () => {
    render(<MockAutoSuggestDropdown helperText={"HelperTextLabel"} />);
    await expect(screen.getByText("HelperTextLabel")).toBeInTheDocument();
  });
  it("check the helperText and label are getting displayed", async () => {
    render(<MockAutoSuggestDropdown helperText={"HelperTextLabel"} label={"AutoSuggestDropdownQuestion"} />);
    await expect(screen.getByText("HelperTextLabel")).toBeInTheDocument();
    await expect(screen.getByText("AutoSuggestDropdownQuestion")).toBeInTheDocument();
  });
});
