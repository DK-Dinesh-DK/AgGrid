import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";

function LaiDataGrid(props) {
  const rowData = [
    { one: "one1", two: "two1", three: "three1", four: "four1", five: "five1" },
    { one: "one2", two: "two2", three: "three2", four: "four2", five: "five2" },
    { one: "one3", two: "two3", three: "three3", four: "four3", five: "five3" },
    { one: "one4", two: "two4", three: "three4", four: "four4", five: "five4" },
    { one: "one5", two: "two5", three: "three5", four: "four5", five: "five5" },
  ];
  const columns = [
    { header: "One", field: "one" },
    { header: "Two", field: "two" },
    {
      header: "Three",
      field: "three",
      colSpan: (props) => {
        if (props.type === "ROW" && props.rowIndex === 1) {
          return 3;
        }
        if (props.type === "HEADER") {
          return 3;
        }
      },
    },
    { header: "Four", field: "four", width: 100 },
    { header: "Five", field: "five" },
  ];
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
      />
    </>
  );
}

function LaiDataGrid1(props) {
  const rowData = [
    { one: "one1", two: "two1", three: "three1", four: "four1", five: "five1" },
    { one: "one2", two: "two2", three: "three2", four: "four2", five: "five2" },
    { one: "one3", two: "two3", three: "three3", four: "four3", five: "five3" },
    { one: "one4", two: "two4", three: "three4", four: "four4", five: "five4" },
    { one: "one5", two: "two5", three: "three5", four: "four5", five: "five5" },
  ];
  const columns = [
    {
      header: "One",
      field: "one",
      summaryFormatter(props) {
        return props.row.one;
      },
      colSpan: (props) => {
        if (props.type === "SUMMARY" && props.rowIndex === 0) {
          return 2;
        }
      },
    },
    { header: "Two", field: "two" },
    {
      header: "Three",
      field: "three",
      colSpan: (props) => {
        if (props.type === "ROW" && props.rowIndex === 1) {
          return 3;
        }
        if (props.type === "HEADER") {
          return 3;
        }
      },
    },
    { header: "Four", field: "four", width: 100 },
    { header: "Five", field: "five" },
  ];
  const summaryRowsTop = [
    {
      one: "one1-summary",
      two: "two1-summary",
      three: "three1-summary",
      four: "four1-summary",
      five: "five1-summary",
    },
    {
      one: "one2-summary",
      two: "two2-summary",
      three: "three2-summary",
      four: "four2-summary",
      five: "five2-summary",
    },
  ];
  const summaryRowsBottom = [
    {
      one: "one1-summary-bottom",
      two: "two1-summary-bottom",
      three: "three1-summary-bottom",
      four: "four1-summary-bottom",
      five: "five1-summary-bottom",
    },
    {
      one: "one2-summary-bottom",
      two: "two2-summary-bottom",
      three: "three2-summary-bottom",
      four: "four2-summary-bottom",
      five: "five2-summary-bottom",
    },
  ];
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid1"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        topSummaryRows={summaryRowsTop}
        bottomSummaryRows={summaryRowsBottom}
      />
    </>
  );
}
describe("Datagrid Unit test for Column Span", () => {
  test("editors for button", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cellEle = screen.getByRole("gridcell", { name: "two2" });
    expect(cellEle).toBeInTheDocument();
    fireEvent.click(cellEle);
    fireEvent.keyDown(cellEle, {
      key: "ArrowRight",
      code: "ArrowRight",
      keyCode: 39,
    });
    fireEvent.keyDown(cellEle, {
      key: "ArrowRight",
      code: "ArrowRight",
      keyCode: 39,
    });

    fireEvent.keyDown(cellEle, {
      key: "ArrowUp",
      code: "ArrowUp",
      keyCode: 38,
    });
    fireEvent.keyDown(cellEle, {
      key: "ArrowUp",
      code: "ArrowUp",
      keyCode: 38,
    });
  });
  test("editors for button", async () => {
    render(<LaiDataGrid1 />);

    const screenArea = screen.getByTestId("laidatagrid1");
    expect(screenArea).toBeInTheDocument();
    const cellEle = screen.getByText("one2-summary-bottom");
    expect(cellEle).toBeInTheDocument();
    fireEvent.click(cellEle);
    fireEvent.keyDown(cellEle, {
      key: "ArrowUp",
      code: "ArrowUp",
      keyCode: 38,
    });
    const cellE11 = screen.getByText("one1-summary");
    expect(cellE11).toBeInTheDocument();
    fireEvent.click(cellE11);
    fireEvent.keyDown(cellE11, { key: "ArrowRight" });
  });
});
