import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef } from "react";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 1; i < 10; i++) {
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
  const rowData = createRows();

  const gridRef = useRef(null);
  const columns = [
    {
      headerName: "trial",
      field: "",
      width: 45,
    },
    {
      field: "id",
      headerName: "ID",
      width: 80,
      rowDrag: true,
    },
    {
      field: "task",
      headerName: "Title",
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
  return (
    <>
      <button
        data-testid={"setSuppressRowDrag"}
        onClick={() => {
          gridRef.current.api.setSuppressRowDrag(true);
        }}
      >
        GetValue
      </button>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        ref={gridRef}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for Row Reorder", () => {
  test("Row Reorder", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const firstColumn = screen.getByTestId("drag-icon-1-0");
    const targetColumn = screen.getByTestId("drag-icon-1-3");
    expect(firstColumn).toBeInTheDocument();
    expect(targetColumn).toBeInTheDocument();

    fireEvent.dragStart(firstColumn);
    fireEvent.dragEnter(targetColumn);
    fireEvent.dragOver(targetColumn);
    fireEvent.drop(targetColumn);
    fireEvent.dragEnd(firstColumn);
  });
  test("Row Reorder suppress Row Drag", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const suppressbtn = screen.getByTestId("setSuppressRowDrag");
    expect(suppressbtn).toBeInTheDocument();
    fireEvent.click(suppressbtn);
  });
});
