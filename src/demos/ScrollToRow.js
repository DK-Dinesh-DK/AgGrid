import { useRef } from "react";
import DataGrid from "../components/datagrid/DataGrid";
import "../App.css";

import { TextEditor } from "../components/datagrid/editors";

export default function ScrollToRow({ direction }) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 2; i++) {
      rows.push({
        id: `${i}`,

        erer: `email${i}`,
        title1: `title-1-${i}`,
        title2: `title-2-${i}`,
        ffff: `firstName${i}`,
        cvcv: `lastName${i}`,
        qqqq: `qq${i}`,
        oooo: `zipCode${i}`,
        xxxx: `xxx${i}`,
        eeee1: `name${i}`,
        rdrd: `words${i}`,
        pppp2: `sentence${i}`,
      });
    }

    return rows;
  }
  const rowData = createRows();

  const gridRef = useRef(null);

  const nonFlightColumnDefs = [
    {
      headerName: "Non Flight Details",
      field: "nonFlightDetails",
      haveChildren: true,
      // width: 540,
      children: [
        { headerName: "Location(s)", field: "locations", width: 100 },
        {
          headerName: "+",
          field: "+",
          cellRenderer: (props) =>{console.log("Props",props); return <button>+</button>},
          width: 40,
        },
        {
          headerName: "Job Ref No",
          field: "jobRefno",
          cellRenderer: (props) => <input type="text" />,
          width: 100,
        },
        {
          headerName: "Job Date",
          field: "jobDate",
          cellRenderer: (props) => <input type="date" />,
          width: 100,
        },
        {
          headerName: "Start Time",
          field: "startTime",
          cellRenderer: (props) => <input type="datetime" />,
          width: 100,
        },
        {
          headerName: "End Time",
          field: "endTime",
          cellRenderer: (props) => <input type="datetime" />,
          width: 100,
        },
      ],
    },
    {
      headerName: "Department (Division)",
      field: "departmentDivision",
      // width: 480,
      haveChildren: true,
      children: [
        {
          headerName: "RS",
          field: "RS",
          width: 60,
          depth: 1,
        },
        {
          headerName: "BS",
          field: "BS",
          width: 60,
          depth: 1,
        },
        {
          headerName: "CG",
          field: "CG",
          width: 60,
          depth: 1,
        },
        {
          headerName: "CS",
          field: "CS",
          width: 60,
          depth: 1,
        },
        {
          headerName: "CT",
          field: "CT",
          width: 60,
          depth: 1,
        },
        {
          headerName: "LP",
          field: "LP",
          width: 60,
          depth: 1,
        },
        {
          headerName: "CTOPS-DES",
          field: "CTOPS-DES",
          width: 60,
          depth: 1,
        },
        {
          headerName: "CTFP-CK",
          field: "CTFP-CK",
          width: 60,
          depth: 1,
        },
      ],
    },
    {
      headerName: "Parking Indicator",
      field: "parkingIndicator",
      width: 100,
      cellRenderer: (props) => <input />,
    },
    {
      headerName: "Repeat",
      field: "Repeat",
      width: 100,
      cellRenderer: (props) => <button>...</button>,
    },
  ];
  return (
    <>
      <DataGrid
        columnData={nonFlightColumnDefs}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        innerRef={gridRef}
        multilineHeader={true}
      />
    </>
  );
}
