import React, { memo } from "react";
import { clsx } from "clsx";
import { css } from "@linaria/core";

import {
  cell,
  cellFrozenLast,
  rowClassname,
  rowSelectedClassname,
} from "./style";
import { SELECT_COLUMN_KEY } from "./Columns";
import GroupCell from "./GroupCell";
import { RowSelectionProvider } from "./hooks";
import { getRowStyle } from "./utils";

const groupRow = css`
  @layer rdg.GroupedRow {
    &:not([aria-selected="true"]) {
      background-color: var(--rdg-header-background-color);
    }

    > .${String(cell)}:not(:last-child):not(.${String(cellFrozenLast)}) {
      border-inline-end: none;
    }
  }
`;

const groupRowClassname = `rdg-group-row ${groupRow}`;

function GroupedRow({
  id,
  groupKey,
  viewportColumns,
  childRows,
  rowIdx,
  row,
  gridRowStart,
  height,
  level,
  isExpanded,
  selectedCellIdx,
  isRowSelected,
  selectGroup,
  toggleGroup,
  setToolTip,
  setToolTipContent,
  setMouseY,
  rowLevelToolTip,
  ...props
}) {
  // Select is always the first column
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;

  function handleSelectGroup() {
    selectGroup(rowIdx);
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

  return (
    <RowSelectionProvider value={isRowSelected}>
      <div
        key={`${rowIdx}`}
        role="row"
        id={`group-row-${row?.id ?? rowIdx}`}
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
              toolTipContent = `group-rowIndex-${rowIdx}`;
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
          groupRowClassname,
          `rdg-row-groupRow-${rowIdx % 2 === 0 ? "even" : "odd"}`,
          {
            [rowSelectedClassname]: selectedCellIdx === -1,
          }
        )}
        onClick={handleSelectGroup}
        style={getRowStyle(gridRowStart, height)}
        {...props}
      >
        {viewportColumns.map((column) => (
          <GroupCell
            key={`${column.key}`}
            id={id}
            groupKey={groupKey}
            childRows={childRows}
            isExpanded={isExpanded}
            isCellSelected={selectedCellIdx === column.idx}
            column={column}
            row={row}
            groupColumnIndex={idx}
            toggleGroup={toggleGroup}
            rowIndex={rowIdx}
            setMouseY={handleMoseY}
            setToolTip={handleToolTip}
            setToolTipContent={handleToolTipContent}
            Rowheight={height}
          />
        ))}
      </div>
    </RowSelectionProvider>
  );
}

export default memo(GroupedRow);
