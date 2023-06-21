import React from "react";
import DataGrid from "../components/datagrid/DataGrid";
import TextEditor from "../components/datagrid/editors/textEditor";

export default function TreeView({ direction }) {
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
  const rt = createRows();
  return (
    <>
      <DataGrid
        columnData={columns}
        rowData={rt}
        className="big-grid"
        direction={direction}
        treeData={true}
        selection={true}
        serialNumber={true}
        valueChangedCellStyle={{ backgroundColor: "blue", color: "white" }}
      />
    </>
  );
}
