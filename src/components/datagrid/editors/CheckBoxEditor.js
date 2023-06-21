import { SelectCellFormatter } from "../formatters";

export default function CheckBoxEditor({
  row,
  column,
  onRowChange,
  isCellSelected,
  ...props
}) {
  return (
    <>
      <SelectCellFormatter
        value={row[column.key]}
        onChange={() => {
          onRowChange({ ...row, [column.key]: !row[column.key] });
        }}
        isCellSelected={isCellSelected}
      {  ...props}
      />
    </>
  );
}
