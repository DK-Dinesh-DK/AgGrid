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
      { field: "firstname", headerName: "First Name"},
      { field: "lastname", headerName: "Last Name"},
    ],
  },
  {
    field: "number",
    headerName: "Number",
    haveChildren: true,
    children: [
      { field: "homenumber", headerName: "Home Numer"},
      {
        field: "personalnumber",
        headerName: "Personal Number",
    
      },
    ],
  },
  { field: "address", headerName: "Address"},
  { field: "school", headerName: "School"},
  { field: "class", headerName: "Class"},
];
const initialRows = [
  {
    firstname: "John",
    lastname: "Doe",
    homenumber: "9987654336",
    personalnumber: "4545454534",
    address: "WhiteField",
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
      rowKeyGetter={(data) => data.homenumber}
      enableVirtualization={false}
      onRowsChange={setRows}
      selection={true}
    />
  );
}

describe("Datagrid Unit test", () => {
 

  test("Headerdata rendered & on headerCell click it should be selected", async () => {
    render(<LaiDataGrid />);

    const datagrid = screen.getByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const columnheader = screen.getByRole("columnheader", {
      name: "First Name",
    });
    expect(columnheader).toBeInTheDocument();
    expect(columnheader).toHaveAttribute("aria-selected", "false");
    await fireEvent.click(columnheader);
    expect(columnheader).toHaveAttribute("aria-selected", "true");

    const columnheader1 = screen.getByRole("columnheader", {
      name: "Address",
    });
    expect(columnheader1).toBeInTheDocument();
    expect(columnheader1).toHaveAttribute("aria-selected", "false");
    await fireEvent.click(columnheader1);
    expect(columnheader1).toHaveAttribute("aria-selected", "true");
   
  });

  test("Rowdata rendered & on rowCell click it should be selected", async () => {
    render(<LaiDataGrid />);

    const datagrid = screen.getByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const gridcell = screen.getByRole("gridcell", { name: "Suvendu" });
    expect(gridcell).toBeInTheDocument();

    expect(gridcell).toHaveAttribute("aria-selected", "false");
    await fireEvent.click(gridcell);
    expect(gridcell).toHaveAttribute("aria-selected", "true");

    const gridcell2 = screen.getByRole("gridcell", { name: "Marathahali" });
    expect(gridcell2).toBeInTheDocument();

    expect(gridcell2).toHaveAttribute("aria-selected", "false");
    await fireEvent.click(gridcell2);
    expect(gridcell2).toHaveAttribute("aria-selected", "true");
    
  });
  
});
