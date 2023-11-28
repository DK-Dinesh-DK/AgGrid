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

function isAtBottom({ currentTarget }) {
  return (
    currentTarget.scrollTop + 10 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}

function loadMoreRows(newRowsCount, length) {
  return new Promise((resolve) => {
    const newRows = [];

    for (let i = 0; i < newRowsCount; i++) {
      newRows[i] = createFakeRowObjectData(i + length);
    }

    setTimeout(() => resolve(newRows), 1000);
  });
}

export default function ExportFile({ direction }) {
  const [rows, setRows] = useState(() => createRows(100));
  const [isLoading, setIsLoading] = useState(false);

  async function handleScroll(event) {
    if (isLoading || !isAtBottom(event)) return;

    setIsLoading(true);

    const newRows = await loadMoreRows(50, rows.length);

    setRows([...rows, ...newRows]);
    setIsLoading(false);
  }
  return (
    <>
      <DataGrid
        columnData={columns}
        rowData={rows}
        rowKeyGetter={rowKeyGetter}
        onRowsChange={setRows}
        rowHeight={25}
        rowSelection={"single"}
        className="fill-grid"
        style={{
          "--rdg-color": " #000",
          "--rdg-cell-border-color": "1px solid #FFFFFF",
          "--rdg-summary-border-color": "#aaa",
          "--rdg-background-color": "hsl(0deg 0% 100%)",
          "--rdg-header-background-color": "#16365D",
          "--rdg-header-row-color": "#FFFFFF",
          "--rdg-row-hover-background-color": "#D7E3BC",
          "--rdg-row-hover-color": "#000",
          "--rdg-row-selected-background-color": "hsl(207deg 76% 92%)",
          "--rdg-row-selected-hover-background-color": "hsl(207deg 76% 88%)",
          "--rdg-checkbox-color": "hsl(207deg 100% 29%)",
          "--rdg-checkbox-focus-color": "hsl(207deg 100% 69%)",
          "--rdg-checkbox-disabled-border-color": " #ccc",
          "--rdg-checkbox-disabled-background-color": "#ddd",
          "--rdg-textEditor-text-color": "#000000",
          "--rdg-row-even-background-color": "#E5EDF8",
          "--rdg-row-odd-background-color": "#f3f8fc",
          "--rdg-row-selected-background-color": "#ebf1dd",
          "--rdg-font-family":
            '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          "--rdg-header-font-size": "11px",
          "--rdg-tree-icon-color": "#000",
          "--rdg-tree-icon-font-size": "12px",
          "--rdg-master-icon-color": "#000",
          "--rdg-master-icon-font-size": "12px",
          "--rdg-group-icon-color": "#000",
          "--rdg-group-icon-font-size": "12px",
        }}
        direction={direction}
        importExcel={true}
        export={{
          pdfFileName: "TableData",
          csvFileName: "TableData",
          excelFileName: "TableData",
        }}
        exportPdfStyle={{ width: 400, height: 900 }}
      />
      {isLoading && (
        <div className={loadMoreRowsClassname}>Loading more rows...</div>
      )}
    </>
  );
}
