import { act, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import { getCellsAtRowIndex } from "./utils/utils";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
beforeAll(() => {
  userEvent.setup();
  window.HTMLElement.prototype.scrollIntoView = function () { };
});

const columns = [
  {
    field: "id",
    headerName: "ID"
  },
  {
    field: "name",
    headerName: "Name",
    haveChildren: true,
    children: [
      { field: "firstname", headerName: "First Name" },
      { field: "lastname", headerName: "Last Name" },
    ],
  },
  {
    field: "number",
    headerName: "Number",
    haveChildren: true,
    children: [
      { field: "homenumber", headerName: "Home Numer" },
      {
        field: "personalnumber",
        headerName: "Personal Number",

      },
    ],
  },
  { field: "address", headerName: "Address" },
  { field: "school", headerName: "School" },
  { field: "class", headerName: "Class" },
];
const initialRows = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    homenumber: "9987654336",
    personalnumber: "4545454534",
    address: "WhiteField",
    school: "DAV",
    class: "10th",
  },
  {
    id: 2,
    firstname: "Suvendu",
    lastname: "Sahoo",
    homenumber: "8976543234",
    personalnumber: "8765789045",
    address: "Kodihali",
    school: "DPS",
    class: "7th",
  },
  {
    id: 3,
    firstname: "Namit",
    lastname: "Singh",
    homenumber: "6765458907",
    personalnumber: "8769034156",
    address: "Marathahali",
    school: "DPS",
    class: "8th",
  },
  {
    id: 4,
    firstname: "Pravalika",
    lastname: "Reddy",
    homenumber: "9098654567",
    personalnumber: "6578934123",
    address: "Indira Nagar",
    school: "DAV",
    class: "9th",
  },
];


function LaiDataGrid(props) {
  const [rows, setRows] = useState(initialRows);
  return (
    <DataGrid
      columnData={columns}
      testId={"laidatagrid"}
      rowData={rows}
      headerRowHeight={24}
      className="fill-grid"
      rowKeyGetter={(data) => data.id}
      enableVirtualization={false}
      selection={props.selection}
      showSelectedRows={props.showSelectedRows}
    />
  );
}


describe("Show selected rows prop works correctly", () => {
  test("Show selected rows is rendered when showSelectedRows prop is passed", () => {
    render(
      <LaiDataGrid
        showSelectedRows={true}
      />
    );
    const selectedRowsCount = screen.getByText(
      `0 out of ${initialRows.length} selected`
    );

    expect(selectedRowsCount).toBeInTheDocument();
  });
  test("Show selected rows is rendered when showSelectedRows=false or prop is not passed", () => {
    render(
      <LaiDataGrid
        showSelectedRows={false}
      />
    );
    const selectedRowsCount = screen.queryByText(
      `0 out of ${initialRows.length} selected`
    );
    expect(selectedRowsCount).not.toBeInTheDocument();
  });

  test("Show selected rows shows correct number of rows when row is selected", async () => {
    render(<LaiDataGrid
      selection={true}
      showSelectedRows={true}
    />);

    const selectedCheckBoxes = [];

    let selectedRowsCount = screen.getByText(
      `0 out of ${initialRows.length} selected`
    );
    expect(selectedRowsCount).toBeInTheDocument();

    // Selecting checkbox at rowIndex 2
    selectedCheckBoxes.push(
      within(getCellsAtRowIndex(2)[0]).getByLabelText("Select")
    );

    expect(selectedCheckBoxes[0]).not.toBeChecked();
    await act(async () => await userEvent.click(selectedCheckBoxes[0]));
    expect(selectedCheckBoxes[0]).toBeChecked();

    selectedRowsCount = screen.getByText(
      `${selectedCheckBoxes.length} out of ${initialRows.length} selected`
    );
    expect(selectedRowsCount).toBeInTheDocument();

    //Selecting checkbox at rowIndex 3
    selectedCheckBoxes.push(
      within(getCellsAtRowIndex(3)[0]).getByLabelText("Select")
    );
    expect(selectedCheckBoxes[1]).not.toBeChecked();
    await act(async () => await userEvent.click(selectedCheckBoxes[1]));
    expect(selectedCheckBoxes[1]).toBeChecked();

    selectedRowsCount = screen.getByText(
      `${selectedCheckBoxes.length} out of ${initialRows.length} selected`
    );
    expect(selectedRowsCount).toBeInTheDocument();
  });
  test("Show selected rows shows correct number of rows when all rows are selected", async () => {
    render(<LaiDataGrid
      selection={true}
      showSelectedRows={true}
    />);

    let selectedRowsCount = screen.getByText(
      `0 out of ${initialRows.length} selected`
    );
    expect(selectedRowsCount).toBeInTheDocument();

    const headerCheckbox = screen.getByRole("checkbox", {
      name: /select all/i,
    });
    let allCheckboxes = screen.getAllByRole("checkbox", { name: "Select" });

    //Selecting the headercheckbox to select all rows
    expect(headerCheckbox).not.toBeChecked();
    await act(async () => {
      await userEvent.click(headerCheckbox);
    });
    expect(headerCheckbox).toBeChecked();

    //checking whether all checkboxes are selected
    allCheckboxes.forEach((checkbox) => expect(checkbox).toBeChecked);

    //checking selected row count
    selectedRowsCount = screen.queryByText(
      `${initialRows.length} out of ${initialRows.length} selected`
    );
    expect(selectedRowsCount).toBeInTheDocument();

    //deselecting one row to see if it deselects the headercheckbox
    expect(allCheckboxes[3]).toBeChecked();
    await act(async () => {
      await userEvent.click(allCheckboxes[3]);
    });
    expect(allCheckboxes[3]).not.toBeChecked();
    expect(headerCheckbox).not.toBeChecked();

    //checking selected row count
    selectedRowsCount = screen.queryByText(
      `${initialRows.length - 1} out of ${initialRows.length} selected`
    );
    expect(selectedRowsCount).toBeInTheDocument();
  });
});
