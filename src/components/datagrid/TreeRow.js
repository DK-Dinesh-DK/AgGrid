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
  // rowArray,
  sourceData,
  childRows,
  treeData,
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
  setToolTip,
  setToolTipContent,
  setMouseY,
  rowLevelToolTip,
  previousData,
  ...props
}) {
  // Select is always the first column
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;
  const [detectedLevel, setDetectedLevel] = useState();
  function handleMouseY(y) {
    setMouseY(y);
  }
  function handleToolTip(value) {
    setToolTip(value);
  }
  function handleToolTipContent(value) {
    setToolTipContent(value);
  }
  useEffect(() => {
    let detectedLevel;
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
        id={
          row.children
            ? `tree-row-${row?.id ?? rowIdx}`
            : `row-${row?.id ?? rowIdx}`
        }
        ref={props.ref}
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
              toolTipContent = row.children
                ? `tree-row-${row?.id ?? rowIdx}`
                : `row-index-${row?.id ?? rowIdx}`;
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
          rowClass,
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
            // isCopied={props.copiedCellIdx === idx}
            selectCell={selectCell}
            selectedCellEditor={selectedCellEditor}
            valueChangedCellStyle={valueChangedCellStyle}
            treeData={treeData}
            previousData={previousData}
            setMouseY={handleMouseY}
            setToolTip={handleToolTip}
            setToolTipContent={handleToolTipContent}
            Rowheight={height}
          />
        ))}
      </div>
    </RowSelectionProvider>
  );
}

export default memo(TreeRow);
