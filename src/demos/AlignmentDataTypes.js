import { useState } from "react";
// import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";

// import { SelectColumn } from "../components/datagrid/Columns";
import { TextEditor } from "../components/datagrid/editors";

import DataGrid from "../components/datagrid/DataGrid";

// import DropDownEditor from "../components/datagrid/editors/DropDownEditors";
import moment from "moment";
function rowKeyGetter(row) {
  return row.id;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    filter: true,
    // sortable: true,
    alignment: { type: "number" },
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 200,
    alignment: true,
    filter: true,
    sortable: true,
  },
  {
    headerName: "Money",
    field: "money",
    cellEditor: TextEditor,
    alignment: true,
    // filter: true,
    // sortable: true,
    width: 200,
    // validation: {
    //   style: { backgroundColor: "red", color: "blue" },
    //   method: (value) => value.slice(1) >= 100,
    // },
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 200,
    alignment: { type: "string" },
    filter: true,
    sortable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: "max-content",
    alignment:true
  },
  {
    field: "date",
    headerName: "Date",
    alignment: { type: "DATe" },
    // width:200,
    resizable: true,
    filter: true,
    sortable: true,
  },
  {
    field: "time",
    headerName: "Time",
    // width: 150,
    alignment: { type: "Time" },
    filter: true,
    sortable: true,
  },
  {
    field: "datetime",
    headerName: "DateTime",
    alignment: { type: "datetime" },
    filter: true,
    sortable: true,
  },
];

function createRows() {
  const rows = [];

  for (let i = 0; i < 10; i++) {
    rows.push({
      id: i,
      email: `${faker.internet.email()} `,
      title: faker.name.prefix(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      date: moment(faker.date.past().toLocaleDateString()).format(
        "MMMM-DD-YYYY"
      ),
      money: 101,
      time: new Date().toLocaleTimeString("en-IN"),
      datetime: moment(new Date()).format("MM-DD-YYYY h:mm:ss a"),
    });
  }

  return rows;
}

export default function AlignmentDataTypes({ direction }) {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      onFill={true}
      rowHeight={25}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      className="fill-grid"
      direction={direction}
    />
  );
}
