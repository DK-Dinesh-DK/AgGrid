import { useState } from "react";

import TextEditor from "../components/datagrid/editors/textEditor";
import DataGrid from "../components/datagrid/DataGrid";

const frameworkComponents = {
  abc: () => {
    return <input type={"checkbox"} />;
  },
  cdd: (props) => <button />,
};

function createRows() {
  const rows = [];

  for (let i = 1; i < 500; i++) {
    rows.push({
      id: i,
      task: `Task ${i}`,
      complete: Math.min(100, Math.round(Math.random() * 110)),
      priority: ["Critical", "High", "Medium", "Low"][
        Math.round(Math.random() * 3)
      ],
      issueType: ["Bug", "Improvement", "Epic", "Story"][
        Math.round(Math.random() * 3)
      ],
    });
  }

  return rows;
}

const columns = [
  // {
  //   headerName: "trial",
  //   field: "",
  //   width: 45,
  //   cellRenderer: "abc",
  // },
  {
    field: "id",
    headerName: "ID",
    width: 80,
    rowDrag: true,
  },
  {
    field: "task",
    headerName: "Title",
    editor: TextEditor,
  },
  {
    field: "priority",
    headerName: "Priority",
  },
  {
    field: "issueType",
    headerName: "Issue Type",
  },
  {
    field: "complete",
    headerName: "% Complete",
  },
];
function rowKeyGetter(row) {
  return row.id;
}

export default function RowsReordering({ direction }) {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState([{ id: 2 }]);

  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      rowKeyGetter={rowKeyGetter}
      selectedRows={selectedRows}
      onSelectedRowsChange={(rows) => {
        console.log("OnselectedRows", rows);
        setSelectedRows(rows);
      }}
      // serialNumber={true}
      selection={true}
      rowSelection="multiple"
      onRowsChange={setRows}
      direction={direction}
      frameworkComponents={frameworkComponents}
    />
  );
}
