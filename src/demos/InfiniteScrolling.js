import { useRef, useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import {
  DateEditor,
  DropDownEditor,
  ImageViewer,
  TextEditor,
  CheckBoxEditor,
  ColorPicker,
  ButtonEditor,
  ProgressBarEditor,
  TimeEditor,
  RadioButtonEditor,
  DateTimeEditor,
  SliderEditor,
  LinkEditor,
} from "../components/datagrid/editors";
import DataGrid from "../components/datagrid/DataGrid";
import moment from "moment";
import ComboBox2 from "./ComboBox2";

export default function InfiniteScrolling({ direction }) {
  // const [selectedRows, setSelectedRows] = useState([]);
  function createRows() {
    const rows = [];

    for (let i = 0; i < 5; i++) {
      rows.push({
        id: `id_${i}`,
        title: faker.name.prefix(),
        firstName: faker.name.firstName(),
        lastName: `lastName${i}`,
      });
    }

    return rows;
  }
  const rowData = createRows();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "title",
      headerName: "Title",
      sortable: true,
      width: 200,
    },
    {
      field: "firstName",
      filter: true,
      headerName: "First Name",

      width: 200,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
    },
  ];
  return (
    <div>
      <DataGrid columnData={columns} rowData={rowData} className="fill-grid" />
      <DataGrid columnData={columns} rowData={rowData} className="fill-grid" />
      <DataGrid columnData={columns} rowData={rowData} className="fill-grid" />
      <DataGrid columnData={columns} rowData={rowData} className="fill-grid" />
      <DataGrid columnData={columns} rowData={rowData} className="fill-grid" />
    </div>
  );
}
