import {
  render,
  act,
  screen,
  fireEvent,
  queryAllByRole,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
beforeAll(() => {
  userEvent.setup();
  window.HTMLElement.prototype.scrollIntoView = function () {};
});
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
function LaiDatagrid(props) {
  const dataGridRef = useRef(null);
  return (
    <>
      <button
        type="button"
        data-testid="setColumnPinnedBtn"
        onClick={() =>
          dataGridRef.current.columnApi.setColumnPinned(props.column)
        }
      >
        setColumnPinned
      </button>
      <button
        type="button"
        data-testid="setColumnsPinnedBtn"
        onClick={() =>
          dataGridRef.current.columnApi.setColumnsPinned(props.columns)
        }
      >
        setColumnsPinned
      </button>
      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
        innerRef={dataGridRef}
        testId={"laidatagrid"}
      />
    </>
  );
}
describe("Column Pinning", () => {
  test("setColumnPinned works correctly when column passed as string", () => {
    const column = "task";
    render(<LaiDatagrid column={column} />);
    const setColumnPinnedBtn = screen.queryByTestId("setColumnPinnedBtn");
    expect(setColumnPinnedBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setColumnPinnedBtn);
    });

    const columns = screen.queryAllByRole("parentcolumn");
    const taskColumn = columns[0];
    expect(taskColumn).toBeInTheDocument();
    expect(taskColumn).toHaveClass("rdg-cell c9tygie rdg-header-column-even");
  });
  test("setColumnPinned works correctly when column passed as object", () => {
    const columnObj = {
      colId: "task",
    };
    render(<LaiDatagrid column={columnObj} />);
    const setColumnPinnedBtn = screen.queryByTestId("setColumnPinnedBtn");
    expect(setColumnPinnedBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setColumnPinnedBtn);
    });

    const columns = screen.queryAllByRole("parentcolumn");
    const taskColumn = columns[0];
    expect(taskColumn).toBeInTheDocument();
    expect(taskColumn).toHaveClass("rdg-cell c9tygie rdg-header-column-even");
  });
  test("setColumnsPinned works correctly when columns are passed as array of strings", () => {
    const columns = ["id", "priority"];
    render(<LaiDatagrid columns={columns} />);

    const setColumnsPinnedBtn = screen.queryByTestId("setColumnsPinnedBtn");
    expect(setColumnsPinnedBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setColumnsPinnedBtn);
    });

    const columnDivs = screen.queryAllByRole("parentcolumn");
    const idColumn = columnDivs[0];
    const priorityColumn = columnDivs[1];

    expect(idColumn).toBeInTheDocument();
    expect(idColumn).toHaveClass("rdg-cell c9tygie rdg-header-column-even");

    expect(priorityColumn).toBeInTheDocument();
    expect(priorityColumn).toHaveClass(
      "rdg-cell c9tygie rdg-header-column-odd"
    );
  });
  test("setColumnsPinned works correctly when columns are passed as array of objects", () => {
    const columnObjs = [
      {
        colId: "id",
      },
      {
        colId: "priority",
      },
    ];

    render(<LaiDatagrid columns={columnObjs} />);

    const setColumnsPinnedBtn = screen.queryByTestId("setColumnsPinnedBtn");
    expect(setColumnsPinnedBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setColumnsPinnedBtn);
    });

    const columnDivs = screen.queryAllByRole("parentcolumn");
    const idColumn = columnDivs[0];
    const priorityColumn = columnDivs[1];

    expect(idColumn).toBeInTheDocument();
    expect(idColumn).toHaveClass(" rdg-cell c9tygie rdg-header-column-even");

    expect(priorityColumn).toBeInTheDocument();
    expect(priorityColumn).toHaveClass(
      "rdg-cell c9tygie rdg-header-column-odd"
    );
  });
});
