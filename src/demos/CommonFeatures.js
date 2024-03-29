import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import TextEditor from "../components/datagrid/editors/textEditor";
import { SelectCellFormatter } from "../components/datagrid/formatters/SelectCellFormatter";
import DataGrid from "../components/datagrid/DataGrid";
import {
  exportToCsv,
  exportToXlsx,
  exportToPdf,
} from "../components/datagrid/exportUtils";
import { ButtonEditor } from "../components/datagrid/editors";

const toolbarClassname = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-block-end: 8px;
`;

const dialogContainerClassname = css`
  position: absolute;
  inset: 0;
  display: flex;
  place-items: center;
  background: rgba(0, 0, 0, 0.1);

  > dialog {
    width: 300px;
    > input {
      width: 100%;
    }

    > menu {
      text-align: end;
    }
  }
`;

const dateFormatter = new Intl.DateTimeFormat(navigator.language);
const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  currency: "eur",
});

function TimestampFormatter({ timestamp }) {
  return <>{dateFormatter.format(timestamp)}</>;
}

function CurrencyFormatter({ value }) {
  return <>{currencyFormatter.format(value)}</>;
}

function getColumns(countries, direction) {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 60,
      frozen: true,
      haveChildren: false,
      topHeader: "id",
      resizable: false,
      summaryFormatter() {
        return <strong>Total</strong>;
      },
    },
    {
      field: "title",
      headerName: "Task",
      topHeader: "title",
      width: 100,
      haveChildren: false,
      frozen: true,
      sortable: true,
      filter: true,
      cellEditor: TextEditor,
      summaryFormatter({ row }) {
        return <>{row.totalCount} records</>;
      },
    },
    {
      field: "client",
      headerName: "Client",
      haveChildren: false,
      topHeader: "client",
      width: "max-content",
      cellRenderer: TextEditor,
    },
    {
      field: "area",
      topHeader: "area",
      headerName: "Area",
      haveChildren: false,
      width: 120,

      // cellRenderer: TextEditor,
    },
    {
      field: "country",
      topHeader: "country",
      headerName: "Country",
      haveChildren: false,
      width: 180,
      cellRenderer: (p) => (
        <select
          //  className={textEditorClassname}
          value={p.row.country}
          style={{ width: "100%" }}
          onChange={(e) =>
            p.onRowChange({ ...p.row, country: e.target.value }, true)
          }
        >
          {countries.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
      ),
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      field: "contact",
      topHeader: "contact",
      headerName: "Contact",
      haveChildren: false,
      width: 160,
      // cellRenderer: TextEditor,
    },
    {
      field: "assignee",
      topHeader: "assignee",
      headerName: "Assignee",
      width: 150,
      haveChildren: false,
      // cellRenderer: TextEditor,
    },
    {
      field: "progress",
      topHeader: "progress",
      headerName: "Completion",
      width: 110,
      haveChildren: false,
      valueFormater(props) {
        const value = props.row.progress;
        return (
          <>
            <progress max={100} value={value} style={{ inlineSize: 50 }} />{" "}
            {Math.round(value)}%
          </>
        );
      },
      cellEditor({ row, onRowChange, onClose }) {
        return createPortal(
          <div
            dir={direction}
            className={dialogContainerClassname}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                onClose();
              }
            }}
          >
            <dialog open>
              <input
                type="range"
                min="0"
                max="100"
                value={row.progress}
                onChange={(e) =>
                  onRowChange({ ...row, progress: e.target.valueAsNumber })
                }
              />
              <menu>
                <button onClick={() => onClose()}>Cancel</button>
                <button onClick={() => onClose(true)}>Save</button>
              </menu>
            </dialog>
          </div>,
          document.body
        );
      },
      editorOptions: {
        renderFormatter: true,
      },
    },
    {
      field: "startTimestamp",
      topHeader: "startTimestamp",
      headerName: "Start date",
      width: 100,
      haveChildren: false,
      valueFormatter(props) {
        return <TimestampFormatter timestamp={props.row.startTimestamp} />;
      },
    },
    {
      field: "endTimestamp",
      topHeader: "endTimestamp",
      headerName: "Deadline",
      width: 100,
      haveChildren: false,
      valueFormatter(props) {
        return <TimestampFormatter timestamp={props.row.endTimestamp} />;
      },
    },
    {
      field: "budget",
      topHeader: "budget",
      headerName: "Budget",
      width: 100,
      haveChildren: false,
      valueFormatter(props) {
        return <CurrencyFormatter value={props.row.budget} />;
      },
    },
    {
      field: "transaction",
      topHeader: "transaction",
      headerName: "Transaction type",
      haveChildren: false,
    },
    {
      field: "account",
      topHeader: "account",
      headerName: "Account",
      haveChildren: false,
      width: 150,
    },
    {
      field: "version",
      topHeader: "version",
      headerName: "Version",
      haveChildren: false,
    },
    { field: "save", headerName: "Save", cellRenderer: ButtonEditor },
    {
      field: "available",
      topHeader: "available",
      headerName: "Available",
      width: 80,
      haveChildren: false,
      valueFormatter({ row, onRowChange, isCellSelected }) {
        return (
          <SelectCellFormatter
            value={row.available}
            onChange={() => {
              onRowChange({ ...row, available: !row.available });
            }}
            isCellSelected={isCellSelected}
          />
        );
      },
      summaryFormatter({ row: { yesCount, totalCount } }) {
        return <>{`${Math.floor((100 * yesCount) / totalCount)}% ✔️`}</>;
      },
    },
  ];
}

function rowKeyGetter(row) {
  return row.id;
}

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

function getComparator(sortColumn) {
  switch (sortColumn) {
    case "assignee":
    case "title":
    case "client":
    case "area":
    case "country":
    case "contact":
    case "transaction":
    case "account":
    case "version":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    case "available":
      return (a, b) => {
        return a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1;
      };
    case "id":
    case "progress":
    case "startTimestamp":
    case "endTimestamp":
    case "budget":
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}

export default function CommonFeatures({ direction }) {
  const [rows, setRows] = useState(createRows);
  const [sortColumns, setSortColumns] = useState([]);
  // const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [selectedRows, setSelectedRows] = useState([]);
  const countries = useMemo(() => {
    return [...new Set(rows.map((r) => r.country))].sort(
      new Intl.Collator().compare
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = useMemo(
    () => getColumns(countries, direction),
    [countries, direction]
  );

  const summaryRows = useMemo(() => {
    const summaryRow = {
      id: "total_0",
      totalCount: rows.length,
      yesCount: rows.filter((r) => r.available).length,
    };
    return [summaryRow];
  }, [rows]);

  const sortedRows = useMemo(() => {
    if (sortColumns.length === 0) return rows;

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey);
        const compResult = comparator(a, b);
        if (compResult !== 0) {
          return sort.direction === "ASC" ? compResult : -compResult;
        }
      }
      return 0;
    });
  }, [rows, sortColumns]);

  return (
    <>
      <div className={toolbarClassname}>
        <ExportButton
          onExport={() =>
            exportToCsv(sortedRows, columns, "CommonFeatures.csv")
          }
        >
          Export to CSV
        </ExportButton>
        <ExportButton
          onExport={() =>
            exportToXlsx(sortedRows, columns, "CommonFeatures.xlsx")
          }
        >
          Export to XSLX
        </ExportButton>
        <ExportButton
          onExport={() =>
            exportToPdf(sortedRows, columns, "CommonFeatures.pdf")
          }
        >
          Export to PDF
        </ExportButton>
      </div>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columnData={columns}
        restriction={{
          copy: true,
          paste: false,
        }}
        rowData={sortedRows}
        //  onRowsChange={setRows}
        // selectedRows={selectedRows}
        // onSelectedRowsChange={setSelectedRows}
        topSummaryRows={summaryRows}
        bottomSummaryRows={summaryRows}
        showSelectedRows={true}
        className="fill-grid"
        direction={direction}
        selection={true}
        serialNumber={true}
        onRowClicked={(props) => {
          console.log("Data", props);
        }}
        enableVirtualization={false}
        pagination={true}
      />
    </>
  );
}

function ExportButton({ onExport, children }) {
  const [exporting, setExporting] = useState(false);
  return (
    <button
      disabled={exporting}
      onClick={async () => {
        setExporting(true);
        await onExport();
        setExporting(false);
      }}
    >
      {exporting ? "Exporting" : children}
    </button>
  );
}
