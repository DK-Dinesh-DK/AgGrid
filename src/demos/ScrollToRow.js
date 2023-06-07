import { useState, useRef, useEffect } from "react";
import DataGrid from "../components/datagrid/DataGrid";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "title", headerName: "Title" },
  { field: "count", headerName: "Count" },
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
  const [rowData, setRowData] = useState([
    { name: "Dinesh", count: 0 },
    { name: "kumar", count: 0 },
  ]);

  return (
    <>
      {/* <div style={{ marginBlockEnd: 5 }}>
        <span style={{ marginInlineEnd: 5 }}>Row index: </span>
        <input
          style={{ inlineSize: 50 }}
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.valueAsNumber)}
        />
        <button
          type="button"
          onClick={() => gridRef.current.scrollToRow(value)}
        >
          Scroll to row
        </button>
      </div>
      <DataGrid
        ref={gridRef}
        columnData={columns}
        rowData={rows}
        direction={direction}
      /> */}
      <button
        onClick={() => {
          let sam = [...rowData];
          sam[0].count = rowData[0].count + 1;
          setRowData(sam);
        }}
      >
        Add1
      </button>
      <button
        onClick={() => {
          let sam = [...rowData];
          sam[1].count = rowData[1].count + 1;
          setRowData(sam);
        }}
      >
        Add2
      </button>
      <DataGrid
        columnData={[
          { headerName: "Name", field: "name" },
          { headerName: "Count", field: "count" },
        ]}
        rowData={rowData}
      />
    </>
  );
}
