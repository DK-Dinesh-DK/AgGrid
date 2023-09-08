import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef, useState } from "react";

beforeEach(() => {
  window.ResizeObserver = null;
});
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
  const [rowData, setRowData] = useState(createRows());

  const columns = [
    {
      field: "id",
      headerName: "id",
      frozen: true,
      width: 400,
    },
    {
      field: "name",
      headerName: "Name",
      width: 400,
      filter: true,
    },
    {
      field: "format",
      headerName: "format",
      width: 400,
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
  const gridlocalRef = useRef(null);
  const [alwaysShowHorizontalScroll, setAlwaysShowHorizontalScroll] =
    useState(false);
  const [alwaysShowVerticalScroll, setAlwaysShowVerticalScroll] =
    useState(false);
  return (
    <>
      <button
        data-testid={"setAlwaysShowHorizontalScroll"}
        onClick={() => {
          console.log(
            gridlocalRef.current.api.setAlwaysShowHorizontalScroll(
              !alwaysShowHorizontalScroll
            )
          );
          setAlwaysShowHorizontalScroll(!alwaysShowHorizontalScroll);
        }}
      >
        setAlwaysShowHorizontalScroll
      </button>

      <button
        data-testid={"setAlwaysShowVerticalScroll"}
        onClick={() => {
          console.log(
            gridlocalRef.current.api.setAlwaysShowVerticalScroll(
              !alwaysShowVerticalScroll
            )
          );
          setAlwaysShowHorizontalScroll(!alwaysShowVerticalScroll);
        }}
      >
        setAlwaysShowVerticalScroll
      </button>
      <button
        data-testid={"ensureIndexVisible-scroll-top"}
        onClick={() => {
          gridlocalRef.current.api.ensureIndexVisible(70, "top");
        }}
      >
        ensureIndexVisible-scroll-top
      </button>
      <button
        data-testid={"scrollToColumn"}
        onClick={() => {
          gridlocalRef.current.api.ensureColumnVisible("price");
        }}
      >
        scrollToColumn
      </button>
      <button
        data-testid={"scrollToRow"}
        onClick={() => {
          console.log(gridlocalRef.current.scrollToRow(100));
        }}
      >
        scrollToRow
      </button>
      <button
        data-testid={"getVerticalPixelRange"}
        onClick={() => {
          console.log(gridlocalRef.current.api.getVerticalPixelRange());
        }}
      >
        getVerticalPixelRange
      </button>

      <button
        data-testid={"getHorizontalPixelRange"}
        onClick={() => {
          console.log(gridlocalRef.current.api.getHorizontalPixelRange());
        }}
      >
        getHorizontalPixelRange
      </button>
      <DataGrid
        columnData={columns}
        ref={gridlocalRef}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        enableVirtualization={false}
        className="fill-grid"
      />
    </>
  );
}

describe("Datagrid Unit test for Scroll", () => {
  test("Datagrid Unit test for Scrol", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const setAlwaysShowHorizontalScrollBtn = screen.getByTestId(
      "setAlwaysShowHorizontalScroll"
    );
    expect(setAlwaysShowHorizontalScrollBtn).toBeInTheDocument();
    fireEvent.click(setAlwaysShowHorizontalScrollBtn);
    const setAlwaysShowVerticalScrollBtn = screen.getByTestId(
      "setAlwaysShowVerticalScroll"
    );
    expect(setAlwaysShowVerticalScrollBtn).toBeInTheDocument();
    fireEvent.click(setAlwaysShowVerticalScrollBtn);
    fireEvent.click(setAlwaysShowHorizontalScrollBtn);
  });
  test("Datagrid Unit test for EnsureScroll", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const scrolltoColumnBtn = screen.getByTestId("scrollToColumn");
    expect(scrolltoColumnBtn).toBeInTheDocument();
    fireEvent.click(scrolltoColumnBtn);
    const scrolltoRowBtn = screen.getByTestId("scrollToRow");
    expect(scrolltoRowBtn).toBeInTheDocument();
  });
  test("Datagrid Unit test for api function", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const getVerticalPixelRangeBtn = screen.getByTestId(
      "getVerticalPixelRange"
    );
    expect(getVerticalPixelRangeBtn).toBeInTheDocument();
    fireEvent.click(getVerticalPixelRangeBtn);
    const getHorizontalPixelRangeBtn = screen.getByTestId(
      "getHorizontalPixelRange"
    );
    expect(getHorizontalPixelRangeBtn).toBeInTheDocument();
    fireEvent.click(getHorizontalPixelRangeBtn);
  });
});
