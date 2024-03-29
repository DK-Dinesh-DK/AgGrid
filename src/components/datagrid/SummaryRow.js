import React, { memo } from "react";

import { clsx } from "clsx";
import { css } from "@linaria/core";

import { cell, cellFrozen, rowClassname, rowSelectedClassname } from "./style";
import { getColSpan, getRowStyle } from "./utils";
import SummaryCell from "./SummaryCell";

const summaryRow = css`
  @layer rdg.SummaryRow {
    line-height: var(--rdg-sumary-row-height);

    > .${String(cell)} {
      position: sticky;
    }
  }
`;

const topSummaryRow = css`
  @layer rdg.SummaryRow {
    > .${String(cell)} {
      z-index: 1;
    }

    > .${String(cellFrozen)} {
      z-index: 2;
    }
  }
`;

const topSummaryRowBorderClassname = css`
  @layer rdg.SummaryRow {
    > .${String(cell)} {
      border-block-end: 2px solid var(--rdg-summary-border-color);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const bottomSummaryRowBorderClassname = css`
  @layer rdg.SummaryRow {
    > .${String(cell)} {
      border-block-start: 2px solid var(--rdg-summary-border-color);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const summaryRowClassname = `rdg-summary-row ${summaryRow}`;

const topSummaryRowClassname = `rdg-top-summary-row ${topSummaryRow}`;

function SummaryRow({
  rowIdx,
  gridRowStart,
  row,
  viewportColumns,
  top,
  bottom,
  lastFrozenColumnIndex,
  selectedCellIdx,
  lastTopRowIdx,
  selectCell,
  "aria-rowindex": ariaRowIndex,
  height,
  rowType,
  rowLevelToolTip,
  setToolTip,
  setToolTipContent,
  setMouseY,
}) {
  const cells = [];
  function handleMoseY(y) {
    setMouseY(y);
  }
  function handleToolTip(value) {
    setToolTip(value);
  }
  function handleToolTipContent(value) {
    setToolTipContent(value);
  }
  for (let index = 0; index < viewportColumns.length; index++) {
    const column = viewportColumns[index];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "SUMMARY",
      row,
      rowIndex: rowIdx,
    });

    if (colSpan !== undefined) {
      index += colSpan - 1;
    }

    const isCellSelected = selectedCellIdx === column.idx;

    cells.push(
      <SummaryCell
        key={`${column.key}`}
        column={column}
        colSpan={colSpan}
        row={row}
        isCellSelected={isCellSelected}
        selectCell={selectCell}
        setMouseY={handleMoseY}
        setToolTip={handleToolTip}
        setToolTipContent={handleToolTipContent}
        rowHeight={height}
        rowIndex={rowIdx}
        type={rowType}
      />
    );
  }

  const isTop = lastTopRowIdx !== undefined;

  return (
    <div
      key={`SummaryRow-${rowIdx}`}
      role="row"
      aria-rowindex={ariaRowIndex}
      onMouseOver={() => {
        if (rowLevelToolTip) {
          let toolTipContent;
          if (typeof rowLevelToolTip === "function") {
            toolTipContent = rowLevelToolTip({
              row,
              rowIndex: rowIdx,
              summarryRowtype: rowType,
            });
          } else {
            toolTipContent = `${rowType}-SummarryRow-${rowIdx}`;
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
        `rdg-row-summary-row-${rowIdx % 2 === 0 ? "even" : "odd"}`,
        summaryRowClassname,
        {
          [rowSelectedClassname]: selectedCellIdx === -1,
          [topSummaryRowClassname]: isTop,
          [topSummaryRowBorderClassname]: isTop && lastTopRowIdx === rowIdx,
          [bottomSummaryRowBorderClassname]: !isTop && rowIdx === 0,
          "rdg-bottom-summary-row": !isTop,
        }
      )}
      style={{
        ...getRowStyle(gridRowStart),
        "--rdg-summary-row-top": top !== undefined ? `${top}px` : undefined,
        "--rdg-summary-row-bottom":
          bottom !== undefined ? `${bottom}px` : undefined,
      }}
    >
      {cells}
    </div>
  );
}

export default memo(SummaryRow);
