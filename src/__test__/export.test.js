import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";
import {
  CSVContent,
  exportToCsv,
  exportToPdf,
  exportToXlsx,
} from "../components/datagrid/exportUtils";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

jest.mock("file-saver", () => ({
  saveAs: jest.fn(),
}));

jest.mock("xlsx", () => ({
  utils: {
    json_to_sheet: jest.fn(),
  },
  write: jest.fn(),
}));
function LaiDataGrid(props) {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      var row;

      row = {
        id,
        name: `supplier ${i}`,
        format: `package ${i}`,
        position: "Run of site",
        price,
      };

      rows.push(row);
    }
    return rows;
  }
  const rowData = createRows();

  const columns = [
    {
      field: "id",
      headerName: "id",
      frozen: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
      filter: true,
    },
    {
      field: "format",
      headerName: "format",
    },
    {
      // field: "position",
      headerName: "position",
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
    },
  ];
  var csvContent;
  return (
    <>
      <button
        data-testid={"csv-content"}
        onClick={() => {
          csvContent = CSVContent(rowData, columns);
        }}
      >
        CSV Content
      </button>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        export={{
          pdfFileName: "TableData",
          csvFileName: "TableData",
          excelFileName: "TableData",
        }}
      />
    </>
  );
}

describe("Datagrid Unit test for Export", () => {
  test("CSV button and download", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const csvbtn = screen.getByTestId("Export to CSV");
    expect(csvbtn).toBeInTheDocument();
    const csvContentbtn = screen.getByTestId("csv-content");
    expect(csvContentbtn).toBeInTheDocument();
    fireEvent.click(csvContentbtn);
  });
  test("XSLX button and downloa", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const excelbtn = screen.getByTestId("Export to XSLX");
    expect(excelbtn).toBeInTheDocument();
    // fireEvent.click(excelbtn);
  });
  test("pdf button and download", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const pdfbtn = screen.getByTestId("Export to PDF");
    expect(pdfbtn).toBeInTheDocument();
    fireEvent.click(pdfbtn);
  });
  test("exports data to XLSX file", async () => {
    const fileData = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ];
    const columns = [
      { field: "id", headerName: "ID" },
      { field: "name", headerName: "Name" },
    ];
    const fileName = "data";

    const expectedFileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const expectedFileExtension = ".xlsx";
    const expectedSheetData = { data: "mockSheetData" };
    const expectedExcelBuffer = "mockExcelBuffer";
    const expectedBlob = { type: expectedFileType };

    // Mock the necessary functions and return values
    XLSX.utils.json_to_sheet.mockReturnValue(expectedSheetData);
    XLSX.write.mockReturnValue(expectedExcelBuffer);
    window.Blob = jest.fn().mockImplementation(() => expectedBlob);

    exportToXlsx(fileData, columns, fileName);

    // Check if the necessary functions were called with the correct arguments
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(fileData);
    expect(XLSX.write).toHaveBeenCalledTimes(1);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(
      expectedBlob,
      fileName + expectedFileExtension
    );
  });
});
