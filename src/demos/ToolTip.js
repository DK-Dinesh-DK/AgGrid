import { useState } from "react";
import DataGrid from "../components/datagrid/DataGrid";

function createRows() {
  const rows = [];

  for (let i = 1; i <= 50; i++) {
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

const columns1 = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
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
];
const columns2 = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
    sortable: true,
    toolTip: true,
  },
  {
    field: "priority",
    headerName: "Priority",
    sortable: true,
    toolTip: true,
  },
  {
    field: "issueType",
    headerName: "Issue Type",
    sortable: true,
    toolTip: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    sortable: true,
  },
];
const columns3 = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "task",
    headerName: "Title",
    sortable: true,
    toolTip: true,
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
    toolTip: (params) => `Issue Type ${params.row[params.column.field]}`,
  },
  {
    field: "complete",
    headerName: "% Complete",
    sortable: true,
  },
];
const columns4 = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    headerName: "Details",
    haveChildren: true,
    width: 200,
    children: [
      {
        field: "task",
        headerName: "Title",
        sortable: true,
        toolTip: true,
        width: 100,
      },
      {
        field: "priority",
        headerName: "Priority",
        sortable: true,
        width: 100,
      },
    ],
  },

  {
    field: "issueType",
    headerName: "Issue Type",
    sortable: true,
    toolTip: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    sortable: true,
    toolTip: true,
  },
];
const columns5 = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    headerName: "Details",
    haveChildren: true,
    width: 200,
    children: [
      {
        field: "task",
        headerName: "Title",
        sortable: true,
        toolTip: (params) => `Task Type ${params.row[params.column.field]}`,
        width: 100,
      },
      {
        field: "priority",
        headerName: "Priority",
        sortable: true,
        width: 100,
      },
    ],
  },

  {
    field: "issueType",
    headerName: "Issue Type",
    sortable: true,
    toolTip: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    sortable: true,
    toolTip: true,
  },
];

export default function ToolTip({ direction }) {
  const rows = createRows();
  const [tooltipType, setTooltipType] = useState("RowLevelDynamic");
  return (
    <>
      {/* <input type={"checkbox"} onClick={() => setRows(rows.slice(0, 40))} >Clcik</input> */}
      <div>
        <label>ToolTip Methods</label>
        <select
          onChange={(e) => {
            setTooltipType(e.target.value);
          }}
          value={tooltipType}
        >
          <option key="RowLevelDefault">RowLevelDefault</option>
          <option key="RowLevelDynamic">RowLevelDynamic</option>
          <option key="RowLevelDynamicInside">RowLevelDynamicInside</option>
          <option key="CellLevelDefault">CellLevelDefault</option>
          <option key="CellLevelDynamic">CellLevelDynamic</option>
          <option key="MultiLineCellLevelDefault">
            MultiLineCellLevelDefault
          </option>
          <option key="MultiLineCellLevelDynamic">
            MultiLineCellLevelDynamic
          </option>
        </select>
      </div>

      {tooltipType === "RowLevelDefault" && (
        <DataGrid
          className="fill-grid"
          columnData={columns1}
          rowData={rows}
          rowLevelToolTip={true}
        />
      )}
      {tooltipType === "RowLevelDynamic" && (
        <DataGrid
          className="fill-grid"
          columnData={columns1}
          rowData={rows}
          rowLevelToolTip={(params) => {
            if (params.rowIndex > 5 && params.rowIndex < 10) return "";
            return `Row Index ${params.rowIndex}1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?`;
          }}
        />
      )}
      {tooltipType === "RowLevelDynamicInside" && (
        <div style={{ display: "flex" }}>
          <DataGrid
            className="fill-grid"
            columnData={columns1}
            rowData={rows}
            rowLevelToolTip={(params) => {
              if (params.rowIndex > 5 && params.rowIndex < 10) return "";
              return `Row Index ${params.rowIndex}1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?`;
            }}
          />
          <div
            style={{
              width: "200px",
              backgroundColor: "red",
              height: "inherit",
            }}
          >
            jituigjvj
          </div>
        </div>
      )}
      {tooltipType === "CellLevelDefault" && (
        <DataGrid className="fill-grid" columnData={columns2} rowData={rows} />
      )}
      {tooltipType === "CellLevelDynamic" && (
        <DataGrid className="fill-grid" columnData={columns3} rowData={rows} />
      )}
      {tooltipType === "MultiLineCellLevelDefault" && (
        <DataGrid className="fill-grid" columnData={columns4} rowData={rows} />
      )}
      {tooltipType === "MultiLineCellLevelDynamic" && (
        <DataGrid className="fill-grid" columnData={columns5} rowData={rows} />
      )}
    </>
  );
}
