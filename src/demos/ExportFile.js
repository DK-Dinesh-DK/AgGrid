import DataGrid from "../components/datagrid/DataGrid";
import { faker } from "@faker-js/faker";

export default function ExportFile({ direction }) {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "task",
      headerName: "Title",
      editable: true,
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
    {
      field: "startDate",
      headerName: "Start Date",
    },
    {
      field: "completeDate",
      headerName: "Expected Complete",
      width: 200,
    },
  ];

  function getRandomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toLocaleDateString();
  }

  function createRows() {
    const rows = [];
    for (let i = 1; i < 50; i++) {
      rows.push({
        id: i,
        task: `Task ${i}`,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ["Critical", "High", "Medium", "Low"][
          Math.floor(Math.random() * 3 + 1)
        ],
        issueType: ["Bug", "Improvement", "Epic", "Story"][
          Math.floor(Math.random() * 3 + 1)
        ],
        startDate: getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: getRandomDate(new Date(), new Date(2016, 0, 1)),
      });
    }

    return rows;
  }

  return (
    <>
      <DataGrid
        columnData={columns}
        rowData={createRows()}
        importExcel={true}
        export={{
          pdfFileName: "TableData",
          csvFileName: "TableData",
          excelFileName: "TableData",
        }}
      />
    </>
  );
}
