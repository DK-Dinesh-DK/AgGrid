import { render, act, screen, fireEvent } from "@testing-library/react";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    filter: true,
  },
  {
    field: "task",
    headerName: "Title",
    sortable: true,
  },
  {
    field: "priority",
    headerName: "Priority",
  },
];
const rows = [
  { id: 1, task: "Task #1", priority: "Low", key: 1 },
  { id: 2, task: "Task #2", priority: "Medium", key: 2 },
  { id: 3, task: "Task #3", priority: "High", key: 3 },
  { id: 4, task: "Task #4", priority: "Medium", key: 4 },
  { id: 5, task: "Task #5", priority: "Low", key: 5 },
  { id: 6, task: "Task #6", priority: "High", key: 6 },
  { id: 7, task: "Task #7", priority: "Critical", key: 7 },
];
function LaiDatagrid(props) {
  const dataGridRef = useRef(null);
  return (
    <>
      <button
        type="button"
        data-testid="selectAllFiltered"
        onClick={() => dataGridRef.current.api.selectAllFiltered()}
      >
        selectAllFiltered
      </button>

      <button
        type="button"
        data-testid="deselectAllFiltered"
        onClick={() => dataGridRef.current.api.deselectAllFiltered()}
      >
        deselectAllFiltered
      </button>

      <button
        type="button"
        data-testid="setSuppressPagination"
        onClick={() => dataGridRef.current.api.setSuppressPagination(false)}
      >
        setSuppressPagination
      </button>
      <button
        type="button"
        data-testid="setHeaderHeight"
        onClick={() => dataGridRef.current.api.setHeaderHeight(30)}
      >
        setHeaderHeight
      </button>
      <button
        type="button"
        data-testid="forEachLeafNodeAfterFilterAndSort("
        onClick={() =>
          dataGridRef.current.api.forEachLeafNodeAfterFilterAndSort((params) =>
            console.log(params)
          )
        }
      >
        forEachLeafNodeAfterFilterAndSort
      </button>
      <button
        type="button"
        data-testid="forEachLeafNodeAfterFilter"
        onClick={() =>
          dataGridRef.current.api.forEachLeafNodeAfterFilter((params) =>
            console.log(params)
          )
        }
      >
        forEachLeafNodeAfterFilter
      </button>
      <button
        type="button"
        data-testid="setRowData"
        onClick={() =>
          dataGridRef.current.api.setRowData([
            ...rows,
            { id: 17, task: "Task #17", priority: "Critical", key: 17 },
          ])
        }
      >
        setRowData
      </button>
      <button
        data-testid="addItem-false"
        onClick={() => {
          dataGridRef.current.api.addItem(
            { id: 7, task: "Task #7", priority: "Critical", key: 8 },
            false
          );
        }}
      >
        AddItem
      </button>
      <button
        data-testid="addItem-nothing"
        onClick={() => {
          dataGridRef.current.api.addItem({
            id: 7,
            task: "Task #7",
            priority: "Critical",
            key: 8,
          });
        }}
      >
        AddItem
      </button>
      <button
        data-testid="addItems-false"
        onClick={() => {
          dataGridRef.current.api.addItems(
            [
              { id: 7, task: "Task #7", priority: "Critical", key: 8 },
              { id: 8, task: "Task #8", priority: "Critical", key: 9 },
            ],
            false
          );
        }}
      >
        AddItems
      </button>
      <button
        data-testid="addItems-nothing"
        onClick={() => {
          dataGridRef.current.api.addItems([
            { id: 7, task: "Task #7", priority: "Critical", key: 8 },
            { id: 8, task: "Task #8", priority: "Critical", key: 9 },
          ]);
        }}
      >
        AddItems
      </button>

      <button
        data-testid="removeItem"
        onClick={() => {
          dataGridRef.current.api.removeItem({
            id: 7,
            task: "Task #7",
            priority: "Critical",
          });
        }}
      >
        RemoveItem
      </button>

      <button
        data-testid="removeItems"
        onClick={() => {
          dataGridRef.current.api.removeItems([
            { id: 7, task: "Task #7", priority: "Critical" },
            { id: 8, task: "Task #8", priority: "Critical" },
          ]);
        }}
      >
        RemoveItems
      </button>
      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
        innerRef={dataGridRef}
        testId={"laidatagrid"}
        rowSelection={"multiple"}
        {...props}
      />
    </>
  );
}
describe("GridAPI - Filtering APIs", () => {
  test("selectAllFiltered and deselectAllFiltered", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const selectAllFilteredBtn = screen.getByTestId("selectAllFiltered");
    expect(selectAllFilteredBtn).toBeInTheDocument();
    act(() => fireEvent.click(selectAllFilteredBtn));
    const deselectAllFilteredBtn = screen.getByTestId("deselectAllFiltered");
    expect(deselectAllFilteredBtn).toBeInTheDocument();
    act(() => fireEvent.click(deselectAllFilteredBtn));
  });
  test("selectAllFiltered and deselectAllFiltered with onSelectedRowsChange", async () => {
    render(
      <LaiDatagrid onSelectedRowsChange={(params) => console.log(params)} />
    );

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const selectAllFilteredBtn = screen.getByTestId("selectAllFiltered");
    expect(selectAllFilteredBtn).toBeInTheDocument();
    act(() => fireEvent.click(selectAllFilteredBtn));
    const deselectAllFilteredBtn = screen.getByTestId("deselectAllFiltered");
    expect(deselectAllFilteredBtn).toBeInTheDocument();
    act(() => fireEvent.click(deselectAllFilteredBtn));
  });
  test("setSuppressPagination", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const setSuppressPaginationBtn = screen.getByTestId(
      "setSuppressPagination"
    );
    expect(setSuppressPaginationBtn).toBeInTheDocument();
    act(() => fireEvent.click(setSuppressPaginationBtn));
  });
  test("setHeaderHeight", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const setHeaderHeightBtn = screen.getByTestId("setHeaderHeight");
    expect(setHeaderHeightBtn).toBeInTheDocument();
    act(() => fireEvent.click(setHeaderHeightBtn));
  });
  test("forEachLeafNodeAfterFilterAndSort", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const forEachLeafNodeAfterFilterAndSortBtn = screen.getByTestId(
      "forEachLeafNodeAfterFilterAndSort("
    );
    expect(forEachLeafNodeAfterFilterAndSortBtn).toBeInTheDocument();
    act(() => fireEvent.click(forEachLeafNodeAfterFilterAndSortBtn));
  });
  test("forEachLeafNodeAfterFilter", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const forEachLeafNodeAfterFilterBtn = screen.getByTestId(
      "forEachLeafNodeAfterFilter"
    );
    expect(forEachLeafNodeAfterFilterBtn).toBeInTheDocument();
    act(() => fireEvent.click(forEachLeafNodeAfterFilterBtn));
  });
  test("setRowData", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const setRowDataBtn = screen.getByTestId("setRowData");
    expect(setRowDataBtn).toBeInTheDocument();
    act(() => fireEvent.click(setRowDataBtn));
  });
  test("addItem", async () => {
    render(<LaiDatagrid rowKeyGetter={(row) => row.key} />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const addItemfalseBtn = screen.getByTestId("addItem-false");
    expect(addItemfalseBtn).toBeInTheDocument();
    act(() => fireEvent.click(addItemfalseBtn));
    const addItemNtgBtn = screen.getByTestId("addItem-nothing");
    expect(addItemNtgBtn).toBeInTheDocument();
    act(() => fireEvent.click(addItemNtgBtn));
  });
  test("addItems", async () => {
    render(<LaiDatagrid rowKeyGetter={(row) => row.key} />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const addItemsfalseBtn = screen.getByTestId("addItems-false");
    expect(addItemsfalseBtn).toBeInTheDocument();
    act(() => fireEvent.click(addItemsfalseBtn));
    const addItemsNtgBtn = screen.getByTestId("addItems-nothing");
    expect(addItemsNtgBtn).toBeInTheDocument();
    act(() => fireEvent.click(addItemsNtgBtn));
  });
  test("removeItem", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const removeItemBtn = screen.getByTestId("removeItem");
    expect(removeItemBtn).toBeInTheDocument();
    act(() => fireEvent.click(removeItemBtn));
  });
  test("removeItems", async () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const removeItemsBtn = screen.getByTestId("removeItems");
    expect(removeItemsBtn).toBeInTheDocument();
    act(() => fireEvent.click(removeItemsBtn));
  });
});
