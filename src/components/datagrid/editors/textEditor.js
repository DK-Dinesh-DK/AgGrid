import React from "react";
import { css } from "@linaria/core";

const textEditorInternalClassname = css`
  @layer rdg.TextEditor {
    appearance: none;
    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    height: 20px;
    margin: 2px 0;
    padding-block: 0;
    padding-inline: 6px;
    border: none;
    vertical-align: top;
    color: var(--rdg-textEditor-text-color);
    background-color: var(--rdg-background-color);
    font-family: inherit;
    font-size: var(--rdg-font-size);

    &:focus {
      border-color: var(--rdg-selection-color);
      outline: none;
    }

    &::placeholder {
      color: #999;
      opacity: 1;
    }
  }
`;

export const textEditorClassname = `rdg-text-editor ${textEditorInternalClassname}`;

export default function TextEditor({
  row,
  column,
  onRowChange,
  onClose,
  ...props
}) {
  var type = column.type ? column.type : "text";
  type =
    type.toLowerCase() === "masked" || type.toLowerCase() === "mask"
      ? "password"
      : type;
  let value = row[column.key];
  return (
    <input
      role="gridcellTextbox"
      spellCheck="true"
      data-testid={`gird-text-editor-${column.idx}-${props.rowIndex}`}
      className={textEditorClassname}
      type={type}
      disabled={column.editable ?? false}
      value={value}
      {...column.inputProps}
      onChange={(event) =>
        onRowChange({ ...row, [column.key]: event.target.value })
      }
    />
  );
}
