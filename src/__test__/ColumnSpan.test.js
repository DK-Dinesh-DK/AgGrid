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
        console.log("Propss", props);
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

describe("Datagrid Unit test for Column Span", () => {
  test("editors for button", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
  });
});
