import React, { useRef, useState } from "react";

import { faker } from "@faker-js/faker";
import DataGrid from "../components/datagrid/DataGrid";

function createRows() {
  const rows = [];

  for (let i = 0; i < 5; i++) {
    rows.push({
      id: i,
      title: `Task #${i + 1}`,
      area: `Area #${i + 1}`,
      contact: `Contanct #${i + 1}`,
    });
  }

  return rows;
}

export default function ColumnToolPanel({ direction }) {
  const rows = createRows();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      frozen: true,
      width: 60,
    },
    {
      field: "title",
      headerName: "Title",
      frozen: true,
      width: 100,
    },
    {
      field: "area",
      headerName: "Area",
      width: 150,
    },
    {
      field: "contact",
      headerName: "Contact",
      width: 150,
    },
  ];

  return (
    <div>
      <DataGrid
        columnData={columns}
        rowData={rows}
        serialNumber={true}
        columnPanel={true}
        // selection={true}
      />
    </div>
  );
}
