import { useState, useRef } from "react";
import DataGrid from "../components/datagrid/DataGrid";
import "../App.css";

export default function ScrollToRow({ direction }) {
  const [rows] = useState(() => {
    const rows = [];

    for (let i = 0; i < 1000; i++) {
      rows.push({
        id: i,
        title: `Title ${i}`,
        count: i * 1000,
        fg: null,
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
  const selectedCellHeaderStyle = {
    backgroundColor: "red",
    fontSize: "12px",
  };
  const [hide, setHide] = useState(true);
  const columns = [
    { field: "id", headerName: "", sortable: true, hide: hide },
    {
      field: "title",
      headerName: "Title",
      sortable: true,
      filter: true,
      editable: true,
      readOnly: true,
    },
    {
      field: "count",
      headerName: "Count",
      filter: true,
      // frozen: true,
      rowSpan: (params) => {
        if (params.rowIndex === 2) return 2;
      },
    },
    {
      field: "count3",
      headerName: "Count2",
      hide: hide,
    },
  ];
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
        <button type="button" onClick={() => console.log(gridRef.current)}>
          gridApi
        </button>
        <input
          onChange={(e) => {
            gridRef.current.api.setQuickFilter(e.target.value);
          }}
        />
        <button
          onClick={() => {
            setHide(!hide);
          }}
        >
          {!hide ? "Hide" : "Show"}
        </button>
      </div>

      <DataGrid
        innerRef={gridRef}
        columnData={columns}
        rowData={rows}
        direction={direction}
        // valueChangedCellStyle={{ backgroundColor: "red", color: "black" }}
        serialNumber={true}
        onGridReady={onGridReady}
        // selectedCellHeaderStyle={selectedCellHeaderStyle}
        // multilineHeaderEnable={true}
        rowSelection={"multiple"}
        onCellClicked={(params) => console.log("CellCleciked", params)}
      />
    </>
  );
}
