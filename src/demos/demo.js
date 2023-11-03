import React, { useState } from "react";

import { faker } from "@faker-js/faker";
import DataGrid from "../components/datagrid/DataGrid";
import { ButtonEditor } from "../components/datagrid/editors";

function createRows() {
  const now = Date.now();
  const rows = [];

  for (let i = 0; i < 1000; i++) {
    rows.push({
      id: i,
      title: `Task #${i + 1}`,
      client: faker.company.name(),
      area: faker.name.jobArea(),
      country: faker.address.country(),
      contact: faker.internet.exampleEmail(),
      assignee: faker.name.fullName(),
      progress: Math.random() * 100,
      startTimestamp: now - Math.round(Math.random() * 1e10),
      endTimestamp: now + Math.round(Math.random() * 1e10),
      budget: 500 + Math.random() * 10500,
      transaction: faker.finance.transactionType(),
      account: faker.finance.iban(),
      version: faker.system.semver(),
      available: Math.random() > 0.5,
    });
  }

  return rows;
}

export default function Demo({ direction }) {
  const [rows, setRows] = useState(createRows);

  const [columns, setColumns] = useState([
    {
      field: "id",
      headerName: "ID",
      frozen: true,
      width: 60,
    },
    {
      field: "title",
      headerName: "Task",
      frozen: true,
      width: 100,
    },
    {
      field: "area",
      headerName: "Area",
      width:200,
      rowSpan: (params) => {
        if (params.rowIndex === 1) return 2;
      },
      // frozen: true,
      // width: 100,
    },
  ]);

  return (
    <>
      <button
        onClick={() => {
          setColumns([
            ...columns,

            {
              field: "contact",
              headerName: "Contact",
            },
            {
              field: "assignee",
              headerName: "Assignee",
            },

            {
              field: "startTimestamp",
              headerName: "Start date",
            },
            {
              field: "endTimestamp",
              headerName: "Deadline",
            },
            {
              field: "budget",
              headerName: "Budget",
            },
            {
              field: "transaction",
              headerName: "Transaction type",
            },
            {
              field: "account",
              headerName: "Account",
            },
            {
              field: "version",
              headerName: "Version",
            },
          ]);
        }}
      >
        Add Columns
      </button>
      <DataGrid
        columnData={columns}
        rowData={rows}
        columnReordering={true}
        // defaultColumnDef={{ filter: true, sortable: true }}
      />
    </>
  );
}
