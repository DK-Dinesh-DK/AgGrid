import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";
import TextEditor from "../components/datagrid/editors/textEditor";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      var row;

      row = {
        id,
        name: `supplier-${i}`,
        format: `package-${i}`,
        position: "Run of site",
        price: `price-${i}`,
      };

      rows.push(row);
    }
    return rows;
  }
  const rowData = createRows();

  const columns = [
    {
      field: "id",
      headerName: "id",
      frozen: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      filter: true,
    },
    {
      field: "format",
      headerName: "format",
    },
    {
      field: "position",
      headerName: "position",
    },
    {
      field: "price",
      headerName: "price",
      cellEditor: TextEditor,
      sortable: true,
    },
  ];
  const [show, setShow] = useState(true);
  return (
    <>
      <button data-testid={"remove-table"} onClick={() => setShow(!show)}>
        Remove Table{" "}
      </button>
      {show && (
        <DataGrid
          columnData={columns}
          testId={"laidatagrid"}
          rowData={rowData}
          {...props}
        />
      )}
    </>
  );
}
describe("rowSelection event test", () => {
  test("Copy Paste event ", async () => {
    render(<LaiDataGrid restriction={{ copy: true, paste: true }} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const removebtn = screen.getByTestId("remove-table");
    expect(removebtn).toBeInTheDocument();
    fireEvent.click(removebtn);
    fireEvent.click(removebtn);
    fireEvent.click(removebtn);
  });
  test("copy checking ", async () => {
    render(<LaiDataGrid restriction={{ copy: false, paste: true }} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cellElement = screen.getByText("supplier-0");
    expect(cellElement).toBeInTheDocument();
    fireEvent.click(cellElement);

    // Simulate a keydown event on the cell to copy the value
    fireEvent.keyDown(cellElement, { key: "c", ctrlKey: true });
    const copiedValue = cellElement.textContent;
    expect(copiedValue).toBe("supplier-0");
    const cellEle = screen.getByText("package-0");
    expect(cellEle).toBeInTheDocument();
    fireEvent.click(cellEle);
    fireEvent.keyDown(cellEle, { key: "v", ctrlKey: true });
  });
  test("key down escape", async () => {
    render(<LaiDataGrid restriction={{ copy: false, paste: true }} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    fireEvent.keyDown(screenArea);
    fireEvent.keyDown(screenArea, { key: "Escape" });
  });
  test("key down arrow", async () => {
    render(<LaiDataGrid restriction={{ copy: false, paste: true }} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cellElement = screen.getByText("supplier-0");
    expect(cellElement).toBeInTheDocument();
    fireEvent.click(cellElement);
    fireEvent.keyDown(cellElement, { key: "ArrowUp" });
    fireEvent.keyDown(cellElement, { key: "ArrowDown" });
    fireEvent.keyDown(cellElement, { key: "ArrowLeft" });
    fireEvent.keyDown(cellElement, { key: "ArrowRight" });
    fireEvent.keyDown(cellElement, { key: "Tab" });
    fireEvent.keyDown(cellElement, { key: "Home" });
    fireEvent.keyDown(cellElement, { key: "End" });
    fireEvent.keyDown(cellElement, { key: "PageUp" });
    fireEvent.keyDown(cellElement, { key: "PageDown" });
    fireEvent.keyDown(cellElement, { key: "Escape" });
  });
  test("key down arrow", async () => {
    render(<LaiDataGrid restriction={{ copy: false, paste: true }} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cellElement = screen.getByText("price-0");
    expect(cellElement).toBeInTheDocument();
    fireEvent.click(cellElement);
    fireEvent.keyDown(cellElement, { key: "ArrowUp" });
    fireEvent.keyDown(cellElement, { key: "ArrowDown" });
    fireEvent.keyDown(cellElement, { key: "ArrowLeft" });
    fireEvent.keyDown(cellElement, { key: "ArrowRight" });
    fireEvent.keyDown(cellElement, { key: "Tab" });
    fireEvent.keyDown(cellElement, { key: "Home" });
    fireEvent.keyDown(cellElement, { key: "End" });
    fireEvent.keyDown(cellElement, { key: "PageUp" });
    fireEvent.keyDown(cellElement, { key: "PageDown" });
    fireEvent.keyDown(cellElement, { key: "Escape" });
  });
  test("key down arrow", async () => {
    render(<LaiDataGrid restriction={{ copy: false, paste: true }} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cellElement = screen.getByText("price-0");
    expect(cellElement).toBeInTheDocument();
    fireEvent.click(cellElement);
    fireEvent.keyDown(cellElement, { key: "Enter" });
  });
  test("key down arrow", async () => {
    render(
      <LaiDataGrid
        onCopy={(params) => console.log(params)}
        onPaste={(params) => console.log(params)}
        onRowsChange={(params) => console.log(params)}
      />
    );
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cellElement = screen.getByText("supplier-0");
    expect(cellElement).toBeInTheDocument();
    fireEvent.click(cellElement);
    fireEvent.keyDown(cellElement, { key: "c", keyCode: 67, ctrlKey: true });
    const cellElement1 = screen.getByText("price-0");
    expect(cellElement1).toBeInTheDocument();
    fireEvent.keyDown(cellElement1, { key: "v", keyCode: 86, ctrlKey: true });
    // fireEvent.keyDown(screenArea, { key: "c", keyCode: 67, ctrlKey: true });
  });
});
