import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";

function LaiDataGrid() {
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
        testId={"laidatagrid"}
        headerRowHeight={24}
        className="fill-grid"
      />
    </>
  );
}

describe("Datagrid Unit test for NoRows", () => {
  test("print window check", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const setBtn = screen.getByTestId("setcolumn");
    expect(setBtn).toBeInTheDocument();
    fireEvent.click(setBtn);
  });
});
