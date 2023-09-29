import { fireEvent, render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";
import { queryGrid, queryRows } from "./utils/utils";
const columns = [
  {
    field: "name",
    headerName: "Name",
    haveChildren: true,
    children: [
      { field: "firstname", headerName: "First Name" },
      { field: "lastname", headerName: "Last Name" },
    ],
  },
  {
    field: "number",
    headerName: "Number",
    haveChildren: true,
    children: [
      { field: "homenumber", headerName: "Home Numer" },
      {
        field: "personalnumber",
        headerName: "Personal Number",
      },
    ],
  },
  { field: "address", headerName: "Address" },
  { field: "school", headerName: "School" },
  { field: "class", headerName: "Class" },
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
  const [selectedRowContent, setSelectedRowContent] = useState("");
  function onRowSingleClick(e) {
    console.log("e :>> ", e);
  }
  return (
    <>
      <div>{selectedRowContent}</div>
      <DataGrid
        columnData={columns}
        gridId={"laidatagrid1"}
        rowData={rows}
        rowKeyGetter={(data) => data.personalnumber}
        onRowClicked={(e) => console.log("e :>> ", e)}
        enableVirtualization={false}
      />
    </>
  );
}
describe("rowSingleClick event test", () => {
  test("Row Single Click event works properly", async () => {
    render(<LaiDataGrid />);
    const rowElements = queryRows();
    userEvent.setup();
    window.HTMLElement.prototype.scrollIntoView = function () {};
    await act(async () => await userEvent.click(rowElements[0]));

    // console.log("rows :>> ", rowElements[0]);
  });
});
