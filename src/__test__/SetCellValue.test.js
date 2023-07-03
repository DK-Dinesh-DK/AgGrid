import { render, act, screen, fireEvent, queryAllByRole, within } from "@testing-library/react";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
import { getCellsAtRowIndex } from "./utils/utils";
let getColumnDefsOutput;
let getRowNodeOutput;
let getValueOutput;
let getFirstRenderedDataOutput;
let getDisplayedRowAtIndexOutput;
let getFirstDisplayedRowOutput;
let getLastDisplayedRowOutput;
let getDisplayedRowCountOutput;
let getRowsOutput;
let getRenderedrowsOutput;
let getRenderedNodesOutput;
let getModelOutput;
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
                data-testid="setCellValueBtn"
                onClick={() =>
                    dataGridRef.current.api.setCellValue(props.rowIndex, props.colKey, props.newValue)
                }>
                setCellValue
            </button>
            <button
                type="button"
                data-testid="getColumnDefsBtn"
                onClick={() =>
                    getColumnDefsOutput = dataGridRef.current.api.getColumnDefs()
                }>
                getColumnDefs
            </button>
            <button
                type="button"
                data-testid="updateColumnsBtn"
                onClick={() =>
                    dataGridRef.current.api.updateColumns(props.newColumns)
                }>
                updateColumns
            </button>
            <button
                type="button"
                data-testid="setColumnDefsBtn"
                onClick={() =>
                    dataGridRef.current.api.setColumnDefs(props.setColumns)
                }>
                setColumnDefs
            </button>
            <button
                type="button"
                data-testid="getRowNodeBtn"
                onClick={() =>
                    getRowNodeOutput = dataGridRef.current.api.getRowNode(props.rowIndex)
                }>
                getRowNode
            </button>
            <button
                type="button"
                data-testid="getValueBtn"
                onClick={() =>
                    getValueOutput = dataGridRef.current.api.getValue(props.colKey, props.rowNode)
                }>
                getValue
            </button>
            <button
                type="button"
                data-testid="getFirstRenderedDataBtn"
                onClick={() =>
                    getFirstRenderedDataOutput = dataGridRef.current.api.getFirstRenderedData()
                }>
                getFirstRenderedData
            </button>
            <button
                type="button"
                data-testid="getDisplayedRowAtIndexBtn"
                onClick={() =>
                    getDisplayedRowAtIndexOutput = dataGridRef.current.api.getDisplayedRowAtIndex(props.rowIndex)
                }>
                getDisplayedRowAtIndex
            </button>
            <button
                type="button"
                data-testid="getDisplayedRowCountBtn"
                onClick={() =>
                    getDisplayedRowCountOutput = dataGridRef.current.api.getDisplayedRowCount()
                }>
                getDisplayedRowCount
            </button>
            <button
                type="button"
                data-testid="getFirstDisplayedRowBtn"
                onClick={() =>
                    getFirstDisplayedRowOutput = dataGridRef.current.api.getFirstDisplayedRow()
                }>
                getFirstDisplayedRow
            </button>
            <button
                type="button"
                data-testid="getLastDisplayedRowBtn"
                onClick={() =>
                    getLastDisplayedRowOutput = dataGridRef.current.api.getLastDisplayedRow()
                }>
                getLastDisplayedRow
            </button>

            <button
                type="button"
                data-testid="getRowsBtn"
                onClick={() =>
                    getRowsOutput = dataGridRef.current.api.getRows()
                }>
                getRows
            </button>
            <button
                type="button"
                data-testid="getRenderedrowsBtn"
                onClick={() =>
                    getRenderedrowsOutput = dataGridRef.current.api.getRenderedrows()
                }>
                getRenderedrows
            </button>
            <button
                type="button"
                data-testid="getRenderedNodesBtn"
                onClick={() =>
                    getRenderedNodesOutput = dataGridRef.current.api.getRenderedNodes()
                }>
                getRenderedNodes
            </button>
            <button
                type="button"
                data-testid="getModelBtn"
                onClick={() =>
                    getModelOutput = dataGridRef.current.api.getModel()
                }>
                getModel
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
describe('GridAPI', () => {
    test('setCellValue and getFirstRenderedData work correctly', () => {
        const expectedFirstData = [{ id: 1, task: 'Task #1', priority: 'Low' },
        { id: 2, task: 'Task #2', priority: 'Medium' },
        { id: 3, task: 'Task #3', priority: 'High' },
        { id: 4, task: 'Task #4', priority: 'Medium' },
        { id: 5, task: 'Task #5', priority: 'Low' },
        { id: 6, task: 'Task #6', priority: 'High' },
        { id: 7, task: 'Task #7', priority: 'Critical' }]
        render(<LaiDatagrid
            rowIndex={2}
            colKey={"task"}
            newValue="Coding"
        />)

        const datagrid = screen.getByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        const getFirstRenderedDataBtn = screen.queryByTestId("getFirstRenderedDataBtn")
        expect(getFirstRenderedDataBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getFirstRenderedDataBtn)
        })

        expect(getFirstRenderedDataOutput).toEqual(rows)
        let cellValue = getCellsAtRowIndex(2)[1]
        expect(cellValue).toHaveTextContent("Task #3")

        const setCellValueBtn = screen.queryByTestId("setCellValueBtn")
        expect(setCellValueBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(setCellValueBtn)
        })

        expect(cellValue).toHaveTextContent("Coding")
    })
    test('getColumnDefs,setColumnDefs and updateColumns work correctly', () => {
        const initialColumnDefs = [
            {
                field: 'id',
                headerName: 'ID',
                width: 80,
                depth: 0,
                topHeader: 'id',
                haveChildren: false,
                children: false
            },
            {
                field: 'task',
                headerName: 'Title',
                depth: 0,
                topHeader: 'task',
                haveChildren: false,
                children: false
            },
            {
                field: 'priority',
                headerName: 'Priority',
                depth: 0,
                topHeader: 'priority',
                haveChildren: false,
                children: false
            }
        ]
        const columnDefsAfterUpdate = [
            { field: 'id', headerName: 'ID', width: 80, depth: 0 },
            { field: 'task', headerName: 'Title', depth: 0 },
            { field: 'priority', headerName: 'Priority', depth: 0 },
            { field: 'completion', headerName: 'Complete %' }
        ]
        const newColumns = [...columns, { field: "completion", headerName: "Complete %" }]
        const setColumns = [{ field: "id" }, { field: "name" }]
        const columnDefsAfterSetColumns = [{ field: 'id' }, { field: 'name' }]
        render(<LaiDatagrid newColumns={newColumns} setColumns={setColumns} />)
        const datagrid = screen.queryByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        const getColumnDefsBtn = screen.queryByTestId("getColumnDefsBtn")
        expect(getColumnDefsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getColumnDefsBtn)
        })

        expect(getColumnDefsOutput).toEqual(initialColumnDefs)

        const updateColumnsBtn = screen.queryByTestId("updateColumnsBtn")
        expect(updateColumnsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(updateColumnsBtn)
        })

        act(() => {
            fireEvent.click(getColumnDefsBtn)
        })
        expect(getColumnDefsOutput).toEqual(columnDefsAfterUpdate)

        const setColumnDefsBtn = screen.queryByTestId("setColumnDefsBtn")
        expect(setColumnDefsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(setColumnDefsBtn)
            fireEvent.click(getColumnDefsBtn)
        })

        act(() => {
            fireEvent.click(getColumnDefsBtn)
        })

        expect(getColumnDefsOutput).toEqual(columnDefsAfterSetColumns)
    })
    test('getRowNode and getValue work correctly', () => {
        const expectedRowNode = {
            rowIndex: 2,
            data: { id: 3, task: 'Coding', priority: 'High' }
        }
        render(<LaiDatagrid
            rowIndex={2}
            colKey={"priority"}
            rowNode={{ rowIndex: 2, data: { id: 3, task: 'Coding', priority: 'High' } }}
        />)

        const datagrid = screen.queryByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        const getRowNodeBtn = screen.queryByTestId("getRowNodeBtn")
        expect(getRowNodeBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getRowNodeBtn)
        })

        expect(getRowNodeOutput).toEqual(expect.objectContaining(expectedRowNode))

        const getValueBtn = screen.queryByTestId("getValueBtn")
        expect(getValueBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getValueBtn)
        })

        expect(getValueOutput).toBe("High")
    })
    test('getDisplayedRowCount,getDisplayedRowAtIndex,getFirstDisplayedRow and getLastDisplayedRow work correctly', () => {
        const expectedRowCount = 7;
        const expectedFirstRow = rows[0]
        const expectedLastRow = rows[rows.length - 1]
        const expectedRowAtIndex = rows[3]
        render(<LaiDatagrid rowIndex={3} />)


        const datagrid = screen.getByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        const getDisplayedRowCountBtn = screen.queryByTestId("getDisplayedRowCountBtn")
        expect(getDisplayedRowCountBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getDisplayedRowCountBtn)
        })

        expect(getDisplayedRowCountOutput).toEqual(expectedRowCount)

        const getFirstDisplayedRowBtn = screen.queryByTestId("getFirstDisplayedRowBtn")
        expect(getFirstDisplayedRowBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getFirstDisplayedRowBtn)
        })

        expect(getFirstDisplayedRowOutput).toEqual(expectedFirstRow)

        const getLastDisplayedRowBtn = screen.queryByTestId("getLastDisplayedRowBtn")
        expect(getLastDisplayedRowBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getLastDisplayedRowBtn)
        })

        expect(getLastDisplayedRowOutput).toEqual(expectedLastRow)

        const getDisplayedRowAtIndexBtn = screen.queryByTestId("getDisplayedRowAtIndexBtn")
        expect(getDisplayedRowAtIndexBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getDisplayedRowAtIndexBtn)
        })

        expect(getDisplayedRowAtIndexOutput).toEqual(expectedRowAtIndex)
    })
    test('getRows, getRenderedrows, getRenderedNodes and getModel work correctly', () => {
        const expectedRenderedNodes = [
            {
                rowIndex: 0,
                rowTop: 0,
                childIndex: 1,
                data: { id: 1, task: 'Task #1', priority: 'Low' },
                rowHeight: 24,
                lastChild: false,
                firstChild: true,
                id: 1,
                selected: false,
                setDataValue: expect.any(Function),
                setData: expect.any(Function),
                parent: expect.any(Object),
                updateData: expect.any(Function),
                expanded: undefined,
                isSelected: expect.any(Function),
                setSelected: expect.any(Function),
                isExpandable: expect.any(Function),
                setExpanded: expect.any(Function)
            },
            {
                rowIndex: 1,
                rowTop: 24,
                childIndex: 2,
                data: { id: 2, task: 'Task #2', priority: 'Medium' },
                rowHeight: 24,
                lastChild: false,
                firstChild: false,
                id: 2,
                selected: false,
                setDataValue: expect.any(Function),
                setData: expect.any(Function),
                parent: expect.any(Object),
                updateData: expect.any(Function),
                expanded: undefined,
                isSelected: expect.any(Function),
                setSelected: expect.any(Function),
                isExpandable: expect.any(Function),
                setExpanded: expect.any(Function)
            },
            {
                rowIndex: 2,
                rowTop: 48,
                childIndex: 3,
                data: { id: 3, task: 'Coding', priority: 'High' },
                rowHeight: 24,
                lastChild: false,
                firstChild: false,
                id: 3,
                selected: false,
                setDataValue: expect.any(Function),
                setData: expect.any(Function),
                parent: expect.any(Object),
                updateData: expect.any(Function),
                expanded: undefined,
                isSelected: expect.any(Function),
                setSelected: expect.any(Function),
                isExpandable: expect.any(Function),
                setExpanded: expect.any(Function)
            },
            {
                rowIndex: 3,
                rowTop: 72,
                childIndex: 4,
                data: { id: 4, task: 'Task #4', priority: 'Medium' },
                rowHeight: 24,
                lastChild: false,
                firstChild: false,
                id: 4,
                selected: false,
                setDataValue: expect.any(Function),
                setData: expect.any(Function),
                parent: expect.any(Object),
                updateData: expect.any(Function),
                expanded: undefined,
                isSelected: expect.any(Function),
                setSelected: expect.any(Function),
                isExpandable: expect.any(Function),
                setExpanded: expect.any(Function)
            },
            {
                rowIndex: 4,
                rowTop: 96,
                childIndex: 5,
                data: { id: 5, task: 'Task #5', priority: 'Low' },
                rowHeight: 24,
                lastChild: false,
                firstChild: false,
                id: 5,
                selected: false,
                setDataValue: expect.any(Function),
                setData: expect.any(Function),
                parent: expect.any(Object),
                updateData: expect.any(Function),
                expanded: undefined,
                isSelected: expect.any(Function),
                setSelected: expect.any(Function),
                isExpandable: expect.any(Function),
                setExpanded: expect.any(Function)
            },
            {
                rowIndex: 5,
                rowTop: 120,
                childIndex: 6,
                data: { id: 6, task: 'Task #6', priority: 'High' },
                rowHeight: 24,
                lastChild: false,
                firstChild: false,
                id: 6,
                selected: false,
                setDataValue: expect.any(Function),
                setData: expect.any(Function),
                parent: expect.any(Object),
                updateData: expect.any(Function),
                expanded: undefined,
                isSelected: expect.any(Function),
                setSelected: expect.any(Function),
                isExpandable: expect.any(Function),
                setExpanded: expect.any(Function)
            },
            {
                rowIndex: 6,
                rowTop: 144,
                childIndex: 7,
                data: { id: 7, task: 'Task #7', priority: 'Critical' },
                rowHeight: 24,
                lastChild: true,
                firstChild: false,
                id: 7,
                selected: false,
                setDataValue: expect.any(Function),
                setData: expect.any(Function),
                parent: expect.any(Object),
                updateData: expect.any(Function),
                expanded: undefined,
                isSelected: expect.any(Function),
                setSelected: expect.any(Function),
                isExpandable: expect.any(Function),
                setExpanded: expect.any(Function)
            }
        ]
        const expectedModel = {
            getRow: expect.any(Function),
            getRowNode: expect.any(Function),
            getRowCount: expect.any(Function),
            getTopLevelRowCount: expect.any(Function),
            getTopLevelRowDisplayedIndex: expect.any(Function),
            getRowIndexAtPixel: expect.any(Function),
            isRowPresent: expect.any(Function),
            getRowBounds: expect.any(Function),
            isEmpty: expect.any(Function),
            isRowsToRender: expect.any(Function),
            getNodesInRangeForSelection: expect.any(Function),
            forEachNode: expect.any(Function),
            getType: expect.any(Function),
            isLastRowIndexKnown: expect.any(Function)
        }
        render(<LaiDatagrid />)

        const datagrid = screen.getByTestId("laidatagrid")
        expect(datagrid).toBeInTheDocument()

        //getRows
        const getRowsBtn = screen.queryByTestId("getRowsBtn")
        expect(getRowsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getRowsBtn)
        })

        expect(getRowsOutput).toEqual(rows)

        //getRenderedrows
        const getRenderedrowsBtn = screen.queryByTestId("getRenderedrowsBtn")
        expect(getRenderedrowsBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getRenderedrowsBtn)
        })

        expect(getRenderedrowsOutput).toEqual(rows)

        //getRenderedNodes
        const getRenderedNodesBtn = screen.queryByTestId("getRenderedNodesBtn")
        expect(getRenderedNodesBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getRenderedNodesBtn)
        })

        expect(getRenderedNodesOutput).toEqual(expect.arrayContaining(expectedRenderedNodes))

        //getModel
        const getModelBtn = screen.queryByTestId("getModelBtn")
        expect(getModelBtn).toBeInTheDocument()

        act(() => {
            fireEvent.click(getModelBtn)
        })

        console.log('getModelOutput.getRow() :>> ', getModelOutput.getRow(2));
        expect(getModelOutput).toEqual(expect.objectContaining(expectedModel))

        expect(getModelOutput.getRow(2)).toEqual(expectedRenderedNodes[2])
        expect(getModelOutput.getRowNode(3)[0]).toEqual(expect.objectContaining(expectedRenderedNodes[2]))
        expect(getModelOutput.getRowCount()).toEqual(7)
        expect(getModelOutput.getTopLevelRowCount()).toEqual(7)

        expect(getModelOutput.getTopLevelRowDisplayedIndex(5)).toEqual(5)
        expect(getModelOutput.getTopLevelRowDisplayedIndex(8)).toBeNull()

        expect(getModelOutput.getRowIndexAtPixel(100)).toEqual(4)

        expect(getModelOutput.isEmpty()).toBeFalsy()
        expect(getModelOutput.isRowsToRender()).toBeTruthy()

        expect(getModelOutput.getType()).toBe("clientSide")
        expect(getModelOutput.isLastRowIndexKnown()).toBeTruthy()
        expect(getModelOutput.getRowBounds(3)).toEqual({ rowTop: 72, rowHeight: 24 })

    })
})