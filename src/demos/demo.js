import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import TextEditor from "../components/datagrid/editors/textEditor";
import DataGrid from "../components/datagrid/DataGrid";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
  },
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 100,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 100,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
];

function createRows(numberOfRows) {
  const rows = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = {
      id: `id_${i}`,
      title: faker.name.prefix(),
      firstName: faker.name.firstName(),
      lastName: faker.name.firstName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    };
  }

  return rows;
}

export default function Demo({ direction }) {
  const [rows, setRows] = useState(createRows(1000));
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef(null);
  console.log("rows", rows);
  return (
    <>
      findData
      <input
        onChange={(e) => {
          gridRef.current.api.findData(e.target.value);
        }}
      />
      <DataGrid columnData={columns} rowData={rows} innerRef={gridRef} />
    </>
  );
}
