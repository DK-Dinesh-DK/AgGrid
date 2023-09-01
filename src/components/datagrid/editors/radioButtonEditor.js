import { css } from "@linaria/core";
import React from "react";

export default function RadioButtonEditor({
  row,
  column,
  onRowChange,
  rowIndex,
}) {
  const options = column.options ? column.options : column.buttons;

  const radioButtonContainer = css`
    display: flex;
    font-size: var(--rdg-font-size);
    font-family: var(--rdg-font-family);
    flex-direction: row;
    & > div {
      display: flex;
      align-items: center;
    }
  `;
  const radioButton = css`
    width: 12px;
    height: 12px;
    /* UI Properties */
    background: #ffffff;
    border: 0.9998000264167786px solid #95b3d7;
    border-radius: 50%;
    padding: 2px;
    &:checked {
      background-clip: content-box;
      background-color: #366092;
    }
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  `;
  return (
    <div
      className={`rdg-radio-container${radioButtonContainer}`}
      style={{ display: "flex" }}
    >
      {options.map((option) => {
        return (
          <div key={`${rowIndex}-${option.label}-div`}>
            <input
              type={"radio"}
              value={option.value}
              className={`rdg-radiobutton ${radioButton}`}
              data-testid={`grid-radio-button-${option.label}`}
              key={`${rowIndex}-${option.label}-input`}
              name={`options${column.rowIndex}`}
              checked={row[column.key] === option?.value}
              onClick={(event) => {
                onRowChange({ ...row, [column.key]: event.target.value });
              }}
            />
            <label>{option.label}</label>
          </div>
        );
      })}
    </div>
  );
}
