// import {DataGrid} from "../../lib/bundle"
import React, { useState } from "react";
import { DataGrid } from "../components/datagrid";

function Demos() {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "task",
      headerName: "Title",
      width: 80,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 80,
    },
    {
      field: "issueType",
      headerName: "Issue Type",
      width: 80,
    },
    {
      field: "complete",
      headerName: "% Complete",
      width: 80,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 80,
    },
    {
      field: "completeDate",
      headerName: "Expected Complete",
      width: 200,
    },
  ];

  const [rowDataa, setRowDataa] = useState([])
  return (
    <div>
      <button onClick={() => setRowDataa([{ id: 1, task: "task1", }, { id: 2, task: "task1", }, { id: 3, task: "task1", }])}>Add Rows</button>
      <DataGrid
        rowData={rowDataa}
        columnData={columns}
        style={{ height: "210px", width: "100%" }}
      />
    </div>
  )
}
export default Demos;