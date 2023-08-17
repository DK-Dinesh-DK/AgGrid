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
  { id: 1, task: "Task #1", priority: "Low" },
  { id: 2, task: "Task #2", priority: "Medium" },
  { id: 3, task: "Task #3", priority: "High" },
  { id: 4, task: "Task #4", priority: "Medium" },
  { id: 5, task: "Task #5", priority: "Low" },
  { id: 6, task: "Task #6", priority: "High" },
  { id: 7, task: "Task #7", priority: "Critical" },
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
        data-testid="forEachLeafNodeAfterFilter("
        onClick={() =>
          dataGridRef.current.api.forEachLeafNodeAfterFilter((params) =>
            console.log(params)
          )
        }
      >
        forEachLeafNodeAfterFilter
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
  test("selectAllFiltered and deselectAllFiltered", () => {
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
  test("selectAllFiltered and deselectAllFiltered with onSelectedRowsChange", () => {
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
  test("setSuppressPagination", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const setSuppressPaginationBtn = screen.getByTestId(
      "setSuppressPagination"
    );
    expect(setSuppressPaginationBtn).toBeInTheDocument();
    act(() => fireEvent.click(setSuppressPaginationBtn));
  });
  test("setHeaderHeight", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const setHeaderHeightBtn = screen.getByTestId("setHeaderHeight");
    expect(setHeaderHeightBtn).toBeInTheDocument();
    act(() => fireEvent.click(setHeaderHeightBtn));
  });
  test("forEachLeafNodeAfterFilterAndSort(", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const forEachLeafNodeAfterFilterAndSortBtn = screen.getByTestId(
      "forEachLeafNodeAfterFilterAndSort("
    );
    expect(forEachLeafNodeAfterFilterAndSortBtn).toBeInTheDocument();
    act(() => fireEvent.click(forEachLeafNodeAfterFilterAndSortBtn));
  });
  test("forEachLeafNodeAfterFilter(", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const forEachLeafNodeAfterFilterBtn = screen.getByTestId(
      "forEachLeafNodeAfterFilter("
    );
    expect(forEachLeafNodeAfterFilterBtn).toBeInTheDocument();
    act(() => fireEvent.click(forEachLeafNodeAfterFilterBtn));
  });
});
