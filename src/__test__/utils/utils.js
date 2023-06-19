import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import DataGrid from "../../components/datagrid/DataGrid";
export function setup(props) {
  return render(
    <StrictMode>
      <DataGrid {...props} />
    </StrictMode>
  );
}

export function getGrid() {
  return screen.getByRole("grid");
}

export function queryGrid() {
  return screen.queryByRole("grid");
}

export function getRows() {
  return screen.getAllByRole("row").slice(1);
}

export function queryRows() {
  return screen.queryAllByRole("row").slice(1);
}

export function getCellsAtRowIndex(rowIdx) {
  return Array.from(
    document.querySelectorAll(`[aria-rowindex="${rowIdx + 2}"] > .rdg-cell`)
  );
}

export function getCells() {
  return screen.getAllByRole("gridcell");
}

export function queryCells() {
  return screen.queryAllByRole("gridcell");
}

export function getHeaderCells() {
  return screen.getAllByRole("columnheader");
}

export function queryHeaderCells() {
  return screen.queryAllByRole("columnheader");
}

export function getSelectedCell() {
  return (
    screen.queryByRole("gridcell", { selected: true }) ??
    screen.queryByRole("columnheader", { selected: true })
  );
}
