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
                rowKeyGetter={data => data.id}
            />
        </>
    );
}
describe('GridAPI', () => {
    test('applyTransaction works correctly', () => {
        const transactionObject = {
            addIndex: 2,
            add: [
                { id: 8, task: "Coding", priority: "High" },
                { id: 9, task: "Debugging", priority: "Critical" }
            ],
            update: [
                { id: 2, task: "Bug solving", priority: "Very High" },
            ],
            remove: [
                { id: 5, task: "Task #5", priority: "Low" },
                { id: 6, task: "Task #6", priority: "High" },
            ]
        }
        const expectedObject = {
            added: [
                {
                    rowIndex: 3,
                    childIndex: 4,
                    data: expect.any(Object),
                    rowHeight: 24,
                    lastChild: false,
                    firstChild: false,
                    id: 8
                },
                {
                    rowIndex: 4,
                    childIndex: 5,
                    data: expect.any(Object),
                    rowHeight: 24,
                    lastChild: false,
                    firstChild: false,
                    id: 9
                }
            ],
            updated: [
                {
                    rowIndex: 1,
                    childIndex: 2,
                    data: expect.any(Object),
                    rowHeight: 24,
                    lastChild: false,
                    firstChild: false,
                    id: 2
                }
            ],
            removed: [
                {
                    rowIndex: 3,
                    childIndex: 4,
                    data: expect.any(Object),
                    rowHeight: 24,
                    lastChild: false,
                    firstChild: false,
                    id: 4
                },
                {
                    rowIndex: 4,
                    childIndex: 5,
                    data: expect.any(Object),
                    rowHeight: 24,
                    lastChild: false,
                    firstChild: false,
                    id: 9
                }
            ]
        }
        render(<LaiDatagrid
            transactionObject={transactionObject}
        />)

        const datagrid = screen.queryByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        const getRowsBtn = screen.queryByTestId("getRowsBtn")
        expect(getRowsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getRowsBtn)
        })

        expect(getRowsOutput).toEqual(rows)

        const applyTransactionBtn = screen.queryByTestId("applyTransactionBtn")
        expect(applyTransactionBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(applyTransactionBtn)
            fireEvent.click(getRowsBtn)
        })

        expect(applyTransactionOutput).toEqual(expectedObject)

    })
})