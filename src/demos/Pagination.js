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

  for (let i = 0; i < 1000; i++) {
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

  return (
    <>
      <button onClick={() => setRows(rows.slice(0, 40))}>Clcik</button>
      <DataGrid
        // className="fill-grid"
        columnData={columns}
        rowData={rows}
        rowKeyGetter={rowKeyGetter}
        onRowsChange={setRows}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        pagination={true}
        allRowSelectedChange={(p) => {
          console.log("All Selected", p);
        }}
        style={{ height: "30vh", maxHieght: "inherit" }}
        serialNumber={true}
        paginationStyle={{
          "--rc-pagination-button-active-background-color": "red",
        }}
      />
    </>
  );
}

function rowKeyGetter(row) {
  return row?.id;
}
