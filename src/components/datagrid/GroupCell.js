import React, { memo } from "react";
import { getCellStyle, getCellClassname } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";

function GroupCell({
  id,
  groupKey,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  row,
  groupColumnIndex,
  toggleGroup: toggleGroupWrapper,
  rowIndex,
  setMouseY,
  setToolTip,
  setToolTipContent,
  Rowheight,
}) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);
  function handleToolTip(value) {
    setToolTip(value);
  }
  function handleToolTipContent(value) {
    setToolTipContent(value);
  }

  function toggleGroup() {
    toggleGroupWrapper(id);
  }

  // Only make the cell clickable if the group level matches
  const isLevelMatching = column.rowGroup && groupColumnIndex === column.idx;

  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      role="gridcell"
      id={`group-cell-${column.idx}-${rowIndex}`}
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      ref={ref}
      tabIndex={tabIndex}
      key={column.key}
      onMouseMove={(e) => {
        const element = document.getElementById(
          `group-cell-${column.idx}-${rowIndex}`
        );
        let y = element.getBoundingClientRect().y;
        setMouseY(y + Rowheight / 2);
      }}
      className={getCellClassname(column)}
      style={{
        ...getCellStyle(column),
        cursor: isLevelMatching ? "pointer" : "default",
      }}
      onClick={isLevelMatching ? toggleGroup : undefined}
      onFocus={onFocus}
    >
      {(!column.rowGroup || groupColumnIndex === column.idx) &&
        column.groupFormatter?.({
          groupKey,
          childRows,
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleGroup,
          rowIndex,
          handleToolTip,
          handleToolTipContent,
        })}
    </div>
  );
}

export default memo(GroupCell);
