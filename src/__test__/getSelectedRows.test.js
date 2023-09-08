import { render, act, screen, fireEvent, within } from "@testing-library/react";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
import { getCellsAtRowIndex } from "./utils/utils";
let getSelectedRowsOutput;
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
                data-testid="getSelectedRowsBtn"
                onClick={() =>
                    getSelectedRowsOutput = dataGridRef.current.api.getSelectedRows()
                }>
                getSelectedRows
            </button>
            <DataGrid
                columnData={columns}
                rowData={rows}
                enableVirtualization={false}
                ref={dataGridRef}
                testId={"laidatagrid"}
                selection={true}
                rowKeyGetter={(data) => data.id}
            />
        </>
    );
}
describe('getSelectedRows', () => {
    test('getSelectedRows correctly', () => {
        let expectedSelectedRows = []
        render(<LaiDatagrid />)

        const datagrid = screen.getByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        const getSelectedRowsBtn = screen.queryByTestId("getSelectedRowsBtn")
        expect(getSelectedRowsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getSelectedRowsBtn)
        })

        expect(getSelectedRowsOutput).toHaveLength(0)

        const selectedCheckBoxes = [];

        //Selecting checkbox at rowIndex 2
        selectedCheckBoxes.push(
            within(getCellsAtRowIndex(2)[0]).getByLabelText("Select")
        );
        expect(selectedCheckBoxes[0]).not.toBeChecked();
        act(() => fireEvent.click(selectedCheckBoxes[0]));
        expect(selectedCheckBoxes[0]).toBeChecked();
        expectedSelectedRows.push(rows[2])

        act(() => {
            fireEvent.click(getSelectedRowsBtn)
        })

        expect(getSelectedRowsOutput).toEqual(expectedSelectedRows)

        //Selecting checkbox at rowIndex 6
        selectedCheckBoxes.push(
            within(getCellsAtRowIndex(6)[0]).getByLabelText("Select")
        );
        expect(selectedCheckBoxes[1]).not.toBeChecked();
        act(() => fireEvent.click(selectedCheckBoxes[1]));
        expect(selectedCheckBoxes[1]).toBeChecked();

        expectedSelectedRows.push(rows[6])

        act(() => {
            fireEvent.click(getSelectedRowsBtn)
        })

        expect(getSelectedRowsOutput).toEqual(expectedSelectedRows)

    })
})