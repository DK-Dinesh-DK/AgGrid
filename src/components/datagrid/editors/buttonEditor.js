import React from "react";
import { css } from "@linaria/core";

const buttonInternalClassname = css`
  @layer rdg.ButtonEditor {
    height: 22px;
    background-color: #4f81bd;
    color: #ffffff;
    border: 1px solid #ffffff;
    cursor: pointer;
    font-size: var(--rdg-font-size);
    font-family: var(--rdg-font-family);

    &:focus {
      background-color: #446ea1;
    }
  }
`;

export const buttonClassname = `rdg-button-editor ${buttonInternalClassname}`;
export default function ButtonEditor({ row, column, ...props }) {
  return (
    <>
      <button
        className={buttonClassname}
        data-testid={`grid-button-${column.idx}-${props.rowIndex}`}
        disabled={column.editable ? column.editable : false}
        onClick={() => column.onClick({ row, column, ...props })}
        {...column.inputProps}
      >
        {column.inputProps?.text ?? row[column.key] ?? column.headerName}
      </button>
    </>
  );
}
