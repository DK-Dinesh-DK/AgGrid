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
        if (props.type === "HEADER" ) {
          return 3;
        }
      },
    },
    { header: "Four", field: "four",width:100 },
    { header: "Five", field: "five" },
  ];

  const row = [
    { one: "one1", two: "two1", three: "three1", four: "four1", five: "five1" },
    { one: "one2", two: "two2", three: "three2", four: "four2", five: "five2" },
    { one: "one3", two: "two3", three: "three3", four: "four3", five: "five3" },
    { one: "one4", two: "two4", three: "three4", four: "four4", five: "five4" },
    { one: "one5", two: "two5", three: "three5", four: "four5", five: "five5" },
  ];
  const onRowDoubleClicked =(e)=>{
    console.log('e', e)
  }
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
    />
  );
}
