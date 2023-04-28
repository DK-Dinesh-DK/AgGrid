import { useState, useReducer, useMemo } from "react";
import { CellExpanderFormatter } from "./CellExpanderFormatter";
import { ChildRowDeleteButton } from "./ChildRowDeleteButton";

import DataGrid from "../components/datagrid/DataGrid";
import TextEditor from "../components/datagrid/editors/textEditor";

// import { CellExpanderFormatter, ChildRowDeleteButton } from './components/Formatters';

function createRows() {
  const rows = [];
  for (let i = 0; i < 10; i++) {
    const price = Math.random() * 30;
    const id = `row${i}`;
    var row;
    if (i < 1 ||i==3) {
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
                    id: `${id}-1-1`,
                    parentId: id,
                    name: `supplier ${i}`,
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
            name: `supplier ${i}`,
            format: "328x70",
            position: "run of site",
            price: price * 0.25,
          },
        ],
      };
    } else {
      row = {
        id,
        name: `supplier ${i}`,
        format: `package ${i}`,
        position: "Run of site",
        price,
      };
    }
    rows.push(row);
  }
  return rows;
}

function toggleSubRow(rows, id) {
  const rowIndex = rows.findIndex((r) => r.id === id);
  const row = rows[rowIndex];
  const { children } = row;
  if (!children) return rows;

  const newRows = [...rows];
  newRows[rowIndex] = { ...row, isExpanded: !row.isExpanded };
  if (!row.isExpanded) {
    newRows.splice(rowIndex + 1, 0, ...children);
  } else {
    newRows.splice(rowIndex + 1, children.length);
  }
  return newRows;
}

function deleteSubRow(rows, id) {
  const row = rows.find((r) => r.id === id);
  if (row?.parentId === undefined) return rows;

  // Remove sub row from flattened rows.
  const newRows = rows.filter((r) => r.id !== id);

  // Remove sub row from parent row.
  const parentRowIndex = newRows.findIndex((r) => r.id === row.parentId);
  const { children } = newRows[parentRowIndex];
  if (children) {
    const newChildren = children.filter((sr) => sr.id !== id);
    newRows[parentRowIndex] = {
      ...newRows[parentRowIndex],
      children: newChildren,
    };
  }

  return newRows;
}

function reducer(rows, { type, id }) {
  switch (type) {
    case "toggleSubRow":
      return toggleSubRow(rows, id);
    case "deleteSubRow":
      return deleteSubRow(rows, id);
    default:
      return rows;
  }
}

const defaultRows = createRows();

export default function TreeView({ direction }) {
  const [rows, dispatch] = useReducer(reducer, defaultRows);
  const [allowDelete, setAllowDelete] = useState(true);
  const columns = useMemo(() => {
    return [
      {
        field: "id",
        headerName: "id",
        frozen: true,
      },
      {
        field: "name",
        headerName: "Name",
        width:100,
      },
      {
        field: "format",
        headerName: "format",
      },
      {
        field: "position",
        headerName: "position",
        treeFormatter:(props)=>{
          console.log("formatter",props);
          return props.row[props.column.key]
        }
      },
      {
        field: "price",
        headerName: "price",
      },
    ];
  }, [allowDelete]);

  return (
    <>
      <label>
        Allow Delete
        <input
          type="checkbox"
          checked={allowDelete}
          onChange={() => setAllowDelete(!allowDelete)}
        />
      </label>
      <DataGrid
        columnData={columns}
        rowData={rows}
        className="big-grid"
        direction={direction}
        treeData={true}
      />
    </>
  );
}
