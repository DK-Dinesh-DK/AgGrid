// import {DataGrid} from "../../lib/bundle"
import React, { useState } from "react";
import { DataGrid } from "../components/datagrid";

function Demos() {
  const columnData = [
    {
      headerName: "Flight No",
      field: "FlightNo",
      width: 100,
      filter: true,
      sortable: true,
    },
    {
      headerName: "From",
      field: "FromCity",
      width: 100,
      filter: true,
      sortable: true,
    },
    // {
    //   headerName: "Unit",
    //   haveChildren: true,
    //   width: 200,
    //   children: [
    //     {
    //       headerName: "Unint (Kg)",

    //       field: "CabinCrewWeightkg",

    //       width: 100,
    //     },
    //     {
    //       headerName: "Unint (pound)",

    //       field: "CabinCrewWeightpound",

    //       width: 100,
    //     },
    //   ],
    // },
    {
      headerName: "To",

      field: "ToCity",

      width: 100,

      filter: true,

      sortable: true,
    },

    // {
    //   headerName: "Galley Details",
    //   field: "Galley Details",
    //   haveChildren: true,
    //   width: 740,
    //   children: [
    //     {
    //       headerName: "Pantry FWD%",
    //       field: "Pantry FWD%",
    //       haveChildren: true,
    //       width: 370,
    //       children: [
    //         {
    //           headerName: "...",
    //           field: "SOLMaleWeigw2ht",
    //           width: 50,
    //           // cellRenderer: gridCheckBOX,
    //         },

    //         { headerName: "100%", field: "SOLFemalesdWeight", width: 80 },

    //         { headerName: "80%", field: "SOLFemsaaleWeight", width: 80 },

    //         { headerName: "60%", field: "SOLFsdemaleWeight", width: 80 },

    //         { headerName: "0%", field: "SOLsFemaleWeight", width: 80 },
    //       ],
    //     },

    //     {
    //       headerName: "Pantry AFT%",

    //       field: "CockPitCrewFemaleWeight",

    //       haveChildren: true,

    //       width: 370,

    //       children: [
    //         {
    //           headerName: "...",
    //           field: "SOLMaleWeigwht",
    //           width: 50,
    //           cellRenderer: (p) => {
    //             return "Hello";
    //           },
    //         },

    //         { headerName: "100%", field: "SOLFem3alesdWeight", width: 80 },

    //         { headerName: "80%", field: "SOLFems1aaleWeight", width: 80 },

    //         { headerName: "60%", field: "SOLFsde12maleWeight", width: 80 },

    //         { headerName: "0%", field: "SOLsFem23aleWeight", width: 80 },
    //       ],
    //     },
    //   ],
    // },

    {
      headerName: "Days of Operations",

      field: "AMEWeight",

      width: 150,
    },

    {
      headerName: "Effective Form",

      field: "DHCWeight",

      width: 100,
    },

    {
      headerName: "Effective To",

      field: "ACMWeight",

      width: 100,
    },

    {
      headerName: "Updated At/User",

      field: "SODWeight",

      width: 100,
    },
  ];
  const [initialRows, setInitialRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  console.log("selectedRows", selectedRows);
  return (
    <div>
      <button
        onClick={() => {
          setInitialRows([
            {
              id: 1,
              firstname: "John",
              lastname: "Doe",
              homenumber: "9987654336",
              personalnumber: "4545454534",
              address: "Marathahali",
              school: "DAV",
              class: "10th",
              CabinCrewWeightkg: "CabinCrewWeightkg1",
            },
            {
              id: 2,
              firstname: "Suvendu",
              lastname: "Sahoo",
              homenumber: "8976543234",
              FlightNo: "8765789045",
              address: "Kodihali",
              school: "DPS",
              class: "7th",
            },
            {
              id: 3,
              firstname: "Namit",
              lastname: "Singh",
              homenumber: "6765458907",
              personalnumber: "8769034156",
              address: "Marathahali",
              school: "DPS",
              class: "8th",
            },
            {
              id: 4,
              firstname: "Pravalika",
              lastname: "Reddy",
              homenumber: "9098654567",
              personalnumber: "6578934123",
              address: "Indira Nagar",
              school: "DAV",
              class: "9th",
            },
          ]);
        }}
      >
        ADD
      </button>
      <button
        onClick={() => {
          setInitialRows([]);
        }}
      >
        Delete
      </button>
      <DataGrid
        rowData={initialRows}
        columnData={columnData}
        // multilineHeader={true}
        style={{
          border: "3px solid red",
          // cellVerticalBorder: "3px solid yellow",
          "--rdg-header-row-height": "30px",
        }}
        selectedRows={selectedRows}
        selection={true}
        onSelectedRowsChange={(r) => setSelectedRows([...r])}
      />

      {initialRows.length > 0 && initialRows.length === selectedRows.length && (
        <span>All rows Selected</span>
      )}
    </div>
  );
}
export default Demos;
