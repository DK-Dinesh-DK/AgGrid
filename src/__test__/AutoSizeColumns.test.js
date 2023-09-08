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
        width: 90,
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
                data-testid="autoSizeColumnBtn"
                onClick={() => dataGridRef.current.columnApi.autoSizeColumn(props.column)}>
                autoSizeColumn
            </button>
            <button
                type="button"
                data-testid="autoSizeColumnsBtn"
                onClick={() => dataGridRef.current.columnApi.autoSizeColumns(props.columns)}>
                autoSizeColumns
            </button>
            <button
                type="button"
                data-testid="autoSizeAllColumnsBtn"
                onClick={() => dataGridRef.current.columnApi.autoSizeAllColumns()}>
                autoSizeAllColumns
            </button>
            <button
                type="button"
                data-testid="sizeColumnsToFitBtn"
                onClick={() => dataGridRef.current.columnApi.sizeColumnsToFit(props.gridWidth)}>
                sizeColumnsToFit
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
describe('AutoSizeColumns API', () => {
    test('autoSizeColumn works correctly when column is passed as object', () => {
        const column = { colId: "priority" }
        render(<LaiDatagrid column={column} />)

        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 100px" });

        const autoSizeColumnBtn = screen.queryByTestId("autoSizeColumnBtn");
        expect(autoSizeColumnBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(autoSizeColumnBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 40px" });

    })

    test('autoSizeColumn works correctly when column is passed as string', () => {
        const column = "priority"
        render(<LaiDatagrid column={column} />)

        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 100px" });

        const autoSizeColumnBtn = screen.queryByTestId("autoSizeColumnBtn");
        expect(autoSizeColumnBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(autoSizeColumnBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 40px" });

    })

    test('autoSizeColumns works correctly when column is passed as array of objects', () => {
        const columns = [{ colId:"id"},{ colId: "priority" }]
        render(<LaiDatagrid columns={columns} />)

        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 100px" });

        const autoSizeColumnsBtn = screen.queryByTestId("autoSizeColumnsBtn");
        expect(autoSizeColumnsBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(autoSizeColumnsBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "40px 90px 40px" });

    })

    test('autoSizeColumns works correctly when column is passed as array of strings', () => {
        const columns = ["task","priority"]
        render(<LaiDatagrid columns={columns} />)

        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 100px" });

        const autoSizeColumnsBtn = screen.queryByTestId("autoSizeColumnsBtn");
        expect(autoSizeColumnsBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(autoSizeColumnsBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 40px 40px" });

    })

    test('autoSizeAllColumns works correctly', () => {
     
        render(<LaiDatagrid />)

        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 100px" });

        const autoSizeAllColumnsBtn = screen.queryByTestId("autoSizeAllColumnsBtn");
        expect(autoSizeAllColumnsBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(autoSizeAllColumnsBtn);
        });

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "40px 40px 40px" });

    })

    test('sizeColumnsToFit works correctly', () => {
        const gridWidth=600
        render(<LaiDatagrid gridWidth={gridWidth}/>)

        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument();

        expect(datagrid).toHaveStyle({ gridTemplateColumns: "80px 90px 100px" });

        const sizeColumnsToFitBtn = screen.queryByTestId("sizeColumnsToFitBtn");
        expect(sizeColumnsToFitBtn).toBeInTheDocument();

        act(() => {
            fireEvent.click(sizeColumnsToFitBtn);
        });

        const columnWidths=datagrid.style.gridTemplateColumns.split(" ")
        let totalGridWidth=0;
        
        columnWidths.forEach((colWidth)=>{
            totalGridWidth+=parseInt(colWidth,10)
        })
       
        expect(totalGridWidth).toEqual(gridWidth)

    })
})