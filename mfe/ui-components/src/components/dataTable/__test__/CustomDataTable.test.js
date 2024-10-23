import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CustomDataTable } from "../CustomDataTable";
import { Default } from "../../../stories/CustomDataTable.stories";

describe("Custom data table from stories", () => {
  test("Default type renders correctly", () => {
    render(<Default {...Default.args} />);
    const tableElement = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();

    const rowGroupElements = screen.getAllByRole("rowgroup");
    expect(rowGroupElements.length).toBe(2);

    let headerWrapperElement = rowGroupElements[0];
    let headerElements = headerWrapperElement.firstChild;
    expect(headerElements.childElementCount).toBe(11);
  });
});

// Sample data
let tableData = [
  {
    id: 1,
    PatientName: "John Doe",
    Priority: "High",
    Task: 123,
    Type: "Medical",
    TaskPurpose: "Checkup",
    Location: "Hospital",
    Provider: "Dr. Smith",
    Assignee: "Nurse Jane",
    LastUpdate: "2023-08-15",
    TaskAge: "2 days",
    Status: "Pending",
  },
  {
    id: 2,
    PatientName: "Jane Smith",
    Priority: "Medium",
    Task: 124,
    Type: "Lab",
    TaskPurpose: "Blood Test",
    Location: "Clinic",
    Provider: "Dr. Johnson",
    Assignee: "Lab Technician",
    LastUpdate: "2023-08-14",
    TaskAge: "1 day",
    Status: "Completed",
  },
];

// Table headers configuration
let tableHeaders = [
  {
    id: "PatientName",
    name: "Patient Name",
    sortable: true,
    selector: (row) => row.PatientName,
  },
  {
    id: "Priority",
    name: "Priority",
    sortable: true,
    cell: (row) => (
      <div style={{ backgroundColor: "red", color: "blue" }}>
        {row.Priority}
      </div>
    ),
    selector: (row) => row.Priority,
  },
  {
    id: "Task",
    name: "Task#",
    sortable: false,
    selector: (row) => row.Task,
  },
  {
    id: "Type",
    name: "Type",
    sortable: false,
    selector: (row) => row.Type,
  },
  {
    id: "TaskPurpose",
    name: "Task Purpose",
    sortable: false,
    selector: (row) => row.TaskPurpose,
  },
  {
    id: "Location",
    name: "Location",
    sortable: false,
    selector: (row) => row.Location,
  },
  {
    id: "Provider",
    name: "Provider",
    sortable: false,
    selector: (row) => row.Provider,
  },
  {
    id: "Assignee",
    name: "Assignee",
    sortable: false,
    selector: (row) => row.Assignee,
  },
  {
    id: "LastUpdate",
    name: "Last Update",
    sortable: false,
    selector: (row) => row.LastUpdate,
  },
  {
    id: "TaskAge",
    name: "Task Age",
    sortable: false,
    selector: (row) => row.TaskAge,
  },
  {
    id: "Status",
    name: "Status",
    sortable: false,
    selector: (row) => row.Status,
  },
];

let tableProps = {
  defaultSortColumn: "Priority",
};

const MockTable = (props) => {
  return (
    <CustomDataTable
      columns={tableHeaders}
      data={tableData}
      totalPageCount={20}
      totalRocords={tableData.length}
      recordsPerPage={10}
      currentPage={1}
      noDataComponent={"No results"}
      paginationTotalRecordsMessage={"results"}
      paginationRecordsPerPageMessage={"per page"}
      stickyHeader={true}
      {...tableProps}
      {...props}
    />
  );
};

