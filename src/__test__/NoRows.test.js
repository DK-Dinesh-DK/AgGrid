import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";

function LaiDataGrid(props) {
  const [columns, setColumns] = useState([
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
      field: "position",
      headerName: "position",
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
    },
  ]);
  function EmptyRowsRenderer() {
    return (
      <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
        Nothing to show
        <span lang="ja" title="ショボーン">
          (´・ω・`)
        </span>
      </div>
    );
  }
  return (
    <>
      <button
        data-testid={"setcolumn"}
        onClick={() => {
          setColumns([
            ...columns,
            {
              field: "number",
              headerName: "PhoneNumber",
            },
          ]);
        }}
      >
        setcolumn
      </button>
      <DataGrid
        columnData={columns}
        rowData={[]}
        renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
        testId={"laidatagrid"}
        headerRowHeight={24}
        onGridReady={(props) => {
          console.log(props);
        }}
        className="fill-grid"
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for NoRows", () => {
  test("no rows", () => {
    render(
      <LaiDataGrid
        style={{
          borderWidth: 2,
          headerFontSize: 10,
          cellFontSize: 10,
          cellPaddingRight: 10,
          cellPaddingLeft: 10,
          treeIconFontSize: 13,
          masterIconFontSize: 13,
          groupIconFontSize: 13,
          cellHorizontalBorderWidth: 2,
          cellVerticalBorderWidth: 2,
        }}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const setBtn = screen.getByTestId("setcolumn");
    expect(setBtn).toBeInTheDocument();
    fireEvent.click(setBtn);
  });
  test("keyGetter", () => {
    render(
      <LaiDataGrid
        rowKeyGetter={"id"}
        style={{
          headerFontSize: 10,
          cellFontSize: 10,
          cellPaddingRight: 0,
          cellPaddingLeft: 0,
          treeIconFontSize: 13,
          masterIconFontSize: 13,
          groupIconFontSize: 13,
          borderStyle: "solid",
          borderColor: "red",
          cellHorizontalBorderStyle: "dotted",
          cellHorizontalBorderColor: "yellow",
          cellVerticalBorderStyle: "dotted",
          cellVerticalBorderColor: "yellow",
        }}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
  });
  test("keyGetter", () => {
    render(
      <LaiDataGrid
        rowKeyGetter={"id"}
        style={{
          cellHorizontalBorderWidth: 0,
          cellVerticalBorderWidth: 0,
        }}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
  });
});
