import { css } from "@linaria/core";
import moment from "moment";
import React from "react";

export default function TimeEditor({ row, column, onRowChange, ...props }) {
  const value = row[column.key]
    ? row[column.key]
    : moment(new Date()).format("hh:mm");

  const timeEditorClassName = css`
    @layer rdg.TimeEditor {
      font-size: var(--rdg-font-size);
      font-family: var(--rdg-font-family);
    }
  `;
  return (
    <>
      <input
        type={"time"}
        value={value}
        className={`rdg-time-editor ${timeEditorClassName}`}
        disabled={column.editable ?? false}
        {...column.inputProps}
        onChange={(e) => {
          onRowChange({ ...row, [column.key]: e.target.value });
        }}
        {...props}
      />
    </>
  );
}
