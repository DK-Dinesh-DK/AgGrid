import React, { useState, useRef } from "react";
import {alignmentUtilsCell} from "../alignMentUtils";

export function valueFormatter(props) {
  function selectCellWrapper(openEditor) {
    let sampleColumn = props.column;

    props.selectCell(props.row, sampleColumn, openEditor);
  }

  function handleClick(e) {
    selectCellWrapper(props.column.editorOptions?.editOnClick);
    props.onRowClick?.({
      api: props.api,
      data: props.row,
      columnApi: props.columnApi,
      node: props.node,
      rowIndex: props.rowIndex,
      type: "rowClicked",
      event: e,
    });
    props.onCellClick?.({
      api: props.api,
      colDef: {
        field: props.column.field,
        resizable: props.column.resizable ?? undefined,
        sortable: props.column.sortable ?? undefined,
        width: props.column.width,
      },
      data: props.row,
      node: props.node,
      columnApi: props.columnApi,
      rowIndex: props.rowIndex,
      value: props.row[props.column.field] ?? undefined,
      type: "cellClicked",
      event: e,
    });
  }

  function handleDoubleClick(e) {
    selectCellWrapper(true);
    props.onRowDoubleClick?.({
      api: props.api,
      data: props.row,
      columnApi: props.columnApi,
      node: props.node,
      rowIndex: props.rowIndex,
      type: "rowDoubleClicked",
      event: e,
    });
    props.onCellDoubleClick?.({
      api: props.api,
      colDef: {
        field: props.column.field,
        resizable: props.column.resizable ?? undefined,
        sortable: props.column.sortable ?? undefined,
        width: props.column.width,
      },
      data: props.row,
      node: props.node,
      columnApi: props.columnApi,
      rowIndex: props.rowIndex,
      value: props.row[props.column.field] ?? undefined,
      type: "cellDoubleClicked",
      event: e,
    });
  }

  function handleContextMenu() {
    selectCellWrapper();
  }

  if (props.column.haveChildren === true) {
    return (
      <>
        <div
          key={props.column.idx}
          style={{
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {childData(props.column.children, props)}
        </div>
      </>
    );
  } else {
    var isCellSelected;
    if (props.selectedCellIdx === props.column.idx) {
      isCellSelected = true;
    } else {
      isCellSelected = false;
    }
    let cellStyle = {
      width: "100%",
      textAlign: "center",
      textOverflow: "ellipsis",
      overflow: "hidden",
      height: "inherit",
      paddingInline: isCellSelected && props.selectedCellEditor ? "0px" : "6px",
    };
    if (props.column.alignment) {
      cellStyle = props.column.alignment.align
        ? { ...cellStyle, textAlign: props.column.alignment.align }
        : alignmentUtilsCell(props.column, props.row, cellStyle);
    }
    return (
      // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        key={props.column.field}
        style={cellStyle}
        // className={props.className}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {isCellSelected && props.selectedCellEditor
          ? props.selectedCellEditor
          : props.row[props.column.field]}
      </div>
    );
  }
}

const childData = (subData, props) => {
  function flatten(into, node) {
    if (node == null) return into;
    if (Array.isArray(node)) return node.reduce(flatten, into);
    into.push(node);

    return flatten(into, node.children);
  }

  var rowSubData = flatten([], subData);
  var value1 = false;

  rowSubData = rowSubData.filter(function (item) {
    return item !== value1;
  });

  for (var i = 0; i < rowSubData.length; i++) {
    if (rowSubData[i].haveChildren) {
      rowSubData.splice(i, 1);
      i--;
    }
  }

  const rowCol = props.rowArray;

  return rowSubData.map((info1, index) => {
    const func = (a, b) => {
      if (a.field === b) {
        return a.width;
      } else {
        return null;
      }
    };

    const [cellValue, setCellValue] = useState(
      info1.cellRendererParams?.value ?? props.row[info1.key]
    );
    const gridCell = useRef(null);

    function selectSubCellWrapper(openEditor) {
      let sampleColumn = props.column;
      props.subColumn?.map((obj) => {
        if (obj.field === info1.key) {
          sampleColumn = obj;
        }
      });
      props.selectCell(props.row, sampleColumn, openEditor);
    }
    function handleClick(e) {
      selectSubCellWrapper(info1.editorOptions?.editOnClick);
      props.onRowClick?.({
        api: props.api,
        data: props.row,
        columnApi: props.columnApi,
        node: props.node,
        rowIndex: props.rowIndex,
        type: "rowClicked",
        event: e,
      });
      props.onCellClick?.({
        api: props.api,
        colDef: {
          field: info1.field,
          resizable: info1.resizable ?? undefined,
          sortable: info1.sortable ?? undefined,
          width: info1.width,
        },
        data: props.row,
        node: props.node,
        columnApi: props.columnApi,
        rowIndex: props.rowIndex,
        value: cellValue ?? undefined,
        type: "cellClicked",
        event: e,
      });
    }
    function handleContextMenu() {
      selectSubCellWrapper();
    }
    function handleDoubleClick(e) {
      selectSubCellWrapper(true);
      props.onRowDoubleClick?.({
        api: props.api,
        data: props.row,
        columnApi: props.columnApi,
        node: props.node,
        rowIndex: props.rowIndex,
        type: "rowDoubleClicked",
        event: e,
      });
      props.onCellDoubleClick?.({
        api: props.api,
        colDef: {
          field: info1.field,
          resizable: info1.resizable ?? undefined,
          sortable: info1.sortable ?? undefined,
          width: info1.width,
        },
        data: props.row,
        node: props.node,
        columnApi: props.columnApi,
        rowIndex: props.rowIndex,
        value: cellValue ?? undefined,
        type: "cellDoubleClicked",
        event: e,
      });
    }

    var isCellSelected;

    if (props.selectedCellIdx === info1.idx) {
      isCellSelected = true;
    } else {
      isCellSelected = false;
    }

    let childStyle = {
      display: "flex",
      justifyContent: "center",

      alignItems: "center",

      borderInlineEnd:
        isCellSelected && props.selectedCellEditor
          ? "none"
          : "1px solid var(--rdg-border-color)",

      textAlign: "center",

      textOverflow: "ellipsis",

      overflow: "hidden",

      height: "inherit",

      outline:
        props.selectedCellIdx === info1.idx && isCellSelected
          ? "1px solid var(--rdg-selection-color)"
          : "none",

      outlineOffset:
        props.selectedCellIdx === info1.idx && isCellSelected ? "-1px" : "0px",

      paddingInline: isCellSelected && props.selectedCellEditor ? "0px" : "6px",

      width: `${rowCol.map((info2) => {
        return func(info2, info1.key);
      })}px`.replace(/,/g, ""),
    };

    if (info1.validation) {
      const validationStyle = info1.validation.style
        ? info1.validation.style
        : { backgroundColor: "red" };

      if (info1.validation.method(props.row[info1.key])) {
        childStyle = {
          ...childStyle,

          ...validationStyle,
        };
      }
    }

    if (info1.alignment) {
      childStyle = info1.alignment.align
        ? { ...childStyle, textAlign: info1.alignment.align }
        : alignmentUtilsCell(info1, props.row, childStyle);
    }

    return (
      // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        onClick={handleClick}
        key={info1.idx}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        style={childStyle}
      >
        {/* <div style={{ borderInlineEnd: sdsd, textAlign: "center",height:"24px",width:100 }}> */}

        {isCellSelected && props.selectedCellEditor
          ? props.selectedCellEditor
          : !info1.rowDrag &&
            info1.cellRenderer({
              column: info1,
              api: props.api,
              columnApi: props.columnApi,
              row: props.row,
              onRowChange: props.handleRowChange,
              value: cellValue,
              rowIndex: props.rowIndex,
              node: props.node,
              colDef: info1,
              eGridCell: gridCell.current,
              selectCell: props.selectCell,
              selectedCellIdx: props.selectedCellIdx,
              getValue: () => cellValue,
              setValue: (newValue) => setCellValue(newValue),
              fullWidth: info1.cellRendererParams?.fullWidth,
              valueFormatted: info1.cellRendererParams?.valueFormatted,
              ...info1?.cellRendererParams,
            })}
      </div>
    );
  });
};
