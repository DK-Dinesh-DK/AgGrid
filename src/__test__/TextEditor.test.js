import { fireEvent, render, screen } from "@testing-library/react";
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
      { field: "firstname", headerName: "First Name", cellEditor: TextEditor },
      { field: "lastname", headerName: "Last Name", cellEditor: TextEditor },
    ],
  },
  {
    field: "number",
    headerName: "Number",
    haveChildren: true,
    children: [
      { field: "homenumber", headerName: "Home Numer", cellEditor: TextEditor },
      {
        field: "personalnumber",
        headerName: "Personal Number",
        cellEditor: TextEditor,
      },
    ],
  },
  { field: "address", headerName: "Address", cellEditor: TextEditor },
  { field: "school", headerName: "School", cellEditor: TextEditor },
  { field: "class", headerName: "Class", cellEditor: TextEditor },
];
const initialRows = [
  {
    firstname: "John",
    lastname: "Doe",
    homenumber: "9987654336",
    personalnumber: "4545454534",
    address: "Marathahali",
    school: "DAV",
    class: "10th",
  },
  {
    firstname: "Suvendu",
    lastname: "Sahoo",
    homenumber: "8976543234",
    personalnumber: "8765789045",
    address: "Kodihali",
    school: "DPS",
    class: "7th",
  },
  {
    firstname: "Namit",
    lastname: "Singh",
    homenumber: "6765458907",
    personalnumber: "8769034156",
    address: "Marathahali",
    school: "DPS",
    class: "8th",
  },
  {
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
      testId={"laidatagrid"}
      rowData={rows}
      headerRowHeight={24}
      className="fill-grid"
      onRowsChange={setRows}
      selection={true}
      rowKeyGetter={(data) => data.homenumber}
    />
  );
}

describe("Datagrid Unit test", () => {
  test("Multiline Header rowdata should be editable on dblClick and new edited data should be rendered in that cell", async () => {
    render(<LaiDataGrid />);

    const datagrid = screen.getByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const gridcell = screen.getByRole("gridcell", { name: "Suvendu" });
    expect(gridcell).toBeInTheDocument();

    await userEvent.dblClick(gridcell);
    let input = screen.getByRole("gridcellTextbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("rdg-text-editor");
    fireEvent.change(input, { target: { value: "Sarthak" } });
    expect(input).toHaveValue("Sarthak");
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input).not.toBeInTheDocument();
    expect(gridcell).not.toBeInTheDocument();
  });
});
