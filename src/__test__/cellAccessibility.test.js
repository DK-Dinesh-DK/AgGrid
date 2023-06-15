import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState, useCallback } from "react";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "product", headerName: "Product" },
  { field: "price", headerName: "Price" },
];

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 1; i < 10; i++) {
      rows.push({
        id: i,
        product: `product${i}`,
        price: `price${i}`,
      });
    }

    return rows;
  }

  const rowData = createRows();

  return (
    <DataGrid
      columnData={columns}
      testId={"laidatagrid"}
      rowData={rowData}
      headerRowHeight={24}
      className="fill-grid"
      selection={true}
      onCellClicked={props.onCellClicked}
      onCellDoubleClicked={props.onCellDoubleClicked}
    />
  );
}

describe("Datagrid Unit test for cellAccessiblity", () => {
  test("cell data accessibility ", async () => {
    const consoleMock = jest.spyOn(console, "log");
    render(
      <LaiDataGrid
        onCellClicked={(params) => {
          console.log(params);
        }}
      />
    );
    const gridcell = screen.getByText("product1");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    console.log("consoleMock 1:>> ", consoleMock);

    expect(consoleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        colDef: expect.any(Object),
        data: expect.any(Object),
        event: expect.any(Object),
        node: expect.any(Object),
        rowIndex: expect.any(Number),
        type: expect.stringMatching("cellClicked"),
        value: expect.any(String),
      })
    );
  });
  test("cell data accessibility ", async () => {
    const consoleMock = jest.spyOn(console, "log");
    render(
      <LaiDataGrid
        onCellClicked={(params) => {
          console.log(params.data);
        }}
      />
    );
    const gridcell = screen.getByText("product1");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    expect(consoleMock).toHaveBeenCalledWith({
      id: 1,
      product: "product1",
      price: "price1",
    });
  });

  test("cell double click event ", async () => {
    const consoleMock = jest.spyOn(console, "log");
    render(
      <LaiDataGrid
        onCellDoubleClicked={(params) => {
          console.log(params);
        }}
      />
    );
    const gridcell = screen.getByText("product1");
    expect(gridcell).toBeInTheDocument();
    fireEvent.doubleClick(gridcell);
    expect(consoleMock).toHaveBeenCalledWith(
      expect.objectContaining({
        api: expect.any(Object),
        columnApi: expect.any(Object),
        data: expect.any(Object),
        event: expect.any(Object),
        node: expect.any(Object),
        rowIndex: expect.any(Number),
        type: expect.stringMatching("cellDoubleClicked"),
        value: expect.any(String),
      })
    );
  });

  test("cell double clicked gives data ", async () => {
    const consoleMock = jest.spyOn(console, "log");
    render(
      <LaiDataGrid
        onCellDoubleClicked={(params) => {
          console.log(params.data);
        }}
      />
    );
    const gridcell = screen.getByText("product1");
    expect(gridcell).toBeInTheDocument();
    fireEvent.doubleClick(gridcell);
    expect(consoleMock).toHaveBeenCalledWith({
      id: 1,
      product: "product1",
      price: "price1",
    });
  });
});
