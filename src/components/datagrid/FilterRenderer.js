import React, { useContext } from "react";
import { useFocusRef } from "./hooks";
import FilterContext from "./filterContext";
import alignmentUtils from "./utils/alignMentUtils";
export default function FilterRenderer({
  isCellSelected,
  column,
  children,
  rowData,
}) {
  const filters = useContext(FilterContext);
  const { ref, tabIndex } = useFocusRef(isCellSelected);

  let style = {
    display: "flex",
    justifyContent: "var(--rdg-cell-align)",
  };

  if (rowData && column?.alignment) {
    style = alignmentUtils(column, rowData, style);
  }

  return (
    <>
      {!column.sortable && (
        <div style={{ ...style, width: "90%" }}>{column.headerName}</div>
      )}
      {filters.enabled && <div>{children({ ref, tabIndex, filters })}</div>}
    </>
  );
}
