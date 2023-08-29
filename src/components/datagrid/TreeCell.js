import React, { memo, useRef, useState } from "react";

import { getCellStyle, getCellClassname } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";
import {
  bottomRowIsSelectedClassName,
  rowIsSelectedClassName,
  topRowIsSelectedClassName,
} from "./style";

function TreeCell({
  id,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  row,
  treeColumnIndex,
  toggleTree: toggleTreeWrapper,
  level,
  selection,
  serialNumber,
  viewportColumns,
  allrow,
  selectedCellIdx,
  selectedCellEditor,
  apiObject,
  onRowChange,
  node,
  rowIndex,
  isRowSelected,
  selectCell,
  valueChangedCellStyle,
  previousData,
  setMouseY,
  setToolTip,
  setToolTipContent,
  ...props
}) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleTree() {
    toggleTreeWrapper(id);
  }
  let style = getCellStyle(column);
  const gridCell = useRef(null);

  const [value, setValue] = useState(
    column?.cellRendererParams?.value ?? row[column.key]
  );
  function handleToolTip(value) {
    setToolTip(value);
  }
  function handleToolTipContent(value) {
    setToolTipContent(value);
  }
  let cellParams = {
    column: column,
    data: row,
    value: value,
    node: node,
    colDef: column,
    api: apiObject,
    eGridCell: gridCell.current,
    refreshCell: () => {
      const content = document.getElementById(
        `${rowIndex}${row[column.key]}`
      ).innerHTML;
      document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML =
        content;
    },
    getValue: () => value,
    setValue: (newValue) => {
      setValue(newValue);
      row[column.key] = newValue;
    },
    handleToolTip,
    handleToolTipContent,
  };

  const cellRendererParams =
    typeof column?.cellRendererParams === "function"
      ? column?.cellRendererParams(cellParams)
      : column?.cellRendererParams;

  function handleClick(e) {
    selectCell(row, column);
    if(!column.readOnly){props.onRowClick?.({
      api: props.api,
      data: row,
      columnApi: props.columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowClicked",
      event: e,
    })
    props.onCellClick?.({
      api: props.api,
      colDef: {
        field: column.field,
        resizable: column.resizable,
        sortable: column.sortable,
        width: column.width,
      },
      data: row,
      node: node,
      columnApi: props.columnApi,
      rowIndex: rowIndex,
      value: row[column.field] ?? undefined,
      type: "cellClicked",
      event: e,
    })}
  }
  function handleRowChange(newRow) {
    onRowChange(column, rowIndex, newRow, row);
  }

  const { cellClass } = column;
  const topRow = rowIndex === 0 && isRowSelected ? true : false;
  const bottomRow =
    rowIndex === allrow.length - 1 && isRowSelected ? true : false;
  const middleRow = !(topRow || bottomRow) && isRowSelected ? true : false;
  const className = getCellClassname(
    column,
    `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`,
    {
      [rowIsSelectedClassName]: middleRow,
      [topRowIsSelectedClassName]: topRow,
      [bottomRowIsSelectedClassName]: bottomRow,
    },
    typeof cellClass === "function" ? cellClass(row) : cellClass
  );
  if (valueChangedCellStyle) {
    if (previousData[rowIndex]?.includes(column.key)) {
      style = {
        ...style,
        backgroundColor:
          valueChangedCellStyle.backgroundColor ?? style.backgroundColor,
        color: valueChangedCellStyle.color ?? style.color,
      };
    }
  }
  let cellRender = {
    childRows,
    column,
    row,
    isExpanded,
    isCellSelected,
    toggleTree,
    colDef: column,
    viewportColumns,
    data: row,
    // rowArray,
    allrow,
    selectedCellIdx,
    selectedCellEditor,
    api: apiObject,
    node,
    value,
    rowIndex,
    treeData: props.treeData,
    selectCell,
    onRowChange: handleRowChange,
    onRowClick: props.onRowClick,
    onCellClick: props.onCellClick,
    onRowDoubleClick: props.onRowDoubleClick,
    valueFormatted: cellRendererParams?.valueFormatted,
    fullWidth: cellRendererParams?.fullWidth,
    eGridCell: gridCell.current,
    // refreshCell: () => {
    //   const content = document.getElementById(
    //     `${rowIndex}${row[column.key]}`
    //   ).innerHTML;
    //   document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML =
    //     content;
    // },
    getValue: () => value,
    // setValue: (newValue) => {
    //   setValue(newValue);
    // },
    handleToolTip,
    handleToolTipContent,
    ...cellRendererParams,
  };

  function TreeViewCell() {
    return (
      <>
        <span
          className="tree-expand-icon"
          data-testId={`tree-expand-icon${rowIndex}`}
          style={{
            cursor: "pointer",
            paddingLeft: `${level * 10 + 10}px`,
            width: "30%",
            textAlign: "start",
          }}
          onClick={toggleTree}
        >
          {isExpanded ? "\u25BC" : "\u25B6"}
        </span>
        <span
          style={{
            width: "70%",
            textAlign: "start",
            paddingLeft: `${level * 5 + 5}px`,
          }}
        >
          {(!column.rowGroup || treeColumnIndex === column.idx) &&
            column.treeFormatter?.({
              childRows,
              column,
              row,
              isExpanded,
              isCellSelected,
              treeData: props.treeData,
              toggleTree,
              value,
              allrow,
            })}
        </span>
      </>
    );
  }

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      role="gridcell"
      id={
        row.children
          ? `tree-cell-${column.idx}-${rowIndex}`
          : `cell-id-${column.idx}-${rowIndex}`
      }
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      ref={ref}
      tabIndex={tabIndex}
      key={column.key}
      className={className}
      style={{
        ...style,
        display: "flex",
        width: "100%",
        justifyContent: "center",
      }}
      onClick={handleClick}
      onFocus={onFocus}
      // onDoubleClick={toggleTree}
      onMouseMove={(e) => {
        const element = document.getElementById(
          row.children
            ? `tree-cell-${column.idx}-${rowIndex}`
            : `cell-id-${column.idx}-${rowIndex}`
        );
        let y = element.getBoundingClientRect().y;
        setMouseY(y + props.Rowheight / 2);
      }}
    >
      {column.idx < 1 &&
        serialNumber &&
        column.cellRenderer({ ...cellRender, column: { ...column, rowIndex } })}

      {column.idx < 1 && selection && column.cellRenderer(cellRender)}
      {column.idx === 0 && !selection && !serialNumber && TreeViewCell()}
      {column.idx >= 1 &&
        !selection &&
        !serialNumber &&
        column.cellRenderer?.(cellRender)}
      {column.idx === 1 && !selection && serialNumber && TreeViewCell()}
      {column.idx === 1 && selection && !serialNumber && TreeViewCell()}
      {column.idx === 2 && selection && serialNumber && TreeViewCell()}
      {column.idx === 1 &&
        serialNumber &&
        selection &&
        column.cellRenderer({ ...cellRender, column: { ...column, rowIndex } })}
      {column.idx > 2 &&
        selection &&
        serialNumber &&
        column.cellRenderer?.(cellRender)}
      {column.idx > 1 &&
        !selection &&
        serialNumber &&
        column.cellRenderer?.(cellRender)}
      {column.idx > 1 &&
        selection &&
        !serialNumber &&
        column.cellRenderer?.(cellRender)}
    </div>
  );
}

export default memo(TreeCell);
