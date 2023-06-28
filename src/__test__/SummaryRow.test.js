import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";
import { faker } from "@faker-js/faker";
import moment from "moment";

function LaiDataGrid(props) {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      alignment: { type: "number" },

      summaryFormatter(props) {
        return <strong>Total-{props.column.idx}</strong>;
      },
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 100,
      alignment: true,
      colSpan: (props) => {
        console.log("Propss", props);
        if (props.type === "ROW" && props.rowIndex === 1) {
          return 3;
        }
      },
      summaryCellClass: (props) => {
        console.log("props");
      },
      summaryFormatter({ row }) {
        return <>{row.totalids}-records</>;
      },
    },

    {
      field: "lastName",
      headerName: "Last Name",
      width: 100,
      alignment: { type: "string" },
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
  ];

  function createRows() {
    const rows = [];

    for (let i = 0; i < 10; i++) {
      rows.push({
        id: i,
        email: `${faker.internet.email()} `,
        title: faker.name.prefix(),
        firstName: faker.name.firstName(),
        lastName: `lastName-${i}`,
        date: moment(faker.date.past().toLocaleDateString()).format(
          "MMMM-DD-YYYY"
        ),
        money: "₹101",
        time: new Date().toLocaleTimeString("en-IN"),
        datetime: moment(new Date()).format("MM-DD-YYYY h:mm:ss a"),
      });
    }

    return rows;
  }
  const rowData = createRows();
  const summaryRowsTop = [
    { totalids: rowData.length },
    { totalids: rowData.length + 1 },
    { totalids: rowData.length + 2 },
  ];
  const summaryRowsBottom = [{ totalids: rowData.length / 2 }];

  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        topSummaryRows={summaryRowsTop}
        bottomSummaryRows={summaryRowsBottom}
        className="fill-grid"
      />
    </>
  );
}

describe("Datagrid Unit test for Summarry Row", () => {
  test("print window check", () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const summarycell = screen.getByRole("gridcell", { name: "5-records" });
    expect(summarycell).toBeInTheDocument();
    fireEvent.click(summarycell);
  });
});
