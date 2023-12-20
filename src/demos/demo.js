import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import TextEditor from "../components/datagrid/editors/textEditor";
import DataGrid from "../components/datagrid/DataGrid";

export default function Demo({ direction }) {
  const columns = [
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "firstname",
      width: 150,
      headerName:
        "Here is a simple Typescript with Lodash deep difference checker",
      headerCellStyle: { textWrap: "wrap", lineHeight: "normal" },
      alignment: true,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      width: 200,
      alignment: { type: "string" },
    },
    {
      field: "number",
      headerName: "Number",
    },
    {
      field: "homenumber",
      headerName: "Home Numer",
    },
    {
      field: "personalnumber",
      headerName: "Personal Number",
      headerCellStyle: { textWrap: "wrap", lineHeight: "normal" },
    },
    {
      field: "address",
      headerName: "Address",
    },
    { field: "school", headerName: "School", cellEditor: TextEditor },
    { field: "class", headerName: "Class", cellEditor: TextEditor },
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
      firstname: "Namitoh",
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
  const [selectedRows, setSelectedRows] = useState([]);
  // console.log("selectedRows", selectedRows);
  const gridRef = useRef(null);
  return (
    <>
      <button
        onClick={() => {
          setSelectedRows(
            selectedRows.filter((a, i) => {
              if (i === 0 || i === 3) return a;
            })
          );
        }}
      >
        Reduce
      </button>
      <button
        onClick={() => {
          setSelectedRows([]);
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          setSelectedRows(initialRows);
        }}
      >
        Add
      </button>
      Find{" "}
      <input
        onChange={(e) => {
          gridRef.current.api.findData(e.target.value, "exactmatch");
        }}
      />
      <DataGrid
        columnData={columns}
        rowData={initialRows}
        selection={true}
        selectedRows={selectedRows}
        headerRowHeight={60}
        innerRef={gridRef}
        onSelectedRowsChange={(rows) => {
          // console.log("Calling", rows);
          setSelectedRows([...rows]);
        }}
        style={{ "--rdg-cell-align-string": "start" }}
      />
    </>
  );
}
