import React, { memo } from "react";
import { css } from "@linaria/core";

import { getCellStyle, getCellClassname } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";

export const summaryCellClassname = css`
  @layer rdg.SummaryCell {
    inset-block-start: var(--rdg-summary-row-top);
    inset-block-end: var(--rdg-summary-row-bottom);
  }
`;

function SummaryCell({
  column,
  colSpan,
  row,
  isCellSelected,
  selectCell,
  setMouseY,
  setToolTip,
  setToolTipContent,
  rowIndex,
  rowHeight,
  type,
}) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);
  const { summaryCellClass } = column;
  const className = getCellClassname(
    column,
    summaryCellClassname,
    `rdg-summary-column-${column.idx % 2 === 0 ? "even" : "odd"}`,
    typeof summaryCellClass === "function"
      ? summaryCellClass(row)
      : summaryCellClass
  );

  function onClick() {
    selectCell(row, column);
  }

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      role="gridcell"
      id={`${type}-summarry-cell-${column.idx}-${rowIndex}`}
      aria-colindex={column.idx + 1}
      aria-colspan={colSpan}
      aria-selected={isCellSelected}
      ref={ref}
      tabIndex={tabIndex}
      className={className}
      style={getCellStyle(column, colSpan)}
      onClick={onClick}
      onFocus={onFocus}
      onMouseMove={(e) => {
        const element = document.getElementById(
          `${type}-summarry-cell-${column.idx}-${rowIndex}`
        );
        let y = element.getBoundingClientRect().y;
        setMouseY(y + rowHeight / 2);
      }}
      onMouseOver={(e) => {
        if (column.toolTip) {
          let toolTipContent;
          if (typeof column.toolTip === "function") {
            toolTipContent = column.toolTip({
              row,
              rowIndex,
              column,
              summarryRowtype: type,
            });
          } else {
            toolTipContent = row[column.field];
          }
          setToolTipContent(toolTipContent);
          setToolTip(true);
        }
      }}
      onMouseOutCapture={() => {
        if (column.toolTip) {
          setToolTip(false);
        }
      }}
    >
      {column.summaryFormatter?.({ column, row, isCellSelected })}
    </div>
  );
}

export default memo(SummaryCell);
