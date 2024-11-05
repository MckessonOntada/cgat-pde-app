import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateRangePicker } from "../DateRangePicker";
import { DatePickerMockData } from "./DateRangePickerMockData";
import dayjs from "dayjs";

const MockComponent = (props) => {
  const changeDaterangeFn = jest.fn();
  const closeCalender = jest.fn();
  return (
    <div>
      <div>
        <button
          style={{ margin: "20px" }}
          data-testid="outside-button"
          onClick={closeCalender}
        >
          click outside the component
        </button>
      </div>
      <DateRangePicker {...props} onChange={changeDaterangeFn} />
    </div>
  );
};

describe("DateRangePicker", () => {
  it("should render date range component", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem = screen.getByTestId("date-range-component");
    expect(elem).toBeInTheDocument();
  });

  it("should render start date input", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
  });
  it("should render end date input", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem = screen.getByTestId("input-testid-end-date-test-id");
    expect(elem).toBeInTheDocument();
  });

  it("should render start date input as disabled", async () => {
    render(<MockComponent {...DatePickerMockData} isDisabled={true} />);
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveAttribute("disabled");
  });
  it("should render end date input as disabled", async () => {
    render(<MockComponent {...DatePickerMockData} isDisabled={true} />);
    const elem = screen.getByTestId("input-testid-end-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveAttribute("disabled");
  });

  it("should render start date input placeholder", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveAttribute("placeholder", "mm/dd/yyyy");
  });
  it("should render end date input placeholder", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem = screen.getByTestId("input-testid-end-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveAttribute("placeholder", "mm/dd/yyyy");
  });

  it("should render start date input required icon without required label", async () => {
    render(<MockComponent {...DatePickerMockData} isRequired={true} />);
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    const elem1 = screen.getByTestId("start-date-required-logo");
    expect(elem1).toBeInTheDocument();
    expect(elem1.textContent).not.toContain("Required");
  });
  it("should render end date input required icon without required label", async () => {
    render(<MockComponent {...DatePickerMockData} isRequired={true} />);
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    const elem1 = screen.getByTestId("end-date-required-logo");
    expect(elem1).toBeInTheDocument();
    expect(elem1.textContent).not.toContain("Required");
  });

  it("should render start date input required icon with required label", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        isRequired={true}
        isShowRequiredLabel={true}
        requiredLabel={"Required"}
      />
    );
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    const elem1 = screen.getByTestId("start-date-required-logo");
    expect(elem1).toBeInTheDocument();
    const elem2 = screen.getByTestId("start-date-required-label");
    expect(elem2).toBeInTheDocument();
    expect(elem2.textContent).toContain("Required");
  });
  it("should render end date input required icon with required label", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        isRequired={true}
        isShowRequiredLabel={true}
        requiredLabel={"Required"}
      />
    );
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    const elem1 = screen.getByTestId("end-date-required-logo");
    expect(elem1).toBeInTheDocument();
    const elem2 = screen.getByTestId("end-date-required-label");
    expect(elem2).toBeInTheDocument();
    expect(elem2.textContent).toContain("Required");
  });

  it("should render start date label", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem = screen.getByTestId("label-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem.textContent).toContain("Start Date");
  });
  it("should render end date label", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem = screen.getByTestId("label-testid-end-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem.textContent).toContain("End Date");
  });

  it("should render start date error", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        isStartDateError={true}
        startDateHelperMessage={"Start date required"}
      />
    );
    const elem = screen.getByTestId("helpertext-testid-start-datetest-id");
    expect(elem).toBeInTheDocument();
    expect(elem.textContent).toContain("Start date required");
    const elem1 = screen.getByTestId("start-date-error-icon");
    expect(elem1).toBeInTheDocument();
  });
  it("should render end date error", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        isEndDateError={true}
        endDateHelperMessage={"End date required"}
      />
    );
    const elem = screen.getByTestId("helpertext-testid-end-datetest-id");
    expect(elem).toBeInTheDocument();
    expect(elem.textContent).toContain("End date required");
    const elem1 = screen.getByTestId("end-date-error-icon");
    expect(elem1).toBeInTheDocument();
  });

  it("should render start date success message", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        isStartDateSuccess={true}
        startDateHelperMessage={"Start date success"}
      />
    );
    const elem = screen.getByTestId("helpertext-testid-start-datetest-id");
    expect(elem).toBeInTheDocument();
    expect(elem.textContent).toContain("Start date success");
    const elem1 = screen.getByTestId("start-date-success-icon");
    expect(elem1).toBeInTheDocument();
  });
  it("should render end date success message", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        isEndDateSuccess={true}
        endDateHelperMessage={"End date success"}
      />
    );
    const elem = screen.getByTestId("helpertext-testid-end-datetest-id");
    expect(elem).toBeInTheDocument();
    expect(elem.textContent).toContain("End date success");
    const elem1 = screen.getByTestId("end-date-success-icon");
    expect(elem1).toBeInTheDocument();
  });

  it("open date range calender on click of start calender icon", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem1 = screen.getByTestId("start-date-calender-icon");
    expect(elem1).toBeInTheDocument();
    fireEvent.click(elem1);
    const elem2 = screen.getByTestId("date-range-calender-wrapper");
    expect(elem2).toBeInTheDocument();
    const elem3 = screen.getByText("January");
    expect(elem3).toBeInTheDocument();
  });
  it("open date range calender on click of end calender icon", async () => {
    render(<MockComponent {...DatePickerMockData} />);
    const elem1 = screen.getByTestId("end-date-calender-icon");
    expect(elem1).toBeInTheDocument();
    fireEvent.click(elem1);
    const elem2 = screen.getByTestId("date-range-calender-wrapper");
    expect(elem2).toBeInTheDocument();
    const elem3 = screen.getByText("January");
    expect(elem3).toBeInTheDocument();
  });

  it("render start date value provided date range", async () => {
    render(
      <MockComponent {...DatePickerMockData} dateRange={["11/23/2023", ""]} />
    );
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveValue("11/23/2023");
  });
  it("render end date value provided date range", async () => {
    render(
      <MockComponent {...DatePickerMockData} dateRange={["", "11/28/2023"]} />
    );
    const elem = screen.getByTestId("input-testid-end-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveValue("11/28/2023");
  });

  it("render start date moobjectment value provided date range", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        dateRange={[dayjs().add(2, "days").format("MM/DD/YYYY"), ""]}
      />
    );
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveValue(dayjs().add(2, "days").format("MM/DD/YYYY"));
  });
  it("render end date object value provided date range", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        dateRange={["", dayjs().add(6, "days").format("MM/DD/YYYY")]}
      />
    );
    const elem = screen.getByTestId("input-testid-end-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveValue(dayjs().add(6, "days").format("MM/DD/YYYY"));
  });

  it("render start date with input changed value", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        dateRange={[dayjs().add(2, "days").format("MM/DD/YYYY"), ""]}
      />
    );
    const elem = screen.getByTestId("input-testid-start-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveValue(dayjs().add(2, "days").format("MM/DD/YYYY"));
    fireEvent.change(elem, { target: { value: "11/28/2023" } });
    expect(elem).toHaveValue("11/28/2023");
  });
  it("render end date with input changed value", async () => {
    render(
      <MockComponent
        {...DatePickerMockData}
        dateRange={["", dayjs().add(6, "days").format("MM/DD/YYYY")]}
      />
    );
    const elem = screen.getByTestId("input-testid-end-date-test-id");
    expect(elem).toBeInTheDocument();
    expect(elem).toHaveValue(dayjs().add(6, "days").format("MM/DD/YYYY"));
    fireEvent.change(elem, { target: { value: "11/28/2023" } });
    expect(elem).toHaveValue("11/28/2023");
  });
});
