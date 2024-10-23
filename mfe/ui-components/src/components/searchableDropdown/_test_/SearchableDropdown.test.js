import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  Default,
  NoSearchable,
  ClearSelected,
  errorState as ErrorState,
  disabledState as DisabledState,
  singleSelect as SingleSelect,
  ActionableSelect,
  asyncSearchable as AsyncSearchable,
  NoResult,
  NoResultReadOnly,
  DefaultWithHelperText
} from "../../../stories/SearchableDropdown.stories";

describe("SearchableDropdown", () => {
  test("Should render Default Searchable Dropdown Component", async () => {
    const { container } = render(<Default {...Default.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    const nonSelectedLen = Default.args.options.filter(
      (item) => !item?.isChecked
    )?.length;

    if (Default.args?.maxRecordsCountToShow) {
      if (nonSelectedLen >= Default.args?.maxRecordsCountToShow) {
        const refineMessage = screen.getByTestId("provider-refine-message");
        expect(refineMessage).toBeInTheDocument();
      }
    } else {
      if (nonSelectedLen >= 20) {
        const refineMessage = screen.getByTestId("provider-refine-message");
        expect(refineMessage).toBeInTheDocument();
      }
    }

    let itemSelected = Default.args.options?.filter((item) => item?.isChecked);
    if (itemSelected.length > 0) {
      const selectSeparator = screen.getByTestId("provider-separator-2");
      expect(selectSeparator).toBeInTheDocument();
    }

    //finding clear button and click
    const clearButton = container.querySelector(
      `[data-testid="clearAll-testid-provider"] button`
    );
    fireEvent.click(clearButton);

    //close dropdown
    fireEvent.click(dropdownDom);

    //open dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //checking separtor present or not
    const selectSeparator = container.querySelector(
      `[data-testid="provider-separator-2"]`
    );
    expect(selectSeparator).not.toBeInTheDocument();

    //checkbox check and close dropdown
    let checkbox1Temp = screen.getByTestId(
      "provider-nonSelectedCheckbox-testid-0"
    );
    expect(checkbox1Temp).toBeInTheDocument();
    fireEvent.click(checkbox1Temp);
    await waitFor(() => {
      expect(checkbox1Temp.checked).toBe(true);
    });
    fireEvent.click(dropdownDom);

    //open dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //checking separtor present or not
    expect(
      container.querySelector(`[data-testid="provider-separator-2"]`)
    ).toBeInTheDocument();

    //checking that value is displaying as 1 selected
    const valueBlock = dropdownDom.querySelector(`div`);
    expect(valueBlock.innerHTML).toEqual("1 Selected");

    //clicking another checkbox
    let checkbox2Temp = screen.getByTestId(
      "provider-nonSelectedCheckbox-testid-1"
    );
    expect(checkbox2Temp).toBeInTheDocument();
    fireEvent.click(checkbox2Temp);
    await waitFor(() => {
      expect(checkbox2Temp.checked).toBe(true);
    });
    expect(valueBlock.innerHTML).toEqual("2 Selected");
  });

  test("Should render NoSearchable Searchable Dropdown Component", async () => {
    render(<NoSearchable {...NoSearchable.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    //opening dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //checking search box is not present
    expect(
      dropdownDom.querySelector(`[data-testid="search-testid-provider"]`)
    ).not.toBeInTheDocument();
  });

  test("Should render ClearSelected Searchable Dropdown Component", async () => {
    const { container } = render(<ClearSelected {...ClearSelected.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    //opening dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //checking that clear all button is present
    expect(
      container.querySelector(`[data-testid="clearAll-testid-provider"] button`)
    ).toBeInTheDocument();

    //clicking clear all button
    const clearButton = container.querySelector(
      `[data-testid="clearAll-testid-provider"] button`
    );
    fireEvent.click(clearButton);

    // checking if preselected values are changed to false or not
    ClearSelected.args.options
      .filter((item) => item?.isChecked)
      .forEach((option, index) => {
        let checkboxTemp = screen.getByTestId(
          "provider-selectedCheckbox-testid-" + index
        );
        expect(checkboxTemp).toBeInTheDocument();
        expect(checkboxTemp.checked).toBe(false);
      });
  });

  test("Should render errorState Searchable Dropdown Component", async () => {
    render(<ErrorState {...ErrorState.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    //checking that error message block is present
    const errorMsgDom = screen.getByTestId("error-testid-provider");
    expect(errorMsgDom).toBeInTheDocument();
  });

  test("Should render disabledState Searchable Dropdown Component", async () => {
    const { container } = render(<DisabledState {...DisabledState.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    // checking that click on dropdown is not opening dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        container.querySelector(`[data-testid="options-testid-provider"]`)
      ).not.toBeInTheDocument();
    });
  });

  test("Should render singleSelect Searchable Dropdown Component", async () => {
    const { container } = render(<SingleSelect {...SingleSelect.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    // clicking and opening dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //checking that no checkbox is present in dropdown
    expect(
      container.querySelector(`[input="checkbox"]`)
    ).not.toBeInTheDocument();

    //accessing and clicking option
    const item = container.querySelector(
      `[data-testid="options-testid-provider"] div ul li`
    );
    fireEvent.click(item);

    //checking that value is getting changed or not
    const valueBlock = dropdownDom.querySelector(`div`);
    const selectedValue = item.querySelector(`p`);
    expect(valueBlock.innerHTML).toEqual(selectedValue.innerHTML);
  });

  test("Should render ActionableSelect Searchable Dropdown Component", async () => {
    const { container } = render(
      <ActionableSelect {...ActionableSelect.args} />
    );
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    //clicking and opening dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //checking there is no checkbox in dropdown
    expect(
      container.querySelector(`[input="checkbox"]`)
    ).not.toBeInTheDocument();

    ActionableSelect.args.options
      .filter((item) => !item?.isHideAction)
      .forEach((option) => {
        //finding index of optin where icon should be visibe
        const objTo = ActionableSelect.args.options.findIndex(
          (itemObj) => itemObj.value === option.value
        );

        //accessing option at that particular index
        let checkboxTemp = screen
          .getByTestId("options-testid-provider")
          .querySelector(`div ul`)
          .children.item(objTo);
        //checking that option contains button with svg icon
        expect(checkboxTemp.querySelector(`button svg`)).toBeInTheDocument();

        //clicking option button
        const buttonIcon = checkboxTemp.querySelector(`button`);
        fireEvent.click(buttonIcon);
      });
  });

  test("Should render asyncSearchable Searchable Dropdown Component", async () => {
    const { container } = render(<AsyncSearchable {...AsyncSearchable.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    //open dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //check for search input
    const searchBox = container.querySelector(
      `[data-testid="search-testid-provider"] input`
    );
    expect(searchBox).toBeInTheDocument();
    fireEvent.change(searchBox, { target: { value: "Ajay" } });
  });

  test("Should render No Options Searchable Dropdown Component", async () => {
    const { container } = render(<NoResult {...NoResult.args} />);
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    //checking that value is displaying as No options available
    const valueBlock = dropdownDom.querySelector(`div`);
    expect(valueBlock.innerHTML).toEqual("No options available");

    //open dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(screen.getByTestId("options-testid-provider")).toBeInTheDocument();
    });

    //checking empty message
    expect(screen.getByText("No data to display")).toBeInTheDocument();
  });

  test("Should render No Options Redonly Searchable Dropdown Component", async () => {
    const { container } = render(
      <NoResultReadOnly {...NoResultReadOnly.args} />
    );
    const dropdownDom = screen.getByTestId("dropdown-testid-provider");
    expect(dropdownDom).toBeInTheDocument();

    //checking that value is displaying as No options available
    const valueBlock = dropdownDom.querySelector(`div`);
    expect(valueBlock.innerHTML).toEqual("No options available");

    //should not open dropdown
    fireEvent.click(dropdownDom);
    await waitFor(() => {
      expect(
        container.querySelector(`[data-testid="options-testid-provider"]`)
      ).not.toBeInTheDocument();
    });
  });
  it("check the helperText and label are getting displayed", async () => {
    render(<DefaultWithHelperText {...DefaultWithHelperText.args}/>);
    await expect(screen.getByText("Provider")).toBeInTheDocument();
    await expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });
  it("check the placeHolder is not getting displayed when hidePlaceHolder is true", async () => {
    let propsToBePassed = {...NoSearchable.args,...{hidePlaceHolder:true}}
    const { container } = render(<NoSearchable {...propsToBePassed} />);
    const inputDiv = container.querySelector(`#Provider`);
    expect(inputDiv.innerHTML).toBeFalsy()
  });
});
