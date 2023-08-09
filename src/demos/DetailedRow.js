import { useState, useRef } from "react";
import { TextEditor } from "../components/datagrid";
import DataGrid from "../components/datagrid/DataGrid";

const columns = [
  { field: "sr.no", headerName: "SR.NO", width: 200 },
  { field: "id", headerName: "ID", filter: true, width: 200 },
  {
    field: "title",
    headerName: "Title",
    filter: true,
    sortable: true,
    alignment: true,
    width: 200,
  },
  {
    field: "count",
    headerName: "Count",
    sortable: true,
    alignment: true,
    width: 200,
    cellRenderer: (params) => {
      return TextEditor(params);
    },
  },
  {
    field: "seat",
    headerName: "Seat",
    width: 200,
  },
];

export default function DetailedRow() {
  const [rows, setRows] = useState(() => {
    const rows = [];

    for (let i = 0; i < 20; i++) {
      rows.push({
        id: i,
        "sr.no": i + 1,
        title: `Title ${i}`,
        count: i * 1000,
        seat: i,
      });
    }

    return rows;
  });
  const [expandedId, setExpandedId] = useState([]);
  return (
    <div style={{ height: "300px", width: "100%" }}>
      <DataGrid
        columnData={columns}
        rowData={rows}
        rowHeight={24}
        detailedRowIds={expandedId}
        onDetailedRowIdsChange={(ids) => setExpandedId(ids)}
        detailedRow={true}
        // detailedRowType={"multiple"}
        desktopDetailedRowEnable={true}
        onRowsChange={(rows) => {
          console.log("Sampleee", rows);
          setRows(rows);
        }}
        onRowClicked={(params) => {
          console.log("Onclciked", params);
        }}
      />
    </div>
  );
}
