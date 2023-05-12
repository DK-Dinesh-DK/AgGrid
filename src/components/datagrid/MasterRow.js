import React, { memo, forwardRef } from "react";
import clsx from "clsx";
import { getRowStyle, getColSpan } from "./utils";
import { rowClassname, rowSelectedClassname } from "./style";

import { RowSelectionProvider } from "./hooks";
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
      handleRowChange,
      selectCell,
      selectedCellEditor,
      node,
      allrow,
      lastFrozenColumnIndex,
      expandedMasterRowIds,
      ...props
    },
    ref
  ) => {
    // Select is always the first column

    let style = getRowStyle(gridRowStart, height);

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
          onRowChange={handleRowChange}
          onCellClick={onCellClick}
          onCellDoubleClick={onCellDoubleClick}
          onCellContextMenu={onCellContextMenu}
          onRowDoubleClick={onRowDoubleClick}
          columnApi={columnApi}
          selectTree={selectTree}
          isRowSelected={isRowSelected}
          selectCell={selectCell}
          selectedCellEditor={selectedCellEditor}
          valueChangedCellStyle={valueChangedCellStyle}
          treeData={treeData}
        />
      );
    }

    return (
      <RowSelectionProvider value={isRowSelected}>
        <div
          key={`${rowIdx}`}
          role="row"
          id={row?.id ?? rowIdx}
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
          {...props}
        >
          {cells}
        </div>
      </RowSelectionProvider>
    );
  }
);

export default memo(MasterRow);
