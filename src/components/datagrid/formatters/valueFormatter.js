import React, { cloneElement, isValidElement } from "react";
import alignmentUtils from "../utils/alignMentUtils";
import { withStyles, Tooltip } from "@material-ui/core";

const StyledTooltip = withStyles({
  tooltip: {
    color: " #0f243e",
    backgroundColor: "#f5fbff",
    border: "1px solid #7c94b6",
    wordWrap: "break-word",
    minWidth: "75px",
    maxWidth: "340px",
    fontSize: "11px",
    padding: "5px",
    borderRadius: 0,
    textAlign: "center",
  },
})(Tooltip);

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
        colDef: props.column,
        columnApi: props.columnApi,
        node: props.node,
        rowIndex: props.rowIndex,
        type: "rowClicked",
        event: e,
      });
      props.onCellClick?.({
        api: props.api,
        colDef: props.column,
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
            width: `${props.column.width}px`,
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
      display: "flex",
      justifyContent: "var(--rdg-cell-align)",
      alignItems: "center",
      textOverflow: "ellipsis",
      overflow: "hidden",
      height: "inherit",
      paddingRight:
        isCellSelected && props.selectedCellEditor
          ? "0px"
          : "var(--rdg-cell-padding-right)",
      paddingLeft:
        isCellSelected && props.selectedCellEditor
          ? "0px"
          : "var(--rdg-cell-padding-left)",
      paddingTop:
        isCellSelected && props.selectedCellEditor
          ? "0px"
          : "var(--rdg-cell-padding-top)",
      paddingBottom:
        isCellSelected && props.selectedCellEditor
          ? "0px"
          : "var(--rdg-cell-padding-bottom)",
    };
    if (props.column.alignment) {
      cellStyle = props.column.alignment.align
        ? { ...cellStyle, justifyContent: props.column.alignment.align }
        : alignmentUtils(props.column, props.row, cellStyle);
    }
    if (props.row.gridRowType === "detailedRow") {
      cellStyle = { ...cellStyle, justifyContent: "start" };
    }
    const toolTipContent = props.column.toolTip
      ? typeof props.column.toolTip === "function"
        ? props.column.toolTip({
            row: props.row,
            rowIndex: props.rowIndex,
            column: props.column,
          })
        : props.row[props.column.field]
      : null;

    return (
      <>
        {props.column.toolTip && (
          <StyledTooltip title={toolTipContent} placement="bottom-end">
            <div
              key={props.column.field}
              role="gridcell"
              aria-selected={isCellSelected}
              style={cellStyle}
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              onContextMenu={handleContextMenu}
            >
              {!props.columnWidthEqually &&
              isCellSelected &&
              props.selectedCellEditor
                ? props.selectedCellEditor
                : !props.columnWidthEqually
                ? props.row[props.column.field]
                : props.columnWidthEqually && (
                    <span
                      style={{
                        width: props.column.width,
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {props.row[props.column.field]}
                    </span>
                  )}
            </div>
          </StyledTooltip>
        )}
        {!props.column.toolTip && (
          <div
            key={props.column.field}
            role="gridcell"
            aria-selected={isCellSelected}
            style={cellStyle}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
          >
            {!props.columnWidthEqually &&
            isCellSelected &&
            props.selectedCellEditor
              ? props.selectedCellEditor
              : !props.columnWidthEqually
              ? props.row[props.column.field]
              : props.columnWidthEqually && (
                  <span
                    style={{
                      width: props.column.width,
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {props.row[props.column.field]}
                  </span>
                )}
          </div>
        )}
      </>
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
    function selectSubCellWrapper(openEditor) {
      let sampleColumn;
      rowCol?.map((obj) => {
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
          colDef: info1,
          columnApi: props.columnApi,
          node: props.node,
          rowIndex: props.rowIndex,
          type: "rowClicked",
          event: e,
        });
        props.onCellClick?.({
          api: props.api,
          colDef: info1,
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
          colDef: info1,
          columnApi: props.columnApi,
          node: props.node,
          rowIndex: props.rowIndex,
          type: "rowDoubleClicked",
          event: e,
        });
        props.onCellDoubleClick?.({
          api: props.api,
          colDef: info1,
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
    function handleChange(newValue) {
      let sample = props.row;
      sample[info1.field] = newValue;
      props.onRowChange(sample);
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
          : "var(--rdg-cell-border-vertical)",

      textAlign: "center",

      textOverflow: "ellipsis",

      overflow: "hidden",

      height: "inherit",

      outline:
        props.selectedCellIdx &&
        props.selectedCellIdx === info1.idx &&
        isCellSelected
          ? "1px solid var(--rdg-selection-color)"
          : "none",

      outlineOffset:
        props.selectedCellIdx === info1.idx && isCellSelected ? "-1px" : "0px",

      paddingInline: isCellSelected && props.selectedCellEditor ? "0px" : "6px",

      width: `${info1.width}px`,
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
        : alignmentUtils(info1, props.row, childStyle);
    }
    return (
      <div
        onClick={handleClick}
        key={`${info1.idx}-${props.rowIndex}-${info1.field}`}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        style={childStyle}
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
              setValue: (newValue) => handleChange(newValue),
              expandedMasterIds: props.expandedMasterIds,
              onExpandedMasterIdsChange: props.onExpandedMasterIdsChange,
              fullWidth: info1.cellRendererParams?.fullWidth,
              valueFormatted: info1.cellRendererParams?.valueFormatted,
              onRowClick: handleClick,
              onRowDoubleClick: handleDoubleClick,
              ...info1?.cellRendererParams,
            })}
        {!info1.rowDrag &&
          typeof info1.cellRenderer === "object" &&
          isValidElement(info1.cellRenderer) &&
          cloneElement(info1.cellRenderer, {
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
            setValue: (newValue) => handleChange(newValue),
            expandedMasterIds: props.expandedMasterIds,
            onExpandedMasterIdsChange: props.onExpandedMasterIdsChange,
            fullWidth: info1.cellRendererParams?.fullWidth,
            valueFormatted: info1.cellRendererParams?.valueFormatted,
            onRowClick: handleClick,
            onRowDoubleClick: handleDoubleClick,
            ...info1?.cellRendererParams,
          })}
      </div>
    );
  });
};
