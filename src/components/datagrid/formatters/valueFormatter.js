import React, { useState, useRef } from "react";
import moment from "moment";

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

    return (
      // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        key={props.column.field}
        style={{
          width: "100%",
          textAlign: "center",
          textOverflow: "ellipsis",
          overflow: "hidden",
          height: "inherit",
          paddingInline:
            isCellSelected && props.selectedCellEditor ? "0px" : "6px",
        }}
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
      function alignmentUtils() {
        let styles = childStyle;
        let symbol = ["£", "$", "₹", "€", "¥", "₣", "¢"];
        if (
          info1.alignment.type?.toLowerCase() === "date" ||
          moment(props.row[info1.field], "YYYY-MM-DD", true).isValid() ||
          moment(props.row[info1.field], "YYYY/MM/DD", true).isValid() ||
          moment(props.row[info1.field], "YYYY-DD-MM", true).isValid() ||
          moment(props.row[info1.field], "YYYY/DD/MM", true).isValid() ||
          moment(props.row[info1.field], "MM-DD-YYYY", true).isValid() ||
          moment(props.row[info1.field], "MM/DD/YYYY", true).isValid() ||
          moment(props.row[info1.field], "MM-YYYY-DD", true).isValid() ||
          moment(props.row[info1.field], "MM/YYYY/DD", true).isValid() ||
          moment(props.row[info1.field], "DD-MM-YYYY", true).isValid() ||
          moment(props.row[info1.field], "DD/MM/YYYY", true).isValid() ||
          moment(props.row[info1.field], "DD-YYYY-MM", true).isValid() ||
          moment(props.row[info1.field], "DD/YYYY/MM", true).isValid() ||
          moment(props.row[info1.field], "DD-MMM-YYYY", true).isValid() ||
          moment(props.row[info1.field], "DD/MMM/YYYY", true).isValid() ||
          moment(props.row[info1.field], "DD-YYYY-MMM", true).isValid() ||
          moment(props.row[info1.field], "DD/YYYY/MMM", true).isValid() ||
          moment(props.row[info1.field], "MMM-DD-YYYY", true).isValid() ||
          moment(props.row[info1.field], "MMM/DD/YYYY", true).isValid() ||
          moment(props.row[info1.field], "MMM-YYYY-DD", true).isValid() ||
          moment(props.row[info1.field], "MMM/YYYY/DD", true).isValid() ||
          moment(props.row[info1.field], "YYYY-MMM-DD", true).isValid() ||
          moment(props.row[info1.field], "YYYY/MMM/DD", true).isValid() ||
          moment(props.row[info1.field], "YYYY-DD-MMM", true).isValid() ||
          moment(props.row[info1.field], "YYYY/DD/MMM", true).isValid() ||
          JSON.stringify(props.row[info1.field]).split("/").length === 3 ||
          JSON.stringify(props.row[info1.field]).split("-").length === 3
        ) {
          const alignmentStyle = info1.alignment.align
            ? { textAlign: info1.alignment.align }
            : {
                textAlign: "end",
                paddingRight: "6px",
                paddingLeft: "6px",
              };
          styles = {
            ...styles,
            ...alignmentStyle,
          };
          return styles;
        } else if (
          info1.alignment.type?.toLowerCase() === "time" ||
          moment(props.row[info1.field], "hh:mm", true).isValid() ||
          moment(props.row[info1.field], "hh:mm:ss", true).isValid() ||
          moment(props.row[info1.field], "hh:mm:ss a", true).isValid() ||
          moment(props.row[info1.field], "hh:mm a", true).isValid() ||
          JSON.stringify(props.row[info1.field]).split(":").length > 1
        ) {
          const alignment = info1.alignment.align
            ? { textAlign: info1.alignment.align }
            : { textAlign: "end", paddingRight: "6px", paddingLeft: "6px" };
          styles = {
            ...styles,
            ...alignment,
          };
          return styles;
        } else if (
          info1.alignment.type?.toLowerCase() === "datetime" ||
          (JSON.stringify(props.row[info1.field]).split(":").length > 1 &&
            (JSON.stringify(props.row[info1.field]).split("/").length === 3 ||
              JSON.stringify(props.row[info1.field]).split("-").length === 3))
        ) {
          const alignment = info1.alignment.align
            ? {
                textAlign: info1.alignment.align,
                paddingRight: "6px",
                paddingLeft: "6px",
              }
            : { textAlign: "end", paddingRight: "6px", paddingLeft: "6px" };
          styles = {
            ...styles,
            ...alignment,
          };
          return styles;
        } else if (
          info1.alignment.type?.toLowerCase() === "number" ||
          (typeof props.row[info1.field] === "number" &&
            info1.alignment.type !== "currency")
        ) {
          const alignment = info1.alignment.align
            ? { textAlign: info1.alignment.align }
            : { textAlign: "end" };
          styles = {
            ...styles,
            ...alignment,
          };
          return styles;
        } else if (
          info1.alignment.type?.toLowerCase() === "currency" ||
          symbol.includes(JSON.stringify(props.row[info1.field])[1]) ||
          symbol.includes(
            JSON.stringify(props.row[info1.field])[
              props.row[info1.field].length
            ]
          )
        ) {
          const alignment = info1.alignment.align
            ? { textAlign: info1.alignment.align }
            : { textAlign: "end" };

          styles = {
            ...styles,

            ...alignment,
          };

          return styles;
        } else if (
          info1.alignment.type?.toLowerCase() === "string" ||
          info1.alignment.type?.toLowerCase() === "text" ||
          typeof row[info1.field] === "string"
        ) {
          const alignment = info1.alignment.align
            ? { textAlign: info1.alignment.align }
            : { textAlign: "start" };
          styles = {
            ...styles,
            ...alignment,
          };
          return styles;
        } else {
          const alignment = info1.alignment.align
            ? { textAlign: info1.alignment.align }
            : { textAlign: "center" };
          styles = { ...styles, ...alignment };
          return styles;
        }
      }

      childStyle = info1.alignment.align
        ? { ...childStyle, textAlign: info1.alignment.align }
        : alignmentUtils();
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
