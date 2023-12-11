import React, { useEffect, useMemo, useRef, useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import DataGrid from "../components/datagrid/DataGrid";
import TextEditor from "../components/datagrid/editors/textEditor";

export default function MasterDetail({ direction }) {
  function rowKeyGetter(row) {
    return row.id;
  }

  const productColumns = [
    { field: "id", headerName: "ID" },
    {
      field: "product",
      headerName: "Product",
      cellRenderer: (p) => {
        console.log("Calalalallads");
        return TextEditor(p);
      },
    },
    { field: "description", headerName: "Description" },
    { field: "price", headerName: "Price" },
  ];
  function createDepartments() {
    const departments = [];
    for (let i = 1; i < 5; i++) {
      departments.push({
        id: i,
        department: `master-department-${i}`,
      });
    }
    return departments;
  }

  const productsMap = new Map();
  function getProducts(parentId, data) {
    if (productsMap.has(data)) return productsMap.get(data);
    const products = [];
    for (let i = 0; i < 20; i++) {
      products.push({
        id: `${data}-${i}`,
        product: `productName-${i}`,
        description: `productDescription-${i}`,
        price: `price-${i}`,
      });
    }
    productsMap.set(parentId, products);
    console.log("Callli");
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
                padding: 30px;
                background-color: black;
              `
            : undefined;
        },
        detailsGrid: (props) => {
          return (
            // <DataGrid
            //   id={`details-gird-${props.row.parentId}`}
            //   rowData={getProducts(
            //     props.row.parentId,
            //     props.row.masterRowData.department
            //   )}
            //   columnData={productColumns}
            //   rowKeyGetter={rowKeyGetter}
            //   style={{ blockSize: 250 }}
            //   // onRowsChange={(pr) => console.log("PR", pr)}
            //   onRowClicked={() => {
            //     console.log("Child Rowclciked");
            //   }}
            // />
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexWrap: "wrap",
                columnGap: "10px",
                overflow: "auto",
              }}
            >
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
              <input style={{ width: "100px", height: "22px" }} />
            </div>
          );
        },
      },
      {
        field: "id",
        headerName: "ID",
        width: 35,
      },
      {
        field: "department",
        headerName: "Department",
        cellRenderer: TextEditor,
        // editable: true,
      },
    ];
  }, [direction]);
  const [rows, setRows] = useState(createDepartments());

  const [expandedIds, setExpandedIds] = useState([2, 3]);
  console.log("expandedIds", expandedIds);
  return (
    <>
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
            ? 100
            : 24;
        }}
        // expandedMasterRowIds={expandedIds}
        // onExpandedMasterIdsChange={(pro) => {
        //   setExpandedIds(pro);
        // }}
        onRowsChange={(r) => {
          console.log("ONChange", r);
          setRows(r);
        }}
        // rowLevelToolTip={true}
        onRowClicked={(params) => {
          console.log("Parent Rowclciked", params);
        }}
        direction={direction}
      />
    </>
  );
}
