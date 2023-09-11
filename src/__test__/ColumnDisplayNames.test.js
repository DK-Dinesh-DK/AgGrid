import { render, act, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import { useRef } from "react";
import "@testing-library/jest-dom";
beforeAll(() => {
    userEvent.setup();
    window.HTMLElement.prototype.scrollIntoView = function () { };
});
let displayNameForColumnOutput;
let displayedColAfterOutput;
let displayedColBeforeOutput;
let allVirtualColumnsOutput;
let allDisplayedColumnsOutput;
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
                data-testid="getDisplayNameForColumnBtn"
                onClick={() =>
                    (displayNameForColumnOutput = dataGridRef.current.columnApi.getDisplayNameForColumn(props.displayNameForColumnId, props.displayNameForColumnLocation))
                }>
                displayNameForColumn
            </button>
            <button
                type="button"
                data-testid="getDisplayedColAfterBtn"
                onClick={() =>
                    (displayedColAfterOutput = dataGridRef.current.columnApi.getDisplayedColAfter(props.displayedColAfterColumnId))
                }>
                getDisplayedColAfter
            </button>
            <button
                type="button"
                data-testid="getDisplayedColBeforeBtn"
                onClick={() =>
                    (displayedColBeforeOutput = dataGridRef.current.columnApi.getDisplayedColBefore(props.displayedColBeforeColumnId))
                }>
                getDisplayedColBefore
            </button>
            <button
                type="button"
                data-testid="getAllDisplayedVirtualColumnsBtn"
                onClick={() =>
                    (allVirtualColumnsOutput= dataGridRef.current.columnApi.getAllDisplayedVirtualColumns())
                }>
                getAllDisplayedVirtualColumns
            </button>
            <button
                type="button"
                data-testid="getAllDisplayedColumnsBtn"
                onClick={() =>
                    (allDisplayedColumnsOutput= dataGridRef.current.columnApi.getAllDisplayedColumns())
                }>
                getAllDisplayedColumns
            </button>
            <DataGrid
                columnData={columns}
                rowData={rows}
                enableVirtualization={false}
                innerRef={dataGridRef}
            />
        </>
    );
}
describe('Display name column apis', () => {
    test('getDisplayNameForColumn works correctly', () => {
        render(<LaiDatagrid
            displayNameForColumnId={{ colId: columns[1].field }}
            displayNameForColumnLocation={1}
        />)
        const getDisplayNameForColumnBtn = screen.queryByTestId("getDisplayNameForColumnBtn")
        expect(getDisplayNameForColumnBtn).toBeInTheDocument()

        expect(displayNameForColumnOutput).toBeUndefined()
        act(() => {
            fireEvent.click(getDisplayNameForColumnBtn);
        });
        expect(displayNameForColumnOutput).toMatch(columns[1].headerName)
    })
    test('getDisplayedColAfter works correctly', () => {
        render(<LaiDatagrid
            displayedColAfterColumnId={{ colId: columns[1].field }}
        />)
        const expectedColAfterObject = {
            colId: 'priority',
            columnIndex: 2,
            width: 'auto',
            frozen: undefined,
            rowGroup: false,
            rowGroupIndex: null,
            sort: null,
            userProvidedColDef: { field: 'priority', headerName: 'Priority', depth: 0 }
        }
        const getDisplayedColAfterBtn = screen.queryByTestId("getDisplayedColAfterBtn")
        expect(getDisplayedColAfterBtn).toBeInTheDocument()

        expect(displayedColAfterOutput).toBeUndefined()
        act(() => {
            fireEvent.click(getDisplayedColAfterBtn);
        });
        expect(displayedColAfterOutput).toEqual(expectedColAfterObject)
    })
    test('getDisplayedColBefore works correctly', () => {
        render(<LaiDatagrid
            displayedColBeforeColumnId={{ colId: columns[1].field }}
        />)
        const expectedColBeforeObject = {
            colId: 'id',
            columnIndex: 0,
            width: '80px',
            frozen: undefined,
            rowGroup: false,
            rowGroupIndex: null,
            sort: null,
            userProvidedColDef: { field: 'id', headerName: 'ID', width: 80, depth: 0 }
        }
        const getDisplayedColBeforeBtn = screen.queryByTestId("getDisplayedColBeforeBtn")
        expect(getDisplayedColBeforeBtn).toBeInTheDocument()

        expect(displayedColBeforeOutput).toBeUndefined()
        act(() => {
            fireEvent.click(getDisplayedColBeforeBtn);
        });
        expect(displayedColBeforeOutput).toEqual(expectedColBeforeObject)
    })
    test('getAllDisplayedVirtualColumns works correctly', () => { 
        render(<LaiDatagrid />)
        const expectedAllVirtualColumns= [
            {
              field: 'id',
              headerName: 'ID',
              width: 80,
              depth: 0,
              topHeader: 'id',
              haveChildren: false,
              children: false,
              colId: 'id',
              key: 'id',
              userProvidedColDef: {
                field: 'id',
                headerName: 'ID',
                width: 80,
                depth: 0,
                topHeader: 'id',
                haveChildren: false,
                children: false
              },
              parent: null,
              idx: 0,
              index: 0,
              frozen: undefined,
              isLastFrozenColumn: false,
              rowGroup: false,
              minWidth: 40,
              maxWidth: undefined,
              sortable: false,
              resizable: false,
          
              filter: false,
           
            },
            {
              field: 'task',
              headerName: 'Title',
              depth: 0,
              topHeader: 'task',
              haveChildren: false,
              children: false,
              colId: 'task',
              key: 'task',
              userProvidedColDef: {
                field: 'task',
                headerName: 'Title',
                depth: 0,
                topHeader: 'task',
                haveChildren: false,
                children: false
              },
              parent: null,
              idx: 1,
              index: 1,
              frozen: undefined,
              isLastFrozenColumn: false,
              rowGroup: false,
              width: 'auto',
              minWidth: 40,
              maxWidth: undefined,
              sortable: false,
              resizable: false,
              filter: false,
            },
            {
              field: 'priority',
              headerName: 'Priority',
              depth: 0,
              topHeader: 'priority',
              haveChildren: false,
              children: false,
              colId: 'priority',
              key: 'priority',
              userProvidedColDef: {
                field: 'priority',
                headerName: 'Priority',
                depth: 0,
                topHeader: 'priority',
                haveChildren: false,
                children: false
              },
              parent: null,
              idx: 2,
              index: 2,
              frozen: undefined,
              isLastFrozenColumn: false,
              rowGroup: false,
              width: 'auto',
              minWidth: 40,
              maxWidth: undefined,
              sortable: false,
              resizable: false,
              filter: false,
            }
          ]
      
        const getAllDisplayedVirtualColumnsBtn = screen.queryByTestId("getAllDisplayedVirtualColumnsBtn")
        expect(getAllDisplayedVirtualColumnsBtn).toBeInTheDocument()

        expect(allVirtualColumnsOutput).toBeUndefined()
        act(() => {
            fireEvent.click(getAllDisplayedVirtualColumnsBtn);
        });
        expect(allVirtualColumnsOutput).toEqual(expect.arrayContaining(
           [ expect.objectContaining(expectedAllVirtualColumns[0]),
            expect.objectContaining(expectedAllVirtualColumns[1]),       
            expect.objectContaining(expectedAllVirtualColumns[2]), ]
        ))
     })
     test('getAllDisplayedColumns works correctly', () => { 
        render(<LaiDatagrid />)
        const expectedAllDisplayedColumns=[
            {
              field: 'id',
              headerName: 'ID',
              width: 80,
              depth: 0,
              topHeader: 'id',
              haveChildren: false,
              children: false,
              colId: 'id',
              key: 'id',
              userProvidedColDef: {
                field: 'id',
                headerName: 'ID',
                width: 80,
                depth: 0,
                topHeader: 'id',
                haveChildren: false,
                children: false
              },
              parent: null,
              idx: 0,
              index: 0,
              frozen: undefined,
              isLastFrozenColumn: false,
              rowGroup: false,
              minWidth: 40,
              maxWidth: undefined,
              sortable: false,
              resizable: false,
              filter: false,
            },
            {
              field: 'task',
              headerName: 'Title',
              depth: 0,
              topHeader: 'task',
              haveChildren: false,
              children: false,
              colId: 'task',
              key: 'task',
              userProvidedColDef: {
                field: 'task',
                headerName: 'Title',
                depth: 0,
                topHeader: 'task',
                haveChildren: false,
                children: false
              },
              parent: null,
              idx: 1,
              index: 1,
              frozen: undefined,
              isLastFrozenColumn: false,
              rowGroup: false,
              width: 'auto',
              minWidth: 40,
              maxWidth: undefined,
              sortable: false,
              resizable: false,
              filter: false,
            },
            {
              field: 'priority',
              headerName: 'Priority',
              depth: 0,
              topHeader: 'priority',
              haveChildren: false,
              children: false,
              colId: 'priority',
              key: 'priority',
              userProvidedColDef: {
                field: 'priority',
                headerName: 'Priority',
                depth: 0,
                topHeader: 'priority',
                haveChildren: false,
                children: false
              },
              parent: null,
              idx: 2,
              index: 2,
              frozen: undefined,
              isLastFrozenColumn: false,
              rowGroup: false,
              width: 'auto',
              minWidth: 40,
              maxWidth: undefined,
              sortable: false,
              resizable: false,
              filter: false,
            }
          ]
      
        const getAllDisplayedColumnsBtn = screen.queryByTestId("getAllDisplayedColumnsBtn")
        expect(getAllDisplayedColumnsBtn).toBeInTheDocument()

        expect(allDisplayedColumnsOutput).toBeUndefined()
        act(() => {
            fireEvent.click(getAllDisplayedColumnsBtn);
        });
        expect(allDisplayedColumnsOutput).toEqual(expect.arrayContaining(
           [ expect.objectContaining(expectedAllDisplayedColumns[0]),
            expect.objectContaining(expectedAllDisplayedColumns[1]),       
            expect.objectContaining(expectedAllDisplayedColumns[2]), ]
        ))
      })
})