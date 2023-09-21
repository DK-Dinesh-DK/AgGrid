import React, { createElement, isValidElement } from "react";
import alignmentUtils from "../utils/alignMentUtils";

export function valueFormatter(props) {
  function selectCellWrapper(openEditor) {
    let sampleColumn = props.column;

    props.selectCell(props.row, sampleColumn, openEditor);
  }

  function handleClick(e) {
    selectCellWrapper(props.column.editorOptions?.editOnClick);
    e.stopPropagation();
    if (!props.column.readOnly) {
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
          resizable: props.column.resizable,
          sortable: props.column.sortable,
          width: props.column.width,
        },
        data: props.row,
        node: props.node,
        columnApi: props.columnApi,
        rowIndex: props.rowIndex,
        value: props.row[props.column.field],
        type: "cellClicked",
        event: e,
      });
    }
  }

  function handleDoubleClick(e) {
    selectCellWrapper(true);
    e.stopPropagation();
    if (!props.column.readOnly) {
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
          resizable: props.column.resizable,
          sortable: props.column.sortable,
          width: props.column.width,
        },
        data: props.row,
        node: props.node,
        columnApi: props.columnApi,
        rowIndex: props.rowIndex,
        value: props.row[props.column.field],
        type: "cellDoubleClicked",
        event: e,
      });
    }
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
        : alignmentUtils(props.column, props.row, cellStyle, "Row");
    }
    if (props.row.gridRowType === "detailedRow") {
      cellStyle = { ...cellStyle, textAlign: "start" };
    }
    let toolTipContent;
    return (
      <div
        key={props.column.field}
        role="gridcell"
        aria-selected={isCellSelected}
        style={cellStyle}
        // className={props.className}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseOver={(e) => {
          if (props.column.haveChildren === false && props.column.toolTip) {
            if (typeof props.column.toolTip === "function") {
              toolTipContent = props.column.toolTip({
                row: props.row,
                rowIndex: props.rowIndex,
                column: props.column,
              });
            } else {
              toolTipContent = props.row[props.column.field];
            }
            props.handleToolTipContent(toolTipContent);
            props.handleToolTip(true);
          }
        }}
        onMouseOutCapture={() => {
          if (props.column.haveChildren === false && props.column.toolTip) {
            props.handleToolTip(false);
          }
        }}
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
  let value1 = false;

  rowSubData = rowSubData.filter(function (item) {
    return item !== value1;
  });

  for (let i = 0; i < rowSubData.length; i++) {
    if (rowSubData[i].haveChildren) {
      rowSubData.splice(i, 1);
      i--;
    }
  }

  const rowCol = props.rowArray;

  return rowSubData.map((info1, index) => {
    function getWidth() {
      let width;
      rowCol.forEach((info2) => {
        if (info1.key === info2.field) {
          width = info2.width;
        }
      });
      return width;
    }
    // const [cellValue, setCellValue] = useState(
    //   info1.cellRendererParams?.value ?? props.row[info1.key]
    // );
    // const gridCell = useRef(null);

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
      if (!info1.readOnly) {
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
            resizable: info1.resizable,
            sortable: info1.sortable,
            width: info1.width,
          },
          data: props.row,
          node: props.node,
          columnApi: props.columnApi,
          rowIndex: props.rowIndex,
          value: info1.cellRendererParams?.value ?? props.row[info1.key],
          type: "cellClicked",
          event: e,
        });
      }
    }
    function handleContextMenu() {
      selectSubCellWrapper();
    }
    function handleDoubleClick(e) {
      selectSubCellWrapper(true);
      if (!info1.readOnly) {
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
            resizable: info1.resizable,
            sortable: info1.sortable,
            width: info1.width,
          },
          data: props.row,
          node: props.node,
          columnApi: props.columnApi,
          rowIndex: props.rowIndex,
          value: info1.cellRendererParams?.value ?? props.row[info1.key],
          type: "cellDoubleClicked",
          event: e,
        });
      }
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

      width: `${getWidth()}px`.replace(/,/g, ""),
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
        : alignmentUtils(info1, props.row, childStyle, "Row");
    }
    let toolTipContent;
    return (
      // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        onClick={handleClick}
        key={`${props.colDef.idx}-${props.row[info1.field]}`}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        style={childStyle}
        onMouseOver={(e) => {
          if (info1.toolTip) {
            if (typeof info1.toolTip === "function") {
              toolTipContent = info1.toolTip({
                row: props.row,
                rowIndex: props.rowIndex,
                column: info1,
              });
            } else {
              toolTipContent = props.row[info1.field];
            }
            props.handleToolTipContent(toolTipContent);
            props.handleToolTip(true);
          }
        }}
        onMouseOutCapture={() => {
          if (info1.toolTip) {
            props.handleToolTip(false);
          }
        }}
        // title={info1.toolTip && !info1.haveChildren ? toolTipContent : null}
      >
        {/* <div style={{ borderInlineEnd: sdsd, textAlign: "center",height:"24px",width:100 }}> */}
        {isCellSelected && props.selectedCellEditor
          ? props.selectedCellEditor
          : !info1.rowDrag &&
            typeof info1.cellRenderer === "function" &&
            info1.cellRenderer({
              column: info1,
              api: props.api,
              columnApi: props.columnApi,
              row: props.row,
              onRowChange: props.onRowChange,
              value: info1.cellRendererParams?.value ?? props.row[info1.key],
              rowIndex: props.rowIndex,
              node: props.node,
              colDef: info1,
              // eGridCell: gridCell.current,
              selectCell: props.selectCell,
              selectedCellIdx: props.selectedCellIdx,
              getValue: () =>
                info1.cellRendererParams?.value ?? props.row[info1.key],
              // setValue: (newValue) => setCellValue(newValue),
              expandedMasterIds: props.expandedMasterIds,
              onExpandedMasterIdsChange: props.onExpandedMasterIdsChange,
              fullWidth: info1.cellRendererParams?.fullWidth,
              valueFormatted: info1.cellRendererParams?.valueFormatted,
              ...info1?.cellRendererParams,
            })}
        {!info1.rowDrag &&
          typeof info1.cellRenderer === "object" &&
          isValidElement(info1.cellRenderer) &&
          createElement(info1.cellRenderer, {
            column: info1,
            api: props.api,
            columnApi: props.columnApi,
            row: props.row,
            onRowChange: props.onRowChange,
            value: info1.cellRendererParams?.value ?? props.row[info1.key],
            rowIndex: props.rowIndex,
            node: props.node,
            colDef: info1,
            // eGridCell: gridCell.current,
            selectCell: props.selectCell,
            selectedCellIdx: props.selectedCellIdx,
            getValue: () =>
              info1.cellRendererParams?.value ?? props.row[info1.key],
            // setValue: (newValue) => setCellValue(newValue),
            expandedMasterIds: props.expandedMasterIds,
            onExpandedMasterIdsChange: props.onExpandedMasterIdsChange,
            fullWidth: info1.cellRendererParams?.fullWidth,
            valueFormatted: info1.cellRendererParams?.valueFormatted,
            ...info1?.cellRendererParams,
          })}
      </div>
    );
  });
};
