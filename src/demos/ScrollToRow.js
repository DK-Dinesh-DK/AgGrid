import { useState, useRef } from "react";
import DataGrid from "../components/datagrid/DataGrid";
import "../App.css";
import { getValue } from "@mui/system";
import { TextEditor } from "../components/datagrid/editors";

export default function ScrollToRow({ direction }) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      var row;

      row = {
        id,
        name: `supplier-${i}`,
        format: `package-${i}`,
        position: "Run of site",
        price,
      };

      rows.push(row);
    }
    return rows;
  }
  const rowData = createRows();

  function TextInput(params) {
    return (
      <input
        data-testid={`text-input-${params.rowIndex}`}
        value={params.getValue()}
        onChange={(e) => {
          params.setValue(e.target.value);
          params.refreshCell();
        }}
      />
    );
  }
  const frameworkComponents = {
    btn: TextInput,
  };
  const columns = [
    {
      field: "id",
      headerName: "id",
      frozen: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 400,
      filter: true,
      cellRenderer: TextEditor,
    },
    {
      field: "format",
      headerName: "format",
      width: 400,
      cellRenderer: "btn",
      cellRendererParams: (params) => {
        return params;
      },
    },
    {
      field: "position",
      headerName: "position",
      width: 400,
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
      width: 400,
    },
  ];

  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        enableVirtualization={false}
        className="fill-grid"
        frameworkComponents={frameworkComponents}
        valueChangedCellStyle={{ backgroundColor: "red", color: "black" }}
      />
    </>
  );
}
