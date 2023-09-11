import { useState, useRef } from "react";
import { TextEditor } from "../components/datagrid";
import DataGrid from "../components/datagrid/DataGrid";

export default function DetailedRow() {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 20; i++) {
      rows.push({
        id: i,
        "sr.no": i + 1,
        title: `Title ${i}`,
        count: i * 1000,
      });
    }

    return rows;
  }

  const columns = [
    { field: "sr.no", headerName: "SR.NO" },
    { field: "id", headerName: "ID", filter: true },
    {
      field: "title",
      headerName: "Title",
      filter: true,
      sortable: true,
      toolTip: true,
    },
    {
      field: "count",
      headerName: "Count",
      cellRenderer: TextEditor,
    },
  ];
  const [rows, setRows] = useState(createRows());
  const [expandedId, setExpandedId] = useState([]);
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rows}
        rowHeight={24}
        detailedRowIds={expandedId}
        onRowsChange={(rows) => {
          setRows(rows);
        }}
        detailedRow={true}
        onDetailedRowIdsChange={(ids) => setExpandedId(ids)}
      />
    </>
  );
}
