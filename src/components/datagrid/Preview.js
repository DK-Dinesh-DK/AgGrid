import React from "react";
import DataGrid from "./DataGrid";
function Preview({rowData,columnData, ...props }) {
  return (
    <div>
      <div>
        <idv style={{ display: "flex", justifyContent: "center" }}>
          <h4>{props.title}</h4>
        </idv>
        <img
          src={props.image}
          alt={props.title}
          style={{ display: "flex", justifyContent: "start" }}
        />
        <div style={{ display: "flex", justifyContent: "end" }}>
          <p>{props.description}</p>
        </div>
      </div>
      <div>
        <DataGrid
         rowData={props.rowData}
         columns={props.columns}
        />
      </div>
    </div>
  );
}

export default Preview;
