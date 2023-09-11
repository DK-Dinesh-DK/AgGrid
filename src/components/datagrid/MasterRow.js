import React, { memo, forwardRef } from "react";
import clsx from "clsx";
import { getRowStyle, getColSpan } from "./utils";
import { rowClassname, rowSelectedClassname } from "./style";

import { RowSelectionProvider, useLatestFunc } from "./hooks";
import MasterCell from "./MasterCell";

const MasterRow = forwardRef(
  (
    {
      id,
      viewportColumns,
      className,
      rowIdx,
      row,
      level,
      selection,
      gridRowStart,
      columnApi,
      height,
      isExpanded,
      selectedCellIdx,
      isRowSelected,
      selectGroup,
      serialNumber,
      toggleMaster,
      rowArray,
      sourceData,
      childRows,
      apiObject,
      valueChangedCellStyle,
      onRowClick,
      onRowDoubleClick,
      onCellClick,
      onCellContextMenu,
      onCellDoubleClick,
      rowClass,
      handleRowChange,
      selectCell,
      selectedCellEditor,
      node,
      allrow,
      lastFrozenColumnIndex,
      expandedMasterRowIds,
      setToolTip,
      rowLevelToolTip,
      setMouseY,
      setToolTipContent,
      ...props
    },
    ref
  ) => {
    // Select is always the first column
    function handleMoseY(y) {
      setMouseY(y);
    }
    function handleToolTip(value) {
      setToolTip(value);
    }
    function handleToolTipContent(value) {
      setToolTipContent(value);
    }
    let style = getRowStyle(gridRowStart, height);
    const onRowChange = useLatestFunc((column, newRow) => {
      handleRowChange(column, rowIdx, newRow, row);
    });
    const cells = [];

    for (let index = 0; index < viewportColumns.length; index++) {
      const column = { ...viewportColumns[index], rowIndex: rowIdx };
      const { idx } = column;
      const colSpan = getColSpan(column, lastFrozenColumnIndex, {
        type: "ROW",
        row,
        rowIndex: rowIdx,
        expandedMasterIds: expandedMasterRowIds,
      });
      if (colSpan !== undefined) {
        index += colSpan - 1;
      }

      cells.push(
        <MasterCell
          key={`${column.key}`}
          id={id}
          childRows={row.children}
          isExpanded={isExpanded}
          isCellSelected={selectedCellIdx === column.idx}
          selectedCellIdx={selectedCellIdx}
          column={column}
          colSpan={colSpan}
          row={row}
          apiObject={apiObject}
          groupColumnIndex={idx}
          toggleMaster={toggleMaster}
          selection={selection}
          serialNumber={serialNumber}
          allrow={allrow}
          rowIndex={rowIdx}
          viewportColumns={viewportColumns}
          node={node}
          onRowClick={onRowClick}
          onRowChange={onRowChange}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellContextMenu={onCellContextMenu}
          onRowDoubleClick={onRowDoubleClick}
          columnApi={columnApi}
          setMouseY={handleMoseY}
          isRowSelected={isRowSelected}
          selectCell={selectCell}
          setToolTip={handleToolTip}
          selectedCellEditor={selectedCellEditor}
          valueChangedCellStyle={valueChangedCellStyle}
          setToolTipContent={handleToolTipContent}
          Rowheight={height}
        />
      );
    }

    return (
      <RowSelectionProvider value={isRowSelected}>
        <div
          key={`${rowIdx}`}
          role="row"
          id={
            row.gridRowType === "Detail"
              ? `details-row-${row?.id ?? rowIdx}`
              : `master-row-${row?.id ?? rowIdx}`
          }
          ref={ref}
          aria-level={level}
          aria-expanded={isExpanded}
          onMouseOver={() => {
            if (rowLevelToolTip) {
              let toolTipContent;
              if (typeof rowLevelToolTip === "function") {
                toolTipContent = rowLevelToolTip({
                  row,
                  rowIndex: rowIdx,
                });
              } else {
                toolTipContent =
                  row.gridRowType === "Detail"
                    ? `details-row-${row?.id ?? rowIdx}`
                    : `master-row-${row?.id ?? rowIdx}`;
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
          className={clsx(
            rowClassname,
            `rdg-row-${rowIdx % 2 === 0 ? "even" : "odd"}`,
            `rdg-row-${row.gridRowType === "Detail" ? "detail" : "master"}`,
            {
              [rowSelectedClassname]: isRowSelected,
            },
            rowClass?.(row),
            className
          )}
          style={style}
          {...props}
        >
          {cells}
        </div>
      </RowSelectionProvider>
    );
  }
);

export default memo(MasterRow);
