import { render, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
beforeAll(() => {
  userEvent.setup();
  window.HTMLElement.prototype.scrollIntoView = function () {};
});
let getColumnOutput;
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
function TestComponent(props) {
  const dataGridRef = useRef(null);
  return (
    <>
      <button
        type="button"
        onClick={() =>
          (getColumnOutput = dataGridRef.current.columnApi.getColumn(
            props.column
          ))
        }
      >
        getColumn
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
describe("getColumn works correctly", () => {
  test("getColumn gets column object of correct column(priority) when colKey passed as string", async () => {
    render(<TestComponent column={"priority"} />);
    const expectedColumnObject = {
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
    };

    const getColumnBtn = screen.getByRole("button", {
      name: /getcolumn/i,
    });

    await act(async () => {
      await userEvent.click(getColumnBtn);
    });

    expect(getColumnOutput).toEqual(expectedColumnObject);
  });
  test("getColumn gets column object of correct column(id) when colKey passed as object", async () => {
    render(<TestComponent column={{ colId: "id" }} />);

    const expectedColumnObject = {
      colId: "id",
      columnIndex: 0,
      width: "80px",
      frozen: false,
      rowGroup: false,
      rowGroupIndex: null,
      sort: null,
      userProvidedColDef: {
        depth: 0,
        field: "id",
        headerName: "ID",
        width: 80,
        frozen: false,
      },
    };

    const getColumnBtn = screen.getByRole("button", {
      name: /getcolumn/i,
    });

    await act(async () => {
      await userEvent.click(getColumnBtn);
    });
    expect(getColumnOutput).toEqual(expectedColumnObject);
  });
});
