import { useMemo, useState } from "react";
import TextEditor from "../components/datagrid/editors/textEditor";
import DataGrid from "../components/datagrid/DataGrid";

function createRows() {
  const rows = [];

  for (let i = 0; i < 5; i++) {
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

export default function Demo({ direction }) {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState([]);
  console.log("selectedRows", selectedRows);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "task",
      headerName: "Title",
      cellEditor: (props) => {
        return TextEditor(props);
      },
      sortable: true,
    },
    {
      field: "priority",
      headerName: "Priority",
      sortable: true,
    },
    {
      field: "issueType",
      headerName: "Issue Type",
      sortable: true,
    },
    {
      field: "complete",
      headerName: "% Complete",
      sortable: true,
    },
    {
      headerName: "Delete",
      cellRenderer: (props) => {
        return (
          <button
            onClick={() => {
              console.log("Props", props);
              setRows(rows.filter((p) => p.id !== props.row.id));
              setSelectedRows(
                selectedRows.filter((p) => p.id !== props.row.id)
              );
            }}
          >
            Delete
          </button>
        );
      },
    },
  ];
  return (
    <>
      <DataGrid
        // className="fill-grid"
        columnData={columns}
        rowData={rows}
        onRowsChange={setRows}
        selectedRows={selectedRows}
        selection={true}
        onSelectedRowsChange={(p) => setSelectedRows([...p])}
      />
    </>
  );
}
