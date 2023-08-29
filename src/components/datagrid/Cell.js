import React, { memo, useState, useRef } from "react";
import { css } from "@linaria/core";
import { getCellStyle, getCellClassname, isCellEditable } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";
import { useDrag, useDrop } from "react-dnd";
import alignmentUtils from "./utils/alignMentUtils";
import {
  bottomRowIsSelectedClassName,
  rowIsSelectedClassName,
  topRowIsSelectedClassName,
} from "./style";
import useUpdateEffect from "./hooks/useUpdateEffect";
const cellCopied = css`
  @layer rdg.Cell {
    background-color: #ccccff;
  }
`;

const cellCopiedClassname = `rdg-cell-copied ${cellCopied}`;

const cellDraggedOver = css`
  @layer rdg.Cell {
    background-color: #ccccff;

    &.${cellCopied} {
      background-color: #9999ff;
    }
  }
`;

const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver}`;

const rowCellFreezeClassname = css`
  @layer rdg.rowCell {
    position: sticky;
    z-index: 2;
    background: dark blue;
    inset-block-start: var(--rdg-summary-row-top);
    inset-block-end: var(--rdg-summary-row-bottom);
  }
`;
const freezeCol = css`
  @layer rdg.rowFridge {
    z-index: 3;
  }
`;
const freezedLastRowClassName = css`
  @layer rdg.freezedLastRowShadow {
    box-shadow: 0 calc(2px * var(--rdg-sign)) 5px -2px rgba(136, 136, 136, 0.5);
  }
