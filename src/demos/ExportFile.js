import React from "react";
import { faker } from "@faker-js/faker";

import DataGrid from "../components/datagrid/DataGrid";

function rowKeyGetter(row) {
  return row.id;
}

function createRows() {
  const now = Date.now();
  const rows = [];

  for (let i = 0; i < 10; i++) {
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

export default function ExportFile() {
  const rows = createRows();

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "title",
      headerName: "Task",
      sortable: true,
      headerRenderer: () => <span>Task-New</span>,
    },
    {
      field: "client",
      headerName: "Client",
    },
    {
      field: "area",
      headerName: "Area",
    },
    {
      field: "contact",
      headerName: "Contact",
    },
    {
      field: "assignee",
      headerName: "Assignee",
    },
    {
      field: "progress",
      headerName: "Completion",
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
    {
      field: "available",
      headerName: "Available",
    },
  ];

  return (
    <>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columnData={columns}
        rowData={rows}
        exportPdfStyle={{ width: 1000, height: 600 }}
        serialNumber={true}
        // importExcel={true}
        export={{
          pdfFileName: true,
          csvFileName: "TableData",
          excelFileName: "TableData",
        }}
      />
    </>
  );
}
