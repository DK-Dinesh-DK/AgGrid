import { useState, useRef, useCallback } from "react";
import DataGrid from "../components/datagrid/DataGrid";
import { TextEditor } from "../components/datagrid/editors";
import "../App.css";
// import { DataGrid } from "../../node_modules/lai_datagrid/lib/bundle";
// import "../../node_modules/lai_datagrid/lib/styles.css";
const columns = [
  { field: "id", headerName: "ID", sortable: true },
  {
    field: "title",
    headerName: "Title",
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    field: "count",
    headerName: "Count",
    filter: true,
    // frozen: true,
    rowSpan: (params) => {
      if (params.rowIndex == 2) return 2;
    },
  },
  {
    field: "count3",
    headerName: "Count2",
  },
];

export default function ScrollToRow({ direction }) {
  const [rows] = useState(() => {
    const rows = [];

    for (let i = 0; i < 1000; i++) {
      rows.push({
        id: i,
        title: `Title ${i}`,
        count: i * 1000,
      });
    }

    return rows;
  });
  const [value, setValue] = useState(10);
  const gridRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  return (
    <>
      <div style={{ marginBlockEnd: 5 }}>
        <span style={{ marginInlineEnd: 5 }}>Row index: </span>
        <input
          style={{ inlineSize: 50 }}
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.valueAsNumber)}
        />
        <button type="button" onClick={() => console.log("gridApi", gridApi)}>
          gridApi
        </button>
      </div>
      <DataGrid
        innerRef={gridRef}
        columnData={columns}
        rowData={rows}
        direction={direction}
        valueChangedCellStyle={{ backgroundColor: "red", color: "black" }}
        serialNumber={true}
        onGridReady={onGridReady}
        // style={{ width: "max-content" }}
      />
    </>
  );
}
