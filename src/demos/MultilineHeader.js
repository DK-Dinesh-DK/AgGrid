import { useState } from "react";
import { faker } from "@faker-js/faker";

import TextEditor from "../components/datagrid/editors/TextEditor";

import DataGrid from "../components/datagrid/DataGrid";

function EmptyRowsRenderer() {
  return (
    <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
      Nothing to show{" "}
      <span lang="ja" title="ショボーン">
        (´・ω・`)
      </span>
    </div>
  );
}

const selectedCellHeaderStyle = {
  backgroundColor: "red",
  fontSize: "12px",
};
const selectedCellRowStyle = {
  backgroundColor: "yellow",
};

const frameworkComponents = {
  CheckBox: (props) => <button style={{ width: "100%" }}>Save</button>,
};

function rowKeyGetter(row) {
  return row.id;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 50,
    sortable: true,
    frozen: true,
    cellEditor: TextEditor,
  },
  {
    field: "rdrd",
    headerName: "AASS",
    frozen: true,
    width: 60,
    cellEditor: TextEditor,
  },

  {
    field: "title",
    headerName: "Title",
    cellEditor: TextEditor,
    frozen: true,
    width: 300,
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
            headerName: "XXXX",
            cellEditor: TextEditor,
            width: 100,
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
                editable: true,
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
                        alignment: { align: "end" },
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
                            validation: {
                              style: {
                                backgroundColor: "red",
                                color: "blue",
                              },
                              method: (value) => {
                                console.log(typeof value);
                                return typeof value === "string";
                              },
                            },
                            width: 100,
                            filter: true,
                          },
                          {
                            field: "pppp2",
                            headerName: "PPPP2",
                            width: 100,
                            sortable: true,
                            filter: true,
                            cellEditor: TextEditor,
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
        headerName: "OOOO",
        width: 100,
        topHeader: "count",
        sortable: true,
      },
      {
        field: "qqqq",
        headerName: "QQQQ",
        width: 100,
        sortable: true,

        filter: true,
      },
    ],
  },
];

function createRows() {
  const rows = [];

  for (let i = 0; i < 50; i++) {
    rows.push({
      id: `${i}`,

      erer: `email${i}`,
      title: `title${i}`,
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
export default function MultilineHeader({ direction }) {
  const [rows, setRows] = useState(createRows);

  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      rowSelection={"multiple"}
      renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
      rowKeyGetter={rowKeyGetter}
      classheaderName="fill-grid"
      className="fill-grid"
      rowFreezLastIndex={3}
      onRowClicked={(props) => {
        console.log("Data", props);
      }}
    />
  );
}
