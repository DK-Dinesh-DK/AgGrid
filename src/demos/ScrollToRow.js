import { useState, useRef } from "react";
import DataGrid from "../components/datagrid/DataGrid";
import { TextEditor } from "../components/datagrid/editors";
import "../App.css";
// import { DataGrid } from "../../node_modules/lai_datagrid/lib/bundle";
// import "../../node_modules/lai_datagrid/lib/styles.css";
const columns = [
  { field: "id", headerName: "ID", sortable: true, width: 100 },
  {
    field: "title",
    headerName: "Title",
    filter: true,
    sortable: true,
    width: 100,
    resizable:true
  },
  {
    field: "count",
    headerName: "Count",
    filter: true,
    width: 100,
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
        <button
          type="button"
          onClick={() =>
            console.log(gridRef.current.api.isColumnFilterPresent())
          }
        >
          isColumnFilterPresent
        </button>
      </div>
      <DataGrid
        innerRef={gridRef}
        columnData={columns}
        rowData={rows}
        direction={direction}
        valueChangedCellStyle={{ backgroundColor: "red", color: "black" }}
        onPaste={(params) => console.log(params)}
        onRowsChange={(params) => console.log(params)}
        serialNumber={true}
        style={{ width: "max-content" }}
      />
    </>
  );
}
