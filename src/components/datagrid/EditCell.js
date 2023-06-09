import React, { useEffect, useRef } from "react";
import { css } from "@linaria/core";
import { useLatestFunc } from "./hooks/useLatestFunc";
import { getCellStyle, getCellClassname, onEditorNavigation } from "./utils";

const cellEditing = css`
  @layer rdg.EditCell {
    padding: 0;
  }
`;

export default function EditCell({
  column,
  colSpan,
  row,
  allrow,
  rowIndex,
  onRowChange,
  api,
  node,
  closeEditor,
}) {
  const frameRequestRef = useRef();
  const commitOnOutsideClick =
    column.editorOptions?.commitOnOutsideClick !== false;

  // We need to prevent the `useEffect` from cleaning up between re-renders,
  // as `onWindowCaptureMouseDown` might otherwise miss valid mousedown events.
  // To that end we instead access the latest props via useLatestFunc.
  const commitOnOutsideMouseDown = useLatestFunc(() => {
    onClose(true);
  });

  useEffect(() => {
    if (!commitOnOutsideClick) return;

    function onWindowCaptureMouseDown() {
      frameRequestRef.current = requestAnimationFrame(commitOnOutsideMouseDown);
    }

    // eslint-disable-next-line no-restricted-globals
    addEventListener("mousedown", onWindowCaptureMouseDown, { capture: true });

    return () => {
      // eslint-disable-next-line no-restricted-globals
      removeEventListener("mousedown", onWindowCaptureMouseDown, {
        capture: true,
      });
      cancelFrameRequest();
    };
  }, [commitOnOutsideClick, commitOnOutsideMouseDown]);

  function cancelFrameRequest() {
    cancelAnimationFrame(frameRequestRef.current);
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      // Discard changes
      onClose();
    } else if (event.key === "Enter") {
      event.stopPropagation();
      onClose(true);
    } else {
      const onNavigation =
        column.editorOptions?.onNavigation ?? onEditorNavigation;
      if (!onNavigation(event)) {
        event.stopPropagation();
      }
    }
  }

  function onClose(commitChanges) {
    if (commitChanges) {
      onRowChange(row, true);
    } else {
      closeEditor();
    }
  }

  const { cellClass } = column;
  const className = getCellClassname(
    column,
    "rdg-editor-container",
    !column.editorOptions?.renderFormatter && cellEditing,
    typeof cellClass === "function" ? cellClass(row) : cellClass
  );

  return (
    <div
      role="gridcell"
      // aria-colindex is 1-based
      aria-colindex={column.idx + 1}
      aria-colspan={colSpan}
      aria-selected
      className={className}
      style={getCellStyle(column, colSpan)}
      onKeyDown={onKeyDown}
      onMouseDownCapture={commitOnOutsideClick ? cancelFrameRequest : undefined}
    >
      {(column.cellEditor != null || column.editable === true) &&
        !column.rowDrag && (
          <>
            {column.cellEditor({
              column,
              colDef: column,
              row,
              data: row,
              onRowChange,
              value: row[column.key],
              node,
              valueFormatted: column.valueFormatter,
              allrow,
              rowIndex,
              api,
              onClose,
            })}
            {column.editorOptions?.renderFormatter &&
              column.editable !== true &&
              column.formatter({
                colDef: column,
                column,
                data: row,
                row,
                api,
                node,
                value: row[column.key],
                valueFormatted: column.valueFormatter,
                onRowChange,
                isCellSelected: true,
              })}
            {column.editable &&
              column.formatter({
                colDef: column,
                column,
                data: row,
                row,
                api,
                node,
                value: row[column.key],
                valueFormatted: column.valueFormatter,
                onRowChange,
                isCellSelected: true,
              })}
          </>
        )}
    </div>
  );
}
