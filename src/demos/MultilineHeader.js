import React, { useRef } from "react";

import TextEditor from "../components/datagrid/editors/textEditor";

import DataGrid from "../components/datagrid/DataGrid";

export default function MultilineHeader({ direction }) {
  //  function createRows() {
  //   const rows = [];

  //   for (let i = 0; i < 10; i++) {
  //     rows.push({
  //       id: `${i}`,

  //       erer: `email${i}`,
  //       title1: `title-1-${i}`,
  //       title2: `title-2-${i}`,
  //       ffff: `firstName${i}`,
  //       cvcv: `lastName${i}`,
  //       qqqq: `qq${i}`,
  //       oooo: `zipCode${i}`,
  //       xxxx: `xxx${i}`,
  //       eeee1: `name${i}`,
  //       rdrd: `words${i}`,
  //       pppp2: `sentence${i}`,
  //     });
  //   }

  //   return rows;
  // }
  // const rowData = createRows();
  // const summaryRowsTop = [
  //   {
  //     id: "id",
  //     erer: `email`,
  //     title1: `title-1-`,
  //     title2: `title-2-`,
  //     ffff: `firstName}`,
  //     cvcv: `lastName`,
  //   },
  // ];
  // const summaryRowsBottom = [
  //   {
  //     id: "id-bottom",
  //     erer: `email-bottom`,
  //     title1: `title-1-bottom`,
  //     title2: `title-2-bottom`,
  //     ffff: `firstName-bottom`,
  //     cvcv: `lastName-bottom`,
  //   },
  // ];
  // const columns = [
  //   {
  //     field: "id",
  //     headerName: "ID",
  //     width: 50,
  //     sortable: true,
  //     frozen: true,
  //     alignment: true,
  //     cellEditor: TextEditor,
  //     summaryFormatter(props) {
  //       return props.row.id;
  //     },
  //     colSpan: (props) => {
  //       if (props.type === "SUMMARY" && props.rowIndex === 0) {
  //         return 2;
  //       }
  //     },
  //   },
  //   {
  //     field: "rdrd",
  //     headerName: "AASS",
  //     resizable: true,
  //     frozen: true,
  //     width: 60,
  //     cellRenderer: TextEditor,
  //   },

  //   {
  //     headerName: "Title",
  //     frozen: true,
  //     haveChildren: true,
  //     children: [
  //       {
  //         field: "title1",
  //         headerName: "Title1",
  //         filter: true,
  //         sortable: true,
  //         alignment: true,
  //         cellRenderer: (params) => {
  //           return TextEditor(params);
  //         },
  //         width: 150,
  //       },
  //       { field: "title2", headerName: "Title2", width: 150 },
  //     ],
  //   },
  //   {
  //     field: "cvcv",
  //     headerName: "FGHT",
  //     frozen: true,
  //     filter: true,
  //     cellEditor: TextEditor,
  //     width: 80,
  //   },
  //   {
  //     field: "erer",
  //     headerName: "FGHT",
  //     sortable: true,
  //     filter: true,
  //     width: 80,
  //     frozen: true,
  //     alignment: true,
  //   },
  //   {
  //     field: "count",
  //     headerName: "Count",
  //     haveChildren: true,
  //     children: [
  //       {
  //         field: "nnnn",
  //         headerName: "NNNN",
  //         haveChildren: true,
  //         children: [
  //           {
  //             field: "xxxx",
  //             resizable: true,
  //             cellRenderer: TextEditor,
  //             width: 100,
  //             alignment: true,
  //           },
  //           {
  //             field: "jjjj",
  //             headerName: "JJJJ",
  //             haveChildren: true,
  //             children: [
  //               {
  //                 field: "ffff",
  //                 headerName: "FFFF",
  //                 width: 100,
  //                 alignment: true,
  //                 cellEditor: (params) => {
  //                   console.log(params.getValue());
  //                   TextEditor(params);
  //                 },
  //               },
  //               {
  //                 field: "qweasd",
  //                 headerName: "DFSDF",
  //                 width: 100,
  //                 alignment: true,
  //                 sortable: true,
  //                 cellRenderer: (params) => {
  //                   console.log(params.getValue());
  //                   TextEditor(params);
  //                 },
  //               },
  //               {
  //                 field: "vvvv1",
  //                 headerName: "VVVV1",
  //                 haveChildren: true,
  //                 children: [
  //                   {
  //                     field: "llll",
  //                     headerName: "LLLL",
  //                     width: 100,
  //                     alignment: true,
  //                     editable: true,
  //                   },
  //                   {
  //                     field: "pppp",
  //                     headerName: "PPPP",
  //                     haveChildren: true,
  //                     children: [
  //                       {
  //                         field: "eeee",
  //                         headerName: "EEEE",
  //                         resizable: true,
  //                         width: 100,
  //                         alignment: true,
  //                         validation: {
  //                           style: {
  //                             backgroundColor: "red",
  //                             color: "blue",
  //                           },
  //                           method: (value) => {
  //                             return typeof value !== "string";
  //                           },
  //                         },
  //                       },
  //                       {
  //                         field: "pppp1",
  //                         headerName: "PPPP1",
  //                         haveChildren: true,
  //                         children: [
  //                           {
  //                             field: "eeee1",
  //                             headerName: "EEEE1",
  //                             alignment: { align: "end" },
  //                             editable: true,
  //                             width: 100,
  //                             validation: {
  //                               style: {
  //                                 backgroundColor: "red",
  //                                 color: "blue",
  //                               },
  //                               method: (value) => {
  //                                 return typeof value === "string";
  //                               },
  //                             },
  //                             filter: true,
  //                           },
  //                           {
  //                             field: "pppp2",
  //                             headerName: "PPPP2",
  //                             sortable: true,
  //                             filter: true,
  //                             alignment: true,
  //                             width: 100,
  //                             validation: {
  //                               method: (value) => {
  //                                 return typeof value === "string";
  //                               },
  //                             },
  //                           },
  //                         ],
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //       {
  //         field: "oooo",
  //         alignment: true,
  //         topHeader: "count",
  //         sortable: true,
  //         cellRenderer: TextEditor,
  //       },
  //       {
  //         field: "qqqq",
  //         headerName: "QQQQ",
  //         width: 100,
  //         sortable: true,
  //         filter: true,
  //         alignment: true,
  //       },
  //     ],
  //   },
  // ];
  // const gridRef = useRef(null);
  // const selectedCellHeaderStyle = {
  //   backgroundColor: "red",
  //   fontSize: "12px",
  // };
  // const selectedCellRowStyle = {
  //   backgroundColor: "yellow",
  // };

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

    {
      headerName: "To",

      field: "ToCity",

      width: 100,

      filter: true,

      sortable: true,
    },

    {
      headerName: "Galley Details",

      field: "CockPitCrewWeight",

      haveChildren: true,

      width: 740,

      children: [
        {
          headerName: "Pantry FWD%",

          field: "CockPitCrewMaleWeight",

          haveChildren: true,

          width: 370,

          children: [
            {
              headerName: "...",
              field: "SOLMaleWeigw2ht",
              width: 50,
              // cellRenderer: gridCheckBOX,
            },

            { headerName: "100%", field: "SOLFemalesdWeight", width: 80 },

            { headerName: "80%", field: "SOLFemsaaleWeight", width: 80 },

            { headerName: "60%", field: "SOLFsdemaleWeight", width: 80 },

            { headerName: "0%", field: "SOLsFemaleWeight", width: 80 },
          ],
        },

        {
          headerName: "Pantry AFT%",

          field: "CockPitCrewFemaleWeight",

          haveChildren: true,

          width: 370,

          children: [
            {
              headerName: "...",
              field: "SOLMaleWeigwht",
              width: 50,
              cellRenderer: (p) => {
                return "Hello";
              },
            },

            { headerName: "100%", field: "SOLFem3alesdWeight", width: 80 },

            { headerName: "80%", field: "SOLFems1aaleWeight", width: 80 },

            { headerName: "60%", field: "SOLFsde12maleWeight", width: 80 },

            { headerName: "0%", field: "SOLsFem23aleWeight", width: 80 },
          ],
        },
      ],
    },

    {
      headerName: "Unit",

      field: "CabinCrewWeight",

      width: 100,
    },

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
  const initialRows = [
    {
      firstname: "John",
      lastname: "Doe",
      homenumber: "9987654336",
      personalnumber: "4545454534",
      address: "Marathahali",
      school: "DAV",
      class: "10th",
    },
    {
      firstname: "Suvendu",
      lastname: "Sahoo",
      homenumber: "8976543234",
      personalnumber: "8765789045",
      address: "Kodihali",
      school: "DPS",
      class: "7th",
    },
    {
      firstname: "Namit",
      lastname: "Singh",
      homenumber: "6765458907",
      personalnumber: "8769034156",
      address: "Marathahali",
      school: "DPS",
      class: "8th",
    },
    {
      firstname: "Pravalika",
      lastname: "Reddy",
      homenumber: "9098654567",
      personalnumber: "6578934123",
      address: "Indira Nagar",
      school: "DAV",
      class: "9th",
    },
  ];
  return (
    <DataGrid
      columnData={columnData}
      testId={"laidatagrid"}
      rowData={initialRows}
      headerRowHeight={24}
      className="fill-grid"
      //  onRowsChange={setRows}
      // style={{ width: "max-content", overflowX: "auto" }}
      selection={true}
      rowKeyGetter={(data) => data.homenumber}
      multilineHeader={true}
      onCellClicked={() => console.log("CellClciked")}
      onCellDoubleClicked={() => console.log("onCellDoubleClicked")}
    />
  );
}
