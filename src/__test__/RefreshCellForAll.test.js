import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";

import { TextEditor } from "../components/datagrid/editors";
function TextInput(params) {
  return (
    <input
      data-testid={`text-input-${params.column.headerName}-${params.rowIndex}`}
      value={params.getValue()}
      onChange={(e) => {
        params.setValue(e.target.value);
        params.refreshCell();
      }}
    />
  );
}
const frameworkComponents = {
  btn: TextInput,
};
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
        price,
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
      width: 400,
      filter: true,
      cellRenderer: TextEditor,
    },
    {
      field: "format",
      headerName: "Format",
      width: 400,
      cellRenderer: "btn",
      cellRendererParams: (params) => {
        return params;
      },
    },
    {
      field: "position",
      headerName: "Position",
      width: 400,
      cellRenderer: TextInput,
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
      width: 400,
    },
  ];

  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        enableVirtualization={false}
        className="fill-grid"
        valueChangedCellStyle={{ backgroundColor: "red", color: "black" }}
        frameworkComponents={frameworkComponents}
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
      cellRenderer: "btn",
      cellRendererParams: (params) => {
        return params;
      },
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
      {/* <button onClick={()=>{gridRef.current.api}}>GetValue</button> */}
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        treeData={true}
        valueChangedCellStyle={{ backgroundColor: "red", color: "black" }}
        frameworkComponents={frameworkComponents}
        {...props}
      />
    </>
  );
}

const productColumns = [
  { field: "id", headerName: "ID", width: 35 },
  { field: "product", headerName: "Product" },
  { field: "description", headerName: "Description" },
  { field: "price", headerName: "Price" },
];
function createDepartments() {
  const departments = [];
  for (let i = 1; i < 10; i++) {
    departments.push({
      id: i,
      department: "Department",
    });
  }
  return departments;
}

const productsMap = new Map();
function getProducts(parentId) {
  if (productsMap.has(parentId)) return productsMap.get(parentId);
  const products = [];
  for (let i = 0; i < 10; i++) {
    products.push({
      ids: `${parentId}-${i}`,
      product: `${productName}-${i}`,
      description: `${productDescription}-${i}`,
      price: `${price}-${i}`,
    });
  }
  productsMap.set(parentId, products);
  return products;
}
function LaiDataGrid2() {
  const columns = [
    {
      field: "expanded",
      headerName: "",
      minWidth: 30,
      width: 30,
      colSpan(args) {
        return args.type === "ROW" && args.row?.gridRowType === "Detail"
          ? 3
          : 1;
      },
      cellClass(row) {
        return row.gridRowType === "DETAIL" ? "detail-row" : undefined;
      },
      detailsGrid: (props) => {
        return (
          <DataGrid
            rowData={getProducts(props.row.parentId)}
            columnData={productColumns}
            rowKeyGetter={rowKeyGetter}
            style={{ blockSize: 250, margin: "30px" }}
          />
        );
      },
    },
    {
      field: "ids",
      headerName: "ID",
      width: 35,
      cellRenderer: "btn",
      cellRendererParams: (params) => {
        return params;
      },
    },
    { field: "department", headerName: "Department" },
  ];

  const rows = createDepartments();

  return (
    <>
      <DataGrid
        columnData={columns}
        rowData={rows}
        headerRowHeight={24}
        className="fill-grid"
        masterData={true}
        rowHeight={(args) => {
          return args.type === "ROW" && args.row.gridRowType === "Detail"
            ? 300
            : 40;
        }}
        testId={"laidatagrid"}
        frameworkComponents={frameworkComponents}
      />
    </>
  );
}

function LaiDataGrid4(props) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 20; i++) {
      rows.push({
        id: i,
        count: i * 1000,
      });
    }

    return rows;
  }

  const columns = [
    {
      field: "count",
      headerName: "Count",
      cellRenderer: TextInput,
    },
  ];
  const rows = createRows();

  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rows}
        rowHeight={24}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for refresh Cell For all", () => {
  test(" test for refresh Cell For normall cell", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const input = screen.getByTestId("text-input-Format-0");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "package000" } });
    const input1 = screen.getByTestId("text-input-Position-0");
    expect(input1).toBeInTheDocument();
    fireEvent.change(input1, { target: { value: "Position" } });
    const input2 = screen.getByTestId("gird-text-editor-1-0");
    expect(input2).toBeInTheDocument();
    fireEvent.change(input2, { target: { value: "supplier-00" } });
  });
  test(" test for refresh Cell For Tree cell", () => {
    render(<LaiDataGrid1 />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const input = screen.getByTestId("text-input-Name-0");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "package000" } });
  });
  test(" test for refresh Cell For master cell", () => {
    render(<LaiDataGrid2 />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const input = screen.getByTestId("text-input-ID-0");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "package000" } });
  });
  test("test for refresh Cell For DetailedRow  cell", async () => {
    const mobileViewWidth = 360;
    const mobileViewHeight = 640;
    window.innerWidth = mobileViewWidth;
    window.innerHeight = mobileViewHeight;
    render(<LaiDataGrid4 detailedRow={true} />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const input = screen.getByTestId("text-input-Count-0");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "package000" } });
  });
});
