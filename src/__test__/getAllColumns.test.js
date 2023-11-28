import { render, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
beforeAll(() => {
  userEvent.setup();
  window.HTMLElement.prototype.scrollIntoView = function () {};
});
describe("getColumns and getAllGridColumns work correctly", () => {
  test("getColumns returns all columns", async () => {
    let getColumnsOutput;
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
    function TestComponent() {
      const dataGridRef = useRef(null);
      return (
        <>
          <button
            type="button"
            onClick={() =>
              (getColumnsOutput = dataGridRef.current.columnApi.getColumns())
            }
          >
            getColumns
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
    const expectedColumnObjects = [
      {
        colId: "id",
        columnIndex: 0,
        width: "80px",
        frozen: false,
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
        userProvidedColDef: {
          field: "id",
          headerName: "ID",
          width: 80,
          depth: 0,
          frozen: false,
        },
      },
      {
        colId: "task",
        columnIndex: 1,
        width: "auto",
        frozen: false,
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
        userProvidedColDef: {
          field: "task",
          headerName: "Title",
          depth: 0,
          frozen: false,
        },
      },
      {
        colId: "priority",
        columnIndex: 2,
        width: "auto",
        frozen: false,
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
        userProvidedColDef: {
          field: "priority",
          headerName: "Priority",
          depth: 0,
          frozen: false,
        },
      },
    ];
    const getColumnsBtn = screen.getByRole("button", {
      name: /getcolumns/i,
    });

    await act(async () => {
      await userEvent.click(getColumnsBtn);
    });
    expect(getColumnsOutput).toEqual(expectedColumnObjects);
  });
  test("getAllGridColumns returns all grid columns", async () => {
    let getAllGridColumnsOutput;
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
    function TestComponent() {
      const dataGridRef = useRef(null);
      return (
        <>
          <button
            type="button"
            onClick={() =>
              (getAllGridColumnsOutput =
                dataGridRef.current.columnApi.getAllGridColumns())
            }
          >
            getAllGridColumns
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
    const expectedColumnObjects = [
      {
        colId: "id",
        columnIndex: 0,
        width: "80px",
        frozen: false,
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
        userProvidedColDef: {
          field: "id",
          headerName: "ID",
          width: 80,
          depth: 0,
          frozen: false,
        },
      },
      {
        colId: "task",
        columnIndex: 1,
        width: "auto",
        frozen: false,
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
        userProvidedColDef: {
          field: "task",
          headerName: "Title",
          depth: 0,
          frozen: false,
        },
      },
      {
        colId: "priority",
        columnIndex: 2,
        width: "auto",
        frozen: false,
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
        userProvidedColDef: {
          field: "priority",
          headerName: "Priority",
          depth: 0,
          frozen: false,
        },
      },
    ];
    const getAllGridColumns = screen.getByRole("button", {
      name: /getallgridcolumns/i,
    });

    await act(async () => {
      await userEvent.click(getAllGridColumns);
    });
    expect(getAllGridColumnsOutput).toEqual(expectedColumnObjects);
  });
});
