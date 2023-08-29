import React, { memo, useRef, useState } from "react";

import { getCellStyle, getCellClassname, isCellEditable } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";

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
  setMouseY,
  setToolTip,
  setToolTipContent,
  rowArray,
  totalColumns,
  ...props
}) {
  const { tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleMaster() {
    toggleMasterWrapper(id);
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
    rowArray,
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
    onRowChange: handleRowChange,
  };

  const cellRendererParams =
    typeof column?.cellRendererParams === "function"
      ? column?.cellRendererParams(cellParams)
      : column?.cellRendererParams;

  function handleClick(e) {
    e.stopPropagation();
    if (!column.readOnly) {
      props.onRowClick?.({
        event: e,
        rowIndex: rowIndex,
        api: props.api,
        node: node,
        data: row,
        columnApi: props.columnApi,
        type: "rowClicked",
      });
      props.onCellClick?.({
        api: props.api,
        rowIndex: rowIndex,
        value: row[column.field] ?? undefined,
        type: "cellClicked",
        event: e,
        colDef: {
          field: column.field,
          resizable: column.resizable,
          sortable: column.sortable,
          width: column.width,
        },
        data: row,
        node: node,
        columnApi: props.columnApi,
      });
    }
  }

  function handleDoubleClick(e) {
    e.stopPropagation();
    if (!column.readOnly) {
      props.onRowDoubleClick?.({
        api: api,
        data: row,
        columnApi: columnApi,
        node: node,
        rowIndex: rowIndex,
        type: "rowDoubleClicked",
        event: e,
      });
      props.onCellDoubleClick?.({
        api: api,
        data: row,
        columnApi: columnApi,
        node: node,
        rowIndex: rowIndex,
        value: row[column.key],
        type: "cellDoubleClicked",
        event: e,
      });
    }
  }
  const { cellClass } = column;
  const className = getCellClassname(
    column,
    `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`,
    typeof cellClass === "function" ? cellClass(row) : cellClass,
    row.gridRowType === "Detail" ? "rdg-cell-detail" : undefined
  );
  style =
    column.idx === 0 && isRowSelected
      ? { ...style, ...{ borderInlineStart: "1px solid #9bbb59" } }
      : { ...style };
  style =
    column.idx === totalColumns - 1 && isRowSelected
      ? { ...style, ...{ borderInlineEnd: "1px solid #9bbb59" } }
      : { ...style };
  if (row.gridRowType === "Detail" && column.toolTip) {
    let toolTipContent;
    if (typeof column.toolTip === "function") {
      toolTipContent = column.toolTip({
        row,
        rowIndex,
      });
    } else {
      toolTipContent = `details-row-${row?.id ?? rowIndex}`;
    }
    handleToolTipContent(toolTipContent);
    handleToolTip(true);
  }
  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      // role="gridcell"
      id={`mastercellid-${column.idx}-${rowIndex}`}
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      aria-readonly={!isCellEditable(column, row) || undefined}
      ref={gridCell}
      tabIndex={tabIndex}
      key={column.key}
      className={className}
      style={style}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
        row.gridRowType !== "Detail" &&
        column.cellRenderer?.({
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleMaster,
          viewportColumns,
          data: row,
          allrow,
          selectedCellIdx,
          selectedCellEditor,
          rowIndex,
          selectCell,
          onRowClick: props.onRowClick,
          onRowDoubleClick: props.onRowDoubleClick,
          onCellClick: props.onCellClick,
          onCellDoubleClick: props.onCellDoubleClick,
          valueFormatted: cellRendererParams?.valueFormatted,
          fullWidth: cellRendererParams?.fullWidth,
          eGridCell: gridCell.current,
          ...cellParams,
          ...cellRendererParams,
        })}
      {column.idx === 0 && row.gridRowType !== "Detail" && (
        <>
          <span
            className="master-expand-icon"
            data-testid={`master-expand-icon-${rowIndex}`}
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
          allrow,
          selectedCellIdx,
          selectedCellEditor,
          api: apiObject,
          node,
          row,
          rowIndex,
          column,
          isExpanded,
          isCellSelected,
          toggleMaster,
          colDef: column,
          viewportColumns,
        })}
    </div>
  );
}

export default memo(MasterCell);
