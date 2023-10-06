import { render, within, screen } from "@testing-library/react";
import DataGrid from "../components/datagrid/DataGrid";
import { queryHeaderCells } from "./utils/utils";
import "@testing-library/jest-dom";

function createRows() {
  const rows = [];

  for (let i = 1; i < 10; i++) {
    rows.push({
      id: i,
      task: `Task #${i}`,
    });
  }

  return rows;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "task",
    headerName: "Task",
  },
];

const rows = createRows();
describe("SerialNumber Column Renders correctly", () => {
  test("Page has serial number column after passing serialNumber or serialNumber=true", () => {
    render(
      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
        serialNumber={true}
      />
    );
    const serialNumberColumn = screen.getByText(/sr\. no\./i);
    expect(serialNumberColumn).toBeInTheDocument();
  });
  test("Page has serial number column after passing serialNumber or serialNumber=true", () => {
    render(
      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
        serialNumber={true}
        serialColumnStyle={{ backgroundColor: "red" }}
      />
    );
    const serialNumberColumn = screen.getByText(/sr\. no\./i);
    expect(serialNumberColumn).toBeInTheDocument();
  });
  test("Page has serial number column after passing serialNumber or serialNumber=true", () => {
    render(
      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
        serialNumber={true}
        serialColumnStyle={() => {
          return { backgroundColor: "red" };
        }}
      />
    );
    const serialNumberColumn = screen.getByText(/sr\. no\./i);
    expect(serialNumberColumn).toBeInTheDocument();
  });
  test("Page doesnt serial number column serialNumber=false or prop is not passed", () => {
    render(
      <DataGrid
        columnData={columns}
        rowData={rows}
        enableVirtualization={false}
      />
    );
    const serialNumberColumn = screen.queryByText(/sr\. no\./i);
    expect(serialNumberColumn).not.toBeInTheDocument();
  });
});
