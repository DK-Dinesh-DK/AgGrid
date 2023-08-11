import { render, act, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
beforeAll(() => {
  userEvent.setup();
  window.HTMLElement.prototype.scrollIntoView = function () {};
});
let columnStatesOutput;
const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    rowGroup: true,
  },
  {
    field: "task",
    headerName: "Title",
    width: 90,
    sortable: true,
    rowGroup: true,
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 100,
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
        data-testid="getColumnStateBtn"
        onClick={() =>
          (columnStatesOutput = dataGridRef.current.columnApi.getColumnState())
        }
      >
        getColumnState
      </button>
      <button
        type="button"
        data-testid="applyColumnStateBtn"
        onClick={() =>
          dataGridRef.current.columnApi.applyColumnState(props.columnState)
        }
      >
        applyColumnState
      </button>
      <button
        type="button"
        data-testid="resetColumnStateBtn"
        onClick={() => dataGridRef.current.columnApi.resetColumnState()}
      >
        resetColumnState
      </button>

      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
        innerRef={dataGridRef}
        testId={"laidatagrid"}
        groupBy={["id", "task"]}
      />
    </>
  );
}
describe("ColumnState API", () => {
  test("getColumnState works correctly", () => {
    const expectedColumnStates = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: true,
        width: "80px",
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: true,
        width: "90px",
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: undefined,
        width: "100px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
      },
    ];

    render(<LaiDatagrid />);

    const datagrid = screen.getByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getColumnStateBtn = screen.queryByTestId("getColumnStateBtn");
    expect(getColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getColumnStateBtn);
    });

    expect(columnStatesOutput).toEqual(expectedColumnStates);
  });
  test("applyColumnState works correctly", () => {
    const initialColumnState = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: true,
        width: "80px",
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: true,
        width: "90px",
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: undefined,
        width: "100px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
      },
    ];
    const columnStates = {
      state: [
        {
          colId: "id",
          sort: "ASC",
          frozen: true,
          rowGroup: false,
        },
        {
          colId: "task",
          width: "60px",
          rowGroupIndex: 1,
        },
        {
          colId: "priority",
          rowGroup: true,
          rowGroupIndex: 0,
          width: 30,
        },
      ],
    };
    const expectedColumnStates = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: true,
        width: "80px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: "ASC",
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: true,
        width: "90px",
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: undefined,
        width: "100px",
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
      },
    ];

    render(<LaiDatagrid columnState={columnStates} />);

    const datagrid = screen.getByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getColumnStateBtn = screen.queryByTestId("getColumnStateBtn");
    expect(getColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getColumnStateBtn);
    });
    expect(columnStatesOutput).toEqual(initialColumnState);

    const applyColumnStateBtn = screen.queryByTestId("applyColumnStateBtn");
    expect(applyColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(applyColumnStateBtn);
      fireEvent.click(getColumnStateBtn);
    });

    expect(columnStatesOutput).toEqual(expectedColumnStates);
  });
  test("defaultState passed to applyColumnState works correctly", () => {
    const initialColumnState = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: true,
        width: "80px",
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: true,
        width: "90px",
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: undefined,
        width: "100px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
      },
    ];
    const columnStates = {
      defaultState: {
        width: 30,
        frozen: false,
        sort: "ASC",
        rowGroup: false,
      },
    };
    const expectedColumnStates = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: false,
        width: "80px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: "ASC",
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: false,
        width: "90px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: "ASC",
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: false,
        width: "100px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: "ASC",
      },
    ];

    render(<LaiDatagrid columnState={columnStates} />);

    const datagrid = screen.getByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getColumnStateBtn = screen.queryByTestId("getColumnStateBtn");
    expect(getColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getColumnStateBtn);
    });
    expect(columnStatesOutput).toEqual(initialColumnState);

    const applyColumnStateBtn = screen.queryByTestId("applyColumnStateBtn");
    expect(applyColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(applyColumnStateBtn);
      fireEvent.click(getColumnStateBtn);
    });

    expect(columnStatesOutput).toEqual(expectedColumnStates);
  });
  test("resetColumnState works correctly", () => {
    const initialColumnState = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: true,
        width: "80px",
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: true,
        width: "90px",
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: undefined,
        width: "100px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
      },
    ];
    const columnStates = {
      state: [
        {
          colId: "id",
          frozen: true,
        },
      ],
      defaultState: {
        width: 30,
        frozen: false,
        sort: "ASC",
        rowGroup: false,
      },
    };
    const expectedColumnStates = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: true,
        width: "80px",
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: false,
        width: "90px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: "ASC",
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: false,
        width: "100px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: "ASC",
      },
    ];
    const expectedResetState = [
      {
        colId: "id",
        columnIndex: 0,
        frozen: true,
        width: "80px",
        rowGroup: true,
        rowGroupIndex: null,
        sort: null,
      },
      {
        colId: "task",
        columnIndex: 1,
        frozen: false,
        width: "90px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
      },
      {
        colId: "priority",
        columnIndex: 2,
        frozen: false,
        width: "100px",
        rowGroup: false,
        rowGroupIndex: null,
        sort: null,
      },
    ];

    render(<LaiDatagrid columnState={columnStates} />);

    const datagrid = screen.getByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getColumnStateBtn = screen.queryByTestId("getColumnStateBtn");
    expect(getColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getColumnStateBtn);
    });
    expect(columnStatesOutput).toEqual(initialColumnState);

    const applyColumnStateBtn = screen.queryByTestId("applyColumnStateBtn");
    expect(applyColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(applyColumnStateBtn);
      fireEvent.click(getColumnStateBtn);
    });

    expect(columnStatesOutput).toEqual(expectedColumnStates);

    const resetColumnStateBtn = screen.queryByTestId("resetColumnStateBtn");
    expect(resetColumnStateBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(resetColumnStateBtn);
      fireEvent.click(getColumnStateBtn);
    });

    expect(columnStatesOutput).toEqual(expectedResetState);
  });
});
