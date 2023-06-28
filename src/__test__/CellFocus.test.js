import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef, useState } from "react";
import { TextEditor } from "../components/datagrid/editors";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 50; i++) {
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
  const [rowData, setRowData] = useState(createRows());

  const columns = [
    {
      field: "id",
      headerName: "id",
      frozen: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      filter: true,
    },
    {
      field: "format",
      headerName: "format",
    },
    {
      field: "position",
      headerName: "position",
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
    },
  ];
  const gridRef = useRef(null);
  return (
    <>
      <button
        data-testid={"getFocusedCell"}
        onClick={() => {
          console.log(gridRef.current.api.getFocusedCell());
        }}
      >
        getFocusedCell
      </button>
      <button
        data-testid={"tabToNextCell"}
        onClick={() => {
          console.log(gridRef.current.api.tabToNextCell());
        }}
      >
        tabToNextCell
      </button>
      <button
        data-testid={"tabToPreviousCell"}
        onClick={() => {
          console.log(gridRef.current.api.tabToPreviousCell());
        }}
      >
        tabToPreviousCell
      </button>

      <button
        data-testid={"setFocusedCell"}
        onClick={() => {
          console.log(gridRef.current.api.setFocusedCell(2, "format"));
        }}
      >
        setFocusedCell
      </button>
      <button
        data-testid={"clearFocusedCell"}
        onClick={() => {
          console.log(gridRef.current.api.clearFocusedCell());
        }}
      >
        clearFocusedCell
      </button>
      <DataGrid
        columnData={columns}
        innerRef={gridRef}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for Cell Focus", () => {
  test("table pagination with Cell Focus", () => {
    render(<LaiDataGrid pagination={true} paginationAutoPageSize={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridCell = screen.getByRole("gridcell", { name: "supplier-0" });
    expect(gridCell).toBeInTheDocument();
    fireEvent.click(gridCell);
    const getFocusedcellBtn = screen.getByTestId("getFocusedCell");
    expect(getFocusedcellBtn).toBeInTheDocument();
    fireEvent.click(getFocusedcellBtn);
    const tabToPreviouscellBtn = screen.getByTestId("tabToPreviousCell");
    expect(tabToPreviouscellBtn).toBeInTheDocument();
    fireEvent.click(tabToPreviouscellBtn);
    fireEvent.click(tabToPreviouscellBtn);
    const tabToNextcellBtn = screen.getByTestId("tabToNextCell");
    expect(tabToNextcellBtn).toBeInTheDocument();
    fireEvent.click(tabToNextcellBtn);
    fireEvent.click(tabToNextcellBtn);
    const setFocusedcellBtn = screen.getByTestId("setFocusedCell");
    expect(setFocusedcellBtn).toBeInTheDocument();
    fireEvent.click(setFocusedcellBtn);
    const clearFocusedcellBtn = screen.getByTestId("clearFocusedCell");
    expect(clearFocusedcellBtn).toBeInTheDocument();
    fireEvent.click(clearFocusedcellBtn);
  });
});
