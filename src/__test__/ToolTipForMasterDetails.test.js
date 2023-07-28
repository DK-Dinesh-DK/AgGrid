import { fireEvent, getByText, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import "./utils/index.css";

const productColumns = [
  { field: "id", headerName: "ID", width: 35 },
  { field: "product", headerName: "Product" },
  { field: "description", headerName: "Description" },
  { field: "price", headerName: "Price" },
];
function createDepartments() {
  const departments = [];
  for (let i = 1; i < 30; i++) {
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
  for (let i = 0; i < 20; i++) {
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

function LaiDataGrid({ direction, ...props }) {
  function rowKeyGetter(row) {
    return row.id;
  }

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
        cellRenderer: (params) => `id-${params.row.id}`,
      },
      { field: "department", headerName: "Department" },
    ];
  }, [direction]);
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
        {...props}
      />
    </>
  );
}
function LaiDataGrid1({ direction, ...props }) {
  function rowKeyGetter(row) {
    return row.id;
  }

  const columns = useMemo(() => {
    return [
      {
        field: "expanded",
        headerName: "",
        minWidth: 30,
        width: 30,
        toolTip: true,
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
        valueFormatter: (params) => `id-${params.row.id}`,
        toolTip: true,
      },
      { field: "department", headerName: "Department" },
    ];
  }, [direction]);
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
        {...props}
      />
    </>
  );
}
function LaiDataGrid2({ direction, ...props }) {
  function rowKeyGetter(row) {
    return row.id;
  }

  const columns = useMemo(() => {
    return [
      {
        field: "expanded",
        headerName: "",
        minWidth: 30,
        width: 30,
        toolTip: (params) => `Data-${params.row.id}`,
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
        valueFormatter: (params) => `id-${params.row.id}`,
        toolTip: true,
      },
      { field: "department", headerName: "Department" },
    ];
  }, [direction]);
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
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for Master Details", () => {
  test("Master Details default row Tool tip", () => {
    render(<LaiDataGrid rowLevelToolTip={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const content = screen.getByText("id-1");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseOut(content);
    const expandicon = screen.getByTestId("master-expand-icon-1");
    expect(expandicon).toBeInTheDocument();
    fireEvent.click(expandicon);
    const rect = expandicon.getBoundingClientRect();
    const newY = rect.top + 50;

    // Create a mouse event with the new y-coordinate and dispatch it on the target element
    const moveDownEvent = new MouseEvent("mousemove", {
      clientX: rect.left,
      clientY: newY,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(expandicon, moveDownEvent);
  });
  test("Master Details dynamic row Tool tip", () => {
    render(
      <LaiDataGrid
        rowLevelToolTip={(params) => {
          return "Master Row ToolTip";
        }}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const content = screen.getByText("id-1");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseOut(content);
    const expandicon = screen.getByTestId("master-expand-icon-1");
    expect(expandicon).toBeInTheDocument();
    fireEvent.click(expandicon);
    const rect = expandicon.getBoundingClientRect();
    const newY = rect.top + 20;

    // Create a mouse event with the new y-coordinate and dispatch it on the target element
    const moveDownEvent = new MouseEvent("mousemove", {
      clientX: rect.left,
      clientY: newY,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(expandicon, moveDownEvent);
  });
  test("Master Details default cell Tool tip", () => {
    render(<LaiDataGrid1 />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const content = screen.getByText("id-1");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
    const expandicon = screen.getByTestId("master-expand-icon-1");
    expect(expandicon).toBeInTheDocument();
    fireEvent.click(expandicon);
    const rect = expandicon.getBoundingClientRect();
    const newY = rect.top + 20;

    // Create a mouse event with the new y-coordinate and dispatch it on the target element
    const moveDownEvent = new MouseEvent("mousemove", {
      clientX: rect.left,
      clientY: newY,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(expandicon, moveDownEvent);
  });
  test("Master Details dynamic row Tool tip", () => {
    render(<LaiDataGrid2 />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const content = screen.getByText("id-1");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
    const expandicon = screen.getByTestId("master-expand-icon-1");
    expect(expandicon).toBeInTheDocument();
    fireEvent.click(expandicon);
    const rect = expandicon.getBoundingClientRect();
    const newY = rect.top + 20;

    // Create a mouse event with the new y-coordinate and dispatch it on the target element
    const moveDownEvent = new MouseEvent("mousemove", {
      clientX: rect.left,
      clientY: newY,
      bubbles: true,
      cancelable: true,
    });
    fireEvent(expandicon, moveDownEvent);
  });
});
