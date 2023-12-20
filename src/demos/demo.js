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
      haveChildren: true,
      children: [
        {
          field: "firstname",
          headerName: "First Name",
          filter: true,
          cellEditor: TextEditor,
        },
        {
          field: "lastname",
          filter: true,
          headerName: "Last Name",
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
          headerName: "Home Numer",
          cellEditor: TextEditor,
        },
        {
          field: "personalnumber",
          headerName: "Personal Number",
          cellEditor: TextEditor,
        },
      ],
    },
    {
      field: "address",
      filter: true,
      headerName: "Address",
      cellEditor: TextEditor,
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
  return (
    <>
      <DataGrid columnData={columns} rowData={initialRows} />
    </>
  );
}
