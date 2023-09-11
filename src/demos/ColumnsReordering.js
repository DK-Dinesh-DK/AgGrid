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
    topHeader: "id",
    haveChildren: false,
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
    // resizable: true,
    topHeader: "task",
    // haveChildren: false,
    // sortable: true,
    editable: true,
  },
  {
    field: "priority",
    headerName: "Priority",
    topHeader: "priority",
    haveChildren: false,
    resizable: true,
    sortable: true,
  },
  {
    field: "issueType",
    headerName: "Issue Type",
    resizable: true,
    topHeader: "issueType",
    haveChildren: false,
    sortable: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    topHeader: "complete",
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
      topHeader: "id",
      width: 80,
    },
    {
      field: "task",
      headerName: "Title",
      resizable: true,
      topHeader: "task",
      sortable: true,
      cellEditor: TextEditor,
    },
    {
      field: "priority",
      headerName: "Priority",
      topHeader: "priority",
      resizable: true,
      sortable: true,
    },
    {
      field: "issueType",
      headerName: "Issue Type",
      resizable: true,
      topHeader: "issueType",
      sortable: true,
    },
    {
      field: "complete",
      headerName: "% Complete",
      topHeader: "complete",
      headerRenderer: () => {
        return <span>% Complete</span>;
      },
      resizable: true,
      sortable: true,
    },
  ];

  return (
    <>
      {/* <button onClick={()=>{gridRef.current.api}}>GetValue</button> */}
      <DataGrid
        columnData={columns}
        columnReordering={true}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
      />
    </>
  );
}
