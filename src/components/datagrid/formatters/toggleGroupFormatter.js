import React from "react";
import { css } from "@linaria/core";
import { useFocusRef } from "../hooks/useFocusRef";

const groupCellContent = css`
  @layer rdg.GroupCellContent {
    outline: none;
  }
`;

const groupCellContentClassname = `rdg-group-cell-content ${groupCellContent}`;

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

const caretClassname = `rdg-caret ${caret}`;

export function toggleGroupFormatter(props) {
  return <ToggleGroup {...props} />;
}

export function ToggleGroup({
  groupKey,
  isExpanded,
  isCellSelected,
  toggleGroup,
  ...props
}) {
  const { ref, tabIndex } = useFocusRef(isCellSelected);

  const d = isExpanded ? "M1 1 L 7 7 L 13 1" : "M1 7 L 7 1 L 13 7";

  return (
    <span
      ref={ref}
      data-testid={`grid-group-toggle-${props.column.idx}-${props.rowIndex}`}
      className={groupCellContentClassname}
      tabIndex={tabIndex}
      onMouseOver={(e) => {
        if (props.column.toolTip) {
          let toolTipContent;
          if (typeof props.column.toolTip === "function") {
            toolTipContent = props.column.toolTip({
              row: props.row,
              rowIndex: props.rowIndex,
              column: props.column,
            });
          } else {
            toolTipContent = groupKey;
          }
          props.handleToolTipContent(toolTipContent);
          props.handleToolTip(true);
        }
      }}
      onMouseOutCapture={() => {
        if (props.column.haveChildren === false && props.column.toolTip) {
          props.handleToolTip(false);
        }
      }}
    >
      {groupKey}
      <svg
        viewBox="0 0 14 8"
        width="14"
        height="8"
        className={caretClassname}
        aria-hidden
      >
        <path d={d} />
      </svg>
    </span>
  );
}
