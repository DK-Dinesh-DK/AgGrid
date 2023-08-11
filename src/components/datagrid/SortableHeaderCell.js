import React from "react";
import { useDefaultComponents } from "./DataGridDefaultComponentsProvider";
import { useFocusRef } from "./hooks";
import { css } from "@linaria/core";
import alignmentUtils from "./utils/alignMentUtils";
const headerSortCell = css`
  @layer rdg.SortableHeaderCell {
    cursor: pointer;
    padding: 2px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    &:focus {
      outline: none;
    }
  }
`;

// gridTemplateColumns: "`100%/Object.keys(subData.children).length` ".repeat(
//   Object.keys(subData.children).length
// ),

const headerSortCellClassname = `rdg-header-sort-cell ${headerSortCell}`;

const headerSortName = css`
  @layer rdg.SortableHeaderCellName {
    flex-grow: 1;
    overflow: hidden;
    overflow: clip;
    text-overflow: ellipsis;
  }
`;
const headerSortNameClassname = `rdg-header-sort-name ${headerSortName}`;

export default function SortableHeaderCell({
  onSort,
  selectedPositionIdx,
  subCellIdx,
  sortDirection,
  priority,
  children,
  isCellSelected,
  column,
  borderBottom,
  rowData,
}) {
  const sortStatus = useDefaultComponents().sortStatus;

  var { ref, tabIndex } = useFocusRef(isCellSelected);

  function handleKeyDown(event) {
    if (event.key === " " || event.key === "Enter") {
      // stop propagation to prevent scrolling
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey, children);
    }
  }

  function handleClick(event) {
    onSort(event.ctrlKey || event.metaKey, children);
  }
  let style = {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    paddingLeft: column?.filter && !column?.alignment ? "15px" : 0,
  };
  if (column?.alignment) {
    style = alignmentUtils(column, rowData, style, "Header");
  }
  return (
    <div
      data-testid="sortableHeaderName"
      ref={ref}
      tabIndex={tabIndex}
      className={headerSortCellClassname}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* <span className={headerSortNameClassname}>{children}</span> */}
      <div style={style}>{children}</div>
      {selectedPositionIdx === subCellIdx && (
        <div
          style={{ width: "10%", display: sortDirection ? "block" : "none" }}
        >
          {sortStatus({ sortDirection, priority })}
        </div>
      )}
    </div>
  );
}
