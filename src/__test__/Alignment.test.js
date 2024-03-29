import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";
import { TextEditor } from "../components/datagrid/editors";
import { faker } from "@faker-js/faker";
import moment from "moment";

function LaiDataGrid(props) {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      alignment: { type: "number" },
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 100,
      alignment: true,
    },
    {
      headerName: "Money",
      field: "money",
      cellEditor: TextEditor,
      alignment: true,
      width: 100,
      validation: {
        style: { backgroundColor: "red", color: "blue" },
        method: (value) => value.slice(1) >= 100,
      },
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 100,
      alignment: { type: "string" },
    },
    {
      field: "email",
      headerName: "Email",
      width: "max-content",
      alignment: { type: "string", align: "start" },
    },
    {
      field: "date",
      headerName: "Date",
      alignment: { type: "DATe" },
      // width:200,
      resizable: true,
    },
    {
      field: "date1",
      headerName: "DateWithAlign",
      alignment: { type: "DATe", align: "start" },
      // width:200,
      resizable: true,
    },
    {
      field: "time",
      headerName: "Time",
      // width: 150,
      alignment: { type: "Time" },
    },
    {
      field: "datetime",
      headerName: "DateTime",
      alignment: { type: "datetime" },
    },
    {
      field: "newDatetime",
      headerName: "NewDateTime",
      alignment: true,
    },
    {
      field: "num",
      headerName: "Number",
      alignment: true,
    },
    {
      field: "num1",
      headerName: "NumberWithAlign",
      alignment: { type: "number", align: "start" },
    },
    // {
    //   field: dateWithalign,
    //   headerName: "DateWithAlign",
    //   alignment: { type: "date", align: "center" },
    // },
  ];

  function createRows() {
    const rows = [];

    for (let i = 0; i < 10; i++) {
      rows.push({
        id: i,
        email: `${faker.internet.email()} `,
        title: faker.name.prefix(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        date: moment(faker.date.birthdate()).format("MMMM-DD-YYYY"),
        date1: moment(faker.date.birthdate()).format("MMMM-DD-YYYY"),
        money: "₹101",
        time: new Date().toLocaleTimeString("en-IN"),
        datetime: moment(new Date()).format("MM-DD-YYYY h:mm:ss a"),
        newDatetime: moment(new Date()).format("MM/DD/YYYY h:mm:ss a"),
        num: i,
        num1: i,
        // dateWithalign: moment(faker.date.past().toLocaleDateString()).format(
        //   "MMMM-DD-YYYY"
        // ),
      });
    }

    return rows;
  }
  const rowData = createRows();
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

describe("Datagrid Unit test for Alignment", () => {
  test("print window check", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    // const csvbtn = screen.getByText("Export To CSV");
    // expect(csvbtn).toBeInTheDocument();
  });
});
