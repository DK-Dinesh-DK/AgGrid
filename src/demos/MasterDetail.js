import React, { useEffect, useMemo, useRef, useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import DataGrid from "../components/datagrid/DataGrid";

export default function MasterDetail({ direction }) {
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
          return row.gridRowType === "DETAIL"
            ? css`
                padding: 24px;
                background-color: black;
              `
            : undefined;
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
      { field: "department", headerName: "Department" },
    ];
  }, [direction]);
  const [rows, setRows] = useState([]);

  const [expandedIds, setExpandedIds] = useState([]);
  console.log("expandedIds", expandedIds);
  return (
    <>
      <button onClick={() => setRows([...createDepartments()])}>Insert</button>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columnData={columns}
        rowData={rows}
        headerRowHeight={24}
        className="fill-grid"
        masterData={true}
        rowSelection={"single"}
        rowHeight={(args) => {
          return args.type === "ROW" && args.row.gridRowType === "Detail"
            ? 300
            : 40;
        }}
        expandedMasterRowIds={expandedIds}
        onExpandedMasterIdsChange={(pro) => {
          console.log("fvfvf", pro);
        }}
        direction={direction}
      />
    </>
  );
}
