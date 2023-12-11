import { useEffect, useState } from "react";
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

function createRows(count) {
  const rows = [];

  for (let i = 0; i < count; i++) {
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
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
  },
  {
    field: "priority",
    headerName: "Priority",
  },
  {
    field: "issueType",
    headerName: "Issue Type",
  },
  {
    field: "complete",
    headerName: "% Complete",
  },
];

export default function Pagination({ direction }) {
  const [count, setCount] = useState(5);
  const [rows, setRows] = useState(createRows(50));
  // useEffect(() => {
  //   setRows([...createRows(count)]);
  // }, [count]);
  return (
    <>
      <button
        onClick={() => {
          setCount(count + 15);
        }}
      >
        Add Row
      </button>
      <DataGrid
        columnData={columns}
        rowData={rows}
        pagination={true}
        serialNumber={true}
        // enableVirtualization={false}
        // rowHeight={() => 24}
      />
    </>
  );
}
