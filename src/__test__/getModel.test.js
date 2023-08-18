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
        name: `supplier ${i}`,
        format: `package ${i}`,
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
        data-testid="getRow"
        onClick={() => {
          var model = gridRef.current.api.getModel();
          model.getRow(3);
        }}
      >
        getRow
      </button>
      <button
        data-testid="getRowNode"
        onClick={() => {
          var model = gridRef.current.api.getModel();
          model.getRowNode(3);
        }}
      >
        getRowNode
      </button>
      <button
        data-testid="getRowCount"
        onClick={() => {
          var model = gridRef.current.api.getModel();
          model.getRowCount();
        }}
      >
        getRowCount
      </button>
      <button
        data-testid="getTopLevelRowCount"
        onClick={() => {
          var model = gridRef.current.api.getModel();
          model.getTopLevelRowCount();
        }}
      >
        getTopLevelRowCount
      </button>
      <button
        data-testid="getTopLevelRowDisplayedIndex"
        onClick={() => {
          var model = gridRef.current.api.getModel();
          model.getTopLevelRowDisplayedIndex(2);
        }}
      >
        getTopLevelRowDisplayedIndex
      </button>
      <button
        data-testid="getRowIndexAtPixel"
        onClick={() => {
          var model = gridRef.current.api.getModel();
          model.getRowIndexAtPixel(200);
        }}
      >
        getRowIndexAtPixel
      </button>
      <button
        data-testid="isRowPresent"
        onClick={() => {
          var node = gridRef.current.api.getRowNode(3);
          gridRef.current.api.getModel().isRowPresent(node);
        }}
      >
        isRowPresent
      </button>
      <button
        data-testid="getRowBounds"
        onClick={() => {
          gridRef.current.api.getModel().getRowBounds(4);
        }}
      >
        getRowBounds
      </button>
      <button
        data-testid="isEmpty"
        onClick={() => {
          gridRef.current.api.getModel().isEmpty();
        }}
      >
        isEmpty
      </button>
      <button
        data-testid="isRowsToRender"
        onClick={() => {
          gridRef.current.api.getModel().isRowsToRender();
        }}
      >
        isRowsToRender
      </button>
      <button
        data-testid="getNodesInRangeForSelection"
        onClick={() => {
          var node = gridRef.current.api.getRowNode(3);
          var node1 = gridRef.current.api.getRowNode(7);
          gridRef.current.api
            .getModel()
            .getNodesInRangeForSelection(node, node1);
          gridRef.current.api
            .getModel()
            .getNodesInRangeForSelection(node1, node);
          gridRef.current.api
            .getModel()
            .getNodesInRangeForSelection(node, { name: "asd" });
          gridRef.current.api
            .getModel()
            .getNodesInRangeForSelection({ name: "asd" }, node);
        }}
      >
        getNodesInRangeForSelection
      </button>
      <button
        data-testid="forEachNode"
        onClick={() => {
          gridRef.current.api.getModel().forEachNode((params) => {
            console.log(params);
          });
        }}
      >
        forEachNode
      </button>
      <button
        data-testid="getType"
        onClick={() => {
          gridRef.current.api.getModel().getType();
        }}
      >
        getType
      </button>
      <button
        data-testid="isLastRowIndexKnown"
        onClick={() => {
          gridRef.current.api.getModel().isLastRowIndexKnown();
        }}
      >
        isLastRowIndexKnown
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

describe("Datagrid Unit test for Get Model", () => {
  test("get Model", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const getRowbtn = screen.getByTestId("getRow");
    expect(getRowbtn).toBeInTheDocument();
    fireEvent.click(getRowbtn);
    const getRowNodebtn = screen.getByTestId("getRowNode");
    expect(getRowNodebtn).toBeInTheDocument();
    fireEvent.click(getRowNodebtn);
    const getRowCountbtn = screen.getByTestId("getRowCount");
    expect(getRowCountbtn).toBeInTheDocument();
    fireEvent.click(getRowCountbtn);
    const getTopLevelRowCountbtn = screen.getByTestId("getTopLevelRowCount");
    expect(getTopLevelRowCountbtn).toBeInTheDocument();
    fireEvent.click(getTopLevelRowCountbtn);
    const getTopLevelRowDisplayedIndexbtn = screen.getByTestId(
      "getTopLevelRowDisplayedIndex"
    );
    expect(getTopLevelRowDisplayedIndexbtn).toBeInTheDocument();
    fireEvent.click(getTopLevelRowDisplayedIndexbtn);
    const getRowIndexAtPixelbtn = screen.getByTestId("getRowIndexAtPixel");
    expect(getRowIndexAtPixelbtn).toBeInTheDocument();
    fireEvent.click(getRowIndexAtPixelbtn);
    const isRowPresentbtn = screen.getByTestId("isRowPresent");
    expect(isRowPresentbtn).toBeInTheDocument();
    fireEvent.click(isRowPresentbtn);
    const getRowBoundsbtn = screen.getByTestId("getRowBounds");
    expect(getRowBoundsbtn).toBeInTheDocument();
    fireEvent.click(getRowBoundsbtn);
    const isEmptybtn = screen.getByTestId("isEmpty");
    expect(isEmptybtn).toBeInTheDocument();
    fireEvent.click(isEmptybtn);
    const isRowsToRenderbtn = screen.getByTestId("isRowsToRender");
    expect(isRowsToRenderbtn).toBeInTheDocument();
    fireEvent.click(isRowsToRenderbtn);
    const getNodesInRangeForSelectionbtn = screen.getByTestId(
      "getNodesInRangeForSelection"
    );
    expect(getNodesInRangeForSelectionbtn).toBeInTheDocument();
    fireEvent.click(getNodesInRangeForSelectionbtn);
    const forEachNodebtn = screen.getByTestId("forEachNode");
    expect(forEachNodebtn).toBeInTheDocument();
    fireEvent.click(forEachNodebtn);
    const getTypebtn = screen.getByTestId("getType");
    expect(getTypebtn).toBeInTheDocument();
    fireEvent.click(getTypebtn);
    const isLastRowIndexKnownbtn = screen.getByTestId("isLastRowIndexKnown");
    expect(isLastRowIndexKnownbtn).toBeInTheDocument();
    fireEvent.click(isLastRowIndexKnownbtn);
  });
});
