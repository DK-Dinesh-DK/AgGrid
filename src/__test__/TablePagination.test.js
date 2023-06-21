import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef } from "react";
import { TextEditor } from "../components/datagrid/editors";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      var row;

      row = {
        id,
        name: `supplier ${i}`,
        format: `package ${i}`,
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
      cellRenderer: TextEditor,
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
  const gridRef = useRef(null);
  return (
    <>
      <button
        data-testid="setPagination"
        onClick={() => {
          console.log(gridRef.current.api.setPagination(2));
        }}
      >
        setPagination
      </button>
      <button
        data-testid="paginationIsLastPageFound"
        onClick={() => {
          console.log(gridRef.current.api.paginationIsLastPageFound());
        }}
      >
        paginationIsLastPageFound
      </button>
      <button
        data-testid="paginationGetPageSize"
        onClick={() => {
          console.log(gridRef.current.api.paginationGetPageSize());
        }}
      >
        paginationGetPageSize
      </button>
      <button
        data-testid="paginationSetPageSize"
        onClick={() => {
          console.log(gridRef.current.api.paginationSetPageSize(5));
        }}
      >
        paginationSetPageSize
      </button>
      <button
        data-testid="paginationGetCurrentPage"
        onClick={() => {
          console.log(gridRef.current.api.paginationGetCurrentPage());
        }}
      >
        paginationGetCurrentPage
      </button>
      <button
        data-testid="paginationGetTotalPages"
        onClick={() => {
          console.log(gridRef.current.api.paginationGetTotalPages());
        }}
      >
        paginationGetTotalPages
      </button>
      <button
        data-testid="paginationGetRowCount"
        onClick={() => {
          console.log(gridRef.current.api.paginationGetRowCount());
        }}
      >
        paginationGetRowCount
      </button>
      <button
        data-testid="paginationGoToFirstPage"
        onClick={() => {
          console.log(gridRef.current.api.paginationGoToFirstPage());
        }}
      >
        paginationGoToFirstPage
      </button>
      <button
        data-testid="paginationGoToLastPage"
        onClick={() => {
          console.log(gridRef.current.api.paginationGoToLastPage());
        }}
      >
        paginationGoToLastPage
      </button>
      <button
        data-testid="paginationGoToPage"
        onClick={() => {
          console.log(gridRef.current.api.paginationGoToPage(3));
        }}
      >
        paginationGoToPage
      </button>
      <button
        data-testid="paginationGoToNextPage"
        onClick={() => {
          console.log(gridRef.current.api.paginationGoToNextPage());
        }}
      >
        paginationGoToNextPage
      </button>
      <button
        data-testid="paginationGoToPreviousPage"
        onClick={() => {
          console.log(gridRef.current.api.paginationGoToPreviousPage());
        }}
      >
        paginationGoToPreviousPage
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

describe("Datagrid Unit test for Table Pagination", () => {
  test("table pagination", () => {
    render(<LaiDataGrid pagination={true} defaultPage={3} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const nxtbtn = screen.getByTestId("pagination-prev");
    expect(nxtbtn).toBeInTheDocument();
    fireEvent.click(nxtbtn);
    const setpagebtn = screen.getByTestId("setPagination");
    expect(setpagebtn).toBeInTheDocument();
    fireEvent.click(setpagebtn);
    const lastpagebtn = screen.getByTestId("paginationIsLastPageFound");
    expect(lastpagebtn).toBeInTheDocument();
    fireEvent.click(lastpagebtn);
    const getpagesizebtn = screen.getByTestId("paginationGetPageSize");
    expect(getpagesizebtn).toBeInTheDocument();
    fireEvent.click(getpagesizebtn);
    const setpagesizebtn = screen.getByTestId("paginationSetPageSize");
    expect(setpagesizebtn).toBeInTheDocument();
    fireEvent.click(setpagesizebtn);
    const getcurrentpagebtn = screen.getByTestId("paginationGetCurrentPage");
    expect(getcurrentpagebtn).toBeInTheDocument();
    fireEvent.click(getcurrentpagebtn);
    const gettotalpagebtn = screen.getByTestId("paginationGetTotalPages");
    expect(gettotalpagebtn).toBeInTheDocument();
    fireEvent.click(gettotalpagebtn);
    const getpaginationRowCountbtn = screen.getByTestId(
      "paginationGetRowCount"
    );
    expect(getpaginationRowCountbtn).toBeInTheDocument();
    fireEvent.click(getpaginationRowCountbtn);
    const gotoFirstPagebtn = screen.getByTestId("paginationGoToFirstPage");
    expect(gotoFirstPagebtn).toBeInTheDocument();
    fireEvent.click(gotoFirstPagebtn);
    const gotoLastPagebtn = screen.getByTestId("paginationGoToLastPage");
    expect(gotoLastPagebtn).toBeInTheDocument();
    fireEvent.click(gotoLastPagebtn);
    const gotoPagebtn = screen.getByTestId("paginationGoToPage");
    expect(gotoPagebtn).toBeInTheDocument();
    fireEvent.click(gotoPagebtn);
    const gotoNextPagebtn = screen.getByTestId("paginationGoToNextPage");
    expect(gotoNextPagebtn).toBeInTheDocument();
    fireEvent.click(gotoNextPagebtn);
    const gotoPreviousPagebtn = screen.getByTestId(
      "paginationGoToPreviousPage"
    );
    expect(gotoPreviousPagebtn).toBeInTheDocument();
    fireEvent.click(gotoPreviousPagebtn);
  });

  test("table pagination with selected", () => {
    render(
      <LaiDataGrid pagination={true} selection={true} showSelectedRows={true} />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

  });
});

//
