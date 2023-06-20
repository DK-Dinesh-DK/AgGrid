import { render, within, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getCellsAtRowIndex } from "./utils/utils";
import DataGrid from "../components/datagrid/DataGrid";
import { useState, useRef } from "react";
import { SelectColumn } from "../components/datagrid/Columns";
import textEditor from "../components/datagrid/editors/textEditor";
import "@testing-library/jest-dom";
beforeAll(() => {
  userEvent.setup();
  window.HTMLElement.prototype.scrollIntoView = function () {};
});
describe("getSelectedNodes Works Correctly", () => {
  test("getSelectedNodes shows correct selected nodes", async () => {
    let selectedNodes = [];
    const columns = [
      {
        ...SelectColumn,
      },
      {
        field: "id",
        headerName: "ID",
        width: 80,
      },
      {
        field: "task",
        headerName: "Title",
        cellEditor: (props) => {
          //console.log(props);
          return textEditor(props);
        },
      },
    ];
    function rowKeyGetter(row) {
      return row.id;
    }
    function LaiDataGrid() {
      const rows = [
        { id: 1, task: "Task 1" },
        { id: 2, task: "Task 2" },
        { id: 3, task: "Task 3" },
        { id: 4, task: "Task 4" },
        { id: 5, task: "Task 5" },
        { id: 6, task: "Task 6" },
        { id: 7, task: "Task 7" },
        { id: 8, task: "Task 8" },
        { id: 9, task: "Task 9" },
        { id: 10, task: "Task 10" },
      ];
      const [selectedRows, setSelectedRows] = useState([]);
      const dataGridRef = useRef(null);

      return (
        <>
          <button
            type="button"
            onClick={() =>
              (selectedNodes = dataGridRef.current.api.getSelectedNodes())
            }>
            getSelectedNodes
          </button>
          <DataGrid
            columnData={columns}
            rowData={rows}
            rowKeyGetter={rowKeyGetter}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
            innerRef={dataGridRef}
            enableVirtualization={false}
          />
        </>
      );
    }

    render(<LaiDataGrid />);
    const selectedCheckBoxes = [];

    //check whether getSelectedNodes is initially Empty
    expect(selectedNodes).toHaveLength(0);

    //Selecting checkbox at rowIndex 2
    selectedCheckBoxes.push(
      within(getCellsAtRowIndex(2)[0]).getByLabelText("Select")
    );
    expect(selectedCheckBoxes[0]).not.toBeChecked();
    await act(async () => await userEvent.click(selectedCheckBoxes[0]));
    expect(selectedCheckBoxes[0]).toBeChecked();

    //Selecting checkbox at rowIndex 6
    selectedCheckBoxes.push(
      within(getCellsAtRowIndex(6)[0]).getByLabelText("Select")
    );
    expect(selectedCheckBoxes[1]).not.toBeChecked();
    await act(async () => await userEvent.click(selectedCheckBoxes[1]));
    expect(selectedCheckBoxes[1]).toBeChecked();

    const expectedSelectedNodes = [
      {
        rowIndex: 2,
        data: { id: 3, task: "Task 3" },
      },
      {
        rowIndex: 6,
        data: { id: 7, task: "Task 7" },
      },
    ];

    const getSelectedNodesBtn = screen.getByRole("button", {
      name: /getselectednodes/i,
    });

    await act(async () => {
      await userEvent.click(getSelectedNodesBtn);
    });

    //check whether getSelectedNodes return correct number of nodes
    expect(selectedNodes).toHaveLength(selectedCheckBoxes.length);

    //check whether getSelectedNodes return correct selected Nodes
    for (let i = 0; i < selectedNodes.length; i++) {
      expect(selectedNodes[i]).toEqual(
        expect.objectContaining(expectedSelectedNodes[i])
      );
    }
  });
});
