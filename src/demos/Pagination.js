import { useMemo, useState } from "react";
import { css } from "@linaria/core";

import { SelectColumn } from "../components/datagrid/Columns";
import TextEditor from "../components/datagrid/editors/textEditor";

import DataGrid from "../components/datagrid/DataGrid";

const selectCellClassname = css`
  display: flex;
  align-items: center;
  justify-content: center;

  > input {
    margin: 0;
  }
`;

const sortPriorityClassname = css`
  color: grey;
  margin-left: 2px;
`;

function createRows() {
  const rows = [];

  for (let i = 1; i <= 500; i++) {
    rows.push({
      id: i,
      task: `Task ${i}`,
      complete: Math.min(100, Math.round(Math.random() * 110)),
      priority: ["Critical", "High", "Medium", "Low"][
        Math.round(Math.random() * 3)
      ],
      issueType: ["Bug", "Improvement", "Epic", "Story"][
        Math.round(Math.random() * 3)
      ],
    });
  }

  return rows;
}

const columns = [
  {
    ...SelectColumn,
    headerCellClass: selectCellClassname,
    cellClass: selectCellClassname,
  },
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
    cellEditor: (props) => {
      return TextEditor(props);
    },
    sortable: true,
  },
  {
    field: "priority",
    headerName: "Priority",
    sortable: true,
  },
  {
    field: "issueType",
    headerName: "Issue Type",
    sortable: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    sortable: true,
  },
];

export default function Pagination({ direction }) {
  const [rows, setRows] = useState(createRows);
  const [sortColumns, setSortColumns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

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
  const [paginationPageSize, setPaginationPageSize] = useState(39);
  return (
    <>
      <button onClick={() => setRows(rows.slice(0, 40))}>Clcik</button>
      <DataGrid
        // className="fill-grid"
        columnData={columns}
        rowData={sortedRows}
        rowKeyGetter={rowKeyGetter}
        onRowsChange={setRows}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        renderers={{ sortStatus, checkboxFormatter }}
        direction={direction}
        pagination={true}
        defaultPage={3}
        // paginationAutoPageSize={true}
        paginationPageSize={39}
        paginationStyle={{
          "--rc-pagination-button-active-background-color": "#5a8dee",
          "--rc-pagination-button-active-border-color": "none",
          "--rc-pagination-button-active-color": "#fff",
          "--rc-pagination-button-font-family":
            '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          "--rc-pagination-button-color": "#656f84 ",
          "--rc-pagination-button-border": "none",
          "--rc-pagination-button-background-color": "transparent",
          "--rc-pagination-button-font-size": "11px",
          "--rc-pagination-button-border-radius": "8px",
        }}
        style={{
          "--rdg-color": " #000",
          "--rdg-border-color": "#FFFFFF",
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
        // suppressPaginationPanel={true}
      />
    </>
  );
}

function checkboxFormatter({ onChange, ...props }, ref) {
  function handleChange(e) {
    onChange(e.target.checked, e.nativeEvent.shiftKey);
  }

  return <input type="checkbox" ref={ref} {...props} onChange={handleChange} />;
}

function sortStatus({ sortDirection, priority }) {
  return (
    <>
      {sortDirection !== undefined
        ? sortDirection === "ASC"
          ? "\u2B9D"
          : "\u2B9F"
        : null}
      <span className={sortPriorityClassname}>{priority}</span>
    </>
  );
}
function rowKeyGetter(row) {
  return row?.id;
}

function getComparator(sortColumn) {
  switch (sortColumn) {
    case "task":
    case "priority":
    case "issueType":
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn]);
      };
    case "complete":
      return (a, b) => {
        return a[sortColumn] - b[sortColumn];
      };
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`);
  }
}
