import { useState } from "react";
import { faker } from "@faker-js/faker";

import TextEditor from "../components/datagrid/editors/textEditor";

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
    alignment: true,
  },
  {
    field: "rdrd",
    headerName: "AASS",
    frozen: true,
    width: 100,
    cellEditor: TextEditor,
    alignment: true,
  },

  {
    field: "title",
    headerName: "Title",
    cellEditor: TextEditor,
    frozen: true,
    width: 300,
    alignment: true,
  },
  {
    field: "cvcv",
    headerName: "FGHT",
    frozen: true,
    filter: true,
    cellEditor: TextEditor,
    width: 80,
    alignment: true,
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
            headerName: "XXXX",
            cellEditor: TextEditor,
            width: 100,
            alignment:{type:"number"},
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
                // alignment: true,
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
                        // alignment: true,
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
                            alignment: {type:"number"},
                            width: 200,
                            filter: true,
                          },
                          {
                            field: "pppp2",
                            headerName: "PPPP2",
                            width: 200,
                            sortable: true,
                            filter: true,
                            alignment: {type:"number"},
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
        alignment: true,
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
        alignment: true,
      },
    ],
  },
];

function createRows() {
  const rows = [];

  for (let i = 0; i < 5000; i++) {
    rows.push({
      id: i,

      erer: faker.internet.email(),
      title: faker.name.prefix(),
      ffff: faker.name.firstName(),
      cvcv: faker.name.lastName(),
      qqqq: faker.internet.email(),
      oooo: faker.address.zipCode(),
      xxxx: faker.name.firstName(),
      eeee1: faker.company.name(),
      rdrd: faker.lorem.words(),
      pppp2: faker.lorem.sentence(),
    });
  }

  return rows;
}

export default function MultilineHeader({ direction }) {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      onRowsChange={setRows}
      rowSelection={"multiple"}
      renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
      rowKeyGetter={rowKeyGetter}
      classheaderName="fill-grid"
      className="fill-grid"
      rowFreezLastIndex={3}
    />
  );
}
