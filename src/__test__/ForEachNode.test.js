import { render, act, screen, fireEvent, queryAllByRole, within } from "@testing-library/react";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
import { getCellsAtRowIndex } from "./utils/utils";
let getRowsOutput;
let applyTransactionOutput;
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
                data-testid="forEachNodeBtn"
                onClick={() =>
                    dataGridRef.current.api.forEachNode(props.callbackFunctionOne)
                }>
                forEachNode
            </button>
            <button
                type="button"
                data-testid="forEachLeafNodeBtn"
                onClick={() =>
                    dataGridRef.current.api.forEachLeafNode(props.callbackFunctionTwo)
                }>
                forEachLeafNode
            </button>
            <button
                type="button"
                data-testid="applyTransactionBtn"
                onClick={() =>
                    applyTransactionOutput = dataGridRef.current.api.applyTransaction(props.transactionObject)
                }>
                applyTransaction
            </button>
            <button
                type="button"
                data-testid="getRowsBtn"
                onClick={() =>
                    getRowsOutput = dataGridRef.current.api.getRows()
                }>
                getRows
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
describe('GridAPI', () => {
    test('forEachNode and forEachLeafNode work correctly', () => {
      
        render(<LaiDatagrid
            callbackFunctionOne={(node) => node.data.task = "Coding"}
            callbackFunctionTwo={(node) => { if (node.data.id === 4) node.data.task = "Debugging" }}
        />)

        const datagrid = screen.queryByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        const getRowsBtn = screen.queryByTestId("getRowsBtn")
        expect(getRowsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getRowsBtn)
        })

        expect(getRowsOutput).toEqual(rows)


        const forEachNodeBtn = screen.queryByTestId("forEachNodeBtn")
        expect(forEachNodeBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(forEachNodeBtn)
            fireEvent.click(getRowsBtn)

        })

        getRowsOutput.forEach((row) => expect(row.task).toEqual("Coding"))

        const forEachLeafNodeBtn = screen.queryByTestId("forEachLeafNodeBtn")
        expect(forEachLeafNodeBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(forEachLeafNodeBtn)
            fireEvent.click(getRowsBtn)

        })
        getRowsOutput.forEach((row) => {
            if (row.id === 4)
                expect(row.task).toEqual("Debugging")
        })
    })
})