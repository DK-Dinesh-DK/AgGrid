import React, { memo } from "react";

import { getCellStyle, getCellClassname } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";
import { css } from "@linaria/core";

function TreeCell({
  id,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  row,
  groupColumnIndex,
  toggleTree: toggleTreeWrapper,
  level,
}) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleTree() {
    toggleTreeWrapper(id);
  }


  const caret = css`
    @layer rdg.GroupCellCaret {
      margin-inline-start: 4px;
      stroke: currentColor;
      stroke-width: 1.5px;
      fill: transparent;
      vertical-align: middle;

      > path {
        transition: d 0.1s;
      }
    }
  `;


  const style = getCellStyle(column);


  return (
    // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      role="gridcell"
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      ref={ref}
      tabIndex={tabIndex}
      key={column.key}
      className={getCellClassname(column)}
      style={{
        ...style,
        display: "flex",
        width: "100%",
        justifyContent: "center",
      }}
      //   onClick={isLevelMatching ? toggleGroup : undefined}
      onFocus={onFocus}
      onDoubleClick={toggleTree}
    >
      <div
        className="tree-expand-icon"
        style={{ width: "30%", textAlign: "start" }}
      >
        {column.idx < 1 && (
          <span
            style={{
              color: "black",
              fontSize: "12px",
              cursor: "pointer",
              paddingLeft: `${level * 10 + 10}px`,
            }}
            onClick={toggleTree}
          >
               {isExpanded ? '\u25BC' : '\u25B6'}
          </span>
        )}
      </div>
      <div
        style={{
          width: "70%",
          textAlign: "start",
          paddingLeft: `${level * 5 + 5}px`,
        }}
      >
        {(!column.rowGroup || groupColumnIndex === column.idx) &&
          column.treeFormatter?.({
            childRows,
            column,
            row,
            isExpanded,
            isCellSelected,
            toggleTree,
          })}
      </div>
    </div>
  );
}

export default memo(TreeCell);
