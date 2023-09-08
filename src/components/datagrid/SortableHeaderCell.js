import React from "react";
import { useDefaultComponents } from "./DataGridDefaultComponentsProvider";
import { useFocusRef } from "./hooks";
import { css } from "@linaria/core";
import alignmentUtils from "./utils/alignMentUtils";
const headerSortCell = css`
  @layer rdg.SortableHeaderCell {
    padding: 2px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    &:focus {
      outline: none;
    }
  }
`;

const headerSortCellClassname = `rdg-header-sort-cell ${headerSortCell}`;

export default function SortableHeaderCell({
  onSort,
  selectedPositionIdx,
  subCellIdx,
  sortDirection,
  priority,
  children,
  isCellSelected,
  column,
  rowData,
}) {
  const sortStatus = useDefaultComponents().sortStatus;

  let { ref, tabIndex } = useFocusRef(isCellSelected);

  function handleKeyDown(event) {
    if (!column.readOnly && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey, children);
    }
  }

  function handleClick(event) {
    if (!column.readOnly) onSort(event.ctrlKey || event.metaKey, children);
  }
  let style = {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    paddingLeft: column?.filter && !column?.alignment ? "15px" : "6px",
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
      style={{ cursor: column.readOnly ? "default" : "pointer" }}
    >
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