describe("Table test cases", () => {
  const baseProps = {
    onSortIconClick: jest.fn(),
    handleChangePage: jest.fn(),
  };

  test("Should render the component", () => {
    render(<MockTable {...baseProps} />);
    const tableElement = screen.getByRole("table");
    expect(tableElement).toBeInTheDocument();

    const rowGroupElements = screen.getAllByRole("rowgroup");
    expect(rowGroupElements.length).toBe(2);

    let headerWrapperElement = rowGroupElements[0];
    let headerElement = headerWrapperElement.firstChild;
    expect(headerElement.childElementCount).toBe(tableHeaders.length);
  });

  test("Should render the table header text properly", () => {
    render(<MockTable {...baseProps} />);
    const rowGroupElements = screen.getAllByRole("rowgroup");
    let headerWrapperElement = rowGroupElements[0];
    let headerElements = headerWrapperElement.firstChild;
    expect(headerElements.childElementCount).toBe(tableHeaders.length);

    headerElements.childNodes.forEach((headerElement, index) => {
      let headerObj = tableHeaders[index];
      let suffix = "";
      if (headerObj.sortable) {
        suffix = "▲";
      }
      expect(headerElement.textContent).toBe(headerObj.name + suffix);
    });
  });

  test("Should render the table data in body properly", () => {
    render(<MockTable {...baseProps} />);
    const rowGroupElements = screen.getAllByRole("rowgroup");
    let bodyElements = rowGroupElements[1];
    expect(bodyElements.childElementCount).toBe(tableData.length);

    bodyElements.childNodes.forEach((rows, index) => {
      expect(rows.childElementCount).toBe(tableHeaders.length);
      let comparingObj = tableData[index];
      rows.childNodes.forEach((rowDataElement, j) => {
        let header = tableHeaders[j];
        expect(rowDataElement.textContent).toBe("" + comparingObj[header.id]);
      });
    });
  });

  test("sort icon should be clickable", () => {
    render(<MockTable {...baseProps} />);
    const rowGroupElements = screen.getAllByRole("rowgroup");
    let headerWrapperElement = rowGroupElements[0];
    let headerElements = headerWrapperElement.firstChild;
    expect(headerElements.childElementCount).toBe(tableHeaders.length);

    let firstSortableHeader = headerElements.firstChild;
    fireEvent.click(firstSortableHeader.firstChild);
    expect(baseProps.onSortIconClick).toHaveBeenCalled();
  });

  test("should render pagination data", () => {
    let extraData = [];
    for (let i = 0; i < 100; i++) {
      let obj = tableData[0];
      obj.id = i + 1;
      extraData.push(obj);
    }
    render(
      <MockTable
        {...baseProps}
        recordsPerPage={10}
        totalRocords={extraData.length}
        data={extraData}
        pagination={true}
        id={"mock"}
      />
    );
    const paginationElement = screen.getByTestId("table-pagination-mock");
    expect(paginationElement).toBeInTheDocument();
  });

  test("should show max page count", () => {
    let extraData = [];
    let totalPageCount = 3;
    //  generating random data for testing
    for (let i = 0; i < 100; i++) {
      let obj = tableData[0];
      obj.id = i + 1;
      extraData.push(obj);
    }
    render(
      <MockTable
        {...baseProps}
        recordsPerPage={10}
        totalRocords={extraData.length}
        data={extraData}
        pagination={true}
        id={"mock"}
        totalPageCount={totalPageCount}
      />
    );
    const paginationElement = screen.getByTestId("table-pagination-mock");
    expect(paginationElement).toBeInTheDocument();
    const ulElement = paginationElement.querySelector("ul");
    const liElements = ulElement.querySelectorAll("li");

    expect(ulElement).toBeInTheDocument();
    expect(liElements).toHaveLength(totalPageCount + 2); // two extra for left and right navigation btn
  });

  test("should show total records count", () => {
    let extraData = [];

    //  generating random data for testing
    for (let i = 0; i < 100; i++) {
      let obj = tableData[0];
      obj.id = i + 1;
      extraData.push(obj);
    }
    render(
      <MockTable
        {...baseProps}
        recordsPerPage={10}
        totalRocords={extraData.length}
        data={extraData}
        pagination={true}
        id={"mock"}
      />
    );
    const paginationElement = screen.getByTestId("table-pagination-mock");
    expect(paginationElement).toBeInTheDocument();
    const totalCountElem = paginationElement.firstChild.firstChild;
    expect(totalCountElem.textContent).toBe("" + extraData.length + " "); // two extra for left and right navigation btn
  });

  test("should show records per page count properly", () => {
    let extraData = [];
    let recordsPerPage = 10;
    let message = "per page";
    //  generating random data for testing
    for (let i = 0; i < 100; i++) {
      let obj = tableData[0];
      obj.id = i + 1;
      extraData.push(obj);
    }
    render(
      <MockTable
        {...baseProps}
        recordsPerPage={recordsPerPage}
        totalRocords={extraData.length}
        data={extraData}
        pagination={true}
        paginationRecordsPerPageMessage={message}
        id={"mock"}
      />
    );
    const paginationElement = screen.getByTestId("table-pagination-mock");
    expect(paginationElement).toBeInTheDocument();
    const totalCountElem = paginationElement.firstChild.lastChild;
    expect(totalCountElem.textContent).toBe(
      "" + recordsPerPage + " " + message
    ); // two extra for left and right navigation btn
  });

  test("should run handlePageChange on page change action", () => {
    let extraData = [];
    let totalPageCount = 3;
    //  generating random data for testing
    for (let i = 0; i < 100; i++) {
      let obj = tableData[0];
      obj.id = i + 1;
      extraData.push(obj);
    }
    render(
      <MockTable
        {...baseProps}
        recordsPerPage={10}
        totalRocords={extraData.length}
        data={extraData}
        pagination={true}
        id={"mock"}
        totalPageCount={totalPageCount}
      />
    );
    const paginationElement = screen.getByTestId("table-pagination-mock");
    expect(paginationElement).toBeInTheDocument();
    const ulElement = paginationElement.querySelector("ul");
    const liElements = ulElement.querySelectorAll("li");

    let secondPageElement = liElements[2];
    fireEvent.click(secondPageElement.firstChild);
    expect(baseProps.handleChangePage).toHaveBeenCalled();
  });
});
