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
      cellRenderer: TextEditor,
    },
    {
      field: "position",
      headerName: "position",
      cellClass: (props) => {
        console.log("props++++", props);
      },
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
    // fireEvent.doubleClick(expandbtn);
    // const gridcell = screen.getByTestId("gird-text-editor-4-0");
    // expect(gridcell).toBeInTheDocument();
    // fireEvent.change(gridcell, { target: { value: "Sarthak" } });
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
