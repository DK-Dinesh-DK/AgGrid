import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef } from "react";
import { TextEditor } from "../components/datagrid/editors";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      var row;
      if (i < 1 || i == 3) {
        row = {
          id,
          name: `supplier ${i}`,
          format: `package ${i}`,
          position: "Run of site",
          price,
          children: [
            {
              id: `${id}-0`,
              parentId: id,
              name: `supplier ${i}`,
              format: "728x90",
              position: "run of site",
              price: price / 2,
            },
            {
              id: `${id}-1`,
              parentId: id,
              name: `supplier ${i}`,
              format: "480x600",
              position: "run of site",
              price: price * 0.25,
              children: [
                {
                  id: `${id}-1-1`,
                  parentId: id,
                  name: `supplier ${i}`,
                  format: "728x90",
                  position: "run of site",
                  price: price / 2,
                  children: [
                    {
                      id: `${id}-1-1-0`,
                      parentId: id,
                      name: `supplier-${i}`,
                      format: "728x90",
                      position: "run of site",
                      price: price / 2,
                    },
                  ],
                },
              ],
            },
            {
              id: `${id}-2`,
              parentId: id,
              name: `supplier-${i}`,
              format: "328x70",
              position: "run of site",
              price: price * 0.25,
            },
          ],
        };
      } else {
        row = {
          id,
          name: `supplier-${i}`,
          format: `package ${i}`,
          position: "Run of site",
          price,
        };
      }
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
      cellRenderer: TextEditor,
    },
    {
      field: "format",
      headerName: "format",
      cellEditor: TextEditor,
    },
    {
      field: "position",
      headerName: "position",
      // treeFormatter: TextEditor,
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
    },
  ];
  const gridRef = useRef(null);
  return (
    <>
      {/* <button onClick={()=>{gridRef.current.api}}>GetValue</button> */}
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        treeData={true}
        ref={gridRef}
        valueChangedCellstyle={{ backgroundColor: "red", color: "black" }}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for Tree view", () => {
  test("Tree view", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const expandbtn = screen.getByTestId("tree-expand-icon0");
    expect(expandbtn).toBeInTheDocument();
    fireEvent.click(expandbtn);
    const gridcell = screen.getByRole("gridcell", { name: "package 1" });
    expect(gridcell).toBeInTheDocument();
    // fireEvent.doubleClick(gridcell);
    // let input = screen.getByRole("gridcellTextbox");
    // expect(input).toBeInTheDocument();
    // expect(input).toHaveClass("rdg-text-editor");
    // fireEvent.change(input, { target: { value: "Sarthak" } });
    // expect(input).toHaveValue("Sarthak");
    // fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    // expect(input).not.toBeInTheDocument();
    // expect(gridcell).not.toBeInTheDocument();
  });
  test("print window check only serial", () => {
    render(<LaiDataGrid serialNumber={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const expandbtn = screen.getByTestId("tree-expand-icon0");
    expect(expandbtn).toBeInTheDocument();
    fireEvent.click(expandbtn);
    // const btn =screen.getBy
  });
  test("print window check only serial", () => {
    render(<LaiDataGrid selection={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const expandbtn = screen.getByTestId("tree-expand-icon0");
    expect(expandbtn).toBeInTheDocument();
    fireEvent.click(expandbtn);
    // const btn =screen.getBy
  });
  test("print window check only serial", () => {
    render(<LaiDataGrid selection={true} serialNumber={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const expandbtn = screen.getByTestId("tree-expand-icon0");
    expect(expandbtn).toBeInTheDocument();
    fireEvent.click(expandbtn);
    // const btn =screen.getBy
  });
});
