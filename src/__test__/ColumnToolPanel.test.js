import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";
import userEvent from "@testing-library/user-event";
function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 50; i++) {
      rows.push({
        id: i,
        title: `Task #${i + 1}`,
        area: `Area #${i + 1}`,
        contact: `Contanct #${i + 1}`,
      });
    }

    return rows;
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      frozen: true,
      width: 60,
    },
    {
      field: "title",
      headerName: "Title",
      frozen: true,
      width: 100,
    },
    {
      field: "area",
      headerName: "Area",
      width: 150,
    },
    {
      field: "contact",
      headerName: "Contact",
      width: 150,
    },
  ];
  const rows = createRows();

  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rows}
        columnPanel={true}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for Column Tool Panel", () => {
  test("Column Tool Panel column Only", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const allinOne = screen.getByText("All in One");
    expect(allinOne).toBeInTheDocument();
    fireEvent.click(allinOne);
    const closeIcon = screen.getByTestId(
      "allinone-column-tool-panel-close-icon"
    );
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
  test("Column Tool Panel column All in one option", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const allinOne = screen.getByText("All in One");
    expect(allinOne).toBeInTheDocument();
    fireEvent.click(allinOne);
    const cancelBtn = screen.getByTestId("allinOne-option-cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    fireEvent.click(allinOne);
    const checkbox = screen.getByTestId("Area-hide-checkbox-all");
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    const freezeinput = screen.getByTestId(
      "Title-allinone-freeze-radio-button"
    );
    expect(freezeinput).toBeInTheDocument();
    fireEvent.click(freezeinput);
    fireEvent.click(freezeinput);
    const numInput = screen.getByTestId("Title-set-width-number-input-all");
    expect(numInput).toBeInTheDocument();
    fireEvent.change(numInput, { target: { value: 150 } });
    fireEvent.change(numInput, { target: { value: 100 } });
    const dragElement = screen.getByTestId("drag-div-all-Title");
    const tergetElement = screen.getByTestId("drag-div-all-ID");
    expect(dragElement).toBeInTheDocument();
    expect(tergetElement).toBeInTheDocument();
    fireEvent.dragStart(dragElement);
    fireEvent.dragOver(tergetElement);
    fireEvent.drop(tergetElement);
    fireEvent.dragEnd(dragElement);
    const okBtn = screen.getByTestId("allinOne-option-ok-btn");
    expect(okBtn).toBeInTheDocument();
    fireEvent.click(okBtn);
    fireEvent.click(toolPanelIcon);
    fireEvent.click(allinOne);

    // fireEvent.click(toolPanelCloseIcon);
  });
  test("Column Tool Panel column show/hide option", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const showHideOption = screen.getByText("Show/ Hide Columns");
    expect(showHideOption).toBeInTheDocument();
    fireEvent.click(showHideOption);
    const cancelBtn = screen.getByTestId("hide-option-cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    fireEvent.click(showHideOption);
    const checkbox = screen.getByTestId("Area-hide-checkbox");
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    const okBtn = screen.getByTestId("hide-option-ok-btn");
    expect(okBtn).toBeInTheDocument();
    fireEvent.click(okBtn);
    fireEvent.click(toolPanelIcon);
    fireEvent.click(showHideOption);
  });
  test("Column Tool Panel column show/hide option1", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const showHideOption = screen.getByText("Show/ Hide Columns");
    expect(showHideOption).toBeInTheDocument();
    fireEvent.click(showHideOption);
    const closeIcon = screen.getByTestId("hide-column-tool-panel-close-icon");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
  test("Column Tool Panel column Freeze Columns option", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const freezeColumnsOptions = screen.getByText("Freeze Columns");
    expect(freezeColumnsOptions).toBeInTheDocument();
    fireEvent.click(freezeColumnsOptions);
    const cancelBtn = screen.getByTestId("freeze-option-cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    fireEvent.click(freezeColumnsOptions);
    const radio = screen.getByTestId("Title-freeze-radio-button");
    fireEvent.click(radio);
    fireEvent.click(radio);
    const okBtn = screen.getByTestId("freeze-option-ok-btn");
    expect(okBtn).toBeInTheDocument();
    fireEvent.click(okBtn);
  });
  test("Column Tool Panel column Freeze Columns option1", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const freezeColumnsOptions = screen.getByText("Freeze Columns");
    expect(freezeColumnsOptions).toBeInTheDocument();
    fireEvent.click(freezeColumnsOptions);
    const closeIcon = screen.getByTestId("freeze-column-tool-panel-close-icon");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
  test("Column Tool Panel Find", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const findColumnsOptions = screen.getByTestId(
      "column-toolpanel-option-Find"
    );
    expect(findColumnsOptions).toBeInTheDocument();
    fireEvent.click(findColumnsOptions);
    const input = screen.getByTestId("find-option-text-input");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "Task" } });
    const nextBtn = screen.getByTestId("find-option-findnext-button");
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);
    const matchcaseCheckbox = screen.getByTestId(
      "find-option-matchcase-checkbox"
    );
    expect(matchcaseCheckbox).toBeInTheDocument();
    fireEvent.click(matchcaseCheckbox);
    const matchwordCheckbox = screen.getByTestId(
      "find-option-matchword-checkbox"
    );
    expect(matchwordCheckbox).toBeInTheDocument();
    fireEvent.click(matchwordCheckbox);
    fireEvent.change(input, { target: { value: "Task #1" } });
    const cancelBtn = screen.getByTestId("find-option-cancel-button");
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    fireEvent.click(toolPanelIcon);
    const findColumnsOptions1 = screen.getByTestId(
      "column-toolpanel-option-Find"
    );
    fireEvent.click(findColumnsOptions1);
    const closeIcon = screen.getByTestId("column-tool-panel-find-close-icon");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
  test("Column Tool Panel Find1", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const findColumnsOptions = screen.getByTestId(
      "column-toolpanel-option-Find"
    );
    expect(findColumnsOptions).toBeInTheDocument();
    fireEvent.click(findColumnsOptions);
    const closeIcon = screen.getByTestId("column-tool-panel-find-close-icon");
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
  test("Column Tool Panel column set Columns Width option", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const setWidthOptions = screen.getByText("Set Columns Width");
    expect(setWidthOptions).toBeInTheDocument();
    fireEvent.click(setWidthOptions);
    const cancelBtn = screen.getByTestId("setWidth-option-cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    fireEvent.click(setWidthOptions);
    const numInput = screen.getByTestId("Title-set-width-number-input");
    expect(numInput).toBeInTheDocument();
    fireEvent.change(numInput, { target: { value: 150 } });
    fireEvent.change(numInput, { target: { value: 100 } });

    const okBtn = screen.getByTestId("setWidth-option-ok-btn");
    expect(okBtn).toBeInTheDocument();
    fireEvent.click(okBtn);
  });
  test("Column Tool Panel column set Columns Width option1", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const setWidthOptions = screen.getByText("Set Columns Width");
    expect(setWidthOptions).toBeInTheDocument();
    fireEvent.click(setWidthOptions);
    const closeIcon = screen.getByTestId(
      "setColumnsWidth-column-tool-panel-close-icon"
    );
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });

  test("Column Tool Panel column Re-Arrange Column option", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const re_ArrangeColumnOptions = screen.getByText("Re-Arrange Columns");
    expect(re_ArrangeColumnOptions).toBeInTheDocument();
    fireEvent.click(re_ArrangeColumnOptions);
    const dragElement = screen.getByTestId("drag-div-Title");
    const tergetElement = screen.getByTestId("drag-div-ID");
    expect(dragElement).toBeInTheDocument();
    expect(tergetElement).toBeInTheDocument();
    fireEvent.dragStart(dragElement);
    fireEvent.dragOver(tergetElement);
    fireEvent.drop(tergetElement);
    fireEvent.dragEnd(dragElement);
    const cancelBtn = screen.getByTestId("reArrange-option-cancel-btn");
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    fireEvent.click(re_ArrangeColumnOptions);
    const okBtn = screen.getByTestId("reArrange-option-ok-btn");
    expect(okBtn).toBeInTheDocument();
    fireEvent.click(okBtn);
  });
  test("Column Tool Panel column Re-Arrange Column option1", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const re_ArrangeColumnOptions = screen.getByText("Re-Arrange Columns");
    expect(re_ArrangeColumnOptions).toBeInTheDocument();
    fireEvent.click(re_ArrangeColumnOptions);
    const closeIcon = screen.getByTestId(
      "reArrange-column-tool-panel-close-icon"
    );
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
  });
  test("Column Tool Panel Size Columns To Fit Column option", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const sizeToFit = screen.getByText("Size Columns To Fit");
    expect(sizeToFit).toBeInTheDocument();
    fireEvent.click(sizeToFit);
  });
  test("Column Tool Panel Reset Columns Width option", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
    fireEvent.click(toolPanelIcon);
    const resetWidth = screen.getByText("Reset Columns Width");
    expect(resetWidth).toBeInTheDocument();
    fireEvent.click(resetWidth);
  });
  test("Column Tool Panel column Only with serial", async () => {
    render(<LaiDataGrid serialNumber={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
  });
  test("Column Tool Panel column Only with selection", async () => {
    render(<LaiDataGrid selection={true} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toolPanelIcon = screen.getByTestId("column-tool-panel-icon");
    expect(toolPanelIcon).toBeInTheDocument();
  });
});
