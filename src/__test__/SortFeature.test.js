/* eslint-disable testing-library/prefer-screen-queries */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { TextEditor } from "../components/datagrid/editors";
import React, { useState } from "react";

const columns = [
  {
    field: "firstname",
    headerName: "First Name",
    sortable: true,
    cellEditor: TextEditor,
  },
  {
    field: "lastname",
    headerName: "Last Name",
    sortable: true,
    resizable: true,
    cellEditor: TextEditor,
  },

  {
    field: "homenumber",
    headerName: "Home Number",
    sortable: true,
    cellEditor: TextEditor,
  },
  {
    field: "personalnumber",
    sortable: true,
    headerName: "Personal Number",
    cellEditor: TextEditor,
  },

  {
    field: "address",
    headerName: "Address",
    sortable: true,
    cellEditor: TextEditor,
  },
  {
    field: "school",
    headerName: "School",
    sortable: true,
    cellEditor: TextEditor,
  },
  {
    field: "class",
    headerName: "Class",
    sortable: true,
    cellEditor: TextEditor,
  },
];
const initialRows = [
  {
    id: 1,
    firstname: "John",

    lastname: "Doe",
    homenumber: "9987654336",
    personalnumber: "4545454534",
    address: "Marathahali",
    school: "DAV",
    class: "10th",
  },
  {
    id: 2,
    firstname: "Suvendu",
    lastname: "Sahoo",
    homenumber: "8976543234",
    personalnumber: "8765789045",
    address: "Kodihali",
    school: "DPS",
    class: "7th",
  },
  {
    id: 3,
    firstname: "Namit",
    lastname: "Singh",
    homenumber: "6765458907",
    personalnumber: "8769034156",
    address: "Marathahali",
    school: "DPS",
    class: "8th",
  },
  {
    id: 4,
    firstname: "Pravalika",
    lastname: "Reddy",
    homenumber: "9098654567",
    personalnumber: "6578934123",
    address: "Indira Nagar",
    school: "DAV",
    class: "9th",
  },
];

function LaiDataGrid() {
  const [rows, setRows] = useState(initialRows);

  return (
    <DataGrid
      columnData={columns}
      testId={"datagridMultilineHeader"}
      rowData={rows}
      headerRowHeight={24}
      className="fill-grid"
      onRowsChange={setRows}
      rowKeyGetter={(data) => data.id}
      enableVirtualization={false}
      selection={true}
    />
  );
}

describe("Datagrid Unit test", () => {
  test("should sort data when user clicks header name", () => {
    const { getByText, getAllByRole } = render(<LaiDataGrid />);

    // Find the header element for 'Last Name'
    const lastNameHeader = getByText("Last Name");

    // Click on the 'Last Name' header to sort by last name in ascending order
    fireEvent.click(lastNameHeader);

    // Get all the rows in the grid
    const rowsAscending = getAllByRole("row");

    // Verify that the rows are sorted by last name in ascending order
    expect(rowsAscending[0]).toHaveTextContent("Doe");
    expect(rowsAscending[1]).toHaveTextContent("Reddy");
    expect(rowsAscending[2]).toHaveTextContent("Sahoo");
    expect(rowsAscending[3]).toHaveTextContent("Singh");

    fireEvent.click(lastNameHeader);

    // Get all the rows in the grid after sorting in descending order
    const rowsDescending = getAllByRole("row");

    // Verify that the rows are sorted by last name in descending order
    expect(rowsDescending[0]).toHaveTextContent("Singh");
    expect(rowsDescending[1]).toHaveTextContent("Sahoo");
    expect(rowsDescending[2]).toHaveTextContent("Reddy");
    expect(rowsDescending[3]).toHaveTextContent("Doe");

    fireEvent.click(lastNameHeader);

    // Get all the rows in the grid after sorting in byDefault order
    const rowsDefault = getAllByRole("row");

    // Verify that the rows are sorted by last name in byDefault order
    expect(rowsDefault[0]).toHaveTextContent("Doe");
    expect(rowsDefault[1]).toHaveTextContent("Sahoo");
    expect(rowsDefault[2]).toHaveTextContent("Singh");
    expect(rowsDefault[3]).toHaveTextContent("Reddy");
  });
  test(" header keydown", () => {
    const { getByText, getAllByRole } = render(<LaiDataGrid />);

    // Find the header element for 'Last Name'
    const lastNameHeader = getByText("Last Name");
    expect(lastNameHeader).toBeInTheDocument();
    fireEvent.keyDown(lastNameHeader, { key: "Enter" });
    fireEvent.pointerDown(lastNameHeader);
    fireEvent.pointerMove(lastNameHeader);
    fireEvent.lostPointerCapture(lastNameHeader);
  });
});
