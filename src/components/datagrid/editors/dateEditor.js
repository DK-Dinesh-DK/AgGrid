import { css } from "@linaria/core";
import moment from "moment";

const datePickerInternalClassname = css`
  @layer rdg.DatePicker {
    border: none;
    height: 22px;
    background-color: #ffffff;
    font-size: var(--rdg-font-size);
    font-family: var(--rdg-font-family);
  }
`;

export const datePickerClassname = `rdg-date-picker-editor ${datePickerInternalClassname}`;
export default function DateEditor({ row, column, onRowChange, ...props }) {
  return (
    <>
      <input
        type={"date"}
        className={datePickerClassname}
        data-testid={`grid-date-picker-${column.idx}-${props.rowIndex}`}
        value={moment(row[column.key]).format("YYYY-MM-DD")}
        placeholder="dd-mm-yyyy"
        disabled={column.editable ?? false}
        {...column.inputProps}
        onChange={(e) => {
          onRowChange({ ...row, [column.key]: new Date(e.target.value) });
        }}
        {...props}
      />
    </>
  );
}
