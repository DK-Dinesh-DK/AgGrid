import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";
import { TextEditor } from "../components/datagrid/editors";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 20; i++) {
      rows.push({
        id: i,
        "sr.no": i + 1,
        title: `Title ${i}`,
        count: i * 1000,
      });
    }

    return rows;
  }

  const columns = [
    { field: "sr.no", headerName: "SR.NO" },
    { field: "id", headerName: "ID", filter: true },
    {
      field: "title",
      headerName: "Title",
      filter: true,
      sortable: true,
      toolTip: true,
    },
    {
      field: "count",
      headerName: "Count",
      cellRenderer: TextEditor,
    },
  ];
  const [rows, setRows] = useState(createRows());
  const [expandedId, setExpandedId] = useState([]);
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rows}
        rowHeight={24}
        detailedRowIds={expandedId}
        onRowsChange={(rows) => {
          setRows(rows);
        }}
        onDetailedRowIdsChange={(ids) => setExpandedId(ids)}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for Responsive Detailed Row", () => {
  test("DetailedRow Mobile view with single", async () => {
    const mobileViewWidth = 360;
    const mobileViewHeight = 640;
    window.innerWidth = mobileViewWidth;
    window.innerHeight = mobileViewHeight;
    render(
      <LaiDataGrid
        detailedRow={true}
        onRowClicked={(params) => {
          console.log("Onclciked", params);
        }}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const expandIcon = screen.getByTestId("details-expand-icon-0");
    expect(expandIcon).toBeInTheDocument();
    fireEvent.click(expandIcon);
    const detailCell = screen.getByRole("gridcell", { name: "Count" });
    expect(detailCell).toBeInTheDocument();
    fireEvent.click(detailCell);
  });
  test("DetailedRow Mobile view with multiple", async () => {
    const mobileViewWidth = 360;
    const mobileViewHeight = 640;
    window.innerWidth = mobileViewWidth;
    window.innerHeight = mobileViewHeight;
    render(<LaiDataGrid detailedRow={true} detailedRowType={"multiple"} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const expandIcon = screen.getByTestId("details-expand-icon-0");
    expect(expandIcon).toBeInTheDocument();
    fireEvent.click(expandIcon);
    const expandIcon1 = screen.getByTestId("details-expand-icon-1");
    expect(expandIcon1).toBeInTheDocument();
    fireEvent.click(expandIcon1);
  });
  test("DetailedRow desktop view with single", async () => {
    const deskTopViewWidth = 1024;
    window.innerWidth = deskTopViewWidth;
    render(
      <LaiDataGrid
        detailedRow={true}
        detailedRowType={"multiple"}
        desktopDetailedRowEnable={true}
        onCellClicked={(params) => {
          console.log("OnCellclciked", params);
        }}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const expandIcon = screen.getByTestId("details-expand-icon-0");
    expect(expandIcon).toBeInTheDocument();
    fireEvent.click(expandIcon);
    const detailCell = screen.getByRole("gridcell", { name: "Count" });
    expect(detailCell).toBeInTheDocument();
    fireEvent.click(detailCell);
  });
  test("DetailedRow desktop view with single", async () => {
    const deskTopViewWidth = 1024;
    window.innerWidth = deskTopViewWidth;
    render(
      <LaiDataGrid
        detailedRow={true}
        detailedRowType={"multiple"}
        desktopDetailedRowEnable={true}
        onCellClicked={(params) => {
          console.log("OnCellclciked", params);
        }}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const detailCell = screen.getByTestId("gird-text-editor-4-0");
    expect(detailCell).toBeInTheDocument();
    fireEvent.change(detailCell, { target: { value: "1010" } });
    const expandIcon = screen.getByTestId("details-expand-icon-0");
    expect(expandIcon).toBeInTheDocument();
    fireEvent.click(expandIcon);
    const input1 = screen.getByTestId("gird-text-editor-4-undefined");
    expect(input1).toBeInTheDocument();
    fireEvent.click(input1);
    fireEvent.change(input1, { target: { value: "101" } });
  });

  test("DetailedRow Mobile view with cell ToolTip", async () => {
    const mobileViewWidth = 360;
    const mobileViewHeight = 640;
    window.innerWidth = mobileViewWidth;
    window.innerHeight = mobileViewHeight;
    render(<LaiDataGrid detailedRow={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cont1 = screen.getByText("Title 0");
    expect(cont1).toBeInTheDocument();
    fireEvent.mouseOver(cont1);
    fireEvent.mouseMove(cont1);
    fireEvent.mouseOut(cont1);
  });
  test("DetailedRow Mobile view with cell ToolTip static", async () => {
    const mobileViewWidth = 360;
    const mobileViewHeight = 640;
    window.innerWidth = mobileViewWidth;
    window.innerHeight = mobileViewHeight;
    render(<LaiDataGrid detailedRow={true} rowLevelToolTip={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cont1 = screen.getByText("Title 0");
    expect(cont1).toBeInTheDocument();
    fireEvent.mouseOver(cont1);
    fireEvent.mouseOut(cont1);
  });
  test("DetailedRow Tab view with cell ToolTip dynamic", async () => {
    const tabViewWidth = 750;
    const mobileViewHeight = 640;
    window.innerWidth = tabViewWidth;
    window.innerHeight = mobileViewHeight;
    render(
      <LaiDataGrid detailedRow={true} rowLevelToolTip={() => "ToolTip"} />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const cont1 = screen.getByText("Title 0");
    expect(cont1).toBeInTheDocument();
    fireEvent.mouseOver(cont1);
    fireEvent.mouseOut(cont1);
  });
});
