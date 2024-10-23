import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  Default,WithoutLabel,Disabled,Arrow
} from "../../../stories/CustomDatepicker.stories";
import dayjs from "dayjs";

describe("SearchableDropdown", () => {
  test("Should render Default Custom Date Picker Component", async () => {
    const { container,getByTestId,getAllByRole,getByText  } = render(<Default {...Default.args} />);
    const Datepicker = getByTestId("dateInput-testid-dateOfBirth");
    const DatepickerLabel = getByTestId("dateInput-label-testid-dateOfBirth")
    const DatepickerInput= container.querySelector('#dateInput-dateOfBirth');
    const DatepickerCalenderIcon= getByTestId("CalendarIcon")
    const DatePickerCalenderButton = container.querySelector(".MuiButtonBase-root")
    const value=dayjs(new Date()).format("MM/DD/YYYY")
    expect(Datepicker).toBeInTheDocument();
    expect(DatepickerLabel).toBeInTheDocument();
    expect(getByText("Date of Birth")).toBeInTheDocument()
    expect(DatepickerInput).not.toBeNull();
    expect(DatepickerCalenderIcon).toBeInTheDocument();
    expect(DatePickerCalenderButton).not.toBeNull();
    expect(DatepickerInput.value===value).toBeTruthy()
    fireEvent.click(DatePickerCalenderButton);
    await waitFor(() => {
      const DateMenu= getAllByRole('presentation')
      expect(DateMenu.length).toBeGreaterThanOrEqual(2)
    });
    });

  test("Should render WithoutLabel Custom Date Picker Component", async () => {
    const { queryByTestId  } = render(<WithoutLabel {...WithoutLabel.args} />);
    const DatepickerLabel = queryByTestId("dateInput-label-testid-dateOfBirth")
    expect(DatepickerLabel).toBeNull();
    });
    
  test("Should render Disabled Custom Date Picker Component", async () => {
    const { container, getByTestId,queryAllByRole,getByText  } = render(<Disabled {...Disabled.args} />);
    const DatePickerCalenderButton = container.querySelector(".MuiButtonBase-root")
    const DatepickerInput= container.querySelector('#dateInput-disabledDate');
    const DatepickerLabel = getByTestId("dateInput-label-testid-disabledDate")
    expect(DatepickerLabel).toBeInTheDocument()
    expect(getByText("Disabled Date")).toBeInTheDocument()
    expect(DatepickerInput).not.toBeNull();
    expect(DatePickerCalenderButton).not.toBeNull();
    expect(DatepickerInput).toBeDisabled();
    expect(DatePickerCalenderButton).toBeDisabled()
    fireEvent.click(DatePickerCalenderButton);
    await waitFor(() => {
      const DateMenu= queryAllByRole("presentation")
      expect(DateMenu.length).toBeLessThan(1)
    });
    });

  test("Should render Arrow Custom Date Picker Component", async () => {
    const mockLeftArrowFunction = jest.fn();
    const mockRightArrowFunction = jest.fn();
    let propsToBePassed= {...Arrow.args,...{onClickLeftArrow:mockLeftArrowFunction},...{onClickRightArrow:mockRightArrowFunction}}
    const { getByText,getByTestId  } = render(<Arrow {...propsToBePassed} />);
    const DatepickerLabel = getByTestId("dateInput-label-testid-withArrows")
    const leftArrow= getByTestId("dateInput-leftArrow-withArrows")
    const rightArrow= getByTestId("dateInput-rightArrow-withArrows")
    expect(DatepickerLabel).toBeInTheDocument();
    expect(getByText("Date with Arrows")).toBeInTheDocument();
    expect(leftArrow).toBeInTheDocument();
    expect(rightArrow).toBeInTheDocument();
    await fireEvent.click(leftArrow);
    expect(mockLeftArrowFunction).toHaveBeenCalled();
    await fireEvent.click(rightArrow);
    expect(mockRightArrowFunction).toHaveBeenCalled()
  });

  test("Should render Arrow Custom Date Picker Component with left Arrow as disabled", async () => {
    const mockLeftArrowFunction = jest.fn();
    let propsToBePassed={...Arrow.args,...{isLeftArrowDisabled:true},...{onClickLeftArrow:mockLeftArrowFunction}}
    const { getByTestId  } = render(<Arrow {...propsToBePassed} />);
    const leftArrow= getByTestId("dateInput-leftArrow-withArrows")
    const rightArrow= getByTestId("dateInput-rightArrow-withArrows")
    expect(leftArrow).toBeInTheDocument();
    expect(leftArrow).toBeDisabled();
    await fireEvent.click(leftArrow);
    expect(mockLeftArrowFunction).not.toHaveBeenCalled();
    expect(rightArrow).toBeInTheDocument();
  });

  test("Should render Arrow Custom Date Picker Component with right Arrow as disabled", async () => {
    const mockRightArrowFunction = jest.fn();
    let propsToBePassed={...Arrow.args,...{isRightArrowDisabled:true},...{onClickRightArrow:mockRightArrowFunction}}
    const { getByTestId  } = render(<Arrow {...propsToBePassed} />);
    const leftArrow= getByTestId("dateInput-leftArrow-withArrows")
    const rightArrow= getByTestId("dateInput-rightArrow-withArrows")
    expect(leftArrow).toBeInTheDocument();
    expect(rightArrow).toBeInTheDocument()
    expect(rightArrow).toBeDisabled();
    await fireEvent.click(rightArrow);
    expect(mockRightArrowFunction).not.toHaveBeenCalled();
  });

  test("check the helperText and label are getting displayed", async () => {
    let propsToBePassed={...Default.args,...{helperText:'Format: mm/dd/yyyy'}}
    const { getByTestId,getByText  } = render(<Default {...propsToBePassed} />);
    const DatepickerLabel = getByTestId("dateInput-label-testid-dateOfBirth")
    expect(DatepickerLabel).toBeInTheDocument();
    expect(getByText("Date of Birth")).toBeInTheDocument()
    expect(getByText("Format: mm/dd/yyyy")).toBeInTheDocument()
  });

  test("should render the changed format of Date Picker Component", async () => {
    let propsToBePassed={...Default.args,...{pickerFormat:'YYYY-MM-DD'}}
    const { container  } = render(<Default {...propsToBePassed} />);
    const DatepickerInput= container.querySelector('#dateInput-dateOfBirth');
    const value=dayjs(new Date()).format("YYYY-MM-DD")
    expect(DatepickerInput).not.toBeNull();
    expect(DatepickerInput.value===value).toBeTruthy()
  });
});
