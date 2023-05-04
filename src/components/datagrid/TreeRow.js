import React, { memo, useState, useEffect } from "react";
import clsx from "clsx";
import { css } from "@linaria/core";
import { getRowStyle } from "./utils";
import {
  cell,
  cellFrozenLast,
  rowClassname,
  rowSelectedClassname,
} from "./style";
import { SELECT_COLUMN_KEY } from "./Columns";
import TreeCell from "./TreeCell";
import { RowSelectionProvider } from "./hooks";

const groupRow = css`
  @layer rdg.TreeRow {
    &:not([aria-selected="true"]) {
      background-color: var(--rdg-header-background-color);
    }

    > .${String(cell)}:not(:last-child):not(.${String(cellFrozenLast)}) {
      border-inline-end: none;
    }
  }
`;

const groupRowClassname = `rdg-group-row ${groupRow}`;

function TreeRow({
  id,
  viewportColumns,
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
  toggleTree,
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
  ...props
}) {
  // Select is always the first column
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;
  const [detectedLevel, setDetectedLevel] = useState();

  useEffect(() => {
    var detectedLevel;
    function recursiveChild(obj, level) {
      if (!obj.children) return;
      if (JSON.stringify(obj) === JSON.stringify(row)) {
        detectedLevel = level;
        return;
      }
      level = level + 1;
      obj.children?.map((childObj) => {
        if (JSON.stringify(childObj) === JSON.stringify(row)) {
          detectedLevel = level;
          return;
        }
        recursiveChild(childObj, level);
      });
    }
    sourceData?.map((data) => {
      let level = 0;
      if (data.children) {
        recursiveChild(data, level);
      }
    });
    setDetectedLevel(detectedLevel);
  }, [sourceData]);

  let style = getRowStyle(gridRowStart, height);

  return (
    <RowSelectionProvider value={isRowSelected}>
      <div
        key={`${rowIdx}`}
        role="row"
        id={row?.id ?? rowIdx}
        ref={props.ref}
        aria-level={level}
        aria-expanded={isExpanded}
        className={clsx(
          rowClassname,
          groupRowClassname,
          `rdg-row-groupRow-${rowIdx % 2 === 0 ? "even" : "odd"}`,
          {
            [rowSelectedClassname]: isRowSelected,
          }
        )}
        style={style}
        {...props}
      >
        {viewportColumns.map((column) => (
          <TreeCell
            key={`${column.key}`}
            id={id}
            childRows={row.children}
            isExpanded={isExpanded}
            isCellSelected={selectedCellIdx === column.idx}
            column={column}
            row={row}
            apiObject={apiObject}
            groupColumnIndex={idx}
            toggleTree={toggleTree}
            level={detectedLevel}
            selection={selection}
            serialNumber={serialNumber}
            allrow={props.allrow}
            rowIndex={rowIdx}
            viewportColumns={viewportColumns}
            node={props.node}
            onRowClick={onRowClick}
            onRowChange={props.handleRowChange}
            onCellClick={props.onCellClick}
            onCellDoubleClick={props.onCellDoubleClickLatest}
            onCellContextMenu={props.onCellContextMenuLatest}
            onRowDoubleClick={onRowDoubleClick}
            columnApi={columnApi}
            selectTree={selectTree}
            isRowSelected={isRowSelected}
            // isCopied={props.copiedCellIdx === idx}
            selectCell={props.selectCell}
            valueChangedCellStyle={valueChangedCellStyle}
            treeData={treeData}
          />
        ))}
      </div>
    </RowSelectionProvider>
  );
}

export default memo(TreeRow);
