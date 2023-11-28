import { useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import TextEditor from "../components/datagrid/editors/textEditor";
import DataGrid from "../components/datagrid/DataGrid";

const loadMoreRowsClassname = css`
  inline-size: 180px;
  padding-block: 8px;
  padding-inline: 16px;
  position: absolute;
  inset-block-end: 8px;
  inset-inline-end: 8px;
  color: white;
  line-height: 35px;
  background: rgb(0 0 0 / 0.6);
`;

function rowKeyGetter(row) {
  return row.id;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    // cellRenderer: (props) => {
    //   return TextEditor(props);
    // },
  },
  {
    field: "title",
    headerName: "Title",
    editable: true,
  },
  {
    field: "firstName",
    headerName: "First Name",
    cellRenderer: (props) => {
      return TextEditor(props);
    },
  },
  {
    field: "lastName",
    headerName: "Last Name",
  },
  {
    field: "email",
    headerName: "Email",
    hide: true,
    valueFormatter: ({ row, column }) => `Email: ${row[column.key]}`,
  },
];

function createFakeRowObjectData(index) {
  return {
    id: `id_${index}`,
    title: faker.name.prefix(),
    firstName: faker.name.firstName(),
    lastName: faker.name.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}

function createRows(numberOfRows) {
  const rows = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = createFakeRowObjectData(i);
  }

  return rows;
}

export default function ExportFile({ direction }) {
  const [rows, setRows] = useState(() => createRows(100));

  return (
    <>
      <DataGrid
        columnData={columns}
        rowData={rows}
        rowKeyGetter={rowKeyGetter}
        importExcel={true}
        export={{
          pdfFileName: "TableData",
          csvFileName: "TableData",
          excelFileName: "TableData",
        }}
        exportPdfStyle={{ width: 400, height: 900 }}
      />
    </>
  );
}
