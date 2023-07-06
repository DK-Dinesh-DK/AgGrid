import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import TextEditor from "../components/datagrid/editors/textEditor";
import React, { useRef, useState } from "react";

const columns = [
  {
    field: "name",
    headerName: "Name",
    haveChildren: true,
    children: [
      {
        field: "firstname",
        headerName: "First Name",
        filter: true,
        cellEditor: TextEditor,
      },
      {
        field: "lastname",
        filter: true,
        headerName: "Last Name",
        cellEditor: TextEditor,
      },
    ],
  },
  {
    field: "number",
    headerName: "Number",
    haveChildren: true,
    children: [
      { field: "homenumber", headerName: "Home Numer", cellEditor: TextEditor },
      {
        field: "personalnumber",
        headerName: "Personal Number",
        cellEditor: TextEditor,
      },
    ],
  },
  {
    field: "address",
    filter: true,
    headerName: "Address",
    cellEditor: TextEditor,
  },
  { field: "school", headerName: "School", cellEditor: TextEditor },
  { field: "class", headerName: "Class", cellEditor: TextEditor },
];
const initialRows = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    homenumber: "9987654336",
    personalnumber: "4545454534",
    address: "Marathahali",
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
    firstname: "Namitoh",
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

function LaiDataGrid() {
  const [rows, setRows] = useState(initialRows);
  const dataRef = useRef(null);
  return (
    <>
      <button
        data-testid={"destroyFilter"}
        onClick={() => {
          dataRef.current.api.destroyFilter(" firstname");
        }}
      >
        destroyFilter
      </button>
      <DataGrid
        columnData={columns}
        testId={"datagridMultilineHeader"}
        rowData={rows}
        innerRef={dataRef}
        headerRowHeight={24}
        className="fill-grid"
        onRowsChange={setRows}
        rowKeyGetter={(data) => data.id}
        enableVirtualization={false}
        selection={true}
      />
    </>
  );
}

describe("Datagrid Unit test", () => {
  test("Filter features", async () => {
    render(<LaiDataGrid />);

    const filterIcon = screen.getByTestId("filterIcon_First Name");
    expect(filterIcon).toBeInTheDocument();

    userEvent.click(filterIcon);

    await waitFor(() => {
      const filterDropdown = screen.getByTestId("filterDropdown");
      expect(filterDropdown).toBeInTheDocument();
    });

    const selectElement = screen.getByRole("combobox");
    const inputElement = screen.getByRole("textbox");
    expect(selectElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();

    // Check if the rows are filtered correctly as per "Contain"
    fireEvent.change(selectElement, { target: { value: "Contain" } });
    fireEvent.change(inputElement, { target: { value: "du" } });
    const filteredRowsAsPerContain = screen.getAllByRole("row");
    expect(filteredRowsAsPerContain).toHaveLength(1);
    expect(filteredRowsAsPerContain[0].textContent).toContain("Suvendu");
    expect(filteredRowsAsPerContain[0].textContent).toContain("ndu");

    // Check if the rows are filtered correctly as per "Ends With..."
    fireEvent.change(selectElement, { target: { value: "Ends With..." } });
    userEvent.clear(inputElement);
    fireEvent.change(inputElement, { target: { value: "hn" } });
    const filteredRowsAsPerEndsWith = screen.getAllByRole("row");
    expect(filteredRowsAsPerEndsWith).toHaveLength(1);
    expect(filteredRowsAsPerEndsWith[0].textContent).toContain("John");
    expect(filteredRowsAsPerEndsWith[0].textContent).toContain("ohn");
    expect(filteredRowsAsPerEndsWith[0].textContent).not.toContain("Suvendu");

    // Check if the rows are filtered correctly as per "Starts With..."
    fireEvent.change(selectElement, { target: { value: "Starts With..." } });
    userEvent.clear(inputElement);
    fireEvent.change(inputElement, { target: { value: "Su" } });
    const filteredRowsAsPerStartsWith = screen.getAllByRole("row");
    expect(filteredRowsAsPerStartsWith).toHaveLength(1);
    expect(filteredRowsAsPerStartsWith[0].textContent).toContain("Suvendu");
    expect(filteredRowsAsPerStartsWith[0].textContent).toContain("Su");
    expect(filteredRowsAsPerStartsWith[0].textContent).not.toContain("John");

    // Check if the rows are filtered correctly as per "Equals"
    fireEvent.change(selectElement, { target: { value: "Equals" } });
    userEvent.clear(inputElement);
    fireEvent.change(inputElement, { target: { value: "John" } });
    const filteredRowsAsPerEqual = screen.getAllByRole("row");
    expect(filteredRowsAsPerEqual).toHaveLength(1);
    expect(filteredRowsAsPerEqual[0].textContent).toContain("John");
    expect(filteredRowsAsPerEqual[0].textContent).not.toContain("Suvendu");

    // Check if the rows are filtered correctly as per "Not Equals"
    fireEvent.change(selectElement, { target: { value: "Not Equals" } });
    userEvent.clear(inputElement);
    fireEvent.change(inputElement, { target: { value: "Suvendu" } });
    const filteredRowsAsPerNotEqual = screen.getAllByRole("row");
    expect(filteredRowsAsPerNotEqual).toHaveLength(3);
    expect(filteredRowsAsPerNotEqual[0].textContent).toContain("John");
    expect(filteredRowsAsPerNotEqual[1].textContent).toContain("Namitoh");
    expect(filteredRowsAsPerNotEqual[2].textContent).toContain("Pravalika");
    expect(filteredRowsAsPerNotEqual[0].textContent).not.toContain("Suvendu");
  });
  test("Filter features", async () => {
    render(<LaiDataGrid />);

    const filterIcon = screen.getByTestId("filterIcon_First Name");
    expect(filterIcon).toBeInTheDocument();

    userEvent.click(filterIcon);

    await waitFor(() => {
      const filterDropdown = screen.getByTestId("filterDropdown");
      expect(filterDropdown).toBeInTheDocument();
    });

    const selectElement = screen.getByRole("combobox");
    const inputElement = screen.getByRole("textbox");
    expect(selectElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();

    // Check if the rows are filtered correctly as per "Contain"
    fireEvent.change(selectElement, { target: { value: "Contain" } });
    fireEvent.change(inputElement, { target: { value: "du" } });
    const filteredRowsAsPerContain = screen.getAllByRole("row");
    expect(filteredRowsAsPerContain).toHaveLength(1);
    expect(filteredRowsAsPerContain[0].textContent).toContain("Suvendu");
    expect(filteredRowsAsPerContain[0].textContent).toContain("ndu");
    const destroyFilterBtn = screen.getByTestId("destroyFilter");
    expect(destroyFilterBtn).toBeInTheDocument();
    fireEvent.click(destroyFilterBtn);
  });
});
