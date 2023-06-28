import { useContext } from "react";
import { useFocusRef } from "./hooks";
import FilterContext from "./filterContext";
import alignmentUtilsHeader from "./alignMentUtils";
export default function FilterRenderer({
  isCellSelected,
  column,
  children,
  rowData,
}) {
  const filters = useContext(FilterContext);
  const { ref, tabIndex } = useFocusRef(isCellSelected);

  var style = { padding: "2px 5px", display: "flex", justifyContent: "center" };

  if (rowData && column.alignment) {
    style = column.alignment.align
      ? { ...style, justifyContent: column.alignment.align }
      : alignmentUtilsHeader(column, rowData[0], style);
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
