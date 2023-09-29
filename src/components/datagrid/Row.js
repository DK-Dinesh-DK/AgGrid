import React, { memo, forwardRef } from "react";
import { clsx } from "clsx";

import Cell from "./Cell";
import { RowSelectionProvider, useLatestFunc } from "./hooks";
import { getColSpan, getRowStyle } from "./utils";
import { rowClassname, rowSelectedClassname } from "./style";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function Row(
  {
    className,
    indexR,
    styleR,
    rowIdx,
    gridTemplateColumns,
    rowArray,
    gridRowStart,
    height,
    selectedCellIdx,
    isRowSelected,
    copiedCellIdx,
    draggedOverCellIdx,
    lastFrozenColumnIndex,
    api,
    row,
    selectedCellRowStyle,
    rows,
    node,
    viewportColumns,
    selectedCellEditor,
    // selectedCellDragHandle,
    onRowClick,
    onRowDoubleClick,
    rowClass,
    setDraggedOverRowIdx,
    onMouseEnter,
    onRowChange,
    selectCell,
    totalColumns,
    subColumn,
    handleReorderRow,
    onCellClick,
    onCellDoubleClick,
    onCellContextMenu,
    columnApi,
    valueChangedCellStyle,
    previousData,
    selectedPosition,
    rowFreezLastIndex,
    summaryRowHeight,
    headerheight,
    expandedMasterIds,
    onExpandedMasterIdsChange,
    setToolTip,
    setToolTipContent,
    setMouseY,
    rowLevelToolTip,
    setDragging,
    handleContextMenu,
    ...props
  },
  ref
) {
  const handleRowChange = useLatestFunc((column, newRow) => {
    onRowChange(column, rowIdx, newRow, row);
  });

  function handleDragEnter(event) {
    setDraggedOverRowIdx?.(rowIdx);
    onMouseEnter?.(event);
  }
  function handleMoseY(y) {
    setMouseY(y);
  }
  function handleToolTip(value) {
    setToolTip(value);
  }
  function handleToolTipContent(value) {
    setToolTipContent(value);
  }
  className = clsx(
    rowClassname,
    `rdg-row-${rowIdx % 2 === 0 ? "even" : "odd"}`,
    {
      [rowSelectedClassname]: isRowSelected,
    },
    rowClass?.(row),
    className
  );

  const cells = [];
  for (let index = 0; index < viewportColumns.length; index++) {
    const column = { ...viewportColumns[index], rowIndex: rowIdx };
    const { idx } = column;
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "ROW",
      row,
      rowIndex: rowIdx,
      expandedMasterIds,
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    const isCellSelected = selectedCellIdx === idx;

    cells.push(
      <Cell
        key={`${column.key}`}
        column={column}
        colSpan={colSpan}
        selectedCellIdx={selectedCellIdx}
        selectedCellEditor={selectedCellEditor}
        api={api}
        viewportColumns={viewportColumns}
        rowArray={rowArray}
        row={row}
        handleReorderRow={handleReorderRow}
        isRowSelected={isRowSelected}
        allrow={rows}
        rowIndex={rowIdx}
        totalColumns={totalColumns}
        node={node}
        isCopied={copiedCellIdx === idx}
        isDraggedOver={draggedOverCellIdx === idx}
        isCellSelected={isCellSelected}
        // dragHandle={isCellSelected ? selectedCellDragHandle : undefined}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        onRowChange={handleRowChange}
        subColumn={subColumn}
        selectCell={selectCell}
        onCellClick={onCellClick}
        onCellDoubleClick={onCellDoubleClick}
        onCellContextMenu={onCellContextMenu}
        columnApi={columnApi}
        valueChangedCellStyle={valueChangedCellStyle}
        previousData={previousData}
        summaryRowHeight={summaryRowHeight}
        rowFreezLastIndex={rowFreezLastIndex}
        headerheight={headerheight}
        expandedMasterIds={expandedMasterIds}
        onExpandedMasterIdsChange={onExpandedMasterIdsChange}
        setMouseY={handleMoseY}
        setToolTip={handleToolTip}
        setToolTipContent={handleToolTipContent}
        Rowheight={height}
        handleSetDragging={(val) => setDragging(val)}
      />
    );
  }

  // }
  let style = getRowStyle(gridRowStart, height);
  if (rowIdx === selectedPosition.rowIdx) {
    style = { ...style, ...selectedCellRowStyle };
  }
  let toolTipContent;

  return (
    <DndProvider backend={HTML5Backend}>
      <RowSelectionProvider value={isRowSelected}>
        <div
          role="row"
          ref={ref}
          id={`rowid-${row?.id ?? rowIdx}`}
          className={className}
          onMouseEnter={handleDragEnter}
          onMouseOver={() => {
            if (rowLevelToolTip) {
              if (typeof rowLevelToolTip === "function") {
                toolTipContent = rowLevelToolTip({
                  row,
                  rowIndex: rowIdx,
                });
              } else {
                toolTipContent = `rowIndex-${rowIdx}`;
              }
              handleToolTipContent(toolTipContent);
              handleToolTip(true);
            }
          }}
          onMouseOutCapture={() => {
            if (rowLevelToolTip) {
              handleToolTip(false);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, row)}
          style={style}
          {...props}
        >
          {cells}
        </div>
      </RowSelectionProvider>
    </DndProvider>
  );
}

const RowComponent = memo(forwardRef(Row));

export default RowComponent;

export function defaultRowRenderer(key, props) {
  return <RowComponent key={key} {...props} />;
}
