import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";

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
    },
  ];
  const rows = createRows();
  const [expandedId, setExpandedId] = useState([]);
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rows}
        rowHeight={24}
        detailedRowIds={expandedId}
        onDetailedRowIdsChange={(ids) => setExpandedId(ids)}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for Responsive Detailed Row", () => {
  test("DetailedRow tab view with single", async () => {
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
  test("DetailedRow tab view with multiple", async () => {
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
    render(
      <LaiDataGrid
        detailedRow={true}
        detailedRowType={"multiple"}
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
  test("DetailedRow desktop view with multiple", async () => {
    render(<LaiDataGrid detailedRow={true} detailedRowType={"multiple"} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const content = screen.getByText("Title 0");
    expect(content).toBeInTheDocument();
    fireEvent.click(content);

    const expandIcon = screen.getByTestId("details-expand-icon-0");
    expect(expandIcon).toBeInTheDocument();
    fireEvent.click(expandIcon);
    const expandIcon1 = screen.getByTestId("details-expand-icon-1");
    expect(expandIcon1).toBeInTheDocument();
    fireEvent.click(expandIcon1);
  });
  test("DetailedRow tab view with cell ToolTip", async () => {
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
  test("DetailedRow tab view with cell ToolTip static", async () => {
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
  test("DetailedRow tab view with cell ToolTip dynamic", async () => {
    const mobileViewWidth = 360;
    const mobileViewHeight = 640;
    window.innerWidth = mobileViewWidth;
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
