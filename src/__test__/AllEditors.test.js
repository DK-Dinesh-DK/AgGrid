import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState, useCallback } from "react";
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
} from "../components/datagrid/editors";
import { faker } from "@faker-js/faker";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 100; i++) {
      rows.push({
        id: `id_${i}`,
        avatar: faker.image.avatar(),
        title: faker.name.prefix(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        zipCode: faker.address.zipCode(),
        date: new Date(),
        sentence: faker.lorem.sentence(),
        money: `₹${100 + i}`,
        valid: i % 2 === true,
        favcolor: faker.color.rgb(),
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
      cellEditor: TextEditor,
    },
    {
      field: "title",
      headerName: "Title",
      sortable: true,
      width: 200,
      resizable: true,
      valueFormatter(props) {
        return <>{props.row.title}</>;
      },
      options: [
        { label: "task1", value: "task1" },
        { label: "task2", value: "task2" },
      ],
      cellRenderer: DropDownEditor,
      editorOptions: {
        editOnClick: true,
      },
    },
    {
      field: "firstName",
      filter: true,
      headerName: "First Name",
      cellEditor: TextEditor,
      width: 200,
      resizable: true,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
      cellEditor: TextEditor,
      resizable: true,
    },
    {
      field: "gender",
      headerName: "Gender",
      cellRenderer: RadioButtonEditor,
      options: [
        { label: "Male", value: "male" },
        { label: "FeMale", value: "female" },
        { label: "Others", value: "others" },
      ],
    },
    {
      field: "datetime",
      headerName: "Birth Date and Time",
      cellRenderer: DateTimeEditor,
    },
    {
      field: "avatar",
      headerName: "Photo",
      cellRenderer: ImageViewer,
    },
    {
      headerName: "Money",
      field: "money",
      cellEditor: TextEditor,
      filter: true,
      sortable: true,
      width: 100,
    },

    {
      field: "zipCode",
      headerName: "ZipCode",
      width: 200,
      resizable: true,
      cellRenderer: TextEditor,
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      cellRenderer: DateEditor,
    },

    {
      field: "time",
      headerName: "Time",
      cellRenderer: TimeEditor,
    },
    {
      field: "valid",
      headerName: "Vaild",
      cellRenderer: CheckBoxEditor,
    },
    {
      field: "favcolor",
      headerName: "Favourite Color",
      cellRenderer: ColorPicker,
    },
    {
      field: "progress",
      headerName: "Progress Level",
      cellRenderer: ProgressBarEditor,
    },
    {
      field: "range",
      headerName: "Range",
      cellRenderer: SliderEditor,
    },
    {
      field: "save",
      headerName: "Save",
      cellRenderer: ButtonEditor,
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
        selection={true}
      />
    </>
  );
}

describe("Datagrid Unit test for All editors", () => {
  test("print window check", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    // const btn =screen.getBy
  });
});
