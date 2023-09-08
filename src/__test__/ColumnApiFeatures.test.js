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
        data-testid="sizeColumnsToFit"
        onClick={() => dataGridRef.current.columnApi.sizeColumnsToFit(600)}
      >
        sizeColumnsToFit
      </button>
      <button
        type="button"
        data-testid="autoSizeAllColumns"
        onClick={() => dataGridRef.current.columnApi.autoSizeAllColumns()}
      >
        autoSizeAllColumns
      </button>
      <button
        type="button"
        data-testid="autoSizeColumn"
        onClick={() => dataGridRef.current.columnApi.autoSizeColumn("priority")}
      >
        autoSizeColumn
      </button>
      <button
        type="button"
        data-testid="autoSizeColumns"
        onClick={() =>
          dataGridRef.current.columnApi.autoSizeColumns(["priority", "task"])
        }
      >
        autoSizeColumns
      </button>
      <button
        type="button"
        data-testid="setColumnWidth"
        onClick={() =>
          dataGridRef.current.columnApi.setColumnWidth("priority", 300)
        }
      >
        setColumnWidth
      </button>
      <button
        type="button"
        data-testid="setColumnsWidth"
        onClick={() =>
          dataGridRef.current.columnApi.setColumnsWidth([
            { key: "priority", newWidth: 200 },
            { key: "task", newWidth: 200 },
          ])
        }
      >
        setColumnsWidth
      </button>

      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
        ref={dataGridRef}
        testId={"laidatagrid"}
        rowSelection={"multiple"}
        direction={"rtl"}
        {...props}
      />
    </>
  );
}
describe("GridAPI - column APIs", () => {
  test("sizeColumnsToFit", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const sizeColumnsToFitBtn = screen.getByTestId("sizeColumnsToFit");
    expect(sizeColumnsToFitBtn).toBeInTheDocument();
    act(() => fireEvent.click(sizeColumnsToFitBtn));
  });
  test("autoSizeAllColumns", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const autoSizeAllColumnsBtn = screen.getByTestId("autoSizeAllColumns");
    expect(autoSizeAllColumnsBtn).toBeInTheDocument();
    act(() => fireEvent.click(autoSizeAllColumnsBtn));
  });
  test("autoSizeColumn", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const autoSizeColumnBtn = screen.getByTestId("autoSizeColumn");
    expect(autoSizeColumnBtn).toBeInTheDocument();
    act(() => fireEvent.click(autoSizeColumnBtn));
  });
  test("autoSizeColumns", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const autoSizeColumnsBtn = screen.getByTestId("autoSizeColumns");
    expect(autoSizeColumnsBtn).toBeInTheDocument();
    act(() => fireEvent.click(autoSizeColumnsBtn));
  });
  test("setColumnWidth", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const setColumnWidthBtn = screen.getByTestId("setColumnWidth");
    expect(setColumnWidthBtn).toBeInTheDocument();
    act(() => fireEvent.click(setColumnWidthBtn));
  });
  test("setColumnsWidth", () => {
    render(<LaiDatagrid />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const setColumnsWidthBtn = screen.getByTestId("setColumnsWidth");
    expect(setColumnsWidthBtn).toBeInTheDocument();
    act(() => fireEvent.click(setColumnsWidthBtn));
  });
});
