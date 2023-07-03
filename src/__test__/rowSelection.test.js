import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef, useState } from "react";

function LaiDataGrid(props) {
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
      // treeFormatter: TextEditor,
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
    },
  ];
  const [selectedRows, setSelectedRows] = useState([]);
  const gridRef = useRef(null);
  return (
    <>
      <button
        data-testid={"setSuppressRowClickSelection"}
        onClick={() => {
          gridRef.current.api.setSuppressRowClickSelection(false);
        }}
      >
        setSuppressRowClickSelection
      </button>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        innerRef={gridRef}
        selectedRows={selectedRows}
        {...props}
      />
    </>
  );
}
describe("rowSelection event test", () => {
  test.only("Single row selection with onSelectedRow ", async () => {
    const mockOnSelect = jest.fn();
    render(
      <LaiDataGrid
        rowSelection={"single"}
        onSelectedRowsChange={mockOnSelect}
      />
    );
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const gridcell1 = screen.getByRole("gridcell", { name: "package-1" });
    expect(gridcell1).toBeInTheDocument();
    fireEvent.click(gridcell1);
    const gridcell2 = screen.getByRole("gridcell", { name: "package-4" });
    expect(gridcell2).toBeInTheDocument();
    fireEvent.click(gridcell2);
    expect(mockOnSelect).toBeCalled();
  });
  test.only("Single row selection without onSelectedRow ", async () => {
    render(<LaiDataGrid rowSelection={"single"} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const gridcell1 = screen.getByRole("gridcell", { name: "package-1" });
    expect(gridcell1).toBeInTheDocument();
    fireEvent.click(gridcell1);
    const gridcell2 = screen.getByRole("gridcell", { name: "package-4" });
    expect(gridcell2).toBeInTheDocument();
    fireEvent.click(gridcell2);
  });
  test.only("Multiple row selection with onSelectedRow ", async () => {
    const mockOnSelect = jest.fn();
    render(
      <LaiDataGrid
        rowSelection={"multiple"}
        onSelectedRowsChange={mockOnSelect}
      />
    );
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const gridcell1 = screen.getByRole("gridcell", { name: "package-1" });
    expect(gridcell1).toBeInTheDocument();
    fireEvent.click(gridcell1);
    const gridcell2 = screen.getByRole("gridcell", { name: "package-4" });
    expect(gridcell2).toBeInTheDocument();
    fireEvent.click(gridcell2, {
      ctrlKey: true,
    });
    expect(mockOnSelect).toBeCalled();
    fireEvent.click(gridcell1);
    fireEvent.click(gridcell1);
  });
  test.only("setSuppressRowClickSelection api  ", async () => {
    render(<LaiDataGrid rowSelection={"multiple"} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const setSuppressRowClickSelectionBtn = screen.getByTestId(
      "setSuppressRowClickSelection"
    );
    expect(setSuppressRowClickSelectionBtn).toBeInTheDocument();
    fireEvent.click(setSuppressRowClickSelectionBtn);
  });
});
