import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";

import React, { useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import "./utils/index.css";
import { TextEditor } from "../components/datagrid";
function rowKeyGetter(row) {
  return row.id;
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
      department: faker.commerce.department(),
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
      id: `${parentId}-${i}`,
      product: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
    });
  }
  productsMap.set(parentId, products);
  return products;
}
function LaiDataGrid({ direction }) {
  const columns = useMemo(() => {
    return [
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
        field: "id",
        headerName: "ID",
        width: 35,
        cellRenderer: TextEditor,
        cellRendererParams: () => {
          return { value: "New Data" };
        },
      },
      { field: "department", headerName: "Department" },
    ];
  }, [direction]);
  const rows = createDepartments();

  const [expandedIds, setExpandedIds] = useState([]);

  return (
    <>
      <button data-testid={"setExpandIds"} onClick={() => setExpandedIds([3])}>
        setExpandIds
      </button>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
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
        expandedMasterRowIds={expandedIds}
        onExpandedMasterIdsChange={(ids) => setExpandedIds([...ids])}
        testId={"laidatagrid"}
      />
    </>
  );
}
function LaiDataGrid1() {
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
      field: "id",
      headerName: "ID",
      width: 35,
    },
    { field: "department", headerName: "Department", cellRenderer: TextEditor },
  ];

  const rows = createDepartments();

  const [expandedIds, setExpandedIds] = useState([]);

  return (
    <>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
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
        expandedMasterRowIds={expandedIds}
        onExpandedMasterIdsChange={(ids) => setExpandedIds([...ids])}
        testId={"laidatagrid"}
      />
    </>
  );
}

describe("Datagrid Unit test for Master Details", () => {
  test("Master Details", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const expandicon = screen.getByTestId("master-expand-icon-1");
    expect(expandicon).toBeInTheDocument();
    fireEvent.click(expandicon);
    fireEvent.click(expandicon);
    const setbtn = screen.getByTestId("setExpandIds");
    expect(setbtn).toBeInTheDocument();
    fireEvent.click(setbtn);
    // const btn =screen.getBy
  });
  test("Master Details editable master row", () => {
    render(<LaiDataGrid1 />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const textBox = screen.getByTestId("gird-text-editor-2-0");
    expect(textBox).toBeInTheDocument();
    fireEvent.change(textBox, { target: { value: "Sarthak" } });
    fireEvent.click(textBox);
    fireEvent.doubleClick(textBox);
  });
});
