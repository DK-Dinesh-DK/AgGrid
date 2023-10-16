import { useState, useRef } from "react";
import DataGrid from "../components/datagrid/DataGrid";
import { TextEditor } from "../components/datagrid/editors";
function createRows() {
  const rows = [];
  for (let i = 1; i < 10; i++) {
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
    haveChildren: false,
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
    // resizable: true,
    // haveChildren: false,
    // sortable: true,
    editable: true,
  },
  {
    field: "priority",
    headerName: "Priority",
    haveChildren: false,
    resizable: true,
    sortable: true,
  },
  {
    field: "issueType",
    headerName: "Issue Type",
    resizable: true,
    haveChildren: false,
    sortable: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    haveChildren: false,
    resizable: true,
    sortable: true,
  },
];

export default function ColumnsReordering({ direction }) {
  function createRows() {
    const rows = [];

    for (let i = 1; i < 500; i++) {
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
  const rowData = createRows();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "task",
      headerName: "Title",
      resizable: true,
      sortable: true,
      cellEditor: TextEditor,
    },
    {
      field: "priority",
      headerName: "Priority",
      resizable: true,
      sortable: true,
    },
    {
      field: "issueType",
      headerName: "Issue Type",
      resizable: true,
      sortable: true,
    },
    {
      field: "complete",
      headerName: "% Complete",
      resizable: true,
      sortable: true,
    },
  ];

  return (
    <>
      <DataGrid
        columnData={columns}
        columnReordering={true}
        rowData={rowData}
      />
    </>
  );
}
