// import {DataGrid} from "../../lib/bundle"
import React from "react";
import { DataGrid } from "../components/datagrid";

function Demos(){
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
        {
          field: "startDate",
          headerName: "Start Date",
        },
        {
          field: "completeDate",
          headerName: "Expected Complete",
          width: 200,
        },
      ];

let rowDataa = [{id:1 , task:"task1", },{id:1 , task:"task1", },{id:1 , task:"task1", }]
return(
    <div>
        <DataGrid
        rowData={rowDataa}
        columnData={columns}
        style={{height:"210px", width:"100%"}}
        />
    </div>
)
}
export default Demos;