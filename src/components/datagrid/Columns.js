import React from "react";
import { css } from "@linaria/core";
import { SelectCellFormatter } from "./formatters";
import { useRowSelection } from "./hooks/useRowSelection";
export const SERIAL_NUMBER_COLUMN_KEY = "serial-number";
export const SELECT_COLUMN_KEY = "select-row";

const headerCellClassName = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--rdg-serial-cell-background-color);
  color: var(--rdg-serial-cell-color);
  font-weight: var(--rdg-serial-cell-font-weight);
`;

function SelectFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection();

  return (
    <SelectCellFormatter
      aria-label="Select"
      isCellSelected={props.isCellSelected}
      value={isRowSelected}
      onChange={(checked, isShiftClick) => {
        onRowSelectionChange({ row: props.row, checked, isShiftClick });
      }}
    />
  );
}

function SelectGroupFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection();

  return (
    <SelectCellFormatter
      rowIndex={props.rowIndex}
      aria-label="Select Group"
      isCellSelected={props.isCellSelected}
      value={isRowSelected}
      onChange={(checked) => {
        onRowSelectionChange({ row: props.row, checked, isShiftClick: false });
      }}
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SelectColumn = {
  key: SELECT_COLUMN_KEY,
  name: "",
  width: 35,
  minWidth: 35,
  maxWidth: 35,
  resizable: false,
  sortable: false,
  frozen: true,
  filter: false,
  haveChildren: false,
  headerRenderer(props) {
    return (
      <SelectCellFormatter
        aria-label="Select All"
        isCellSelected={props.isCellSelected}
        value={props.allRowsSelected}
        onChange={props.onAllRowsSelectionChange}
      />
    );
  },
  cellRenderer(props) {
    return <SelectFormatter {...props} />;
  },
  groupFormatter(props) {
    return <SelectGroupFormatter {...props} />;
  },
};

export const SerialNumberColumn = {
  key: SERIAL_NUMBER_COLUMN_KEY,
  name: "Sr. No.",
  headerName: "Sr. No.",
  field: "Sr. No.",
  width: 50,
  maxWidth: 50,
  resizable: false,
  sortable: false,
  frozen: true,
  filter: false,
  haveChildren: false,
  headerRenderer: () => {
    return SerialNumberColumn.name;
  },
  cellClass: headerCellClassName,
  cellRenderer: (props) => {
    let serialNumber = props?.pagination
      ? props.paginationPageSize * (props.currentPage - 1)
      : 0;

    return <>{props.column.rowIndex + 1 + serialNumber} </>;
  },
};
