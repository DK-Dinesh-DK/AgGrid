import React, { memo, useRef, useState } from "react";

import { getCellStyle, getCellClassname } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";
import {
  bottomRowIsSelectedClassName,
  rowIsSelectedClassName,
  topRowIsSelectedClassName,
} from "./style";

function MasterCell({
  id,
  isExpanded,
  isCellSelected,
  column,
  row,
  colSpan,
  treeColumnIndex,
  toggleMaster: toggleMasterWrapper,
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
  ...props
}) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleMaster() {
    toggleMasterWrapper(id);
  }
  let style = getCellStyle(column, colSpan, row);
  const gridCell = useRef(null);
  const cellRendererParams =
    typeof column?.cellRendererParams === "function"
      ? column?.cellRendererParams()
      : column?.cellRendererParams;
  const [value, setValue] = useState(
    cellRendererParams?.value ?? row[column.key]
  );

  function handleClick(e) {
    selectCell(row, column);
    props.onRowClick?.({
      api: props.api,
      data: row,
      columnApi: props.columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowClicked",
      event: e,
    });
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
    });
  }

  const { cellClass } = column;
  // const topRow = rowIndex === 0 && isRowSelected ? true : false;
  // const bottomRow =
  //   rowIndex === allrow.length - 1 && isRowSelected ? true : false;
  // const middleRow = !(topRow || bottomRow) && isRowSelected ? true : false;
  const className = getCellClassname(
    column,
    `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`,
    typeof cellClass === "function" ? cellClass(row) : cellClass,
    row.gridRowType === "Detail" ? "rdg-cell-detail" : undefined
  );

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      role="gridcell"
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      ref={ref}
      tabIndex={tabIndex}
      key={column.key}
      className={className}
      style={style}
      onClick={handleClick}
      onFocus={onFocus}
      // onDoubleClick={toggleMaster}
    >
      {column.idx > 0 &&
        row.gridRowType !== "Detail" &&
        column.cellRenderer?.({
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleMaster,
          colDef: column,
          viewportColumns,
          data: row,
          allrow,
          selectedCellIdx,
          selectedCellEditor,
          api: apiObject,
          node,
          value,
          rowIndex,
          selectCell,
          onRowClick: props.onRowClick,
          onRowDoubleClick: props.onRowDoubleClick,
          valueFormatted: cellRendererParams?.valueFormatted,
          fullWidth: cellRendererParams?.fullWidth,
          eGridCell: gridCell.current,
          ...cellRendererParams,
        })}
      {column.idx === 0 && row.gridRowType !== "Detail" && (
        <>
          <span
            className="tree-expand-icon"
            data-testid={`tree-expand-icon-${rowIndex}`}
            style={{
              color: "black",
              fontSize: "12px",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={toggleMaster}
          >
            {isExpanded ? "\u25BC" : "\u25B6"}
          </span>
        </>
      )}
      {row.gridRowType === "Detail" &&
        column.detailsGrid &&
        column.detailsGrid({
          row,
          rowIndex,
          column,
          isExpanded,
          isCellSelected,
          toggleMaster,
          colDef: column,
          viewportColumns,
          allrow,
          selectedCellIdx,
          selectedCellEditor,
          api: apiObject,
          node,
        })}
    </div>
  );
}

export default memo(MasterCell);
