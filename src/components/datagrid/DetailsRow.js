import React, { memo, forwardRef } from "react";
import clsx from "clsx";
import { getRowStyle, getColSpan } from "./utils";
import { rowClassname, rowSelectedClassname } from "./style";

import { RowSelectionProvider, useLatestFunc } from "./hooks";
import DetailsCell from "./DetailsCell";

const DetailsRow = forwardRef(
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
      toggleDetailed,
      rowArray,
      sourceData,
      childRows,
      treeData,
      apiObject,
      selectTree,
      valueChangedCellStyle,
      onRowClick,
      onRowDoubleClick,
      onCellClick,
      onCellContextMenu,
      onCellDoubleClick,
      rowClass,
      selectCell,
      selectedCellEditor,
      node,
      allrow,
      lastFrozenColumnIndex,
      detailedRowIds,
      gridWidth,
      setToolTip,
      setToolTipContent,
      setMouseY,
      ...props
    },
    ref
  ) => {
    let style = getRowStyle(gridRowStart, height);
    function handleMoseY(y) {
      setMouseY(y);
    }
    function handleToolTip(value) {
      setToolTip(value);
    }
    function handleToolTipContent(value) {
      setToolTipContent(value);
    }
    const handleRowChange = (column, newRow) => {
      props.onRowChange(column, rowIdx, newRow, row);
    };

    const cells = [];

    for (let index = 0; index < viewportColumns.length; index++) {
      const column = { ...viewportColumns[index], rowIndex: rowIdx };
      const { idx } = column;
      let colSpan = getColSpan(column, lastFrozenColumnIndex, {
        type: "ROW",
        row,
        rowIndex: rowIdx,
        detailedRowIds,
      });
      if (colSpan !== undefined) {
        index += colSpan - 1;
      }
      if (row.gridRowType === "detailedRow") {
        index += viewportColumns.length;
        colSpan = viewportColumns.length;
      }

      cells.push(
        <DetailsCell
          key={`${column.key}`}
          id={id}
          childRows={row.children}
          isExpanded={isExpanded}
          isCellSelected={selectedCellIdx === column.idx}
          column={column}
          colSpan={colSpan}
          row={row}
          apiObject={apiObject}
          groupColumnIndex={idx}
          toggleDetailed={toggleDetailed}
          selection={selection}
          serialNumber={serialNumber}
          allrow={allrow}
          rowIndex={rowIdx}
          viewportColumns={viewportColumns}
          node={node}
          onRowClick={onRowClick}
          onRowChange={handleRowChange}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellContextMenu={onCellContextMenu}
          onRowDoubleClick={onRowDoubleClick}
          columnApi={columnApi}
          isRowSelected={isRowSelected}
          selectCell={selectCell}
          selectedCellEditor={selectedCellEditor}
          valueChangedCellStyle={valueChangedCellStyle}
          setMouseY={handleMoseY}
          setToolTip={handleToolTip}
          setToolTipContent={handleToolTipContent}
          Rowheight={height}
          selectedCellIdx={selectedCellIdx}
          deviceType={props.deviceType}
          gridWidth={gridWidth}
        />
      );
    }

    return (
      <RowSelectionProvider value={isRowSelected}>
        <div
          key={`${rowIdx}`}
          role="row"
          id={`master-row-${row?.id ?? rowIdx}`}
          ref={ref}
          aria-level={level}
          aria-expanded={isExpanded}
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
          onMouseOver={() => {
            if (props.rowLevelToolTip) {
              let toolTipContent;
              if (typeof props.rowLevelToolTip === "function") {
                toolTipContent = props.rowLevelToolTip({
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
            if (props.rowLevelToolTip) {
              handleToolTip(false);
            }
          }}
          {...props}
        >
          {cells}
        </div>
      </RowSelectionProvider>
    );
  }
);

export default memo(DetailsRow);
