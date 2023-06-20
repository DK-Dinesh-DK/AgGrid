import { render, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
beforeAll(() => {
  userEvent.setup();
  window.HTMLElement.prototype.scrollIntoView = function () {};
});
describe("isPinning works correctly", () => {
  test("isPinning returns true if atleast one column is pinned", async () => {
    let isPinningOutput;
    function TestComponent() {
      const columns = [
        {
          field: "id",
          headerName: "ID",
          width: 80,
        },
        {
          field: "task",
          headerName: "Title",
          frozen: true,
        },
        {
          field: "priority",
          headerName: "Priority",
        },
      ];
      const rows = [
        { id: 1, task: "Task #1", priority: "Low" },
        { id: 2, task: "Task #2", priority: "Medium" },
        { id: 3, task: "Task #3", priority: "High" },
      ];
      const dataGridRef = useRef(null);
      return (
        <>
          <button
            type="button"
            onClick={() =>
              (isPinningOutput = dataGridRef.current.columnApi.isPinning())
            }>
            isPinning
          </button>
          <DataGrid
            columnData={columns}
            rowData={rows}
            enableVirtualization={false}
            innerRef={dataGridRef}
          />
        </>
      );
    }
    render(<TestComponent />);

    const isPinningBtn = screen.getByRole("button", {
      name: /ispinning/i,
    });

    await act(async () => {
      await userEvent.click(isPinningBtn);
    });
    expect(isPinningOutput).toBeTruthy();
  });
  test("isPinning returns false if no columns are pinned", async () => {
    let isPinningOutput;

    function TestComponent() {
      const columns = [
        {
          field: "id",
          headerName: "ID",
          width: 80,
        },
        {
          field: "task",
          headerName: "Title",
        },
        {
          field: "priority",
          headerName: "Priority",
        },
      ];
      const rows = [
        { id: 1, task: "Task #1", priority: "Low" },
        { id: 2, task: "Task #2", priority: "Medium" },
        { id: 3, task: "Task #3", priority: "High" },
      ];
      const dataGridRef = useRef(null);
      return (
        <>
          <button
            type="button"
            onClick={() =>
              (isPinningOutput = dataGridRef.current.columnApi.isPinning())
            }>
            isPinning
          </button>
          <DataGrid
            columnData={columns}
            rowData={rows}
            enableVirtualization={false}
            innerRef={dataGridRef}
          />
        </>
      );
    }
    render(<TestComponent />);

    const isPinningBtn = screen.getByRole("button", {
      name: /ispinning/i,
    });

    await act(async () => {
      await userEvent.click(isPinningBtn);
    });
    expect(isPinningOutput).toBeFalsy();
  });
});
