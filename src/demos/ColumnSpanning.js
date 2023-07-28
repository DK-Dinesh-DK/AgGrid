import React from "react";
import { css } from "@linaria/core";
import clsx from "clsx";

import DataGrid from "../components/datagrid/DataGrid";

const colSpanClassname = css`
  .rdg-cell[aria-colspan] {
    background-color: #ffb300;
    color: black;
    text-align: center;
  }
`;

const rowSpanClassname = css`
  .rdg-cell[aria-rowspan] {
    background-color: #97ac8e;
    color: black;
    text-align: center;
    z-index: 2;
  }
`;

export default function ColumnSpanning({ direction }) {
  const col = [
    {
      header: "One",
      field: "one",
      toolTip: (params) => `"Oneee${params.row.one}`,
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

  const row = [
    { one: "one1", two: "two1", three: "three1", four: "four1", five: "five1" },
    { one: "one2", two: "two2", three: "three2", four: "four2", five: "five2" },
    { one: "one3", two: "two3", three: "three3", four: "four3", five: "five3" },
    { one: "one4", two: "two4", three: "three4", four: "four4", five: "five4" },
    { one: "one5", two: "two5", three: "three5", four: "four5", five: "five5" },
  ];
  const onRowDoubleClicked = (e) => {
    console.log("e", e);
  };
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
    <DataGrid
      columnData={col}
      rowData={row}
      rowHeight={22}
      className={clsx("fill-grid", colSpanClassname, rowSpanClassname)}
      direction={direction}
      serialNumber={true}
      headerRowHeight={24}
      classheaderName="fill-grid"
      onRowDoubleClicked={onRowDoubleClicked}
      topSummaryRows={summaryRowsTop}
      bottomSummaryRows={summaryRowsBottom}
      // rowLevelToolTip={(params) => `ColumnSpanRow-${params.rowIndex}`}
    />
  );
}
