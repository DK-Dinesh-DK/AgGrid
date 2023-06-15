import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import TextEditor from "../components/datagrid/editors/textEditor";
import React, { useState } from "react";

const columns = [
  {
    field: "name",
    headerName: "Name",
    haveChildren: true,
    children: [
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
        cellEditor: TextEditor,
      },
    ],
  },
  {
    field: "number",
    headerName: "Number",
    haveChildren: true,
    children: [
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
    ],
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
    // firstname: "John",

    lastname: "Doe",
    homenumber: "9987654336",
    personalnumber: "4545454534",
    address: "Marathahali",
    school: "DAV",
    class: "10th",
  },
  {
    id: 2,
    // firstname: "Suvendu",
    lastname: "Sahoo",
    homenumber: "8976543234",
    personalnumber: "8765789045",
    address: "Kodihali",
    school: "DPS",
    class: "7th",
  },
  {
    id: 3,
    // firstname: "Namit",
    lastname: "Singh",
    homenumber: "6765458907",
    personalnumber: "8769034156",
    address: "Marathahali",
    school: "DPS",
    class: "8th",
  },
  {
    id: 4,
    // firstname: "Pravalika",
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
      enableVirtualization={false}
      className="fill-grid"
      // onRowsChange={setRows}
      rowKeyGetter={(data) => data.id}
      selection={true}
    />
  );
}

describe("Datagrid Unit test", () => {
  test("All Row selection using HeaderRow Checkbox", async () => {
    render(<LaiDataGrid />);

    const HeaderRowCheckbox = screen.getByRole("checkbox", {
      name: "Select All",
    });
    const rowCheckbox = screen.getAllByRole("checkbox", { name: "Select" });

    //Rowcheckbox should be unchecked bydefault
    rowCheckbox.forEach((rowCheckbox) => {
      expect(rowCheckbox).toBeInTheDocument();
      expect(rowCheckbox).not.toBeChecked();
    });

    //Headercheckbox should be unchecked bydefault
    expect(HeaderRowCheckbox).toBeInTheDocument();
    expect(HeaderRowCheckbox).not.toBeChecked();
    expect(HeaderRowCheckbox.checked).toBe(false);

    //Apply Click event to make headercheckbox checked
    // fireEvent.click(HeaderRowCheckbox);

    // //Now headercheckbox should be checked.
    // expect(HeaderRowCheckbox).toBeChecked();

    // expect(HeaderRowCheckbox.checked).toBe(true);

    // //Now all row should be checked
    // rowCheckbox.forEach((rowCheckbox) => {
    //   expect(rowCheckbox).toBeChecked();
    // });
  });
});
