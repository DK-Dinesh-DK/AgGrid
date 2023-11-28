import { useRef, useState } from "react";
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
  },
  {
    field: "firstName",
    headerName: "First Name",
  },
  {
    field: "lastName",
    headerName: "Last Name",
  },
  {
    field: "email",
    headerName: "Email",
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
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef(null);
  return (
    <>
      <button
        onClick={() => {
          console.log(gridRef.current.api.getRows());
        }}
      >
        Data
      </button>
      <DataGrid
        columnData={columns}
        rowData={rows}
        importExcel={true}
        innerRef={gridRef}
        export={{
          pdfFileName: "NewTableData",
        }}
      />
    </>
  );
}
