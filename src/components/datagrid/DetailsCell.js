import React, { memo, useRef, useState, createElement, isValidElement } from "react";
import { getCellStyle, getCellClassname } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";
import { PlusIcon, MinusIcon } from "../../assets/Icon";
import clsx from "clsx";
import { rowClassname } from "./style";

function DetailsCell({
  id,
  isExpanded,
  isCellSelected,
  column,
  row,
  colSpan,
  treeColumnIndex,
  toggleDetailed: toggleDetailedWrapper,
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
  setMouseY,
  setToolTip,
  setToolTipContent,
  ...props
}) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleDetailedRow() {
    toggleDetailedWrapper(id);
  }
  let style = getCellStyle(column, colSpan, row);
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
  function handleRowChange(newRow) {
    onRowChange(column, newRow);
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
        `mastercellid-${column.idx}-${rowIndex}`
      ).innerHTML;
      document.getElementById(
        `mastercellid-${column.idx}-${rowIndex}`
      ).innerHTML = content;
    },
    onRowChange: handleRowChange,
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
    if (row.gridRowType !== "detailedRow") {
      if (!column.readOnly) {
        props.onRowClick?.({
          columnApi: props.columnApi,
          node: node,
          api: props.api,
          data: row,
          type: "rowClicked",
          rowIndex: rowIndex,
          event: e,
        });
        props.onCellClick?.({
          api: props.api,
          node: node,
          data: row,
          type: "cellClicked",
          columnApi: props.columnApi,
          colDef: {
            field: column.field,
            resizable: column.resizable,
            sortable: column.sortable,
            width: column.width,
          },
          rowIndex: rowIndex,
          value: row[column.field] ?? undefined,
          event: e,
        });
      }
      selectCell(rowIndex, column.idx);
    }
  }

  const { cellClass } = column;
  const className = getCellClassname(
    column,
    `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`,
    typeof cellClass === "function" ? cellClass(row) : cellClass,
    row.gridRowType === "Detail" ? "rdg-cell-detail" : undefined
  );

  if (row.gridRowType === "detailedRow") {
    viewportColumns.shift();
    style = {
      ...style,
      backgroundColor: "#D4DAE1",
      border: "1px solid #97A4B1",
    };
  }

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      role="gridcell"
      id={`mastercellid-${column.idx}-${rowIndex}`}
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      ref={ref}
      tabIndex={tabIndex}
      key={`${column.idx}-${rowIndex}-${column.key}`}
      className={className}
      style={style}
      onClick={handleClick}
      onFocus={onFocus}
      onMouseMove={(e) => {
        const element = document.getElementById(
          `mastercellid-${column.idx}-${rowIndex}`
        );
        let y = element.getBoundingClientRect().y;
        setMouseY(y + props.Rowheight / 2);
      }}
    >
      {column.idx > 0 &&
        row.gridRowType !== "detailedRow" &&
        typeof column.cellRenderer === "function" &&
        column.cellRenderer?.({
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleDetailedRow,
          viewportColumns,
          data: row,
          allrow,
          selectedCellIdx,
          selectedCellEditor,
          rowIndex,
          selectCell,
          onRowClick: props.onRowClick,
          onRowDoubleClick: props.onRowDoubleClick,
          valueFormatted: cellRendererParams?.valueFormatted,
          fullWidth: cellRendererParams?.fullWidth,
          ...cellParams,
          ...cellRendererParams,
          qwe: row,
        })}

      {column.idx > 0 &&
        row.gridRowType !== "detailedRow" &&
        typeof column.cellRenderer === "object" &&
        isValidElement(column.cellRenderer) &&
        createElement(
        column.cellRenderer,{
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleDetailedRow,
          viewportColumns,
          data: row,
          allrow,
          selectedCellIdx,
          selectedCellEditor,
          rowIndex,
          selectCell,
          onRowClick: props.onRowClick,
          onRowDoubleClick: props.onRowDoubleClick,
          valueFormatted: cellRendererParams?.valueFormatted,
          fullWidth: cellRendererParams?.fullWidth,
          ...cellParams,
          ...cellRendererParams,
          qwe: row,
        })}
      {column.idx === 0 && row.gridRowType !== "detailedRow" && (
        <>
          <span
            className="details-expand-icon"
            data-testid={`details-expand-icon-${id}`}
            onClick={toggleDetailedRow}
          >
            {isExpanded ? (
              <MinusIcon className="details-minus-icon" />
            ) : (
              <PlusIcon className="details-plus-icon" />
            )}
          </span>
        </>
      )}
      {row.gridRowType === "detailedRow" && (
        <div style={{ margin: "8px 5px" }} className="detailed-row-container">
          {viewportColumns.map((column,index) => {
            return (
              <div
                aria-selected={selectedCellIdx - 1 === index}
                key={`detailed-row-${rowIndex}-${column.headerName}`}
                className={clsx(
                  rowClassname,
                  `rdg-row-${index % 2 === 0 ? "even" : "odd"}`,
                  "rdg-detailed-row"
                )}
                onClick={(e) => {
                  selectCell(row, column, id);
                  if (!column.readOnly) {
                    props.onRowClick?.({
                      api: apiObject,
                      data: row,
                      columnApi: props.columnApi,
                      node: node,
                      rowIndex: rowIndex,
                      type: "rowClicked",
                      event: e,
                    });
                    props.onCellClick?.({
                      api: apiObject,
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
                    });
                  }
                }}
              >
                <div
                  className="rdg-cell-detail-header"
                  role={"gridcell"}
                  style={{ width: `${props.gridWidth * 0.3}px` }}
                >
                  {column.headerName}
                </div>
                <div
                  className="rdg-cell-detail-data"
                  role={"gridcell"}
                  style={{ width: `${props.gridWidth * 0.7}px` }}
                >
                  {typeof column.cellRenderer ==="function" &&
                     column.cellRenderer?.({
                    column,
                    row,
                    viewportColumns,
                    data: row,
                    allrow,
                    onRowChange: (newrow) => onRowChange(column, newrow),
                    selectCell: () => {
                      selectCell(row, column, id);
                    },
                  })}
                  {typeof column.cellRenderer ==="object" &&
                    isValidElement(column.cellRenderer) &&
                    createElement(column.cellRenderer,{
                    column,
                    row,
                    viewportColumns,
                    data: row,
                    allrow,
                    onRowChange: (newrow) => onRowChange(column, newrow),
                    selectCell: () => {
                      selectCell(row, column, id);
                    },
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(DetailsCell);
