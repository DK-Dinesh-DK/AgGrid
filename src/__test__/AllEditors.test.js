import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";
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
import { faker } from "@faker-js/faker";
import moment from "moment";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 10; i++) {
      rows.push({
        id: `id_${i}`,
        avatar: faker.image.avatar(),
        title: faker.name.prefix(),
        firstName: faker.name.firstName(),
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
      editable: true,
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
      cellStyle: (props) => {
        return { backgroundColor: "blue", color: "White" };
      },
      width: 200,
      resizable: true,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
      cellStyle: { backgroundColor: "blue", color: "White" },
      cellRenderer: TextEditor,
      resizable: true,
    },
    {
      field: "password",
      headerName: "Password",
      width: 200,
      cellRenderer: TextEditor,
      type: "mask",
    },
    {
      field: "gender",
      headerName: "Gender",
      cellRenderer: RadioButtonEditor,
      width: 200,
      options: [
        { label: "Male", value: "male" },
        { label: "FeMale", value: "female" },
        { label: "Others", value: "others" },
      ],
    },
    {
      field: "gend",
      headerName: "GenderButton",
      cellRenderer: RadioButtonEditor,
      width: 200,
      buttons: [
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
      editable: true,
      cellEditor: DateEditor,
    },
    {
      field: "datee",
      headerName: "Date-Without",
      width: 150,
      cellRenderer: DateEditor,
    },

    {
      field: "time",
      headerName: "Time",
      cellRenderer: TimeEditor,
    },
    {
      headerName: "New Time",
      editable: true,
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
      field: "favcolour",
      headerName: "Favourite Colour",
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
      width: 150,
      cellRenderer: SliderEditor,
    },
    {
      field: "save",
      headerName: "Save",
      cellRenderer: ButtonEditor,
      onClick: (params) => {
        console.log(params);
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      cellRenderer: ButtonEditor,
      inputProps: { text: "ItemDelete" },
      editable: true,
    },
    {
      field: "link",
      headerName: "Link",
      cellRenderer: LinkEditor,
    },
  ];
  return (
    <>
      <ButtonEditor
        column={{
          inputProps: {
            text: "Save_Save",
          },
          onClick: (props) => {
            console.log(props);
          },
        }}
      ></ButtonEditor>
      <DateEditor
        row={{ date: new Date() }}
        column={{ editable: false, key: "date", idx: 10001 }}
        rowIndex={100}
        onRowChange={(props) => console.log(props)}
      />

      <DropDownEditor
        row={{ gender: "male" }}
        column={{
          editable: false,
          key: "gender",
          options: [
            { label: "Male", value: "male" },
            { label: "FeMale", value: "female" },
            { label: "Others", value: "others" },
            ,
          ],
        }}
        rowIndex={100}
        onRowChange={(props) => console.log(props)}
        data-testid={"dropDownEditorTest"}
      />
      <RadioButtonEditor
        row={{ gender: "male" }}
        column={{
          editable: false,
          key: "gender",
          options: [
            { label: "Option1", value: "option1" },
            { label: "Option2", value: "option2" },
            { label: "Option3", value: "option3" },
            ,
          ],
        }}
        rowIndex={100}
        onRowChange={(props) => console.log(props)}
      />
      <DateTimeEditor
        row={{ date: new Date() }}
        column={{ editable: false, key: "date", idx: 10001 }}
        rowIndex={100}
        onRowChange={(props) => console.log(props)}
        data-testid={"dateTimeEditorTest"}
      />
      <TimeEditor
        row={{ date: new Date() }}
        column={{ editable: false, key: "date", idx: 10001 }}
        rowIndex={100}
        onRowChange={(props) => console.log(props)}
        data-testid={"timeEditorTest"}
      />
      <ColorPicker
        row={{ date: new Date() }}
        column={{ editable: false, key: "date", idx: 10001 }}
        rowIndex={100}
        onRowChange={(props) => console.log(props)}
        data-testid={"colorPickerTest"}
      />
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        selection={true}
        valueChangedCellstyle={{ backgroundColor: "red", color: "black" }}
      />
    </>
  );
}

describe("Datagrid Unit test for All editors", () => {
  test("editors for button", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const saveButton = screen.getByText("Save_Save");
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
  });
  test("editors for textEditor", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
  });
  test("editors for slider", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const sliderInput = screen.getByTestId("grid-slider-1");
    expect(sliderInput).toBeInTheDocument();
    fireEvent.change(sliderInput, { target: { value: "10" } });
    fireEvent.change(sliderInput, { target: { value: "75" } });
  });
  test("editors for checkbox", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const checkBoxInput = screen.getByTestId("grid-checkbox-1");
    expect(checkBoxInput).toBeInTheDocument();
    fireEvent.click(checkBoxInput);
  });
  test("editors for dateEditor", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const dateinput = screen.getByTestId("grid-date-picker-10001-100");
    expect(dateinput).toBeInTheDocument();
    fireEvent.change(dateinput, { target: { value: "2020-03-03" } });
  });
  test("editors for dateTimeEditor", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const dateTimeInput = screen.getByTestId("dateTimeEditorTest");
    expect(dateTimeInput).toBeInTheDocument();
    fireEvent.change(dateTimeInput, { target: { value: "2020-03-03" } });
  });
  test("editors for timeEditor", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const timeInput = screen.getByTestId("timeEditorTest");
    expect(timeInput).toBeInTheDocument();
    fireEvent.change(timeInput, { target: { value: "10:45" } });
  });
  test("editors for dropDownEditor", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const dropDownInput = screen.getByTestId("dropDownEditorTest");
    expect(dropDownInput).toBeInTheDocument();
    fireEvent.change(dropDownInput, { target: { value: "female" } });
  });
  test("editors for radioButtonEditor", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const radioButtonInput = screen.getByTestId("grid-radio-button-Option2");
    expect(radioButtonInput).toBeInTheDocument();
    fireEvent.click(radioButtonInput);
    // fireEvent.change(radioButtonInput, { target: { value: "female" } });
  });
  test("editors for colorPicker", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const colorPickerDiv = screen.getByTestId("colorPickerTest");
    expect(colorPickerDiv).toBeInTheDocument();
    fireEvent.click(colorPickerDiv);
    const colorPickerInput = screen.getByTestId("grid-color-picker-10001-100");
    expect(colorPickerInput).toBeInTheDocument();
    fireEvent.change(colorPickerInput, { target: { value: "#ff0000" } });
  });
});
