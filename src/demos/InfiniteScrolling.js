import { useEffect, useMemo, useRef, useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import TextEditor from "../components/datagrid/editors/textEditor";
import DataGrid from "../components/datagrid/DataGrid";

const loadMoreRowsClassname = css`
  inline-size: 180px;
  padding-block: 8px;
  padding-inline: 16px;
  position: absolute;
  inset-block-end: 8px;
  inset-inline-end: 8px;
  color: white;
  line-height: 35px;
  background: rgb(0 0 0 / 0.6);
`;

function rowKeyGetter(row) {
  return row.id;
}

function createFakeRowObjectData(index) {
  return {
    id: `${index}`,
    title: faker.name.prefix(),
    firstName: faker.name.firstName(),
    lastName: faker.name.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    new: index,
  };
}

function createRows(numberOfRows) {
  const rows = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = createFakeRowObjectData(i);
  }

  return rows;
}

function isAtBottom({ currentTarget }) {
  return (
    currentTarget.scrollTop + 10 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}

function loadMoreRows(newRowsCount, length) {
  return new Promise((resolve) => {
    const newRows = [];

    for (let i = 0; i < newRowsCount; i++) {
      newRows[i] = createFakeRowObjectData(i + length);
    }

    setTimeout(() => resolve(newRows), 1000);
  });
}

export default function InfiniteScrolling({ direction }) {
  const [rows, setRows] = useState(() => createRows(10));
  const [isLoading, setIsLoading] = useState(false);

  async function handleScroll(event) {
    if (isLoading || !isAtBottom(event)) return;

    setIsLoading(true);

    const newRows = await loadMoreRows(50, rows.length);

    setRows([...rows, ...newRows]);
    setIsLoading(false);
  }
  const dataGridRef = useRef(null);
  const [optionList, setOptioList] = useState([]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      valueFormatter: (props) => {
        let style;
        if (props.row.id.includes(5)) style = { backgroundColor: "blue" };
        else if (props.row.id.includes(9))
          style = { backgroundColor: "yellow" };
        else if (props.row.id.includes(4)) style = { backgroundColor: "grey" };
        else style = { backgroundColor: "green" };
        return <div style={style}>{props.row.id}</div>;
      },
    },
    {
      field: "title",
      headerName: "Title",
      editable: true,
      filter: true,
    },
    {
      field: "firstName",
      headerName: "First Name",
      filter: true,
      cellRenderer: (props) => {
        return TextEditor(props);
      },
    },
    {
      field: "lastName",
      headerName: "Last Name",
      valueGetter: ({ row, column }) => `Last Name: ${row[column.key]}`,
    },
    {
      // field: "email",
      headerName: "Email",
      valueFormatter: ({ row, column }) => `Email: ${row[column.key]}`,
    },
    {
      headerName: "Option",
      // field: "opt",
      cellStyle: (props) => {
        return { backgroundColor: "red" };
      },
      cellRenderer: () => {
        return (
          <select>
            {optionList?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  return (
    <>
      <button
        onClick={() => {
          console.log("Calling");
          setOptioList(["a", "b", "c", "d"]);
        }}
      >
        getFocusedCell
      </button>

      <DataGrid
        columnData={columns}
        rowData={rows}
        rowKeyGetter={rowKeyGetter}
        onRowsChange={(data) => {
          console.log("Data", data);
        }}
        rowHeight={25}
        className="fill-grid"
        ref={dataGridRef}
        direction={direction}
        selection={true}
        valueChangedCellStyle={{ backgroundColor: "Blue", color: "White" }}
      />
      {isLoading && (
        <div className={loadMoreRowsClassname}>Loading more rows...</div>
      )}
    </>
  );
}
