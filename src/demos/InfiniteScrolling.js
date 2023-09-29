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

    for (let i = 0; i < 100; i++) {
      rows.push({
        id: `id_${i}`,
        avatar: faker.image.avatar(),
        title: faker.name.prefix(),
        firstName: `firstName-${i}`,
        lastName: `lastName${i}`,
        zipCode: faker.address.zipCode(),
        date: moment(new Date()).add(i, "day").format("DD-MM-YYYY"),
        sentence: faker.lorem.sentence(),
        money: `₹${100 + i}`,
        valid: i % 2 === true,
        favcolor: faker.color.rgb(),
        deletebtn: "Delete",
        range: Math.floor(Math.random() * 100 + 1),
        time: moment(new Date()).format("hh:mm"),
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
      resizable: true,
    },
    {
      field: "title",
      headerName: "Title",
      sortable: true,
      width: 200,
      resizable: true,
    },
    {
      field: "firstName",
      filter: true,
      headerName: "First Name",
      cellRenderer: (params) => {
        let options = [
          { label: "Task1", value: "Task1" },
          { label: "Task2", value: "Task2" },
        ];
        let isInsideAgGrid = true;
        return (
          <ComboBox2
            options={[
              { label: "Task1", value: "Task1" },
              { label: "Task2", value: "Task2" },
            ]}
            labelKey={"label"}
            valueKey="value"
            isInsideAgGrid
          />
        );
      },
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
    },
  ];

  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
      />
    </>
  );
}
