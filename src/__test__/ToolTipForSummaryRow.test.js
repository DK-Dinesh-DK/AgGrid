import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";
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
const rowData = [
  { one: "one1", two: "two1", three: "three1", four: "four1", five: "five1" },
  { one: "one2", two: "two2", three: "three2", four: "four2", five: "five2" },
  { one: "one3", two: "two3", three: "three3", four: "four3", five: "five3" },
  { one: "one4", two: "two4", three: "three4", four: "four4", five: "five4" },
  { one: "one5", two: "two5", three: "three5", four: "four5", five: "five5" },
];
function LaiDataGrid(props) {
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

  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        topSummaryRows={summaryRowsTop}
        bottomSummaryRows={summaryRowsBottom}
        {...props}
      />
    </>
  );
}
function LaiDataGrid1(props) {
  return (
    <>
      <DataGrid
        columnData={props.columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        topSummaryRows={summaryRowsTop}
        bottomSummaryRows={summaryRowsBottom}
        {...props}
      />
    </>
  );
}
describe("Datagrid Unit test for Summary Row ToolTip", () => {
  test("SummarryRow Row Default ToolTip", async () => {
    render(<LaiDataGrid rowLevelToolTip={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("one1-summary");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
    const content1 = screen.getByText("one1-summary-bottom");
    expect(content1).toBeInTheDocument();
    fireEvent.mouseOver(content1);
    fireEvent.mouseMove(content1);
    fireEvent.mouseOut(content1);
  });
  test("SummarryRow Row Dynamic ToolTip", async () => {
    render(<LaiDataGrid rowLevelToolTip={() => "SummaryRowrtoolTip"} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("one1-summary");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
  });

  test("SummarryRow Cell Default ToolTip", async () => {
    const columns = [
      {
        header: "One",
        field: "one",
        toolTip: true,
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
    render(<LaiDataGrid1 columns={columns} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("one1-summary");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
  });
  test("SummarryRow Cell Dynamic ToolTip", async () => {
    const columns = [
      {
        header: "One",
        field: "one",
        toolTip: () => "SummaryCellOneColumns",
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
    render(<LaiDataGrid1 columns={columns} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("one1-summary");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
  });
});
