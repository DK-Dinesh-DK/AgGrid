import React, { memo, useRef, useState,  isValidElement, cloneElement} from "react";

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

  const gridCell = useRef(null);

  const [value, setValue] = useState(
    column?.cellRendererParams?.value ?? row[column.key]
  );
  let style = getCellStyle(column, colSpan, row);
  function handleToolTip(value) {
    setToolTip(value);
  }
  function handleRowChange(newRow) {
    onRowChange(column, newRow);
  }
  function handleToolTipContent(value) {
    setToolTipContent(value);
  }

  let cellParams = {
    api: apiObject,
    column: column,
    colDef: column,
    data: row,
    eGridCell: gridCell.current,
    getValue: () => value,
    handleToolTip,
    handleToolTipContent,
    onRowChange: handleRowChange,
    node: node,
    rowArray,
    refreshCell: () => {
      const content = document.getElementById(
        `mastercellid-${column.idx}-${rowIndex}`
      ).innerHTML;
      document.getElementById(
        `mastercellid-${column.idx}-${rowIndex}`
      ).innerHTML = content;
    },
    setValue: (newValue) => {
      setValue(newValue);
      row[column.key] = newValue;
    },

    value: value,
  };

  const cellRendererParams =
    typeof column?.cellRendererParams === "function"
      ? column?.cellRendererParams(cellParams)
      : column?.cellRendererParams;

  function handleClick(e) {
    e.stopPropagation();
    if (!column.readOnly) {
      props.onCellClick?.({
        api: props.api,
        colDef: {
          field: column.field,
          resizable: column.resizable,
          sortable: column.sortable,
          width: column.width,
        },
        columnApi: props.columnApi,
        data: row,
        event: e,
        node: node,
        rowIndex: rowIndex,
        type: "cellClicked",
        value: row[column.field] ?? undefined,
      });
      props.onRowClick?.({
        api: props.api,
        columnApi: props.columnApi,
        data: row,
        event: e,
        rowIndex: rowIndex,
        node: node,
        type: "rowClicked",
      });
    }
  }

  function handleDoubleClick(e) {
    e.stopPropagation();
    if (!column.readOnly) {
      props.onCellDoubleClick?.({
        api: api,
        columnApi: columnApi,
        data: row,
        event: e,
        node: node,
        rowIndex: rowIndex,
        type: "cellDoubleClicked",
        value: row[column.key],
      });
      props.onRowDoubleClick?.({
        api: api,
        columnApi: columnApi,
        data: row,
        node: node,
        rowIndex: rowIndex,
        type: "rowDoubleClicked",
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
    <div
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
        typeof column.cellRenderer === "function" &&
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

        {column.idx > 0 &&
        row.gridRowType !== "Detail" &&
        typeof column.cellRenderer === "object" &&
        isValidElement(column.cellRenderer) &&
        cloneElement (column.cellRenderer,{
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
