import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  Default,
  ClearSelected,
  errorState as ErrorState,
  disabledState as DisabledState,
  NoResult,
  NoResultReadOnly,
  DefaultWithHelperText,
} from "../../../stories/TreeviewDropdown.stories";

describe("TreeviewDropdown", () => {
  it("should show placeholder text when no option is selected", () => {
    render(<Default {...Default.args} />);
    expect(screen.getByText("All")).toBeInTheDocument();
  });
  it("should show the correct number of selected options", () => {
    render(<ClearSelected {...ClearSelected.args} />);
    expect(screen.getByText("4 Selected")).toBeInTheDocument();
  });
  it("should toggle the dropdown when clicked", () => {
    render(<ClearSelected {...ClearSelected.args} />);
    const dropdown = screen.getByRole("button");
    fireEvent.click(dropdown);
    expect(screen.getByRole("tree")).toBeInTheDocument();
    fireEvent.click(dropdown);
    expect(screen.queryByRole("tree")).not.toBeInTheDocument();
  });

  it("should display empty state message when no options are available", () => {
    const defaultProps = {
      id: "testDropdown",
      label: "Select an option",
      options: [],
      emptyOptionMessage: "No options available",
    };
    render(<Default {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));
    const noOptionsElements = screen.getAllByText("No options available");

    expect(noOptionsElements).not.toHaveLength(0);
    noOptionsElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });
  it("should clear all selected options when clear button is clicked", () => {
    const defaultProps = {
      id: "testDropdown",
      label: "Select an option",
      options: [
        { id: "1", label: "Option 1", isChecked: true },
        { id: "2", label: "Option 2", isChecked: true },
      ],
      onChange: jest.fn(),
    };
    render(<Default {...defaultProps} />);
    fireEvent.click(screen.getByRole("button"));

    fireEvent.click(screen.getByText("Clear Selection")); // Assuming there's a "Clear All" button
  });

  it("should toggle the dropdown when the Enter key is pressed", () => {
    const defaultProps = {
      id: "testDropdown",
      label: "Select an option",
      options: [
        { id: "1", label: "Option 1", isChecked: false },
        { id: "2", label: "Option 2", isChecked: false },
      ],
      onChange: jest.fn(),
    };

    render(<Default {...defaultProps} />);
    const dropdown = screen.getByRole("button");
    fireEvent.keyDown(dropdown, { key: "Enter", code: "Enter" });
    expect(screen.getByRole("tree")).toBeInTheDocument();
  });
  test("renders the tooltip component", () => {
    const defaultProps = {
      id: "testDropdown",
      label: "Select an option",
      options: [
        { id: "1", label: "Option 1", isChecked: false },
        { id: "2", label: "Option 2", isChecked: false },
      ],
      onChange: jest.fn(),
      tooltipText: "Hover over me",
    };
    render(<Default {...defaultProps} />);

    fireEvent.mouseEnter(screen.getByTestId("tooltip-normal"));

    expect(screen.getByTestId("tooltip-normal")).toBeInTheDocument();
  });
  test("Should render Default Treeview Dropdown Component", async () => {
    const { container } = render(<Default {...Default.args} />);

    const dropdownDom = screen.getByTestId("dropdown-testid-TreeviewDropdown");
    expect(dropdownDom).toBeInTheDocument();

    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.getByTestId("options-testid-TreeviewDropdown")
      ).toBeInTheDocument();
    });

    //clear button should not be visible
    expect(screen.queryByTestId(`clearAll-testid-TreeviewDropdown`)).toBeNull();
    expect(screen.queryByTestId("clear-all-filter")).toBeNull();

    //selecting a value
    const checkbox = screen.getByTestId(
      `option-testid-${Default.args.options[0].id}`
    );
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    // checking that selctedCount is displayed as 1 selected
    const valueBlock = container.querySelector(`[id="TreeviewDropdown"]`);
    expect(valueBlock).toBeInTheDocument();
    expect(valueBlock.innerHTML).toEqual("1 Selected");

    //close Dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.queryByTestId("options-testid-TreeviewDropdown")
      ).toBeNull();
    });

    //open Dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.getByTestId("options-testid-TreeviewDropdown")
      ).toBeInTheDocument();
    });

    //cleat selection should be visible
    expect(
      screen.getByTestId(`clearAll-testid-TreeviewDropdown`)
    ).toBeInTheDocument();
    expect(screen.getByTestId("clear-all-filter")).toBeInTheDocument();

    //clear selection click and checking selectedCount is coming as All
    const clearButton = screen.getByTestId("clear-all-filter");
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(screen.getByTestId(`option-testid-004`)).not.toBeChecked();
      expect(valueBlock.innerHTML).toEqual("All");
    });

    //close Dropdown
    fireEvent.click(dropdownDom);

    //open Dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.getByTestId("options-testid-TreeviewDropdown")
      ).toBeInTheDocument();
    });

    //clar button should not be visible
    expect(screen.queryByTestId(`clearAll-testid-TreeviewDropdown`)).toBeNull();
    expect(screen.queryByTestId("clear-all-filter")).toBeNull();

    //select option having subOptions
    const parentCheckbox = screen.getByTestId(`option-testid-011`);
    expect(parentCheckbox).toBeInTheDocument();
    fireEvent.click(parentCheckbox);
    await waitFor(() => {
      expect(parentCheckbox).toBeChecked();
    });

    //close Dropdown
    fireEvent.click(dropdownDom);

    //open Dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.getByTestId("options-testid-TreeviewDropdown")
      ).toBeInTheDocument();
    });

    //clear Button should be Visible
    expect(
      screen.getByTestId(`clearAll-testid-TreeviewDropdown`)
    ).toBeInTheDocument();
    expect(screen.getByTestId("clear-all-filter")).toBeInTheDocument();

    // checking that selctedCount is displayed as 2 selected
    const valueBlock1 = container.querySelector(`[id="TreeviewDropdown"]`);
    expect(valueBlock1).toBeInTheDocument();
    expect(valueBlock1.innerHTML).toEqual("2 Selected");
  });

  test("Should render errorState Treeview Dropdown Component", async () => {
    render(<ErrorState {...ErrorState.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-TreeviewDropdown");
    expect(dropdownDom).toBeInTheDocument();

    //checking that error message block is present
    const errorMsgDom = screen.getByTestId("error-testid-TreeviewDropdown");
    expect(errorMsgDom).toBeInTheDocument();
    expect(
      within(errorMsgDom).getByText("Please select atleast one provider")
    ).toBeInTheDocument();
  });

  test("Should render disabledState Treeview Dropdown Component", async () => {
    render(<DisabledState {...DisabledState.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-TreeviewDropdown");
    expect(dropdownDom).toBeInTheDocument();

    // checking that click on dropdown is not opening dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.queryByTestId("options-testid-TreeviewDropdown")
      ).toBeNull();
    });
  });

  test("Should render No Options Treeview Dropdown Component", async () => {
    const { container } = render(<NoResult {...NoResult.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-TreeviewDropdown");
    expect(dropdownDom).toBeInTheDocument();

    //checking that value is displaying as No options available
    const valueBlock = container.querySelector(`[id="TreeviewDropdown"]`);
    expect(valueBlock.innerHTML).toEqual("No options available");

    //open dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.getByTestId("options-testid-TreeviewDropdown")
      ).toBeInTheDocument();
    });

    //checking empty message
    expect(screen.getByText("No data to display")).toBeInTheDocument();
  });

  test("Should render No Options Redonly Treeview Dropdown Component", async () => {
    const { container } = render(
      <NoResultReadOnly {...NoResultReadOnly.args} />
    );
    const dropdownDom = screen.getByTestId("dropdown-testid-TreeviewDropdown");
    expect(dropdownDom).toBeInTheDocument();

    //checking that value is displaying as No options available
    const valueBlock = container.querySelector(`[id="TreeviewDropdown"]`);
    expect(valueBlock.innerHTML).toEqual("No options available");

    //should not open dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        screen.queryByTestId("options-testid-TreeviewDropdown")
      ).toBeNull();
    });
  });

  test("Should render Default With Helper Text Treeview Dropdown Component", async () => {
    const { container } = render(
      <DefaultWithHelperText {...DefaultWithHelperText.args} />
    );
    await expect(
      screen.getByText("Please select an option")
    ).toBeInTheDocument();
    const dropdownDom = screen.getByTestId("dropdown-testid-TreeviewDropdown");
    expect(dropdownDom).toBeInTheDocument();
    const valueBlock = container.querySelector(`[id="TreeviewDropdown"]`);
    expect(valueBlock.innerHTML).toEqual("1 Selected");
  });
});
