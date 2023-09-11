import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useState } from "react";
import DataGrid from "../components/datagrid/DataGrid";

function createRows() {
  const rows = [];

  for (let i = 1; i <= 10; i++) {
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
    toolTip: (params) => `ITask For ${params.row[params.column.field]}`,
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
    children: [
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
    ],
  },

  {
    field: "issueType",
    width: 150,
    headerName: "Issue Type",
    sortable: true,
    toolTip: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    width: 150,
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
    children: [
      {
        field: "task",
        headerName: "Title",
        sortable: true,
        toolTip: (params) => `Task Type ${params.row[params.column.field]}`,
      },
      {
        field: "priority",
        headerName: "Priority",
        sortable: true,
      },
    ],
  },

  {
    field: "issueType",
    width: 150,
    headerName: "Issue Type",
    sortable: true,
    toolTip: true,
  },
  {
    field: "complete",
    headerName: "% Complete",
    width: 150,
    sortable: true,
    toolTip: true,
  },
];

function LaiDataGrid() {
  const rows = createRows();
  const [tooltipType, setTooltipType] = useState("RowLevelDefault");
  return (
    <>
      <div>
        <label>ToolTip Methods</label>
        <select
          data-testid="drop-down"
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
          testId={"laidatagrid"}
          columnData={columns1}
          rowData={rows}
          rowLevelToolTip={true}
        />
      )}
      {tooltipType === "RowLevelDynamic" && (
        <DataGrid
          className="fill-grid"
          testId={"laidatagrid"}
          columnData={columns1}
          rowData={rows}
          rowLevelToolTip={(params) => {
            if (params.rowIndex > 5 && params.rowIndex < 10) return "";
            return `Row Index ${params.rowIndex}1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?`;
          }}
        />
      )}
      {tooltipType === "RowLevelDynamicInside" && (
        <DataGrid
          className="fill-grid"
          columnData={columns1}
          testId={"laidatagrid"}
          rowData={rows}
          rowLevelToolTip={(params) => {
            if (params.rowIndex > 5 && params.rowIndex < 10) return "";
            return `Row Index ${params.rowIndex}1234567890-=qwertyuiop[]asdfghjkl;'zxcvbnm,./!@#$%^&*()_+QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>?`;
          }}
        />
      )}
      {tooltipType === "CellLevelDefault" && (
        <DataGrid
          className="fill-grid"
          columnData={columns2}
          rowData={rows}
          testId={"laidatagrid"}
        />
      )}
      {tooltipType === "CellLevelDynamic" && (
        <DataGrid
          className="fill-grid"
          columnData={columns3}
          rowData={rows}
          testId={"laidatagrid"}
        />
      )}
      {tooltipType === "MultiLineCellLevelDefault" && (
        <DataGrid
          className="fill-grid"
          columnData={columns4}
          rowData={rows}
          multilineHeader={true}
          testId={"laidatagrid"}
        />
      )}
      {tooltipType === "MultiLineCellLevelDynamic" && (
        <DataGrid
          className="fill-grid"
          columnData={columns5}
          rowData={rows}
          multilineHeader={true}
          testId={"laidatagrid"}
        />
      )}
    </>
  );
}

describe("Datagrid Unit test for ToolTip view with multiline header", () => {
  test("ToolTip view", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("Task 1");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    const dropDownbtn = screen.getByTestId("drop-down");
    expect(dropDownbtn).toBeInTheDocument();
    fireEvent.change(dropDownbtn, { target: { value: "RowLevelDynamic" } });
    const cont = screen.getByText("Task 1");
    expect(cont).toBeInTheDocument();
    fireEvent.mouseOver(cont);
    fireEvent.mouseOut(cont);
    fireEvent.change(dropDownbtn, { target: { value: "CellLevelDefault" } });
    const cont1 = screen.getByText("Task 1");
    expect(cont1).toBeInTheDocument();
    fireEvent.mouseOver(cont1);
    fireEvent.mouseOut(cont1);
    fireEvent.change(dropDownbtn, { target: { value: "CellLevelDynamic" } });
    const cont2 = screen.getByText("Task 1");
    expect(cont2).toBeInTheDocument();
    fireEvent.mouseOver(cont2);
    fireEvent.change(dropDownbtn, {
      target: { value: "MultiLineCellLevelDefault" },
    });
    const cont3 = screen.getByText("Task 1");
    expect(cont3).toBeInTheDocument();
    fireEvent.mouseOver(cont3);
    fireEvent.change(dropDownbtn, {
      target: { value: "MultiLineCellLevelDynamic" },
    });
    const cont4 = screen.getByText("Task 1");
    expect(cont4).toBeInTheDocument();
    fireEvent.mouseOver(cont4);
    fireEvent.mouseOut(cont4);
  });
});


