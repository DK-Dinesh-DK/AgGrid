import {
    render,
    act,
    screen,
    fireEvent,
    queryAllByRole,
    within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
import { queryHeaderCells } from "./utils/utils";
beforeAll(() => {
    userEvent.setup();
    window.HTMLElement.prototype.scrollIntoView = function () { };
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
                data-testid="setColumnWidthBtn"
                onClick={() =>
                    dataGridRef.current.columnApi.setColumnWidth(
                        props.column,
                        props.columnWidth
                    )
                }>
                setColumnWidth
            </button>
            <button
                type="button"
                data-testid="setColumnsWidthBtn"
                onClick={() =>
                    dataGridRef.current.columnApi.setColumnsWidth(
                        props.columns,

                    )
                }>
                setColumnsWidth
            </button>

            <DataGrid
                columnData={columns}
                rowData={rows}
                enableVirtualization={false}
                ref={dataGridRef}
                testId={"laidatagrid"}
            />
        </>
    );
}
describe("ColumnWidth APIs", () => {
    test("setColumnWidth works properly when column is passed as object", () => {
        const column = { colId: "id" };
        render(<LaiDatagrid column={column} columnWidth={40} />);
        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 40px 40px" });

        const setColumnWidthBtn = screen.queryByTestId("setColumnWidthBtn");
        expect(setColumnWidthBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(setColumnWidthBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "40px 40px 40px" });
    });
    test('setColumnWidth works properly when column is passed as string', () => {
        const column = "task";
        render(<LaiDatagrid column={column} columnWidth={80} />);
        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 40px 40px" });

        const setColumnWidthBtn = screen.queryByTestId("setColumnWidthBtn");
        expect(setColumnWidthBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(setColumnWidthBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 80px 40px" });
    })
    test('setColumnsWidth works properly when columnKey is passed as an object', () => {
        const columns =[
            {
                key:{colId:"id"},
                newWidth:40,
            },
            {
                key:{colId:"priority"},
                newWidth:80,
            }
        ]
        render(<LaiDatagrid columns={columns} />);
        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 40px 40px" });

        const setColumnsWidthBtn = screen.queryByTestId("setColumnsWidthBtn");
        expect(setColumnsWidthBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(setColumnsWidthBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "40px 40px 80px" });
    })
    test('setColumnsWidth works properly when columnKey is passed as an string', () => {
        const columns =[
            {
                key:"task",
                newWidth:50,
            },
            {
                key:"priority",
                newWidth:80,
            }
        ]
        render(<LaiDatagrid columns={columns} />);
        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 40px 40px" });

        const setColumnsWidthBtn = screen.queryByTestId("setColumnsWidthBtn");
        expect(setColumnsWidthBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(setColumnsWidthBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 50px 80px" });
    })
});
