import { render, act, screen, fireEvent } from "@testing-library/react";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
let getRenderedrowsOutput;
let getFilterModelOutput;
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
        data-testid="setQuickFilterBtn"
        onClick={() =>
          dataGridRef.current.api.setQuickFilter(props.filterString)
        }
      >
        setQuickFilter
      </button>
      <button
        type="button"
        data-testid="getRenderedrowsBtn"
        onClick={() =>
          (getRenderedrowsOutput = dataGridRef.current.api.getRenderedrows())
        }
      >
        getRenderedrows
      </button>
      <button
        type="button"
        data-testid="getFilterModelBtn"
        onClick={() =>
          (getFilterModelOutput = dataGridRef.current.api.getFilterModel())
        }
      >
        getFilterModel
      </button>
      <button
        type="button"
        data-testid="setFilterModelBtn"
        onClick={() =>
          dataGridRef.current.api.setFilterModel(props.filterModel)
        }
      >
        setFilterModel
      </button>
      <button
        type="button"
        data-testid="isColumnFilterPresent"
        onClick={() => dataGridRef.current.api.isColumnFilterPresent()}
      >
        isColumnFilterPresent
      </button>
      <button
        type="button"
        data-testid="isAnyFilterPresent"
        onClick={() => dataGridRef.current.api.isAnyFilterPresent()}
      >
        isAnyFilterPresent
      </button>
      <button
        type="button"
        data-testid="setColumnDefs"
        onClick={() =>
          dataGridRef.current.api.setColumnDefs([
            ...columns,
            { headerName: "New Column", field: "newColumn", filter: true },
          ])
        }
      >
        setColumnDefs
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
describe("GridAPI - Filtering APIs", () => {
  test("setQuickFilter works correctly", () => {
    const filterString = "high";
    const expectedRowsAfterFilter = [
      { id: 3, task: "Task #3", priority: "High" },
      { id: 6, task: "Task #6", priority: "High" },
    ];
    render(<LaiDatagrid filterString={filterString} />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRenderedrowsBtn = screen.queryByTestId("getRenderedrowsBtn");
    expect(getRenderedrowsBtn).toBeInTheDocument();

    act(() => fireEvent.click(getRenderedrowsBtn));

    expect(getRenderedrowsOutput).toEqual(rows);

    const setQuickFilterBtn = screen.queryByTestId("setQuickFilterBtn");
    expect(setQuickFilterBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setQuickFilterBtn);
    });

    act(() => fireEvent.click(getRenderedrowsBtn));

    expect(getRenderedrowsOutput).toEqual(expectedRowsAfterFilter);
  });
  test("getFilterModel,setFilterModel work correctly", () => {
    const filterString = "high";
    const initialFilterModel = {
      id: "",
      task: "",
      priority: "",
      undefined: "",
      enabled: true,
    };
    const expectedFilterModel = {
      id: "",
      task: "Task #2",
      priority: "",
      undefined: "",
      enabled: true,
    };
    render(
      <LaiDatagrid
        filterString={filterString}
        filterModel={{ task: "Task #2" }}
      />
    );

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRenderedrowsBtn = screen.queryByTestId("getRenderedrowsBtn");
    expect(getRenderedrowsBtn).toBeInTheDocument();

    act(() => fireEvent.click(getRenderedrowsBtn));

    expect(getRenderedrowsOutput).toEqual(rows);

    const getFilterModelBtn = screen.queryByTestId("getFilterModelBtn");
    expect(getFilterModelBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getFilterModelBtn);
    });

    expect(getFilterModelOutput).toEqual(initialFilterModel);

    const setFilterModelBtn = screen.queryByTestId("setFilterModelBtn");
    expect(setFilterModelBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setFilterModelBtn);
    });
    act(() => {
      fireEvent.click(getRenderedrowsBtn);
      fireEvent.click(getFilterModelBtn);
    });

    expect(getRenderedrowsOutput).toEqual([...rows[1]]);
    expect(getFilterModelOutput).toEqual(expectedFilterModel);
  });
  test("isColumnFilterPresent", () => {
    render(<LaiDatagrid filterModel={{ task: "Task #2" }} />);

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const isColumnFilterPresentBtn = screen.queryByTestId(
      "isColumnFilterPresent"
    );
    expect(isColumnFilterPresentBtn).toBeInTheDocument();

    act(() => fireEvent.click(isColumnFilterPresentBtn));
    const setFilterModelBtn = screen.queryByTestId("setFilterModelBtn");
    expect(setFilterModelBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setFilterModelBtn);
    });
    act(() => fireEvent.click(isColumnFilterPresentBtn));
  });
  test("isAnyFilterPresent", () => {
    const filterString = "high";
    render(
      <LaiDatagrid
        filterString={filterString}
        filterModel={{ task: "Task #2" }}
      />
    );

    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const isAnyFilterPresentBtn = screen.getByTestId("isAnyFilterPresent");
    expect(isAnyFilterPresentBtn).toBeInTheDocument();
    act(() => fireEvent.click(isAnyFilterPresentBtn));

    const setColumnDefsBtn = screen.queryByTestId("setColumnDefs");
    expect(setColumnDefsBtn).toBeInTheDocument();
    act(() => {
      fireEvent.click(setColumnDefsBtn);
    });
    act(() => fireEvent.click(isAnyFilterPresentBtn));
  });
});
