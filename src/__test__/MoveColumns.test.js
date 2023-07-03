import { render, act, screen, fireEvent, queryAllByRole, within } from "@testing-library/react";
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
                data-testid="moveColumnBtn"
                onClick={() =>
                    dataGridRef.current.columnApi.moveColumn(props.column, props.toIndex)
                }>
                moveColumn
            </button>
            <button
                type="button"
                data-testid="moveColumnsBtn"
                onClick={() =>
                    dataGridRef.current.columnApi.moveColumns(props.columns, props.toIndex)
                }>
                moveColumn
            </button>
            <button
                type="button"
                data-testid="moveColumnByIndexBtn"
                onClick={() =>
                    dataGridRef.current.columnApi.moveColumnByIndex(props.fromIndex, props.toIndex)
                }>
                moveColumnByIndex
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
describe('MoveColumns', () => {
    test('moveColumn works correctly when column passed as string', () => {
        const column = "id"
        render(<LaiDatagrid
            column={column}
            toIndex={2}
        />)
        const moveColumnBtn = screen.queryByTestId("moveColumnBtn")
        expect(moveColumnBtn).toBeInTheDocument()

        const columnsBefore = screen.queryAllByRole("parentcolumn")
        let idColumn = columnsBefore[0]

        expect(idColumn).toHaveAttribute("aria-colindex", "1")

        act(() => {
            fireEvent.click(moveColumnBtn);
        });

        const columnsAfter = screen.queryAllByRole("parentcolumn")
        idColumn = columnsAfter[2]

        expect(idColumn).toHaveAttribute("aria-colindex", "3")
    })
    test('moveColumn works correctly when column passed as object', () => {
        const column = { colId: "task" }
        render(<LaiDatagrid
            column={column}
            toIndex={2}
        />)
        const moveColumnBtn = screen.queryByTestId("moveColumnBtn")
        expect(moveColumnBtn).toBeInTheDocument()

        const columnsBefore = screen.queryAllByRole("parentcolumn")
        let taskColumn = columnsBefore[1]

        expect(taskColumn).toHaveAttribute("aria-colindex", "2")

        act(() => {
            fireEvent.click(moveColumnBtn);
        });

        const columnsAfter = screen.queryAllByRole("parentcolumn")
        taskColumn = columnsAfter[2]

        expect(taskColumn).toHaveAttribute("aria-colindex", "3")
    })

    test('moveColumns works correctly when columns are passed as array of objects', () => {
        const columns = [{ colId: "id" }, { colId: "task" }]
        render(<LaiDatagrid
            columns={columns}
            toIndex={2}
        />)
        const moveColumnsBtn = screen.queryByTestId("moveColumnsBtn")
        expect(moveColumnsBtn).toBeInTheDocument()

        const columnsBefore = screen.queryAllByRole("parentcolumn")
        let idColumn = columnsBefore[0]
        let taskColumn = columnsBefore[1]

        expect(idColumn).toHaveAttribute("aria-colindex", "1")
        expect(taskColumn).toHaveAttribute("aria-colindex", "2")

        act(() => {
            fireEvent.click(moveColumnsBtn);
        });

        const columnsAfter = screen.queryAllByRole("parentcolumn")
        idColumn = columnsAfter[1]
        taskColumn = columnsAfter[2]

        expect(idColumn).toHaveAttribute("aria-colindex", "2")
        expect(taskColumn).toHaveAttribute("aria-colindex", "3")
    })
    test('moveColumns works correctly when columns are passed as array of strings', () => {
        const columns = ["id", "task"]
        render(<LaiDatagrid
            columns={columns}
            toIndex={2}
        />)
        const moveColumnsBtn = screen.queryByTestId("moveColumnsBtn")
        expect(moveColumnsBtn).toBeInTheDocument()

        const columnsBefore = screen.queryAllByRole("parentcolumn")
        let idColumn = columnsBefore[0]
        let taskColumn = columnsBefore[1]

        expect(idColumn).toHaveAttribute("aria-colindex", "1")
        expect(taskColumn).toHaveAttribute("aria-colindex", "2")

        act(() => {
            fireEvent.click(moveColumnsBtn);
        });

        const columnsAfter = screen.queryAllByRole("parentcolumn")
        idColumn = columnsAfter[1]
        taskColumn = columnsAfter[2]

        expect(idColumn).toHaveAttribute("aria-colindex", "2")
        expect(taskColumn).toHaveAttribute("aria-colindex", "3")
    })
    test('moveColumnByIndex works correctly', () => { 
        render(<LaiDatagrid
            fromIndex={0}
            toIndex={2}
        />)
        const moveColumnByIndexBtn = screen.queryByTestId("moveColumnByIndexBtn")
        expect(moveColumnByIndexBtn).toBeInTheDocument()

        const columnsBefore = screen.queryAllByRole("parentcolumn")
        let idColumn = columnsBefore[0]

        expect(idColumn).toHaveAttribute("aria-colindex", "1")

        act(() => {
            fireEvent.click(moveColumnByIndexBtn);
        });

        const columnsAfter = screen.queryAllByRole("parentcolumn")
        idColumn = columnsAfter[2]

        expect(idColumn).toHaveAttribute("aria-colindex", "3")

     })
})