`;

function Cell({
  column,
  rowArray,
  colData,
  viewportColumns,
  colSpan,
  isCellSelected,
  selectedCellIdx,
  selectedCellEditor,
  isCopied,
  api,
  isDraggedOver,
  isRowSelected,
  row,
  rowIndex,
  allrow,
  onRowClick,
  onRowDoubleClick,
  onRowChange,
  selectCell,
  node,
  handleReorderRow,
  subColumn,
  totalColumns,
  onCellClick,
  onCellDoubleClick,
  onCellContextMenu,
  columnApi,
  valueChangedCellStyle,
  previousData,
  rowFreezLastIndex,
  headerheight,
  summaryRowHeight,
  expandedMasterIds,
  onExpandedMasterIdsChange,
  setMouseY,
  setToolTip,
  setToolTipContent,
  Rowheight,
  ...props
}) {
  const gridCell = useRef(null);
  const [value, setValue] = useState(
    column?.cellRendererParams?.value ?? row[column.key]
  );

  let cellParams = {
    column: column,
    data: row,
    value: value,
    node: node,
    colDef: column,
    api,
    columnApi,
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
  };

  const cellRendererParams =
    typeof column?.cellRendererParams === "function"
      ? column?.cellRendererParams(cellParams)
      : column?.cellRendererParams;

  useUpdateEffect(() => {
    setValue(column?.cellRendererParams?.value ?? row[column.key]);
  }, [column?.cellRendererParams?.value, row[column.key]]);

  const { tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  const { cellClass } = column;
  const topRow = rowIndex === 0 && isRowSelected ? true : false;
  const bottomRow =
    rowIndex === allrow.length - 1 && isRowSelected ? true : false;
  const middleRow = !(topRow || bottomRow) && isRowSelected ? true : false;
  const className = getCellClassname(
    column,
    `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`,
    {
      [cellCopiedClassname]: isCopied,
      [cellDraggedOverClassname]: isDraggedOver,
      [rowIsSelectedClassName]: middleRow,
      [topRowIsSelectedClassName]: topRow,
      [bottomRowIsSelectedClassName]: bottomRow,
      [rowCellFreezeClassname]: rowIndex <= rowFreezLastIndex,
      [freezeCol]: column.frozen === true && rowIndex <= rowFreezLastIndex,
      [freezedLastRowClassName]: rowIndex === rowFreezLastIndex,
    },
    typeof cellClass === "function" ? cellClass(row) : cellClass
  );

  function handleRowChange(newRow) {
    onRowChange(column, newRow);
  }

  // -----------
  let rowSpan = column.rowSpan?.({ type: "ROW", row }) ?? undefined;
  let style = {
    ...getCellStyle(column, colSpan, rowSpan),
    "--rdg-summary-row-top": `${
      headerheight + summaryRowHeight + rowIndex * 24
    }px`,
  };
  style =
    column.haveChildren === true
      ? { ...style, ...{ borderInlineEnd: "none" } }
      : { ...style };
  style =
    column.idx === 0 && isRowSelected
      ? { ...style, ...{ borderInlineStart: "1px solid #9bbb59" } }
      : { ...style };
  style =
    column.idx === totalColumns - 1 && isRowSelected
      ? { ...style, ...{ borderInlineEnd: "1px solid #9bbb59" } }
      : { ...style };

  if (column.validation) {
    const validationStyle = column.validation.style
      ? column.validation.style
      : { backgroundColor: "red" };
    if (column.validation.method(row[column.key])) {
      style = {
        ...style,
        ...validationStyle,
      };
    }
  }

  if (column.alignment) {
    style = column.alignment.align
      ? { ...style, textAlign: column.alignment.align }
      : alignmentUtils(column, row, style, "Row");
  }
  /// -----------------------
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

  const [{ isDragging }, drag] = useDrag({
    type: "ROW_DRAG",
    item: { index: rowIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  function onRowReorder(fromIndex, toIndex) {
    const newRows = [...allrow];
    newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
    handleReorderRow(newRows);
  }
  const [{ isOver }, drop] = useDrop({
    accept: "ROW_DRAG",
    drop({ index }) {
      onRowReorder(index, rowIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  function handleDoubleClick(e) {
    e.stopPropagation();
    if(!column.readOnly){onRowDoubleClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowDoubleClicked",
      event: e,
    })
    onCellDoubleClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      value: row[column.key],
      type: "cellDoubleClicked",
      event: e,
    })}
  }
  function handleClick(e) {
    e.stopPropagation();
    if(!column.readOnly){onRowClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowClicked",
      event: e,
    })
    onCellClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      value: row[column.key],
      type: "cellClicked",
      event: e,
    })}
  }
  function handleToolTip(value) {
    setToolTip(value);
  }
  function handleToolTipContent(value) {
    setToolTipContent(value);
  }
  let params = {
    column,
    colDef: column,
    selectedCellIdx,
    selectedCellEditor,
    row,
    rowArray,
    colData,
    data: row,
    allrow,
    className,
    api,
    node,
    viewportColumns,
    rowIndex,
    isCellSelected,
    onRowChange: handleRowChange,
    onRowClick: onRowClick,
    columnApi,
    onCellClick,
    onCellDoubleClick,
    selectCell,
    onRowDoubleClick,
    subColumn,
    value: value,
    valueFormatted: cellRendererParams?.valueFormatted,
    fullWidth: cellRendererParams?.fullWidth,
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
    ...cellRendererParams,
    expandedMasterIds,
    onExpandedMasterIdsChange,
  };

  if (column.cellStyle) {
    let dynamicStyle;
    if (typeof column.cellStyle === "function")
      dynamicStyle = column.cellStyle(params);
    else dynamicStyle = column.cellStyle;
    style = { ...style, ...dynamicStyle };
  }

  return (
    <div
      data-testid="rowCell"
      id={`cellid-${column.idx}-${rowIndex}`}
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      aria-colspan={colSpan}
      aria-rowspan={rowSpan}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      aria-readonly={!isCellEditable(column, row) || undefined}
      ref={gridCell}
      tabIndex={tabIndex}
      className={className}
      style={style}
      onFocus={onFocus}
      {...props}
      onMouseMove={(e) => {
        const element = document.getElementById(
          `cellid-${column.idx}-${rowIndex}`
        );
        let y = element.getBoundingClientRect().y;
        setMouseY(y + Rowheight / 2);
      }}
    >
      {!column.rowGroup && (
        <>
          {column.rowDrag && (
            <div
              ref={(ele) => {
                drag(ele);
                drop(ele);
              }}
              style={{ display: "flex" }}
            >
              <span
                data-testid={`drag-icon-${column.idx}-${rowIndex}`}
                style={{
                  cursor: "grab",
                  marginLeft: "10px",
                  marginRight: "5px",
                }}
              >
                &#9674;
              </span>
              {column.cellRenderer(params)}
            </div>
          )}
          {!column.rowDrag && column.cellRenderer(params)}
        </>
      )}
    </div>
  );
}

export default memo(Cell);
