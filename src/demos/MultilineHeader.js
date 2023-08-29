import { useState } from "react";

import TextEditor from "../components/datagrid/editors/textEditor";

import DataGrid from "../components/datagrid/DataGrid";

const frameworkComponents = {
  CheckBox: (props) => <button style={{ width: "100%" }}>Save</button>,
};

function rowKeyGetter(row) {
  return row.id;
}

export default function MultilineHeader({ direction }) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 50; i++) {
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
        llll: `LLL-${i}`,
      });
    }

    return rows;
  }

  const summaryRowsTop = [
    {
      id: "id",
      erer: `email`,
      title1: `title-1-`,
      title2: `title-2-`,
      ffff: `firstName}`,
      cvcv: `lastName`,
    },
  ];

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      sortable: true,
      frozen: true,
      alignment: true,
      cellEditor: TextEditor,
      summaryFormatter(props) {
        return props.row.id;
      },
      colSpan: (props) => {
        if (props.type === "SUMMARY" && props.rowIndex === 0) {
          return 2;
        }
      },
    },
    {
      field: "rdrd",
      headerName: "AASS",
      frozen: true,
      width: 60,
      cellRenderer: TextEditor,
    },

    {
      field: "title",
      frozen: true,
      haveChildren: true,
      children: [
        {
          field: "title1",
          headerName: "Title1",
          filter: true,
          sortable: true,
          width: 150,
        },
        { field: "title2", headerName: "Title2", width: 150 },
      ],
    },
    {
      field: "cvcv",
      headerName: "FGHT",
      frozen: true,
      filter: true,
      cellEditor: TextEditor,
      width: 80,
    },
    {
      field: "erer",
      headerName: "FGHT",
      sortable: true,
      filter: true,
      width: 80,
      frozen: true,
      alignment: true,
    },
    {
      field: "count",
      headerName: "Count",
      haveChildren: true,
      children: [
        {
          field: "nnnn",
          headerName: "NNNN",
          haveChildren: true,
          children: [
            {
              field: "xxxx",
              resizable: true,
              cellRenderer: TextEditor,
              width: 100,
              alignment: true,
            },
            {
              field: "jjjj",
              headerName: "JJJJ",
              haveChildren: true,
              children: [
                {
                  field: "ffff",
                  headerName: "FFFF",
                  width: 100,
                  alignment: true,
                  cellEditor: (params) => {
                    console.log(params.getValue());
                    TextEditor(params);
                  },
                },
                {
                  field: "qweasd",
                  headerName: "DFSDF",
                  width: 100,
                  alignment: true,
                  sortable: true,
                  cellRenderer: (params) => {
                    console.log(params.getValue());
                    TextEditor(params);
                  },
                },
                {
                  field: "vvvv1",
                  headerName: "VVVV1",
                  haveChildren: true,
                  children: [
                    {
                      field: "llll",
                      headerName: "LLLL",
                      width: 100,
                      alignment: true,
                      editable: true,
                      resizable: true,
                    },
                    {
                      field: "pppp",
                      headerName: "PPPP",
                      haveChildren: true,
                      children: [
                        {
                          field: "eeee",
                          headerName: "EEEE",
                          width: 100,
                          alignment: true,
                          validation: {
                            style: {
                              backgroundColor: "red",
                              color: "blue",
                            },
                            method: (value) => {
                              return typeof value !== "string";
                            },
                          },
                        },
                        {
                          field: "pppp1",
                          headerName: "PPPP1",
                          haveChildren: true,
                          width: 100,
                          children: [
                            {
                              field: "eeee1",
                              headerName: "EEEE1",
                              alignment: { align: "end" },
                              editable: true,
                              validation: {
                                style: {
                                  backgroundColor: "red",
                                  color: "blue",
                                },
                                method: (value) => {
                                  return typeof value === "string";
                                },
                              },
                              filter: true,
                            },
                            {
                              field: "pppp2",
                              headerName: "PPPP2",
                              sortable: true,
                              filter: true,
                              alignment: true,
                              validation: {
                                method: (value) => {
                                  return typeof value === "string";
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          field: "oooo",
          alignment: true,
          topHeader: "count",
          sortable: true,
          cellRenderer: TextEditor,
        },
        {
          field: "qqqq",
          headerName: "QQQQ",
          width: 100,
          sortable: true,
          filter: true,
          alignment: true,
        },
      ],
    },
  ];
  const [rows, setRows] = useState(createRows);
  const selectedCellHeaderStyle = {
    backgroundColor: "red",
    fontSize: "12px",
  };

  return (
    // <div style={{ width: "800px", height: "500px" }}>
    <DataGrid
      columnData={columns}
      rowData={rows}
      rowSelection={"multiple"}
      rowKeyGetter={rowKeyGetter}
      classheaderName="fill-grid"
      selectedCellHeaderStyle={selectedCellHeaderStyle}
      className="fill-grid"
      onRowClicked={(props) => {
        console.log("Data", props);
      }}
      topSummaryRows={summaryRowsTop}
      // bottomSummaryRows={summaryRowsBottom}
      multilineHeaderEnable={true}
      serialNumber={true}
    />
    // </div>
  );
}
