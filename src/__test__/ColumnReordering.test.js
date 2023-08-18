import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef } from "react";
import { TextEditor } from "../components/datagrid/editors";

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
      field: "id",
      headerName: "ID",
      topHeader: "id",
      width: 80,
    },
    {
      field: "task",
      headerName: "Title",
      resizable: true,
      topHeader: "task",
      sortable: true,
      cellEditor: TextEditor,
    },
    {
      field: "priority",
      headerName: "Priority",
      topHeader: "priority",
      resizable: true,
      sortable: true,
    },
    {
      field: "issueType",
      headerName: "Issue Type",
      resizable: true,
      topHeader: "issueType",
      sortable: true,
    },
    {
      field: "complete",
      headerName: "% Complete",
      topHeader: "complete",
      headerRenderer: () => {
        return <span>% Complete</span>;
      },
      resizable: true,
      sortable: true,
    },
  ];

  return (
    <>
      <DataGrid
        columnData={columns}
        columnReordering={true}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for column Reorder", () => {
  test("column Reorder", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const firstColumn = screen.getByText("Priority");
    const targetColumn = screen.getByText("Title");
    expect(firstColumn).toBeInTheDocument();
    expect(targetColumn).toBeInTheDocument();

    fireEvent.dragStart(firstColumn);
    fireEvent.dragEnter(targetColumn);
    fireEvent.dragOver(targetColumn);
    fireEvent.drop(targetColumn);
    fireEvent.dragEnd(firstColumn);
  });
  test("column onClcik", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const columnCell = screen.getByText("% Complete");
    expect(columnCell).toBeInTheDocument();
    fireEvent.click(columnCell);
  });
  test("Edit cell UseEffect", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const columnCell = screen.getByText("Task 1");
    expect(columnCell).toBeInTheDocument();
    fireEvent.doubleClick(columnCell);

    let input = screen.getByRole("gridcellTextbox");
    expect(input).toBeInTheDocument();
    userEvent.click(input);
    const ceell = screen.getByText("Task 2");
    fireEvent.click(ceell);
  });
});
