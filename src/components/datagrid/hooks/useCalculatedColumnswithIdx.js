import React, { useMemo } from "react";
import textEditorClassname from "../editors/textEditor";
export function useCalculatedColumnswithIdx({ rowData1 }) {
  const { columns4 } = useMemo(() => {
    var columns4 = rowData1.map((rawColumn, pos) => {
      const column = {
        ...rawColumn,
      };
      column.idx = pos;
      if (rawColumn.editable) {
        column.cellEditor = column.cellEditor
          ? column.cellEditor
          : (props) => {
              let value = props.row[props.column.key];
              return (
                <input
                  className={textEditorClassname}
                  data-testid={`gird-text-editor-${props.column.idx}-${props.rowIndex}`}
                  style={{ width: "100%" }}
                  value={value}
                  onChange={(event) =>
                    props.onRowChange({
                      ...props.row,
                      [props.column.key]: event.target.value,
                    })
                  }
                />
              );
            };
      }
      return column;
    });

    return {
      columns4,
    };
  }, [rowData1]);

  return {
    columns4,
  };
}
