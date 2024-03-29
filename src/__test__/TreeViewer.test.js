import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef } from "react";
import { TextEditor } from "../components/datagrid/editors";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      let row;
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
      cellRenderer: (params) => {
        console.log(params.getValue());
        return TextEditor(params);
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      filter: true,
      cellRenderer: (params) => {
        console.log(params.getValue());
        return TextEditor(params);
      },
    },
    {
      field: "format",
      headerName: "format",
      cellRenderer: (params) => {
        console.log(params.getValue());
        return TextEditor(params);
      },
    },
    {
      field: "position",
      headerName: "position",
      cellRenderer: (params) => {
        console.log(params.getValue());
        return TextEditor(params);
      },
      cellClass: (props) => {
        console.log("props++++", props);
      },
      // treeFormatter: TextEditor,
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
      cellRenderer: (params) => {
        console.log(params.getValue());
        return TextEditor(params);
      },
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
        rowSelection={"single"}
        treeData={true}
        ref={gridRef}
        valueChangedCellStyle={{ backgroundColor: "red", color: "black" }}
        onRowsChange={(data) => {
          console.log("Data", data);
        }}
        {...props}
      />
    </>
  );
}
function LaiDataGrid1(props) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      let row;
      if (i < 1 || i == 3) {
        row = {
          id,
          name: `supplier ${i}`,
          format: `package-${i}`,
          position: "Run of site",
          price,
          children: [
            {
              id: `${id}-0`,
              parentId: id,
              name: `supplier ${id}-0`,
              format: "728x90",
              position: "run of site",
              price: price / 2,
            },
            {
              id: `${id}-1`,
              parentId: id,
              name: `supplier ${id}-1`,
              format: "480x600",
              position: "run of site",
              price: price * 0.25,
              children: [
                {
                  id: `${id}-1-1`,
                  parentId: id,
                  name: `supplier ${id}-1-1`,
                  format: "728x90",
                  position: "run of site",
                  price: price / 2,
                  children: [
                    {
                      id: `${id}-1-1-0`,
                      parentId: id,
                      name: `supplier ${id}-1-1-0`,
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
              name: `supplier${id}-2`,
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
      sortable: true,
    },
  ];
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid1"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        rowSelection={"multiple"}
        treeData={true}
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
    fireEvent.click(expandbtn);
    fireEvent.click(expandbtn);
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
  test("Treeview Value chage", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const expandbtn = screen.getByTestId("gird-text-editor-2-0");
    expect(expandbtn).toBeInTheDocument();
    fireEvent.change(expandbtn, { target: { value: "packge-0" } });
    expect(expandbtn).toHaveValue("packge-0");
    // const btn =screen.getBy
  });
  test("Treeview Row select", () => {
    render(<LaiDataGrid selection={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
  });
  test("Treeview Row select", () => {
    render(<LaiDataGrid1 />);

    const screenArea = screen.getByTestId("laidatagrid1");
    expect(screenArea).toBeInTheDocument();
    const gridcell = screen.getByText("package-0");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    const gridcell1 = screen.getByText("package-3");
    expect(gridcell1).toBeInTheDocument();
    fireEvent.click(gridcell1, { ctrlKey: true });
    fireEvent.click(gridcell, { ctrlKey: true });
  });
});
