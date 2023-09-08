import _extends$1 from '@babel/runtime/helpers/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose';
import * as React from 'react';
import { useRef, useEffect, useLayoutEffect as useLayoutEffect$1, useContext, createContext, useState, useCallback, memo, useMemo, forwardRef, useImperativeHandle } from 'react';
import clsx$1, { clsx } from 'clsx';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import ReactDOM, { createPortal, flushSync } from 'react-dom';
import { groupBy, isString, _ } from 'lodash';
import { ContextMenu, SubMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import moment from 'moment';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Pagination from 'rc-pagination';

const useUpdateEffect = (effect, dependency) => {
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return effect();
  }, dependency);
};
const useUpdateEffect$1 = useUpdateEffect;

function getColSpan(column, lastFrozenColumnIndex, args) {
  const colSpan = typeof column.colSpan === "function" ? column.colSpan(args) : 1;
  if (Number.isInteger(colSpan) && colSpan > 1 && (!column.frozen || column.idx + colSpan - 1 <= lastFrozenColumnIndex)) {
    return colSpan;
  }
  return undefined;
}

function scrollIntoView(element) {
  if (element && typeof element.scrollIntoView === "function") {
    element.scrollIntoView({
      inline: "nearest",
      block: "nearest"
    });
  }
}

const nonInputKeys = new Set(["Unidentified", "Alt", "AltGraph", "CapsLock", "Control", "Fn", "FnLock", "Meta", "NumLock", "ScrollLock", "Shift", "Tab", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "End", "Home", "PageDown", "PageUp", "Insert", "ContextMenu", "Escape", "Pause", "Play", "PrintScreen", "F1", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"]);
function isCtrlKeyHeldDown(e) {
  return (e.ctrlKey || e.metaKey) && e.key !== "Control";
}
function isDefaultCellInput(event) {
  return !nonInputKeys.has(event.key);
}
function onEditorNavigation({
  key,
  target
}) {
  if (key === "Tab" && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
    return target.matches(".rdg-editor-container > :only-child, .rdg-editor-container > label:only-child > :only-child, .rdg-editor-container > div:only-child > label:only-child > :only-child");
  }
  return false;
}

const measuringCellClassname = "m22dhxs1-0-3";
function renderMeasuringCells(viewportColumns) {
  return /*#__PURE__*/jsx(Fragment, {
    children: viewportColumns.map(({
      key,
      idx,
      minWidth,
      maxWidth
    }) => /*#__PURE__*/jsx("div", {
      className: measuringCellClassname,
      style: {
        gridColumnStart: idx + 1,
        minWidth,
        maxWidth
      },
      "data-measuring-cell-key": key ?? `grid_no_key${idx}`
    }, key))
  });
}

function isSelectedCellEditable({
  selectedPosition,
  columns4,
  rows,
  isGroupRow
}) {
  const column = columns4[selectedPosition.idx];
  const row = rows[selectedPosition.rowIdx];
  return !isGroupRow(row) && isCellEditable(column, row);
}
function isCellEditable(column, row) {
  return column.cellEditor != null && !column.rowGroup && (typeof column.editable === "function" ? column.editable(row) : column.editable) !== false;
}
function getSelectedCellColSpan({
  rows,
  topSummaryRows,
  bottomSummaryRows,
  rowIdx,
  lastFrozenColumnIndex,
  column,
  isGroupRow
}) {
  const topSummaryRowsCount = topSummaryRows?.length ?? 0;
  const minRowIdx = -1 - topSummaryRowsCount;
  if (rowIdx === minRowIdx) {
    return getColSpan(column, lastFrozenColumnIndex, {
      type: "HEADER"
    });
  }
  if (topSummaryRows && rowIdx > minRowIdx && rowIdx <= topSummaryRowsCount + minRowIdx) {
    return getColSpan(column, lastFrozenColumnIndex, {
      type: "SUMMARY",
      row: topSummaryRows[rowIdx + topSummaryRowsCount]
    });
  }
  if (rowIdx >= 0 && rowIdx < rows.length) {
    const row = rows[rowIdx];
    if (!isGroupRow(row)) {
      return getColSpan(column, lastFrozenColumnIndex, {
        type: "ROW",
        row
      });
    }
    return undefined;
  }
  if (bottomSummaryRows) {
    return getColSpan(column, lastFrozenColumnIndex, {
      type: "SUMMARY",
      row: bottomSummaryRows[rowIdx - rows.length]
    });
  }
  return undefined;
}
function getNextSelectedCellPosition({
  cellNavigationMode,
  columns,
  colSpanColumns,
  rows,
  topSummaryRows,
  bottomSummaryRows,
  minRowIdx,
  maxRowIdx,
  currentPosition: {
    idx: currentIdx
  },
  nextPosition,
  lastFrozenColumnIndex,
  isCellWithinBounds,
  isGroupRow
}) {
  let {
    idx: nextIdx,
    rowIdx: nextRowIdx
  } = nextPosition;
  const setColSpan = moveRight => {
    if (nextRowIdx >= 0 && nextRowIdx < rows.length) {
      const row = rows[nextRowIdx];
      if (isGroupRow(row)) return;
    }
    for (const column of colSpanColumns) {
      const colIdx = column.idx;
      if (colIdx > nextIdx) break;
      const colSpan = getSelectedCellColSpan({
        rows,
        topSummaryRows,
        bottomSummaryRows,
        rowIdx: nextRowIdx,
        lastFrozenColumnIndex,
        column,
        isGroupRow
      });
      if (colSpan && nextIdx > colIdx && nextIdx < colSpan + colIdx) {
        nextIdx = colIdx + (moveRight ? colSpan : 0);
        break;
      }
    }
  };
  if (isCellWithinBounds(nextPosition)) {
    setColSpan(nextIdx - currentIdx > 0);
  }
  if (cellNavigationMode !== "NONE") {
    const columnsCount = columns.length;
    const isAfterLastColumn = nextIdx === columnsCount;
    const isBeforeFirstColumn = nextIdx === -1;
    if (isAfterLastColumn) {
      if (cellNavigationMode === "CHANGE_ROW") {
        const isLastRow = nextRowIdx === maxRowIdx;
        if (!isLastRow) {
          nextIdx = 0;
          nextRowIdx += 1;
        }
      } else {
        nextIdx = 0;
      }
    } else if (isBeforeFirstColumn) {
      if (cellNavigationMode === "CHANGE_ROW") {
        const isFirstRow = nextRowIdx === minRowIdx;
        if (!isFirstRow) {
          nextRowIdx -= 1;
          nextIdx = columnsCount - 1;
        }
      } else {
        nextIdx = columnsCount - 1;
      }
      setColSpan(false);
    }
  }
  return {
    idx: nextIdx,
    rowIdx: nextRowIdx
  };
}
function canExitGrid({
  cellNavigationMode,
  maxColIdx,
  minRowIdx,
  maxRowIdx,
  selectedPosition: {
    rowIdx,
    idx
  },
  shiftKey
}) {
  if (cellNavigationMode === "NONE" || cellNavigationMode === "CHANGE_ROW") {
    const atLastCellInRow = idx === maxColIdx;
    const atFirstCellInRow = idx === 0;
    const atLastRow = rowIdx === maxRowIdx;
    const atFirstRow = rowIdx === minRowIdx;
    return shiftKey ? atFirstCellInRow && atFirstRow : atLastCellInRow && atLastRow;
  }
  return false;
}

const cell = "c9tygie1-0-3";
const cellClassname = `rdg-cell ${cell}`;
const cellFrozen = "c2lsqdy1-0-3";
const cellFrozenClassname = `rdg-cell-frozen ${cellFrozen}`;
const cellFrozenLast = "cu9dmmf1-0-3";
const cellFrozenLastClassname = `rdg-cell-frozen-last ${cellFrozenLast}`;
const rowIsSelected = "r115cr3i1-0-3";
const rowIsSelectedClassName = `rdg-middle-row-is-selected ${rowIsSelected}`;
const topRowIsSelected = "trhevl71-0-3";
const topRowIsSelectedClassName = `rdg-top-row-is-selected ${topRowIsSelected}`;
const bottomRowIsSelected = "b1y6osgi1-0-3";
const bottomRowIsSelectedClassName = `rdg-bottom-row-is-selected ${bottomRowIsSelected}`;

const root = "r1fgqq0p1-0-3";
const rootClassname = `rdg ${root}`;
const viewportDragging = "v1qpiszo1-0-3";
const viewportDraggingClassname = `rdg-viewport-dragging ${viewportDragging}`;
const focusSinkClassname = "f1tdeyrt1-0-3";
const filterColumnClassName = "filter-cell";
const filterContainerClassname = "f1s6cm8w1-0-3";

const row = "rsqlkts1-0-3";
const rowClassname = `rdg-row ${row}`;
const rowSelected = "r1b98bt1-0-3";
const rowSelectedClassname = "rdg-row-selected";
const rowSelectedWithFrozenCell = "r1t9qo151-0-3";

function getRowStyle(rowIdx, height) {
  if (height !== undefined) {
    return {
      "--rdg-grid-row-start": rowIdx,
      "--rdg-row-height": `${height}px`
    };
  }
  return {
    "--rdg-grid-row-start": rowIdx
  };
}
function getCellStyle(column, colSpan, rowSpan) {
  return {
    height: "100%",
    gridColumnStart: column.index + 1,
    gridColumnEnd: colSpan !== undefined ? `span ${colSpan}` : undefined,
    gridRowEnd: rowSpan !== undefined ? `span ${rowSpan}` : undefined,
    insetInlineStart: column.frozen ? `var(--rdg-frozen-left-${column.index})` : undefined
  };
}
function getCellClassname(column, ...extraClasses) {
  return clsx(cellClassname, {
    [cellFrozenClassname]: column.frozen,
    [cellFrozenLastClassname]: column.isLastFrozenColumn
  }, ...extraClasses);
}

const {
  min,
  max,
  round,
  floor,
  sign,
  abs
} = Math;
function assertIsValidKeyGetter(keyGetter) {
  if (typeof keyGetter !== "function") {
    throw new Error("Please specify the rowKeyGetter prop to use selection");
  }
}
function clampColumnWidth(width, {
  minWidth,
  maxWidth
}) {
  width = max(width, minWidth);
  if (typeof maxWidth === "number" && maxWidth >= minWidth) {
    return min(width, maxWidth);
  }
  return width;
}

const checkboxLabel = "c1kfjsid1-0-3";
const checkboxLabelClassname = `rdg-checkbox-label ${checkboxLabel}`;
const checkboxInput = "ca4mo9e1-0-3";
const checkboxInputClassname = `rdg-checkbox-input ${checkboxInput}`;
const checkbox = "ctrhvdq1-0-3";
const checkboxClassname = `rdg-checkbox ${checkbox}`;
const checkboxLabelDisabled = "c6bptqk1-0-3";
const checkboxLabelDisabledClassname = `rdg-checkbox-label-disabled ${checkboxLabelDisabled}`;
function checkboxFormatter({
  onChange,
  ...props
}, ref) {
  function handleChange(e) {
    onChange(e.target.checked, e.nativeEvent.shiftKey);
  }
  return /*#__PURE__*/jsxs("label", {
    className: clsx(checkboxLabelClassname, {
      [checkboxLabelDisabledClassname]: props.disabled
    }),
    children: [/*#__PURE__*/jsx("input", {
      type: "checkbox",
      ref: ref,
      ...props,
      className: checkboxInputClassname,
      onChange: handleChange
    }), /*#__PURE__*/jsx("div", {
      className: checkboxClassname,
      onClick: e => e.stopPropagation(),
      children: /*#__PURE__*/jsx("div", {})
    })]
  });
}

const useLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect$1;

function useFocusRef(isSelected) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!isSelected) return;
    ref.current?.focus({
      preventScroll: true
    });
  }, [isSelected]);
  return {
    ref,
    tabIndex: isSelected ? 0 : -1
  };
}

const DataGridDefaultComponentsContext = /*#__PURE__*/createContext(undefined);
const DataGridDefaultComponentsProvider = DataGridDefaultComponentsContext.Provider;
function useDefaultComponents() {
  return useContext(DataGridDefaultComponentsContext);
}

function SelectCellFormatter({
  value,
  isCellSelected,
  disabled,
  onChange,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy
}) {
  const {
    ref,
    tabIndex
  } = useFocusRef(isCellSelected);
  const checkboxFormatter = useDefaultComponents().checkboxFormatter;
  return /*#__PURE__*/jsx("div", {
    children: checkboxFormatter({
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      tabIndex,
      disabled,
      checked: value,
      onChange
    }, ref)
  });
}

function alignmentUtilsHeader(column, row, childStyle) {
  let styles = childStyle;
  let symbol = ["£", "$", "₹", "€", "¥", "₣", "¢"];
  if (column.alignment.type?.toLowerCase() === "date" || column.alignment.type?.toLowerCase() !== "datetime" && (moment(row[column.field], "YYYY-MM-DD", true).isValid() || moment(row[column.field], "YYYY/MM/DD", true).isValid() || moment(row[column.field], "YYYY-DD-MM", true).isValid() || moment(row[column.field], "YYYY/DD/MM", true).isValid() || moment(row[column.field], "MM-DD-YYYY", true).isValid() || moment(row[column.field], "MM/DD/YYYY", true).isValid() || moment(row[column.field], "MM-YYYY-DD", true).isValid() || moment(row[column.field], "MM/YYYY/DD", true).isValid() || moment(row[column.field], "DD-MM-YYYY", true).isValid() || moment(row[column.field], "DD/MM/YYYY", true).isValid() || moment(row[column.field], "DD-YYYY-MM", true).isValid() || moment(row[column.field], "DD/YYYY/MM", true).isValid() || moment(row[column.field], "DD-MMM-YYYY", true).isValid() || moment(row[column.field], "DD/MMM/YYYY", true).isValid() || moment(row[column.field], "DD-YYYY-MMM", true).isValid() || moment(row[column.field], "DD/YYYY/MMM", true).isValid() || moment(row[column.field], "MMM-DD-YYYY", true).isValid() || moment(row[column.field], "MMM/DD/YYYY", true).isValid() || moment(row[column.field], "MMM-YYYY-DD", true).isValid() || moment(row[column.field], "MMM/YYYY/DD", true).isValid() || moment(row[column.field], "YYYY-MMM-DD", true).isValid() || moment(row[column.field], "YYYY/MMM/DD", true).isValid() || moment(row[column.field], "YYYY-DD-MMM", true).isValid() || moment(row[column.field], "YYYY/DD/MMM", true).isValid()) || row[column.field] && column.alignment.type?.toLowerCase() !== "datetime" && (JSON.stringify(row[column.field]).split("/").length === 3 || JSON.stringify(row[column.field]).split("-").length === 3)) {
    const alignmentStyle = column.alignment.align ? {
      justifyContent: column.alignment.align
    } : {
      justifyContent: "center"
    };
    styles = {
      ...styles,
      ...alignmentStyle
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "time" || column.alignment.type?.toLowerCase() !== "datetime" && (moment(row[column.field], "hh:mm", true).isValid() || moment(row[column.field], "hh:mm:ss", true).isValid() || moment(row[column.field], "hh:mm:ss a", true).isValid() || moment(row[column.field], "hh:mm a", true).isValid()) || row[column.field] && column.alignment.type?.toLowerCase() !== "datetime" && JSON.stringify(row[column.field]).split(":").length > 1) {
    const alignment = column.alignment.align ? {
      justifyContent: column.alignment.align
    } : {
      justifyContent: "center"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "datetime" || row[column.field] && JSON.stringify(row[column.field]).split(":").length > 1 && (JSON.stringify(row[column.field]).split("/").length === 3 || JSON.stringify(row[column.field]).split("-").length === 3)) {
    const alignment = column.alignment.align ? {
      justifyContent: column.alignment.align
    } : {
      justifyContent: "center"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "number" || typeof row[column.field] === "number" && column.alignment.type !== "currency") {
    let alignment = column.alignment.align ? {
      justifyContent: column.alignment.align
    } : {
      justifyContent: "end"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "currency" || row[column.field] && (symbol.includes(JSON.stringify(row[column.field])[1]) || symbol.includes(JSON.stringify(row[column.field])[row[column.field].length]))) {
    var alignment = column.alignment.align ? {
      justifyContent: column.alignment.align
    } : {
      justifyContent: "center"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "string" || column.alignment.type?.toLowerCase() === "text" || typeof row[column.field] === "string") {
    const alignment = column.alignment.align ? {
      justifyContent: column.alignment.align
    } : {
      justifyContent: "start"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  }
}
function alignmentUtilsCell(column, row, childStyle) {
  let styles = childStyle;
  let symbol = ["£", "$", "₹", "€", "¥", "₣", "¢"];
  if (column.alignment.type?.toLowerCase() === "date" || column.alignment.type?.toLowerCase() !== "datetime" && (moment(row[column.field], "YYYY-MM-DD", true).isValid() || moment(row[column.field], "YYYY/MM/DD", true).isValid() || moment(row[column.field], "YYYY-DD-MM", true).isValid() || moment(row[column.field], "YYYY/DD/MM", true).isValid() || moment(row[column.field], "MM-DD-YYYY", true).isValid() || moment(row[column.field], "MM/DD/YYYY", true).isValid() || moment(row[column.field], "MM-YYYY-DD", true).isValid() || moment(row[column.field], "MM/YYYY/DD", true).isValid() || moment(row[column.field], "DD-MM-YYYY", true).isValid() || moment(row[column.field], "DD/MM/YYYY", true).isValid() || moment(row[column.field], "DD-YYYY-MM", true).isValid() || moment(row[column.field], "DD/YYYY/MM", true).isValid() || moment(row[column.field], "DD-MMM-YYYY", true).isValid() || moment(row[column.field], "DD/MMM/YYYY", true).isValid() || moment(row[column.field], "DD-YYYY-MMM", true).isValid() || moment(row[column.field], "DD/YYYY/MMM", true).isValid() || moment(row[column.field], "MMM-DD-YYYY", true).isValid() || moment(row[column.field], "MMM/DD/YYYY", true).isValid() || moment(row[column.field], "MMM-YYYY-DD", true).isValid() || moment(row[column.field], "MMM/YYYY/DD", true).isValid() || moment(row[column.field], "YYYY-MMM-DD", true).isValid() || moment(row[column.field], "YYYY/MMM/DD", true).isValid() || moment(row[column.field], "YYYY-DD-MMM", true).isValid() || moment(row[column.field], "YYYY/DD/MMM", true).isValid()) || row[column.field] && column.alignment.type?.toLowerCase() !== "datetime" && (JSON.stringify(row[column.field]).split("/").length === 3 || JSON.stringify(row[column.field]).split("-").length === 3)) {
    const alignmentStyle = column.alignment.align ? {
      textAlign: column.alignment.align
    } : {
      textAlign: "center",
      paddingRight: "6px",
      paddingLeft: "6px"
    };
    styles = {
      ...styles,
      ...alignmentStyle
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "time" || column.alignment.type?.toLowerCase() !== "datetime" && (moment(row[column.field], "hh:mm", true).isValid() || moment(row[column.field], "hh:mm:ss", true).isValid() || moment(row[column.field], "hh:mm:ss a", true).isValid() || moment(row[column.field], "hh:mm a", true).isValid()) || row[column.field] && column.alignment.type?.toLowerCase() !== "datetime" && JSON.stringify(row[column.field]).split(":").length > 1) {
    const alignment = column.alignment.align ? {
      textAlign: column.alignment.align
    } : {
      textAlign: "center",
      paddingRight: "6px",
      paddingLeft: "6px"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "datetime" || JSON.stringify(row[column.field])?.split(":").length > 1 && (JSON.stringify(row[column.field])?.split("/").length === 3 || JSON.stringify(row[column.field])?.split("-").length === 3)) {
    const alignment = column.alignment.align ? {
      textAlign: column.alignment.align,
      paddingRight: "6px",
      paddingLeft: "6px"
    } : {
      textAlign: "center",
      paddingRight: "6px",
      paddingLeft: "6px"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "number" || typeof row[column.field] === "number" && column.alignment.type !== "currency") {
    const alignment = column.alignment.align ? {
      textAlign: column.alignment.align
    } : {
      textAlign: "end"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "currency" || JSON.stringify(row[column.field]) && (symbol.includes(JSON.stringify(row[column.field])[1]) || symbol.includes(JSON.stringify(row[column.field])[row[column.field].length]))) {
    var alignment = column.alignment.align ? {
      textAlign: column.alignment.align
    } : {
      textAlign: "center"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  } else if (column.alignment.type?.toLowerCase() === "string" || column.alignment.type?.toLowerCase() === "text" || typeof row[column.field] === "string") {
    const alignment = column.alignment.align ? {
      textAlign: column.alignment.align
    } : {
      textAlign: "start"
    };
    styles = {
      ...styles,
      ...alignment
    };
    return styles;
  }
}

function valueFormatter(props) {
  function selectCellWrapper(openEditor) {
    let sampleColumn = props.column;
    props.selectCell(props.row, sampleColumn, openEditor);
  }
  function handleClick(e) {
    selectCellWrapper(props.column.editorOptions?.editOnClick);
    e.stopPropagation();
    props.onRowClick?.({
      api: props.api,
      data: props.row,
      columnApi: props.columnApi,
      node: props.node,
      rowIndex: props.rowIndex,
      type: "rowClicked",
      event: e
    });
    props.onCellClick?.({
      api: props.api,
      colDef: {
        field: props.column.field,
        resizable: props.column.resizable ?? undefined,
        sortable: props.column.sortable ?? undefined,
        width: props.column.width
      },
      data: props.row,
      node: props.node,
      columnApi: props.columnApi,
      rowIndex: props.rowIndex,
      value: props.row[props.column.field] ?? undefined,
      type: "cellClicked",
      event: e
    });
  }
  function handleDoubleClick(e) {
    selectCellWrapper(true);
    e.stopPropagation();
    props.onRowDoubleClick?.({
      api: props.api,
      data: props.row,
      columnApi: props.columnApi,
      node: props.node,
      rowIndex: props.rowIndex,
      type: "rowDoubleClicked",
      event: e
    });
    props.onCellDoubleClick?.({
      api: props.api,
      colDef: {
        field: props.column.field,
        resizable: props.column.resizable ?? undefined,
        sortable: props.column.sortable ?? undefined,
        width: props.column.width
      },
      data: props.row,
      node: props.node,
      columnApi: props.columnApi,
      rowIndex: props.rowIndex,
      value: props.row[props.column.field] ?? undefined,
      type: "cellDoubleClicked",
      event: e
    });
  }
  function handleContextMenu() {
    selectCellWrapper();
  }
  if (props.column.haveChildren === true) {
    return /*#__PURE__*/jsx(Fragment, {
      children: /*#__PURE__*/jsx("div", {
        style: {
          display: "flex",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        },
        children: childData(props.column.children, props)
      }, props.column.idx)
    });
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
      paddingInline: isCellSelected && props.selectedCellEditor ? "0px" : "6px"
    };
    if (props.column.alignment) {
      cellStyle = props.column.alignment.align ? {
        ...cellStyle,
        textAlign: props.column.alignment.align
      } : alignmentUtilsCell(props.column, props.row, cellStyle);
    }
    return (
      /*#__PURE__*/
      jsx("div", {
        role: "gridcell",
        "aria-selected": isCellSelected,
        style: cellStyle,
        onClick: handleClick,
        onDoubleClick: handleDoubleClick,
        onContextMenu: handleContextMenu,
        children: isCellSelected && props.selectedCellEditor ? props.selectedCellEditor : props.row[props.column.field]
      }, props.column.field)
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
    const [cellValue, setCellValue] = useState(info1.cellRendererParams?.value ?? props.row[info1.key]);
    const gridCell = useRef(null);
    function selectSubCellWrapper(openEditor) {
      let sampleColumn = props.column;
      props.subColumn?.map(obj => {
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
        event: e
      });
      props.onCellClick?.({
        api: props.api,
        colDef: {
          field: info1.field,
          resizable: info1.resizable ?? undefined,
          sortable: info1.sortable ?? undefined,
          width: info1.width
        },
        data: props.row,
        node: props.node,
        columnApi: props.columnApi,
        rowIndex: props.rowIndex,
        value: cellValue ?? undefined,
        type: "cellClicked",
        event: e
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
        event: e
      });
      props.onCellDoubleClick?.({
        api: props.api,
        colDef: {
          field: info1.field,
          resizable: info1.resizable ?? undefined,
          sortable: info1.sortable ?? undefined,
          width: info1.width
        },
        data: props.row,
        node: props.node,
        columnApi: props.columnApi,
        rowIndex: props.rowIndex,
        value: cellValue ?? undefined,
        type: "cellDoubleClicked",
        event: e
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
      borderInlineEnd: isCellSelected && props.selectedCellEditor ? "none" : "1px solid var(--rdg-border-color)",
      textAlign: "center",
      textOverflow: "ellipsis",
      overflow: "hidden",
      height: "inherit",
      outline: props.selectedCellIdx === info1.idx && isCellSelected ? "1px solid var(--rdg-selection-color)" : "none",
      outlineOffset: props.selectedCellIdx === info1.idx && isCellSelected ? "-1px" : "0px",
      paddingInline: isCellSelected && props.selectedCellEditor ? "0px" : "6px",
      width: `${rowCol.map(info2 => {
        return func(info2, info1.key);
      })}px`.replace(/,/g, "")
    };
    if (info1.validation) {
      const validationStyle = info1.validation.style ? info1.validation.style : {
        backgroundColor: "red"
      };
      if (info1.validation.method(props.row[info1.key])) {
        childStyle = {
          ...childStyle,
          ...validationStyle
        };
      }
    }
    if (info1.alignment) {
      childStyle = info1.alignment.align ? {
        ...childStyle,
        textAlign: info1.alignment.align
      } : alignmentUtilsCell(info1, props.row, childStyle);
    }
    return (
      /*#__PURE__*/
      jsx("div", {
        onClick: handleClick,
        onDoubleClick: handleDoubleClick,
        onContextMenu: handleContextMenu,
        style: childStyle,
        children: isCellSelected && props.selectedCellEditor ? props.selectedCellEditor : !info1.rowDrag && info1.cellRenderer({
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
          setValue: newValue => setCellValue(newValue),
          expandedMasterIds: props.expandedMasterIds,
          onExpandedMasterIdsChange: props.onExpandedMasterIdsChange,
          fullWidth: info1.cellRendererParams?.fullWidth,
          valueFormatted: info1.cellRendererParams?.valueFormatted,
          ...info1?.cellRendererParams
        })
      }, info1.idx)
    );
  });
};

const groupCellContent = "gquyxkv1-0-3";
const groupCellContentClassname = `rdg-group-cell-content ${groupCellContent}`;
const caret = "cwe1f4s1-0-3";
const caretClassname = `rdg-caret ${caret}`;
function toggleGroupFormatter(props) {
  return /*#__PURE__*/jsx(ToggleGroup, {
    ...props
  });
}
function ToggleGroup({
  groupKey,
  isExpanded,
  isCellSelected,
  toggleGroup
}) {
  const {
    ref,
    tabIndex
  } = useFocusRef(isCellSelected);
  function handleKeyDown({
    key
  }) {
    if (key === "Enter") {
      toggleGroup();
    }
  }
  const d = isExpanded ? "M1 1 L 7 7 L 13 1" : "M1 7 L 7 1 L 13 7";
  return /*#__PURE__*/jsxs("span", {
    ref: ref,
    className: groupCellContentClassname,
    tabIndex: tabIndex,
    onKeyDown: handleKeyDown,
    children: [groupKey, /*#__PURE__*/jsx("svg", {
      viewBox: "0 0 14 8",
      width: "14",
      height: "8",
      className: caretClassname,
      "aria-hidden": true,
      children: /*#__PURE__*/jsx("path", {
        d: d
      })
    })]
  });
}

const RowSelectionContext = /*#__PURE__*/createContext(undefined);
const RowSelectionProvider = RowSelectionContext.Provider;
const RowSelectionChangeContext = /*#__PURE__*/createContext(undefined);
const RowSelectionChangeProvider = RowSelectionChangeContext.Provider;
function useRowSelection() {
  const rowSelectionContext = useContext(RowSelectionContext);
  const rowSelectionChangeContext = useContext(RowSelectionChangeContext);
  if (rowSelectionContext === undefined || rowSelectionChangeContext === undefined) {
    throw new Error("useRowSelection must be used within DataGrid cells");
  }
  return [rowSelectionContext, rowSelectionChangeContext];
}

const SERIAL_NUMBER_COLUMN_KEY = "serial-number";
const SELECT_COLUMN_KEY = "select-row";
const headerCellClassName = "hayp98z1-0-3";
function SelectFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection();
  return /*#__PURE__*/jsx(SelectCellFormatter, {
    "aria-label": "Select",
    isCellSelected: props.isCellSelected,
    value: isRowSelected,
    onChange: (checked, isShiftClick) => {
      onRowSelectionChange({
        row: props.row,
        checked,
        isShiftClick
      });
    }
  });
}
function SelectGroupFormatter(props) {
  const [isRowSelected, onRowSelectionChange] = useRowSelection();
  return /*#__PURE__*/jsx(SelectCellFormatter, {
    "aria-label": "Select Group",
    isCellSelected: props.isCellSelected,
    value: isRowSelected,
    onChange: checked => {
      onRowSelectionChange({
        row: props.row,
        checked,
        isShiftClick: false
      });
    }
  });
}
const SelectColumn = {
  key: SELECT_COLUMN_KEY,
  name: "",
  width: 35,
  minWidth: 35,
  maxWidth: 35,
  resizable: false,
  sortable: false,
  frozen: true,
  filter: false,
  haveChildren: false,
  headerRenderer(props) {
    return /*#__PURE__*/jsx(SelectCellFormatter, {
      "aria-label": "Select All",
      isCellSelected: props.isCellSelected,
      value: props.allRowsSelected,
      onChange: props.onAllRowsSelectionChange
    });
  },
  cellRenderer(props) {
    return /*#__PURE__*/jsx(SelectFormatter, {
      ...props
    });
  },
  groupFormatter(props) {
    return /*#__PURE__*/jsx(SelectGroupFormatter, {
      ...props
    });
  }
};
const SerialNumberColumn = {
  key: SERIAL_NUMBER_COLUMN_KEY,
  name: "Sr. No.",
  field: "Sr. No.",
  width: 45,
  resizable: false,
  sortable: false,
  frozen: true,
  filter: false,
  haveChildren: false,
  headerRenderer: () => {
    return SerialNumberColumn.name;
  },
  cellClass: headerCellClassName,
  cellRenderer: props => {
    return /*#__PURE__*/jsxs(Fragment, {
      children: [props.column.rowIndex + 1, " "]
    });
  }
};

function useRovingCellRef(isSelected) {
  const [isChildFocused, setIsChildFocused] = useState(false);
  if (isChildFocused && !isSelected) {
    setIsChildFocused(false);
  }
  const ref = useCallback(cell => {
    if (cell === null) return;
    scrollIntoView(cell);
    if (cell.contains(document.activeElement)) return;
    cell.focus({
      preventScroll: true
    });
  }, []);
  function onFocus(event) {
    if (event.target !== event.currentTarget) {
      setIsChildFocused(true);
    }
  }
  const isFocused = isSelected && !isChildFocused;
  return {
    ref: isSelected ? ref : undefined,
    tabIndex: isFocused ? 0 : -1,
    onFocus: isSelected ? onFocus : undefined
  };
}

function TreeCell({
  id,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  row,
  treeColumnIndex,
  toggleTree: toggleTreeWrapper,
  level,
  selection,
  serialNumber,
  viewportColumns,
  allrow,
  selectedCellIdx,
  selectedCellEditor,
  apiObject,
  onRowChange,
  node,
  rowIndex,
  isRowSelected,
  selectCell,
  valueChangedCellStyle,
  previousData,
  ...props
}) {
  const {
    ref,
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  function toggleTree() {
    toggleTreeWrapper(id);
  }
  let style = getCellStyle(column);
  const gridCell = useRef(null);
  const cellRendererParams = typeof column?.cellRendererParams === "function" ? column?.cellRendererParams() : column?.cellRendererParams;
  const [value, setValue] = useState(cellRendererParams?.value ?? row[column.key]);
  function handleClick(e) {
    selectCell(row, column);
    props.onRowClick?.({
      api: props.api,
      data: row,
      columnApi: props.columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowClicked",
      event: e
    });
    props.onCellClick?.({
      api: props.api,
      colDef: {
        field: column.field,
        resizable: column.resizable ?? undefined,
        sortable: column.sortable ?? undefined,
        width: column.width
      },
      data: row,
      node: node,
      columnApi: props.columnApi,
      rowIndex: rowIndex,
      value: row[column.field] ?? undefined,
      type: "cellClicked",
      event: e
    });
  }
  function handleRowChange(newRow) {
    onRowChange(column, rowIndex, newRow, row);
  }
  const {
    cellClass
  } = column;
  const topRow = rowIndex === 0 && isRowSelected ? true : false;
  const bottomRow = rowIndex === allrow.length - 1 && isRowSelected ? true : false;
  const middleRow = !(topRow || bottomRow) && isRowSelected ? true : false;
  const className = getCellClassname(column, `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`, typeof cellClass === "function" ? cellClass(row) : cellClass, middleRow && rowIsSelectedClassName, topRow && topRowIsSelectedClassName, bottomRow && bottomRowIsSelectedClassName);
  if (valueChangedCellStyle) {
    if (previousData[rowIndex]?.includes(column.key)) {
      style = {
        ...style,
        backgroundColor: valueChangedCellStyle.backgroundColor ?? style.backgroundColor,
        color: valueChangedCellStyle.color ?? style.color
      };
    }
  }
  return (
    /*#__PURE__*/
    jsxs("div", {
      role: "gridcell",
      "aria-colindex": column.idx + 1,
      "aria-selected": isCellSelected,
      ref: ref,
      tabIndex: tabIndex,
      className: className,
      style: {
        ...style,
        display: "flex",
        width: "100%",
        justifyContent: "center"
      },
      onClick: handleClick,
      onFocus: onFocus,
      children: [column.idx < 1 && serialNumber && column.cellRenderer({
        childRows,
        column: {
          ...column,
          rowIndex
        },
        row,
        isExpanded,
        isCellSelected,
        toggleTree,
        colDef: column,
        viewportColumns,
        data: row,
        value,
        allrow,
        selectedCellIdx,
        selectedCellEditor,
        api: apiObject,
        node,
        rowIndex,
        selectCell,
        treeData: props.treeData,
        onRowChange: handleRowChange,
        onRowClick: props.onRowClick,
        onRowDoubleClick: props.onRowDoubleClick,
        valueFormatted: cellRendererParams?.valueFormatted,
        fullWidth: cellRendererParams?.fullWidth,
        eGridCell: gridCell.current,
        refreshCell: () => {
          const content = document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML;
          document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML = content;
        },
        getValue: () => value,
        setValue: newValue => {
          setValue(newValue);
        },
        ...cellRendererParams
      }), column.idx < 1 && selection && column.cellRenderer({
        allRow: props.allRow,
        row,
        column,
        isCellSelected,
        childRows,
        isExpanded,
        toggleTree,
        colDef: column,
        viewportColumns,
        data: row,
        value,
        allrow,
        selectedCellIdx,
        selectedCellEditor,
        api: apiObject,
        node,
        treeData: props.treeData,
        rowIndex,
        selectCell,
        onRowChange: handleRowChange,
        onRowClick: props.onRowClick,
        onRowDoubleClick: props.onRowDoubleClick,
        valueFormatted: cellRendererParams?.valueFormatted,
        fullWidth: cellRendererParams?.fullWidth,
        eGridCell: gridCell.current,
        refreshCell: () => {
          const content = document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML;
          document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML = content;
        },
        getValue: () => value,
        setValue: newValue => {
          setValue(newValue);
        },
        ...cellRendererParams
      }), column.idx === 0 && !selection && !serialNumber && /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx("span", {
          className: "tree-expand-icon",
          "data-testId": `tree-expand-icon${rowIndex}`,
          style: {
            color: "black",
            fontSize: "12px",
            cursor: "pointer",
            paddingLeft: `${level * 10 + 10}px`,
            width: "30%",
            textAlign: "start"
          },
          onClick: toggleTree,
          children: isExpanded ? "\u25BC" : "\u25B6"
        }), /*#__PURE__*/jsx("span", {
          style: {
            width: "70%",
            textAlign: "start",
            paddingLeft: `${level * 5 + 5}px`
          },
          children: column.treeFormatter?.({
            childRows,
            column,
            row,
            isExpanded,
            isCellSelected,
            toggleTree,
            selectCell,
            treeData: props.treeData,
            allrow
          })
        })]
      }), column.idx >= 1 && !selection && !serialNumber && column.cellRenderer?.({
        childRows,
        column,
        row,
        isExpanded,
        isCellSelected,
        toggleTree,
        colDef: column,
        viewportColumns,
        data: row,
        allrow,
        selectedCellIdx,
        selectedCellEditor,
        api: apiObject,
        node,
        value,
        rowIndex,
        treeData: props.treeData,
        selectCell,
        onRowChange: handleRowChange,
        onRowClick: props.onRowClick,
        onRowDoubleClick: props.onRowDoubleClick,
        valueFormatted: cellRendererParams?.valueFormatted,
        fullWidth: cellRendererParams?.fullWidth,
        eGridCell: gridCell.current,
        refreshCell: () => {
          const content = document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML;
          document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML = content;
        },
        getValue: () => value,
        setValue: newValue => {
          setValue(newValue);
        },
        ...cellRendererParams
      }), column.idx === 1 && !selection && serialNumber && /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx("span", {
          className: "tree-expand-icon",
          "data-testId": `tree-expand-icon${rowIndex}`,
          style: {
            color: "black",
            fontSize: "12px",
            cursor: "pointer",
            paddingLeft: `${level * 10 + 10}px`,
            width: "30%",
            textAlign: "start"
          },
          onClick: toggleTree,
          children: isExpanded ? "\u25BC" : "\u25B6"
        }), /*#__PURE__*/jsx("span", {
          style: {
            width: "70%",
            textAlign: "start",
            paddingLeft: `${level * 5 + 5}px`
          },
          children: (!column.rowGroup || treeColumnIndex === column.idx) && column.treeFormatter?.({
            childRows,
            column,
            row,
            isExpanded,
            isCellSelected,
            treeData: props.treeData,
            toggleTree,
            value,
            allrow
          })
        })]
      }), column.idx === 1 && selection && !serialNumber && /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx("span", {
          className: "tree-expand-icon",
          "data-testId": `tree-expand-icon${rowIndex}`,
          style: {
            color: "black",
            fontSize: "12px",
            cursor: "pointer",
            paddingLeft: `${level * 10 + 10}px`,
            width: "30%",
            textAlign: "start"
          },
          onClick: toggleTree,
          children: isExpanded ? "\u25BC" : "\u25B6"
        }), /*#__PURE__*/jsx("span", {
          style: {
            width: "70%",
            textAlign: "start",
            paddingLeft: `${level * 5 + 5}px`
          },
          children: (!column.rowGroup || treeColumnIndex === column.idx) && column.treeFormatter?.({
            childRows,
            column,
            row,
            isExpanded,
            isCellSelected,
            treeData: props.treeData,
            toggleTree,
            value,
            allrow
          })
        })]
      }), column.idx === 2 && selection && serialNumber && /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx("span", {
          className: "tree-expand-icon",
          "data-testId": `tree-expand-icon${rowIndex}`,
          style: {
            color: "black",
            fontSize: "12px",
            cursor: "pointer",
            paddingLeft: `${level * 10 + 10}px`,
            width: "30%",
            textAlign: "start"
          },
          onClick: toggleTree,
          children: isExpanded ? "\u25BC" : "\u25B6"
        }), /*#__PURE__*/jsx("span", {
          style: {
            width: "70%",
            textAlign: "start",
            paddingLeft: `${level * 5 + 5}px`
          },
          children: (!column.rowGroup || treeColumnIndex === column.idx) && column.treeFormatter?.({
            childRows,
            column,
            row,
            isExpanded,
            isCellSelected,
            treeData: props.treeData,
            toggleTree,
            value,
            allrow
          })
        })]
      }), column.idx === 1 && serialNumber && selection && column.cellRenderer({
        childRows,
        column: {
          ...column,
          rowIndex
        },
        row,
        isExpanded,
        isCellSelected,
        toggleTree,
        colDef: column,
        viewportColumns,
        data: row,
        value,
        allrow,
        selectedCellIdx,
        selectedCellEditor,
        api: apiObject,
        node,
        rowIndex,
        selectCell,
        treeData: props.treeData,
        onRowChange: handleRowChange,
        onRowClick: props.onRowClick,
        onRowDoubleClick: props.onRowDoubleClick,
        valueFormatted: cellRendererParams?.valueFormatted,
        fullWidth: cellRendererParams?.fullWidth,
        eGridCell: gridCell.current,
        refreshCell: () => {
          const content = document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML;
          document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML = content;
        },
        getValue: () => value,
        setValue: newValue => {
          setValue(newValue);
        },
        ...cellRendererParams
      }), column.idx > 2 && selection && serialNumber && column.cellRenderer?.({
        childRows,
        column,
        row,
        isExpanded,
        isCellSelected,
        toggleTree,
        colDef: column,
        viewportColumns,
        data: row,
        allrow,
        selectedCellIdx,
        selectedCellEditor,
        api: apiObject,
        node,
        value,
        rowIndex,
        treeData: props.treeData,
        selectCell,
        onRowChange: handleRowChange,
        onRowClick: props.onRowClick,
        onRowDoubleClick: props.onRowDoubleClick,
        valueFormatted: cellRendererParams?.valueFormatted,
        fullWidth: cellRendererParams?.fullWidth,
        eGridCell: gridCell.current,
        refreshCell: () => {
          const content = document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML;
          document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML = content;
        },
        getValue: () => value,
        setValue: newValue => {
          setValue(newValue);
        },
        ...cellRendererParams
      })]
    }, column.key)
  );
}
const TreeCell$1 = /*#__PURE__*/memo(TreeCell);

const textEditorInternalClassname = "t1bswe1i1-0-3";
const textEditorClassname = `rdg-text-editor ${textEditorInternalClassname}`;
function TextEditor({
  row,
  column,
  onRowChange,
  onClose,
  ...props
}) {
  var type = column.type ? column.type : "text";
  type = type.toLowerCase() === "masked" || type.toLowerCase() === "mask" ? "password" : type;
  let value = row[column.key];
  return /*#__PURE__*/jsx("input", {
    role: "gridcellTextbox",
    spellCheck: "true",
    className: textEditorClassname,
    type: type,
    disabled: column.editable ? column.editable : false,
    value: value,
    ...column.inputProps,
    onChange: event => onRowChange({
      ...row,
      [column.key]: event.target.value
    })
  });
}

const DEFAULT_COLUMN_WIDTH$1 = "auto";
const DEFAULT_COLUMN_MIN_WIDTH$1 = 40;
function useCalculatedColumns({
  newData,
  columnWidths,
  viewportWidth,
  scrollLeft,
  defaultColumnOptions,
  rawGroupBy,
  enableVirtualization,
  frameworkComponents,
  treeData
}) {
  const defaultWidth = defaultColumnOptions?.width ?? DEFAULT_COLUMN_WIDTH$1;
  const defaultMinWidth = defaultColumnOptions?.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH$1;
  const defaultMaxWidth = defaultColumnOptions?.maxWidth ?? undefined;
  const defaultFormatter = defaultColumnOptions?.formatter ?? valueFormatter;
  const defaultSortable = defaultColumnOptions?.sortable ?? false;
  const defaultResizable = defaultColumnOptions?.resizable ?? false;
  const defaultFilter = defaultColumnOptions?.dilter ?? false;
  const {
    columns,
    colSpanColumns,
    lastFrozenColumnIndex,
    groupBy
  } = useMemo(() => {
    const groupBy = [];
    let lastFrozenColumnIndex = -1;
    const columns = newData?.map((rawColumn, pos) => {
      const rowGroup = rawGroupBy?.includes(rawColumn.field) ?? false;
      const frozen = rowGroup || rawColumn.frozen;
      const cellRendererValue = rawColumn.cellRenderer;
      const components = frameworkComponents ? Object.keys(frameworkComponents) : null;
      const indexOfComponent = components?.indexOf(cellRendererValue);
      const customComponentName = indexOfComponent > -1 ? components[indexOfComponent] : null;
      let recursiveChild = (subChild, rawColumn) => {
        return subChild?.haveChildren === true && Array.isArray(subChild?.children) && subChild?.children.map((subChild2, index1) => {
          const rawChild2 = {
            ...subChild2,
            parent: subChild.field,
            formatter: subChild2.cellRenderer ? subChild2.cellRenderer : subChild2.valueFormatter ?? defaultFormatter,
            filter: subChild2.filter ?? defaultFilter,
            cellRenderer: frameworkComponents?.[customComponentName] ?? subChild2.cellRenderer ?? subChild2.valueFormatter ?? defaultFormatter,
            children: recursiveChild(subChild2),
            key: subChild2.field
          };
          return rawChild2;
        });
      };
      const column = {
        ...rawColumn,
        colId: rawColumn.field,
        key: rawColumn.field ?? rawColumn.key,
        userProvidedColDef: rawColumn,
        parent: null,
        idx: 0,
        index: pos,
        frozen,
        isLastFrozenColumn: false,
        rowGroup,
        width: rawColumn.width ?? defaultWidth,
        minWidth: rawColumn.minWidth ?? defaultMinWidth,
        maxWidth: rawColumn.maxWidth ?? defaultMaxWidth,
        sortable: rawColumn.sortable ?? defaultSortable,
        resizable: rawColumn.resizable ?? defaultResizable,
        formatter: rawColumn.cellRenderer ? rawColumn.cellRenderer : rawColumn.valueFormatter ?? defaultFormatter,
        filter: rawColumn.filter ?? defaultFilter,
        cellRenderer: frameworkComponents?.[customComponentName] ?? rawColumn.cellRenderer ?? rawColumn.valueFormatter ?? defaultFormatter,
        children: rawColumn?.haveChildren === true && Array.isArray(rawColumn?.children) && rawColumn?.children.map((child, index1) => {
          const cellRendererValue = child.cellRenderer;
          const components = frameworkComponents ? Object.keys(frameworkComponents) : null;
          const indexOfComponent = components?.indexOf(cellRendererValue);
          const customComponentName = indexOfComponent > -1 ? components[indexOfComponent] : null;
          const rawChild = {
            ...child,
            parent: rawColumn.field,
            key: child.field,
            formatter: child.cellRenderer ? child.cellRenderer : child.valueFormatter ?? defaultFormatter,
            filter: child.filter ?? defaultFilter,
            cellRenderer: frameworkComponents?.[customComponentName] ?? child.cellRenderer ?? child.valueFormatter ?? defaultFormatter,
            children: child?.haveChildren === true && Array.isArray(child?.children) && child?.children.map((subChild, index2) => {
              const rawChild1 = {
                ...subChild,
                parent: child.field,
                formatter: subChild.cellRenderer ? subChild.cellRenderer : subChild.valueFormatter ?? defaultFormatter,
                filter: subChild.filter ?? defaultFilter,
                cellRenderer: frameworkComponents?.[customComponentName] ?? subChild.cellRenderer ?? subChild.valueFormatter ?? defaultFormatter,
                children: recursiveChild(subChild),
                key: subChild.field
              };
              return rawChild1;
            })
          };
          return rawChild;
        })
      };
      if (rowGroup) {
        column.groupFormatter ??= toggleGroupFormatter;
      }
      function TreeFormatter({
        row,
        column
      }) {
        return row[column.key];
      }
      if (treeData) {
        column.treeFormatter ??= TreeFormatter;
      }
      function TreeFormatter({
        row,
        column
      }) {
        return row[column.key];
      }
      if (treeData) {
        column.treeFormatter ??= TreeFormatter;
      }
      if (frozen) {
        lastFrozenColumnIndex++;
      }
      if (column.alignment) {
        if (column.alignment.type?.toLowerCase() === "date" || column.alignment.type?.toLowerCase() === "datetime" || column.alignment.type?.toLowerCase() === "time") {
          column.width = rawColumn.width ?? "max-content";
        }
      }
      return column;
    });
    columns?.sort(({
      key: aKey,
      frozen: frozenA
    }, {
      key: bKey,
      frozen: frozenB
    }) => {
      if (aKey === SELECT_COLUMN_KEY) return -1;
      if (bKey === SELECT_COLUMN_KEY) return 1;
      if (rawGroupBy?.includes(aKey)) {
        if (rawGroupBy.includes(bKey)) {
          return rawGroupBy.indexOf(aKey) - rawGroupBy.indexOf(bKey);
        }
        return -1;
      }
      if (rawGroupBy?.includes(bKey)) return 1;
      if (frozenA) {
        if (frozenB) return 0;
        return -1;
      }
      if (frozenB) return 1;
      return 0;
    });
    const colSpanColumns = [];
    columns?.forEach((column, idx) => {
      column.idx = idx;
      if (column.rowGroup) {
        groupBy.push(column.key);
      }
      if (column.colSpan != null) {
        colSpanColumns.push(column);
      }
    });
    if (lastFrozenColumnIndex !== -1) {
      columns[lastFrozenColumnIndex].isLastFrozenColumn = true;
    }
    return {
      columns,
      colSpanColumns,
      lastFrozenColumnIndex,
      groupBy
    };
  }, [newData, defaultWidth, defaultMinWidth, defaultMaxWidth, defaultFormatter, defaultResizable, defaultSortable, rawGroupBy]);
  const {
    templateColumns,
    layoutCssVars,
    totalFrozenColumnWidth,
    columnMetrics
  } = useMemo(() => {
    const templateColumns = [];
    let left = 0;
    let totalFrozenColumnWidth = 0;
    const columnMetrics = new Map();
    for (const column of columns) {
      let width = columnWidths.get(column.key) ?? column.width;
      if (typeof width === "number") {
        width = clampColumnWidth(width, column);
      } else {
        width = column.minWidth;
      }
      templateColumns.push(`${width}px`);
      columnMetrics.set(column, {
        width,
        left
      });
      left += width;
    }
    if (lastFrozenColumnIndex !== -1) {
      const columnMetric = columnMetrics.get(columns[lastFrozenColumnIndex]);
      totalFrozenColumnWidth = columnMetric.left + columnMetric.width;
    }
    const layoutCssVars = {
      gridTemplateColumns: templateColumns.join(" ")
    };
    for (let i = 0; i <= lastFrozenColumnIndex; i++) {
      const column = columns[i];
      layoutCssVars[`--rdg-frozen-left-${column.idx}`] = `${columnMetrics.get(column).left}px`;
    }
    return {
      templateColumns,
      layoutCssVars,
      totalFrozenColumnWidth,
      columnMetrics
    };
  }, [columnWidths, columns, lastFrozenColumnIndex]);
  const [colOverscanStartIdx, colOverscanEndIdx] = useMemo(() => {
    if (!enableVirtualization) {
      return [0, columns.length - 1];
    }
    const viewportLeft = scrollLeft + totalFrozenColumnWidth;
    const viewportRight = scrollLeft + viewportWidth;
    const lastColIdx = columns.length - 1;
    const firstUnfrozenColumnIdx = min(lastFrozenColumnIndex + 1, lastColIdx);
    if (viewportLeft >= viewportRight) {
      return [firstUnfrozenColumnIdx, firstUnfrozenColumnIdx];
    }
    let colVisibleStartIdx = firstUnfrozenColumnIdx;
    while (colVisibleStartIdx < lastColIdx) {
      const {
        left,
        width
      } = columnMetrics.get(columns[colVisibleStartIdx]);
      if (left + width > viewportLeft) {
        break;
      }
      colVisibleStartIdx++;
    }
    let colVisibleEndIdx = colVisibleStartIdx;
    while (colVisibleEndIdx < lastColIdx) {
      const {
        left,
        width
      } = columnMetrics.get(columns[colVisibleEndIdx]);
      if (left + width >= viewportRight) {
        break;
      }
      colVisibleEndIdx++;
    }
    const colOverscanStartIdx = max(firstUnfrozenColumnIdx, colVisibleStartIdx - 1);
    const colOverscanEndIdx = min(lastColIdx, colVisibleEndIdx + 1);
    return [colOverscanStartIdx, colOverscanEndIdx];
  }, [columnMetrics, columns, lastFrozenColumnIndex, scrollLeft, totalFrozenColumnWidth, viewportWidth, enableVirtualization]);
  return {
    columns,
    colSpanColumns,
    colOverscanStartIdx,
    colOverscanEndIdx,
    templateColumns,
    layoutCssVars,
    columnMetrics,
    lastFrozenColumnIndex,
    totalFrozenColumnWidth,
    groupBy
  };
}

function useGridDimensions() {
  const gridRef = useRef(null);
  const [inlineSize, setInlineSize] = useState(1);
  const [blockSize, setBlockSize] = useState(1);
  const [isWidthInitialized, setWidthInitialized] = useState(false);
  useLayoutEffect(() => {
    const {
      ResizeObserver
    } = window;
    if (ResizeObserver == null) return;
    const {
      clientWidth,
      clientHeight,
      offsetWidth,
      offsetHeight
    } = gridRef.current;
    const {
      width,
      height
    } = gridRef.current.getBoundingClientRect();
    const initialWidth = width - offsetWidth + clientWidth;
    const initialHeight = height - offsetHeight + clientHeight;
    setInlineSize(initialWidth);
    setBlockSize(initialHeight);
    setWidthInitialized(true);
    const resizeObserver = new ResizeObserver(entries => {
      const size = entries[0].contentBoxSize[0];
      setInlineSize(size.inlineSize);
      setBlockSize(size.blockSize);
    });
    resizeObserver.observe(gridRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return [gridRef, inlineSize, blockSize, isWidthInitialized];
}

function useLatestFunc(fn) {
  const ref = useRef(fn);
  useEffect(() => {
    ref.current = fn;
  });
  const callbackFn = useCallback((...args) => {
    ref.current(...args);
  }, []);
  return fn ? callbackFn : fn;
}

function useViewportColumns({
  columns,
  colSpanColumns,
  rows,
  topSummaryRows,
  bottomSummaryRows,
  colOverscanStartIdx,
  colOverscanEndIdx,
  lastFrozenColumnIndex,
  rowOverscanStartIdx,
  rowOverscanEndIdx,
  columnWidths,
  isGroupRow
}) {
  const startIdx = useMemo(() => {
    if (colOverscanStartIdx === 0) return 0;
    let startIdx = colOverscanStartIdx;
    const updateStartIdx = (colIdx, colSpan) => {
      if (colSpan !== undefined && colIdx + colSpan > colOverscanStartIdx) {
        startIdx = colIdx;
        return true;
      }
      return false;
    };
    for (const column of colSpanColumns) {
      const colIdx = column.idx;
      if (colIdx >= startIdx) break;
      if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
        type: "HEADER"
      }))) {
        break;
      }
      for (let rowIdx = rowOverscanStartIdx; rowIdx <= rowOverscanEndIdx; rowIdx++) {
        const row = rows[rowIdx];
        if (isGroupRow(row)) continue;
        if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
          type: "ROW",
          row
        }))) {
          break;
        }
      }
      if (topSummaryRows != null) {
        for (const row of topSummaryRows) {
          if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
            type: "SUMMARY",
            row
          }))) {
            break;
          }
        }
      }
      if (bottomSummaryRows != null) {
        for (const row of bottomSummaryRows) {
          if (updateStartIdx(colIdx, getColSpan(column, lastFrozenColumnIndex, {
            type: "SUMMARY",
            row
          }))) {
            break;
          }
        }
      }
    }
    return startIdx;
  }, [rowOverscanStartIdx, rowOverscanEndIdx, rows, topSummaryRows, bottomSummaryRows, colOverscanStartIdx, lastFrozenColumnIndex, colSpanColumns, isGroupRow]);
  const {
    viewportColumns,
    flexWidthViewportColumns
  } = useMemo(() => {
    const viewportColumns = [];
    const flexWidthViewportColumns = [];
    for (let colIdx = 0; colIdx <= colOverscanEndIdx; colIdx++) {
      const column = columns[colIdx];
      if (colIdx < startIdx && !column.frozen) continue;
      viewportColumns.push(column);
      if (typeof column.width === "string") {
        flexWidthViewportColumns.push(column);
      }
    }
    return {
      viewportColumns,
      flexWidthViewportColumns
    };
  }, [startIdx, colOverscanEndIdx, columns]);
  const unsizedFlexWidthViewportColumns = useMemo(() => {
    return flexWidthViewportColumns.filter(column => !columnWidths.has(column.key));
  }, [flexWidthViewportColumns, columnWidths]);
  return {
    viewportColumns,
    flexWidthViewportColumns: unsizedFlexWidthViewportColumns
  };
}

function isReadonlyArray(arr) {
  return Array.isArray(arr);
}
function useViewportRows({
  rawRows,
  rowHeight,
  clientHeight,
  scrollTop,
  groupBy,
  rowGrouper,
  expandedGroupIds,
  enableVirtualization,
  paginationPageSize,
  current,
  pagination,
  expandAll,
  expandedMasterIds
}) {
  const [groupedRows, rowsCount] = useMemo(() => {
    if (groupBy.length === 0 || rowGrouper == null) return [undefined, rawRows.length];
    const groupRows = (rows, [groupByKey, ...remainingGroupByKeys], startRowIndex) => {
      let groupRowsCount = 0;
      const groups = {};
      for (const [key, childRows] of Object.entries(rowGrouper(rows, groupByKey))) {
        const [childGroups, childRowsCount] = remainingGroupByKeys.length === 0 ? [childRows, childRows.length] : groupRows(childRows, remainingGroupByKeys, startRowIndex + groupRowsCount + 1);
        groups[key] = {
          childRows,
          childGroups,
          startRowIndex: startRowIndex + groupRowsCount
        };
        groupRowsCount += childRowsCount + 1;
      }
      return [groups, groupRowsCount];
    };
    return groupRows(rawRows, groupBy, 0);
  }, [groupBy, rowGrouper, rawRows]);
  const [rows, isGroupRow] = useMemo(() => {
    const allGroupRows = new Set();
    if (!groupedRows) return [rawRows, isGroupRow];
    const flattenedRows = [];
    const expandGroup = (rows, parentId, level) => {
      if (isReadonlyArray(rows)) {
        flattenedRows.push(...rows);
        return;
      }
      Object.keys(rows).forEach((groupKey, posInSet, keys) => {
        const id = parentId !== undefined ? `${parentId}__${groupKey}` : groupKey;
        const isExpanded = expandAll != null ? expandAll : expandedGroupIds?.has(id) ?? false;
        const {
          childRows,
          childGroups,
          startRowIndex
        } = rows[groupKey];
        const groupRow = {
          id,
          parentId,
          groupKey,
          isExpanded,
          childRows,
          level,
          posInSet,
          startRowIndex,
          setSize: keys.length
        };
        flattenedRows.push(groupRow);
        allGroupRows.add(groupRow);
        if (isExpanded) {
          expandGroup(childGroups, id, level + 1);
        }
      });
    };
    expandGroup(groupedRows, undefined, 0);
    return [flattenedRows, isGroupRow];
    function isGroupRow(row) {
      return allGroupRows.has(row);
    }
  }, [expandedGroupIds, groupedRows, rawRows, expandAll]);
  const {
    totalRowHeight,
    gridTemplateRows,
    getRowTop,
    getRowHeight,
    findRowIdx
  } = useMemo(() => {
    if (typeof rowHeight === "number") {
      return {
        totalRowHeight: rowHeight * rows.length,
        gridTemplateRows: pagination ? ` repeat(${paginationPageSize}, ${rowHeight}px)` : ` repeat(${rows.length}, ${rowHeight}px)`,
        getRowTop: rowIdx => rowIdx * rowHeight,
        getRowHeight: () => rowHeight,
        findRowIdx: offset => floor(offset / rowHeight)
      };
    }
    let totalRowHeight = 0;
    let gridTemplateRows = " ";
    const rowPositions = rows.map((row, index) => {
      const currentRowHeight = isGroupRow(row) ? rowHeight({
        type: "GROUP",
        row
      }) : rowHeight({
        type: "ROW",
        row,
        expandedMasterIds,
        index
      });
      const position = {
        top: totalRowHeight,
        height: currentRowHeight
      };
      gridTemplateRows += `${currentRowHeight}px `;
      totalRowHeight += currentRowHeight;
      return position;
    });
    const validateRowIdx = rowIdx => {
      return max(0, min(rows.length - 1, rowIdx));
    };
    return {
      totalRowHeight,
      gridTemplateRows,
      getRowTop: rowIdx => rowPositions[validateRowIdx(rowIdx)].top,
      getRowHeight: rowIdx => rowPositions[validateRowIdx(rowIdx)].height,
      findRowIdx(offset) {
        let start = 0;
        let end = rowPositions.length - 1;
        while (start <= end) {
          const middle = start + floor((end - start) / 2);
          const currentOffset = rowPositions[middle].top;
          if (currentOffset === offset) return middle;
          if (currentOffset < offset) {
            start = middle + 1;
          } else if (currentOffset > offset) {
            end = middle - 1;
          }
          if (start > end) return end;
        }
        return 0;
      }
    };
  }, [isGroupRow, rowHeight, rows]);
  let rowOverscanStartIdx = 0;
  let rowOverscanEndIdx = rows.length - 1;
  if (enableVirtualization) {
    const overscanThreshold = 4;
    const rowVisibleStartIdx = 0;
    const rowVisibleEndIdx = findRowIdx(scrollTop + clientHeight);
    rowOverscanStartIdx = max(0, rowVisibleStartIdx - overscanThreshold);
    let numberOfRows = rows.length - (current - 1) * paginationPageSize >= paginationPageSize ? paginationPageSize - 1 : rows.length - (current - 1) * paginationPageSize - 1;
    rowOverscanEndIdx = min(pagination ? numberOfRows : rows.length - 1, rowVisibleEndIdx + overscanThreshold);
  }
  if (pagination) {
    let start = paginationPageSize * current - paginationPageSize;
    let end = paginationPageSize * current;
    return {
      rowOverscanStartIdx,
      rowOverscanEndIdx,
      rows: rows.slice(start, end),
      rowsCount: rows.slice(start, end).length - 1,
      totalRowHeight,
      gridTemplateRows,
      isGroupRow,
      getRowTop,
      getRowHeight,
      findRowIdx
    };
  } else {
    return {
      rowOverscanStartIdx,
      rowOverscanEndIdx,
      rows,
      rowsCount,
      totalRowHeight,
      gridTemplateRows,
      isGroupRow,
      getRowTop,
      getRowHeight,
      findRowIdx
    };
  }
}

const groupRow$1 = "g11dsfmk1-0-3";
const groupRowClassname$1 = `rdg-group-row ${groupRow$1}`;
function TreeRow({
  id,
  viewportColumns,
  rowIdx,
  row,
  level,
  selection,
  gridRowStart,
  columnApi,
  height,
  isExpanded,
  selectedCellIdx,
  isRowSelected,
  selectGroup,
  serialNumber,
  toggleTree,
  rowArray,
  sourceData,
  childRows,
  treeData,
  apiObject,
  selectTree,
  valueChangedCellStyle,
  onRowClick,
  onRowDoubleClick,
  onCellClick,
  onCellContextMenu,
  onCellDoubleClick,
  rowClass,
  handleRowChange,
  selectCell,
  selectedCellEditor,
  node,
  allrow,
  ...props
}) {
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;
  const [detectedLevel, setDetectedLevel] = useState();
  useEffect(() => {
    var detectedLevel;
    function recursiveChild(obj, level) {
      if (!obj.children) return;
      if (JSON.stringify(obj) === JSON.stringify(row)) {
        detectedLevel = level;
        return;
      }
      level = level + 1;
      obj.children?.map(childObj => {
        if (JSON.stringify(childObj) === JSON.stringify(row)) {
          detectedLevel = level;
          return;
        }
        recursiveChild(childObj, level);
      });
    }
    sourceData?.map(data => {
      let level = 0;
      if (data.children) {
        recursiveChild(data, level);
      }
    });
    setDetectedLevel(detectedLevel);
  }, [sourceData]);
  let style = getRowStyle(gridRowStart, height);
  return /*#__PURE__*/jsx(RowSelectionProvider, {
    value: isRowSelected,
    children: /*#__PURE__*/jsx("div", {
      role: "row",
      id: row?.id ?? rowIdx,
      ref: props.ref,
      "aria-level": level,
      "aria-expanded": isExpanded,
      className: clsx$1(rowClassname, rowClass, groupRowClassname$1, `rdg-row-groupRow-${rowIdx % 2 === 0 ? "even" : "odd"}`, isRowSelected && rowSelectedClassname),
      style: style,
      ...props,
      children: viewportColumns.map(column => /*#__PURE__*/jsx(TreeCell$1, {
        id: id,
        childRows: row.children,
        isExpanded: isExpanded,
        isCellSelected: selectedCellIdx === column.idx,
        column: column,
        row: row,
        apiObject: apiObject,
        groupColumnIndex: idx,
        toggleTree: toggleTree,
        level: detectedLevel,
        selection: selection,
        serialNumber: serialNumber,
        allrow: allrow,
        rowIndex: rowIdx,
        viewportColumns: viewportColumns,
        node: node,
        onRowClick: onRowClick,
        onRowChange: handleRowChange,
        onCellClick: onCellClick,
        onCellDoubleClick: onCellDoubleClick,
        onCellContextMenu: onCellContextMenu,
        onRowDoubleClick: onRowDoubleClick,
        columnApi: columnApi,
        selectTree: selectTree,
        isRowSelected: isRowSelected,
        selectCell: selectCell,
        selectedCellEditor: selectedCellEditor,
        valueChangedCellStyle: valueChangedCellStyle,
        treeData: treeData,
        previousData: props.previousData
      }, `${column.key}`))
    }, `${rowIdx}`)
  });
}
const TreeRowRenderer = /*#__PURE__*/memo(TreeRow);

const FilterContext = /*#__PURE__*/createContext(undefined);
const FilterContext$1 = FilterContext;

function FilterRenderer({
  isCellSelected,
  column,
  children,
  selectedCellHeaderStyle,
  selectedPosition,
  rowData
}) {
  const filters = useContext(FilterContext$1);
  const {
    ref,
    tabIndex
  } = useFocusRef(isCellSelected);
  var style = {
    padding: "2px 5px",
    display: "flex",
    justifyContent: "center"
  };
  if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) {
    style = {
      ...style,
      ...selectedCellHeaderStyle
    };
  }
  if (rowData && column.alignment) {
    style = column.alignment.align ? {
      ...style,
      justifyContent: column.alignment.align
    } : alignmentUtilsHeader(column, rowData[0], style);
  }
  return /*#__PURE__*/jsxs(Fragment, {
    children: [!column.sortable && /*#__PURE__*/jsx("div", {
      style: {
        ...style,
        width: "90%"
      },
      children: column.headerName
    }), filters.enabled && /*#__PURE__*/jsx("div", {
      children: children({
        ref,
        tabIndex,
        filters
      })
    })]
  });
}

const headerSortCell = "h1ulfo5k1-0-3";
const headerSortCellClassname = `rdg-header-sort-cell ${headerSortCell}`;
const headerSortName = "hkdf6oc1-0-3";
const headerSortNameClassname = `rdg-header-sort-name ${headerSortName}`;
function SortableHeaderCell({
  onSort,
  selectedPositionIdx,
  subCellIdx,
  sortDirection,
  priority,
  children,
  isCellSelected,
  column,
  borderBottom
}) {
  const sortStatus = useDefaultComponents().sortStatus;
  var {
    ref,
    tabIndex
  } = useFocusRef(isCellSelected);
  function handleKeyDown(event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey, children);
    }
  }
  function handleClick(event) {
    onSort(event.ctrlKey || event.metaKey, children);
  }
  return /*#__PURE__*/jsxs("span", {
    "data-testid": "sortableHeaderName",
    ref: ref,
    tabIndex: tabIndex,
    className: headerSortCellClassname,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    children: [/*#__PURE__*/jsx("span", {
      className: headerSortNameClassname,
      children: children
    }), selectedPositionIdx === subCellIdx && /*#__PURE__*/jsx("span", {
      children: sortStatus({
        sortDirection,
        priority
      })
    })]
  });
}

var _path;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SvgRecordsFilter = props => /*#__PURE__*/React.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  xmlSpace: "preserve",
  width: "1em",
  height: "1em",
  fill: "#fff",
  style: {
    shapeRendering: "geometricPrecision",
    textRendering: "geometricPrecision",
    imageRendering: "optimizeQuality",
    fillRule: "evenodd",
    clipRule: "evenodd"
  },
  viewBox: "0 0 507 511.644"
}, props), _path || (_path = /*#__PURE__*/React.createElement("path", {
  d: "M192.557 241.772a31.578 31.578 0 0 1 8.316 21.371v232.663c0 14.002 16.897 21.109 26.898 11.265l64.905-74.378c8.684-10.422 13.475-15.581 13.475-25.901V263.195c0-7.897 3.001-15.529 8.318-21.373L500.705 39.741C514.652 24.582 503.915 0 483.281 0H23.745C9.557 0 .023 11.594 0 23.784c-.01 5.541 1.945 11.204 6.321 15.957l186.236 202.031z"
})));
const FilterIcon = SvgRecordsFilter;

function FilterRendererWithSvg(column, filterClassname, filters, setFilters, setFilterType, gridWidth) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const tooltipRef = useRef(null);
  const handleButtonClick = event => {
    setButtonRect(event.target.getBoundingClientRect());
    if (isOpen === false) {
      setIsOpen(true);
    } else if (isOpen === true) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    const handleClickOutside = event => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipRef]);
  const left = buttonRect && buttonRect.left + window.pageXOffset;
  const tooltipWidth = 200;
  const tooltipLeft = left + tooltipWidth > gridWidth ? left - tooltipWidth : left;
  const getFilterValue = useCallback(event => {
    const value = event.target.value;
    setFilterType(value);
  }, [setFilterType]);
  const getInputValue = useCallback((event, filters) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      [column.field]: value
    });
  }, [setFilters, column.field]);
  return /*#__PURE__*/jsxs("div", {
    className: filterClassname,
    children: [/*#__PURE__*/jsx("svg", {
      "data-testid": `filterIcon_${column.headerName}`,
      xmlns: "http://www.w3.org/2000/svg",
      width: "10px",
      height: "10px",
      version: "1.1",
      viewBox: "0 0 507 511.644",
      onClick: handleButtonClick,
      fill: "white",
      children: /*#__PURE__*/jsxs("g", {
        id: "Layer_x0020_1",
        children: [/*#__PURE__*/jsx("metadata", {
          id: "CorelCorpID_0Corel-Layer"
        }), /*#__PURE__*/jsx("path", {
          className: "fil0",
          d: "M192.557 241.772c5.368,5.842 8.316,13.476 8.316,21.371l0 232.663c0,14.002 16.897,21.109 26.898,11.265l64.905 -74.378c8.684,-10.422 13.475,-15.581 13.475,-25.901l0 -143.597c0,-7.897 3.001,-15.529 8.318,-21.373l186.236 -202.081c13.947,-15.159 3.21,-39.741 -17.424,-39.741l-459.536 0c-14.188,0 -23.722,11.594 -23.745,23.784 -0.01,5.541 1.945,11.204 6.321,15.957l186.236 202.031 0 0z"
        })]
      })
    }), isOpen ? /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/jsx("div", {
      "data-testid": "filterDropdown",
      ref: tooltipRef,
      style: {
        position: "absolute",
        zIndex: 1300,
        top: buttonRect.top + buttonRect.height,
        left: tooltipLeft
      },
      className: "popover",
      children: /*#__PURE__*/jsxs("form", {
        style: {
          width: "200px",
          padding: "10px 10px",
          background: "white",
          borderRadius: "6px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)"
        },
        children: [/*#__PURE__*/jsxs("select", {
          style: {
            background: "rgba(255,255,255,0.1)",
            fontSize: "16px",
            height: "24px",
            margin: 0,
            outline: 0,
            border: '1px solid #b6b6b6',
            width: "100%",
            backgroundColor: "#e8eeef",
            color: "black",
            boxShadow: "0 1px 0 rgba(0,0,0,0.03) inset",
            marginBottom: "10px",
            borderRadius: "2px"
          },
          onChange: getFilterValue,
          children: [/*#__PURE__*/jsx("option", {
            children: "Contain"
          }), /*#__PURE__*/jsx("option", {
            children: "Starts With..."
          }), /*#__PURE__*/jsx("option", {
            children: "Ends With..."
          }), /*#__PURE__*/jsx("option", {
            children: "Equals"
          }), /*#__PURE__*/jsx("option", {
            children: "Not Equals"
          })]
        }), /*#__PURE__*/jsx("input", {
          type: "text",
          style: {
            background: "rgba(255,255,255,0.1)",
            fontSize: "16px",
            height: "24px",
            margin: 0,
            outline: 0,
            border: '1px solid #b6b6b6',
            boxSizing: "border-box",
            width: "100%",
            backgroundColor: "#e8eeef",
            color: "black",
            boxShadow: "0 1px 0 rgba(0,0,0,0.03) inset",
            marginBottom: "0px",
            borderRadius: "2px"
          },
          value: filters?.[column.field],
          placeholder: "Search...",
          onChange: e => getInputValue(e, filters),
          onKeyDown: inputStopPropagation
        })]
      })
    }), document.body) : null]
  });
}
function inputStopPropagation(event) {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.stopPropagation();
  }
}

const filterIcon = /*#__PURE__*/jsx(FilterIcon, {});
const filterClassname = "f2rl2fx1-0-3";
const headerWrapperWithChildData = "ha29pcs1-0-3";
const headerWrapperWithcellData = "h7qgdq51-0-3";
function HeaderRenderer({
  column,
  rows,
  sortDirection,
  priority,
  selectCell,
  onSort,
  shouldFocusGrid,
  setFilters,
  setFilterType,
  cellHeight,
  selectedPosition,
  selectedCellHeaderStyle,
  headerRowHeight,
  selectedCellIdx,
  arrayDepth,
  ChildColumnSetup,
  gridWidth
}) {
  if (column.haveChildren === true) {
    return /*#__PURE__*/jsxs("div", {
      children: [/*#__PURE__*/jsx("div", {
        style: {
          borderBlockEnd: "1px solid var(--rdg-border-color)",
          height: `${headerRowHeight}px`
        },
        children: /*#__PURE__*/jsx("div", {
          className: headerWrapperWithChildData,
          children: column.headerName ?? column.field
        })
      }), /*#__PURE__*/jsx("div", {
        className: headerWrapperWithcellData,
        children: column.children?.map((info, index) => {
          let style_fg = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          };
          if (column.alignment) {
            style_fg = column.alignment.align ? {
              ...style_fg,
              justifyContent: column.alignment.align
            } : alignmentUtilsHeader(column, rows[0], style_fg);
          }
          return /*#__PURE__*/jsx("div", {
            style: style_fg,
            children: RecursiveScan(column.children, info, cellHeight, index, headerRowHeight, selectedPosition, selectedCellHeaderStyle, column, selectCell, shouldFocusGrid, onSort, sortDirection, priority, setFilters, arrayDepth, ChildColumnSetup, selectedCellIdx, filterIcon, setFilterType, gridWidth, rows)
          }, info.field);
        })
      })]
    });
  } else {
    let isCellSelected;
    if (selectedCellIdx === column.idx) {
      isCellSelected = true;
    } else {
      isCellSelected = false;
    }
    const {
      onFocus
    } = useRovingCellRef(isCellSelected);
    ChildColumnSetup(column);
    let style = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "inherit",
      width: column.width ?? "100%",
      paddingLeft: "5px",
      paddingRight: "5px"
    };
    if (column.alignment) {
      style = column.alignment.align ? {
        ...style,
        justifyContent: column.alignment.align
      } : alignmentUtilsHeader(column, rows[0], style);
    }
    if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) style = {
      ...style,
      ...selectedCellHeaderStyle
    };
    function onClick() {
      selectCell(column.idx);
    }
    function onDoubleClick(event) {
      const {
        right,
        left
      } = event.currentTarget.getBoundingClientRect();
      const offset = isRtl ? event.clientX - left : right - event.clientX;
      if (offset > 11) {
        return;
      }
      onColumnResize(column, "max-content");
    }
    function handleFocus(event) {
      onFocus?.(event);
      if (shouldFocusGrid) {
        selectCell(0);
      }
    }
    let style_1 = {
      height: `${cellHeight}px`,
      display: "flex",
      justifyContent: "center",
      width: "100%"
    };
    if (column.alignment) {
      style_1 = column.alignment.align ? {
        ...style_1,
        justifyContent: column.alignment.align
      } : alignmentUtilsHeader(column, rows[0], style_1);
    }
    if (!(column.sortable || column.filter)) {
      return (
        /*#__PURE__*/
        jsx("div", {
          style: style_1,
          "aria-selected": isCellSelected,
          role: "columnheader",
          onFocus: handleFocus,
          onClick: onClick,
          onDoubleClick: column.resizable ? onDoubleClick : undefined,
          children: /*#__PURE__*/jsx("div", {
            style: {
              ...style
            },
            children: column.headerName ?? column.field
          })
        }, column.idx)
      );
    }
    if (column.sortable && !column.filter) {
      return /*#__PURE__*/jsx("div", {
        style: style_1,
        "aria-selected": isCellSelected,
        role: "columnheader",
        onFocus: handleFocus,
        onClick: onClick,
        onDoubleClick: column.resizable ? onDoubleClick : undefined,
        children: /*#__PURE__*/jsx("div", {
          style: {
            ...style
          },
          children: /*#__PURE__*/jsx(SortableHeaderCell, {
            onSort: onSort,
            sortDirection: sortDirection,
            priority: priority,
            isCellSelected: isCellSelected,
            column: column,
            borderBottom: "none",
            children: column.headerName ?? column.field
          })
        })
      }, column.idx);
    }
    if (column.filter && !column.sortable) {
      let style11 = {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) {
        style11 = {
          ...style11,
          ...selectedCellHeaderStyle
        };
      }
      return /*#__PURE__*/jsx("div", {
        style: {
          ...style11
        },
        onClick: onClick,
        "aria-selected": isCellSelected,
        role: "columnheader",
        children: /*#__PURE__*/jsx(FilterRenderer, {
          selectedCellHeaderStyle: selectedCellHeaderStyle,
          selectedPosition: selectedCellHeaderStyle,
          onFocus: handleFocus,
          onClick: onClick,
          column: column,
          onDoubleClick: column.resizable ? onDoubleClick : undefined,
          isCellSelected: isCellSelected,
          children: ({
            filters,
            ...rest
          }) => FilterRendererWithSvg(column, filterClassname, filters, setFilters, setFilterType, gridWidth)
        })
      }, column.idx);
    }
    if (column.filter && column.sortable) {
      let styleSF = {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) {
        styleSF = {
          ...styleSF,
          ...selectedCellHeaderStyle
        };
      }
      if (column.alignment) {
        styleSF = column.alignment.align ? {
          ...styleSF,
          justifyContent: column.alignment.align
        } : alignmentUtilsHeader(column, rows[0], styleSF);
      }
      return /*#__PURE__*/jsxs("div", {
        onFocus: handleFocus,
        "aria-selected": isCellSelected,
        role: "columnheader",
        onClick: onClick,
        onDoubleClick: column.resizable ? onDoubleClick : undefined,
        style: {
          ...styleSF
        },
        children: [/*#__PURE__*/jsx("div", {
          style: {
            width: "90%"
          },
          children: /*#__PURE__*/jsx(SortableHeaderCell, {
            onSort: onSort,
            sortDirection: sortDirection,
            priority: priority,
            isCellSelected: isCellSelected,
            children: column.headerName ?? column.field
          })
        }), /*#__PURE__*/jsx(FilterRenderer, {
          column: column,
          isCellSelected: isCellSelected,
          children: ({
            filters,
            ...rest
          }) => FilterRendererWithSvg(column, filterClassname, filters, setFilters, setFilterType, gridWidth)
        })]
      }, column.idx);
    }
  }
}
let columnsList = [];
const RecursiveScan = (masterData, subData, cellHeight, index, headerRowHeight, selectedPosition, selectedCellHeaderStyle, column, selectCell, shouldFocusGrid, onSort, sortDirection, priority, setFilters, arrayDepth, ChildColumnSetup, selectedCellIdx, filterIcon, setFilterType, gridWidth, direction) => {
  var cellHeight = cellHeight - headerRowHeight;
  ChildColumnSetup(subData);
  let isCellSelected;
  if (selectedCellIdx === subData.idx) {
    isCellSelected = true;
  } else {
    isCellSelected = false;
  }
  useRovingCellRef(isCellSelected);
  let rowData = direction;
  if (subData.haveChildren === true) {
    return /*#__PURE__*/jsxs("div", {
      style: {
        textAlign: "center"
      },
      children: [/*#__PURE__*/jsx("div", {
        style: {
          borderBlockEnd: "1px solid var(--rdg-border-color)",
          height: `${headerRowHeight}px`
        },
        children: /*#__PURE__*/jsx("div", {
          className: headerWrapperWithChildData,
          children: subData.headerName ?? subData.field
        })
      }), /*#__PURE__*/jsx("div", {
        className: headerWrapperWithcellData,
        children: subData.children.map((subInfo, index) => {
          var style = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box"
          };
          return /*#__PURE__*/jsx("div", {
            style: {
              ...style
            },
            children: RecursiveScan(subData.children, subInfo, cellHeight, index, headerRowHeight, selectedPosition, selectedCellHeaderStyle, column, selectCell, shouldFocusGrid, onSort, sortDirection, priority, setFilters, arrayDepth, ChildColumnSetup, selectedCellIdx, filterIcon, setFilterType, gridWidth, direction)
          }, subInfo.field);
        })
      })]
    });
  } else {
    if (!columnsList.includes(subData.name)) columnsList.push(subData.name);
    let style = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderInlineEnd: "1px solid var(--rdg-border-color)",
      width: subData.width,
      boxSizing: "border-box",
      height: `${cellHeight}px`,
      outline: selectedCellIdx === subData.idx ? "1px solid var(--rdg-selection-color)" : "none",
      outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px",
      paddingLeft: "5px",
      paddingRight: "5px"
    };
    if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx) {
      style = {
        ...style,
        ...selectedCellHeaderStyle
      };
    }
    if (subData.alignment) {
      style = subData.alignment.align ? {
        ...style,
        justifyContent: subData.alignment.align
      } : alignmentUtilsHeader(subData, rowData[0], style);
    }
    function onClick() {
      selectCell(subData.idx);
    }
    const isRtl = direction === "rtl";
    function onDoubleClick(event) {
      const {
        right,
        left
      } = event.currentTarget.getBoundingClientRect();
      const offset = isRtl ? event.clientX - left : right - event.clientX;
      if (offset > 11) {
        return;
      }
      onColumnResize(subData, "max-content");
    }
    if (!subData.sortable && !subData.filter) {
      return (
        /*#__PURE__*/
        jsx(Fragment, {
          children: /*#__PURE__*/jsx("div", {
            role: "columnheader",
            "aria-colindex": `${column.index + 1}.${columnsList.indexOf(subData.name) + 1}`,
            "aria-selected": isCellSelected,
            style: {
              ...style
            },
            onClick: onClick,
            onDoubleClick: column.resizable ? onDoubleClick : undefined,
            children: subData.headerName ?? subData.field
          }, subData.idx)
        })
      );
    }
    if (subData.sortable && !subData.filter) return (
      /*#__PURE__*/
      jsx("div", {
        style: {
          ...style
        },
        "aria-selected": isCellSelected,
        role: "columnheader",
        onClick: onClick,
        onDoubleClick: subData.resizable ? onDoubleClick : undefined,
        children: /*#__PURE__*/jsx(SortableHeaderCell, {
          onSort: onSort,
          selectedPositionIdx: selectedPosition.idx,
          subCellIdx: subData.idx,
          sortDirection: sortDirection,
          priority: priority,
          isCellSelected: isCellSelected,
          children: subData.headerName ?? subData.field
        })
      }, subData.idx)
    );
    if (subData.filter && !subData.sortable) {
      let style1 = {
        display: "flex",
        justifyContent: "center",
        borderRight: "1px solid var(--rdg-border-color)",
        width: subData.width,
        alignItems: "center",
        height: `${cellHeight}px`,
        boxSizing: "border-box",
        outline: selectedCellIdx === subData.idx ? "1px solid var(--rdg-selection-color)" : "none",
        outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px"
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx) {
        style1 = {
          ...style1,
          ...selectedCellHeaderStyle
        };
      }
      function onClickFilter() {
        selectCell(subData.idx);
      }
      if (subData.alignment) {
        style1 = subData.alignment.align ? {
          ...style1,
          justifyContent: subData.alignment.align
        } : alignmentUtilsHeader(subData, rowData[0], style1);
      }
      return /*#__PURE__*/jsx("div", {
        onClick: onClickFilter,
        "aria-selected": isCellSelected,
        role: "columnheader",
        onDoubleClick: subData.resizable ? onDoubleClick : undefined,
        style: {
          ...style1
        },
        children: /*#__PURE__*/jsx(FilterRenderer, {
          column: subData,
          isCellSelected: isCellSelected,
          rowData: rowData,
          children: ({
            filters,
            ...rest
          }) => FilterRendererWithSvg(subData, filterClassname, filters, setFilters, setFilterType, gridWidth)
        })
      }, subData.idx);
    }
    if (subData.filter && subData.sortable) {
      let style1 = {
        display: "flex",
        justifyContent: "center",
        borderRight: "1px solid var(--rdg-border-color)",
        width: subData.width,
        alignItems: "center",
        height: `${cellHeight}px`,
        boxSizing: "border-box",
        outline: selectedCellIdx === subData.idx ? "1px solid var(--rdg-selection-color)" : "none",
        outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px"
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx) style1 = {
        ...style1,
        ...selectedCellHeaderStyle
      };
      if (column.alignment) {
        style = column.alignment.align ? {
          ...style,
          justifyContent: column.alignment.align
        } : alignmentUtilsHeader(column, rowData[0], style);
      }
      function onClickFilter() {
        selectCell(subData.idx);
      }
      return (
        /*#__PURE__*/
        jsxs("div", {
          style: {
            ...style1
          },
          "aria-selected": isCellSelected,
          role: "columnheader",
          onClick: onClickFilter,
          onDoubleClick: column.resizable ? onDoubleClick : undefined,
          children: [/*#__PURE__*/jsx("div", {
            style: {
              width: "90%",
              ...style,
              outline: "none",
              borderInlineEnd: "none"
            },
            children: /*#__PURE__*/jsx(SortableHeaderCell, {
              onSort: onSort,
              selectedPositionIdx: selectedPosition.idx,
              subCellIdx: subData.idx,
              sortDirection: sortDirection,
              priority: priority,
              isCellSelected: isCellSelected,
              children: subData.headerName ?? subData.field
            })
          }), /*#__PURE__*/jsx(FilterRenderer, {
            column: subData,
            isCellSelected: isCellSelected,
            rowData: rowData,
            children: ({
              filters,
              ...rest
            }) => FilterRendererWithSvg(subData, filterClassname, filters, setFilters, setFilterType, gridWidth)
          })]
        }, subData.idx)
      );
    }
  }
};

const cellResizable = "c5s4gs71-0-3";
const cellResizableClassname = `rdg-cell-resizable ${cellResizable }`;
function HeaderCell({
  column,
  columns,
  rows,
  cellHeight,
  arrayDepth,
  headerRowHeight,
  colSpan,
  isCellSelected,
  selectedCellIdx,
  onColumnResize,
  allRowsSelected,
  onAllRowsSelectionChange,
  sortColumns,
  onSortColumnsChange,
  selectCell,
  shouldFocusGrid,
  selectedPosition,
  selectedCellHeaderStyle,
  direction,
  setFilters,
  setFilterType,
  handleReorderColumn,
  ChildColumnSetup,
  gridWidth
}) {
  const isRtl = direction === "rtl";
  const {
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  const [sortableColumnKey, setSortableColumnKey] = useState();
  const sortIndex = sortColumns?.findIndex(sort => sort.columnKey === sortableColumnKey);
  const sortColumn = sortIndex !== undefined && sortIndex > -1 ? sortColumns[sortIndex] : undefined;
  const sortDirection = sortColumn?.direction;
  const priority = sortColumn !== undefined && sortColumns.length > 1 ? sortIndex + 1 : undefined;
  const ariaSort = sortDirection && !priority ? sortDirection === "ASC" ? "ascending" : "descending" : undefined;
  let style = getCellStyle(column, colSpan);
  const className = getCellClassname(column, column.headerCellClass, `rdg-header-column-${column.idx % 2 === 0 ? "even" : "odd"}`, column.filter && filterColumnClassName, column.resizable && cellResizableClassname);
  const headerRenderer = column.headerRenderer ?? HeaderRenderer;
  function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.buttons !== 1) {
      return;
    }
    const {
      currentTarget,
      pointerId
    } = event;
    const {
      right,
      left
    } = currentTarget.getBoundingClientRect();
    const offset = isRtl ? event.clientX - left : right - event.clientX;
    if (offset > 11) {
      return;
    }
    function onPointerMove(event) {
      event.preventDefault();
      const {
        right,
        left
      } = currentTarget.getBoundingClientRect();
      const width = isRtl ? right + offset - event.clientX : event.clientX + offset - left;
      if (width > 0) {
        onColumnResize(column, width);
      }
    }
    function onLostPointerCapture() {
      currentTarget.removeEventListener("pointermove", onPointerMove);
      currentTarget.removeEventListener("lostpointercapture", onLostPointerCapture);
    }
    currentTarget.setPointerCapture(pointerId);
    currentTarget.addEventListener("pointermove", onPointerMove);
    currentTarget.addEventListener("lostpointercapture", onLostPointerCapture);
  }
  function onSort(ctrlClick, name, idx) {
    let matches = [];
    const recursiveSort = cdata => {
      if (cdata.haveChildren === true) {
        cdata.children.map((e, index) => {
          return recursiveSort(e);
        });
      } else {
        matches.push(cdata.headerName === name && cdata);
      }
    };
    if (column.haveChildren === true) {
      column.children.map(e => {
        return recursiveSort(e);
      });
    } else {
      matches.push(column.headerName === name && column);
    }
    let value1 = false;
    matches = matches.filter(function (item) {
      return item !== value1;
    });
    setSortableColumnKey(matches[0].field);
    if (onSortColumnsChange == null) return;
    const {
      sortDescendingFirst
    } = matches[0];
    if (sortColumn === undefined) {
      const nextSort = {
        columnKey: matches[0].field,
        direction: sortDescendingFirst ? "DESC" : "ASC"
      };
      onSortColumnsChange(sortColumns && ctrlClick ? [...sortColumns, nextSort] : [nextSort]);
    } else {
      let nextSortColumn;
      if (sortDescendingFirst === true && sortDirection === "DESC" || sortDescendingFirst !== true && sortDirection === "ASC") {
        nextSortColumn = {
          columnKey: matches[0].field,
          direction: sortDirection === "ASC" ? "DESC" : "ASC"
        };
      }
      if (ctrlClick) {
        const nextSortColumns = [...sortColumns];
        if (nextSortColumn) {
          nextSortColumns[sortIndex] = nextSortColumn;
        } else {
          nextSortColumns.splice(sortIndex, 1);
        }
        onSortColumnsChange(nextSortColumns);
      } else {
        onSortColumnsChange(nextSortColumn ? [nextSortColumn] : []);
      }
    }
  }
  function onClick() {
    selectCell(column.idx);
  }
  function onDoubleClick(event) {
    const {
      right,
      left
    } = event.currentTarget.getBoundingClientRect();
    const offset = isRtl ? event.clientX - left : right - event.clientX;
    if (offset > 11) {
      return;
    }
    onColumnResize(column, "max-content");
  }
  function handleFocus(event) {
    onFocus?.(event);
    if (shouldFocusGrid) {
      selectCell(0);
    }
  }
  function handleColumnsReorder(sourceKey, targetKey) {
    const sourceColumnIndex = columns.findIndex(c => c.field === sourceKey);
    const targetColumnIndex = columns.findIndex(c => c.field === targetKey);
    const reorderedColumns = [...columns];
    reorderedColumns.splice(targetColumnIndex, 0, reorderedColumns.splice(sourceColumnIndex, 1)[0]);
    handleReorderColumn([...reorderedColumns]);
  }
  const [{
    isDragging
  }, drag] = useDrag({
    type: "COLUMN_DRAG",
    item: {
      key: column.key
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const [{
    isOver
  }, drop] = useDrop({
    accept: "COLUMN_DRAG",
    drop({
      key
    }) {
      handleColumnsReorder(key, column.key);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  let headerStyle = {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  };
  if (column.alignment) {
    headerStyle = column.alignment.align ? {
      ...headerStyle,
      justifyContent: column.alignment.align
    } : alignmentUtilsHeader(column, rows[0], headerStyle);
  }
  if (column.alignment) {
    style = column.alignment.align ? {
      ...style,
      justifyContent: column.alignment.align
    } : alignmentUtilsHeader(column, rows[0], style);
  }
  return /*#__PURE__*/jsx("div", {
    role: "parentcolumn",
    "aria-colindex": column.idx + 1,
    "aria-sort": ariaSort,
    "aria-colspan": colSpan,
    ref: ele => {
      drag(ele);
      drop(ele);
    },
    tabIndex: shouldFocusGrid ? 0 : tabIndex,
    className: className,
    style: style,
    onPointerDown: column.resizable ? onPointerDown : undefined,
    children: /*#__PURE__*/jsx("div", {
      style: headerStyle,
      children: headerRenderer({
        column,
        rows,
        arrayDepth,
        cellHeight,
        sortDirection,
        selectCell,
        priority,
        selectedCellIdx,
        onSort,
        allRowsSelected,
        onAllRowsSelectionChange,
        isCellSelected,
        setFilters,
        setFilterType,
        style,
        className,
        ChildColumnSetup,
        selectedPosition,
        headerRowHeight,
        selectedCellHeaderStyle,
        gridWidth,
        shouldFocusGrid,
        handleFocus,
        onClick,
        onDoubleClick,
        onPointerDown
      })
    })
  });
}

const headerRow = "h1w9imsy1-0-3";
const headerRowClassname = `rdg-header-row ${headerRow}`;
function HeaderRow({
  columns,
  rows,
  arrayDepth,
  headerheight,
  cellHeight,
  headerData,
  allRowsSelected,
  headerRowHeight,
  onAllRowsSelectionChange,
  onColumnResize,
  sortColumns,
  onSortColumnsChange,
  lastFrozenColumnIndex,
  selectedCellIdx,
  selectCell,
  selectedCellHeaderStyle,
  selectedPosition,
  shouldFocusGrid,
  direction,
  setFilters,
  setFilterType,
  handleReorderColumn,
  gridWidth,
  ...props
}) {
  const cells = [];
  function ChildColumnSetup(data) {
    props.ChildColumnSetup(data);
  }
  for (let index = 0; index < columns.length; index++) {
    const column = columns[index];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "HEADER"
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    cells.push( /*#__PURE__*/jsx(HeaderCell, {
      column: column,
      rows: rows,
      handleReorderColumn: handleReorderColumn,
      columns: columns,
      cellHeight: cellHeight,
      arrayDepth: arrayDepth,
      headerRowHeight: headerRowHeight,
      cellData: headerData,
      colSpan: colSpan,
      selectedPosition: selectedPosition,
      selectedCellHeaderStyle: selectedCellHeaderStyle,
      isCellSelected: selectedCellIdx === column.idx,
      selectedCellIdx: selectedCellIdx,
      onColumnResize: onColumnResize,
      allRowsSelected: allRowsSelected,
      onAllRowsSelectionChange: onAllRowsSelectionChange,
      onSortColumnsChange: onSortColumnsChange,
      sortColumns: sortColumns,
      selectCell: selectCell,
      shouldFocusGrid: shouldFocusGrid && index === 0,
      direction: direction,
      setFilters: setFilters,
      setFilterType: setFilterType,
      ChildColumnSetup: ChildColumnSetup,
      gridWidth: gridWidth
    }, `${column.key}`));
  }
  return /*#__PURE__*/jsx(DndProvider, {
    backend: HTML5Backend,
    children: /*#__PURE__*/jsx("div", {
      role: "header-row",
      "aria-rowindex": 1,
      className: clsx(headerRowClassname, {}),
      style: getRowStyle(1),
      children: cells
    })
  });
}
const HeaderRow$1 = /*#__PURE__*/memo(HeaderRow);

const cellCopied = "c1tk6yq11-0-3";
const cellCopiedClassname = `rdg-cell-copied ${cellCopied }`;
const cellDraggedOver = "c1ldrpav1-0-3";
const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver }`;
const rowCellFreezeClassname = "rufgrhe1-0-3";
const freezeCol = "f120vvd51-0-3";
const freezedLastRowClassName = "f1c9ersr1-0-3";
function Cell({
  column,
  rowArray,
  colData,
  viewportColumns,
  colSpan,
  isCellSelected,
  selectedCellIdx,
  selectedCellEditor,
  isCopied,
  api,
  isDraggedOver,
  isRowSelected,
  row,
  rowIndex,
  allrow,
  dragHandle,
  onRowClick,
  onRowDoubleClick,
  onRowChange,
  selectCell,
  node,
  handleReorderRow,
  subColumn,
  totalColumns,
  onCellClick,
  onCellDoubleClick,
  onCellContextMenu,
  columnApi,
  valueChangedCellStyle,
  previousData,
  rowFreezLastIndex,
  headerheight,
  summaryRowHeight,
  expandedMasterIds,
  onExpandedMasterIdsChange,
  ...props
}) {
  const gridCell = useRef(null);
  const cellRendererParams = typeof column?.cellRendererParams === "function" ? column?.cellRendererParams() : column?.cellRendererParams;
  const [value, setValue] = useState(cellRendererParams?.value ?? row[column.key]);
  useUpdateEffect$1(() => {
    setValue(cellRendererParams?.value ?? row[column.key]);
  }, [cellRendererParams?.value, row[column.key]]);
  const {
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  const {
    cellClass
  } = column;
  const topRow = rowIndex === 0 && isRowSelected ? true : false;
  const bottomRow = rowIndex === allrow.length - 1 && isRowSelected ? true : false;
  const middleRow = !(topRow || bottomRow) && isRowSelected ? true : false;
  const className = getCellClassname(column, `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`, typeof cellClass === "function" ? cellClass(row) : cellClass, rowIndex <= rowFreezLastIndex && [rowCellFreezeClassname, column.frozen === true && freezeCol], isCopied && cellCopiedClassname, isDraggedOver && cellDraggedOverClassname, middleRow && rowIsSelectedClassName, topRow && topRowIsSelectedClassName, bottomRow && bottomRowIsSelectedClassName, rowIndex === rowFreezLastIndex && freezedLastRowClassName);
  function handleRowChange(newRow) {
    onRowChange(column, newRow);
  }
  let style = {
    ...getCellStyle(column, colSpan, row),
    "--rdg-summary-row-top": `${headerheight + summaryRowHeight + rowIndex * 24}px`
  };
  style = column.haveChildren === true ? {
    ...style,
    ...{
      borderInlineEnd: "none"
    }
  } : {
    ...style
  };
  style = column.idx === 0 && isRowSelected ? {
    ...style,
    ...{
      borderInlineStart: "1px solid #9bbb59"
    }
  } : {
    ...style
  };
  style = column.idx === totalColumns - 1 && isRowSelected ? {
    ...style,
    ...{
      borderInlineEnd: "1px solid #9bbb59"
    }
  } : {
    ...style
  };
  const rowSpan = column.rowSpan?.({
    type: "ROW",
    row
  }) ?? undefined;
  if (column.validation) {
    const validationStyle = column.validation.style ? column.validation.style : {
      backgroundColor: "red"
    };
    if (column.validation.method(row[column.key])) {
      style = {
        ...style,
        ...validationStyle
      };
    }
  }
  if (column.alignment) {
    style = column.alignment.align ? {
      ...style,
      textAlign: column.alignment.align
    } : alignmentUtilsCell(column, row, style);
  }
  if (valueChangedCellStyle) {
    if (previousData[rowIndex]?.includes(column.key)) {
      style = {
        ...style,
        backgroundColor: valueChangedCellStyle.backgroundColor ?? style.backgroundColor,
        color: valueChangedCellStyle.color ?? style.color
      };
    }
  }
  const [{
    isDragging
  }, drag] = useDrag({
    type: "ROW_DRAG",
    item: {
      index: rowIndex
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  function onRowReorder(fromIndex, toIndex) {
    const newRows = [...allrow];
    newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
    handleReorderRow(newRows);
  }
  const [{
    isOver
  }, drop] = useDrop({
    accept: "ROW_DRAG",
    drop({
      index
    }) {
      onRowReorder(index, rowIndex);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  function handleDoubleClick(e) {
    e.stopPropagation();
    onRowDoubleClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowDoubleClicked",
      event: e
    });
    onCellDoubleClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      value: row[column.key],
      type: "cellDoubleClicked",
      event: e
    });
  }
  function handleClick(e) {
    e.stopPropagation();
    onRowClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowClicked",
      event: e
    });
    onCellClick?.({
      api: api,
      data: row,
      columnApi: columnApi,
      node: node,
      rowIndex: rowIndex,
      value: row[column.key],
      type: "cellClicked",
      event: e
    });
  }
  let params = {
    column,
    colDef: column,
    selectedCellIdx,
    selectedCellEditor,
    row,
    rowArray,
    colData,
    data: row,
    allrow,
    className,
    api,
    node,
    viewportColumns,
    rowIndex,
    isCellSelected,
    onRowChange: handleRowChange,
    onRowClick: onRowClick,
    columnApi,
    onCellClick,
    onCellDoubleClick,
    selectCell,
    onRowDoubleClick,
    subColumn,
    value: value,
    valueFormatted: cellRendererParams?.valueFormatted,
    fullWidth: cellRendererParams?.fullWidth,
    eGridCell: gridCell.current,
    refreshCell: () => {
      const content = document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML;
      document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML = content;
    },
    getValue: () => value,
    setValue: newValue => {
      setValue(newValue);
      row[column.key] = newValue;
    },
    ...cellRendererParams,
    expandedMasterIds,
    onExpandedMasterIdsChange
  };
  if (column.cellStyle) {
    let dynamicStyle;
    if (typeof column.cellStyle === "function") dynamicStyle = column.cellStyle(params);else dynamicStyle = column.cellStyle;
    style = {
      ...style,
      ...dynamicStyle
    };
  }
  return /*#__PURE__*/jsx("div", {
    "data-testid": "rowCell",
    "aria-colindex": column.idx + 1,
    "aria-colspan": colSpan,
    "aria-rowspan": rowSpan,
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    "aria-readonly": !isCellEditable(column, row) || undefined,
    ref: gridCell,
    tabIndex: tabIndex,
    className: className,
    style: style,
    onFocus: onFocus,
    ...props,
    children: !column.rowGroup && /*#__PURE__*/jsxs(Fragment, {
      children: [column.rowDrag && /*#__PURE__*/jsxs("div", {
        ref: ele => {
          drag(ele);
          drop(ele);
        },
        style: {
          display: "flex"
        },
        children: [/*#__PURE__*/jsx("span", {
          style: {
            cursor: "grab",
            marginLeft: "10px",
            marginRight: "5px"
          },
          children: "\u25CA"
        }), column.cellRenderer(params)]
      }), !column.rowDrag && column.cellRenderer(params), dragHandle]
    })
  });
}
const Cell$1 = /*#__PURE__*/memo(Cell);

var _excluded$1 = ["className", "indexR", "styleR", "rowIdx", "gridTemplateColumns", "rowArray", "gridRowStart", "height", "selectedCellIdx", "isRowSelected", "copiedCellIdx", "draggedOverCellIdx", "lastFrozenColumnIndex", "api", "row", "selectedCellRowStyle", "rows", "node", "viewportColumns", "selectedCellEditor", "selectedCellDragHandle", "onRowClick", "onRowDoubleClick", "rowClass", "setDraggedOverRowIdx", "onMouseEnter", "onRowChange", "selectCell", "totalColumns", "subColumn", "handleReorderRow", "onCellClick", "onCellDoubleClick", "onCellContextMenu", "columnApi", "valueChangedCellStyle", "previousData", "selectedPosition", "rowFreezLastIndex", "summaryRowHeight", "headerheight", "expandedMasterIds", "onExpandedMasterIdsChange"];
function Row(_ref, ref) {
  var _clsx, _row$id;
  var className = _ref.className;
    _ref.indexR;
    _ref.styleR;
    var rowIdx = _ref.rowIdx;
    _ref.gridTemplateColumns;
    var rowArray = _ref.rowArray,
    gridRowStart = _ref.gridRowStart,
    height = _ref.height,
    selectedCellIdx = _ref.selectedCellIdx,
    isRowSelected = _ref.isRowSelected,
    copiedCellIdx = _ref.copiedCellIdx,
    draggedOverCellIdx = _ref.draggedOverCellIdx,
    lastFrozenColumnIndex = _ref.lastFrozenColumnIndex,
    api = _ref.api,
    row = _ref.row,
    selectedCellRowStyle = _ref.selectedCellRowStyle,
    rows = _ref.rows,
    node = _ref.node,
    viewportColumns = _ref.viewportColumns,
    selectedCellEditor = _ref.selectedCellEditor,
    selectedCellDragHandle = _ref.selectedCellDragHandle,
    onRowClick = _ref.onRowClick,
    onRowDoubleClick = _ref.onRowDoubleClick,
    rowClass = _ref.rowClass,
    setDraggedOverRowIdx = _ref.setDraggedOverRowIdx,
    onMouseEnter = _ref.onMouseEnter,
    onRowChange = _ref.onRowChange,
    selectCell = _ref.selectCell,
    totalColumns = _ref.totalColumns,
    subColumn = _ref.subColumn,
    handleReorderRow = _ref.handleReorderRow,
    onCellClick = _ref.onCellClick,
    onCellDoubleClick = _ref.onCellDoubleClick,
    onCellContextMenu = _ref.onCellContextMenu,
    columnApi = _ref.columnApi,
    valueChangedCellStyle = _ref.valueChangedCellStyle,
    previousData = _ref.previousData,
    selectedPosition = _ref.selectedPosition,
    rowFreezLastIndex = _ref.rowFreezLastIndex,
    summaryRowHeight = _ref.summaryRowHeight,
    headerheight = _ref.headerheight,
    expandedMasterIds = _ref.expandedMasterIds,
    onExpandedMasterIdsChange = _ref.onExpandedMasterIdsChange,
    props = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  var handleRowChange = useLatestFunc(function (column, newRow) {
    onRowChange(column, rowIdx, newRow, row);
  });
  function handleDragEnter(event) {
    setDraggedOverRowIdx == null ? void 0 : setDraggedOverRowIdx(rowIdx);
    onMouseEnter == null ? void 0 : onMouseEnter(event);
  }
  className = clsx(rowClassname, "rdg-row-" + (rowIdx % 2 === 0 ? "even" : "odd"), (_clsx = {}, _clsx[rowSelectedClassname] = isRowSelected, _clsx), rowClass == null ? void 0 : rowClass(row), className);
  var cells = [];
  for (var index = 0; index < viewportColumns.length; index++) {
    var column = _extends$1({}, viewportColumns[index], {
      rowIndex: rowIdx
    });
    var idx = column.idx;
    var colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "ROW",
      row: row,
      rowIndex: rowIdx,
      expandedMasterIds: expandedMasterIds
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    var isCellSelected = selectedCellIdx === idx;
    cells.push( /*#__PURE__*/jsx(Cell$1, {
      column: column,
      colSpan: colSpan,
      selectedCellIdx: selectedCellIdx,
      selectedCellEditor: selectedCellEditor,
      api: api,
      viewportColumns: viewportColumns,
      rowArray: rowArray,
      row: row,
      handleReorderRow: handleReorderRow,
      isRowSelected: isRowSelected,
      allrow: rows,
      rowIndex: rowIdx,
      totalColumns: totalColumns,
      node: node,
      isCopied: copiedCellIdx === idx,
      isDraggedOver: draggedOverCellIdx === idx,
      isCellSelected: isCellSelected,
      dragHandle: isCellSelected ? selectedCellDragHandle : undefined,
      onRowClick: onRowClick,
      onRowDoubleClick: onRowDoubleClick,
      onRowChange: handleRowChange,
      subColumn: subColumn,
      selectCell: selectCell,
      onCellClick: onCellClick,
      onCellDoubleClick: onCellDoubleClick,
      onCellContextMenu: onCellContextMenu,
      columnApi: columnApi,
      valueChangedCellStyle: valueChangedCellStyle,
      previousData: previousData,
      summaryRowHeight: summaryRowHeight,
      rowFreezLastIndex: rowFreezLastIndex,
      headerheight: headerheight,
      expandedMasterIds: expandedMasterIds,
      onExpandedMasterIdsChange: onExpandedMasterIdsChange
    }, "" + column.key));
  }
  var style = getRowStyle(gridRowStart, height);
  if (rowIdx === selectedPosition.rowIdx) {
    style = _extends$1({}, style, selectedCellRowStyle);
  }
  return /*#__PURE__*/jsx(DndProvider, {
    backend: HTML5Backend,
    children: /*#__PURE__*/jsx(RowSelectionProvider, {
      value: isRowSelected,
      children: /*#__PURE__*/jsx("div", _extends$1({
        role: "row",
        ref: ref,
        id: (_row$id = row == null ? void 0 : row.id) != null ? _row$id : rowIdx,
        className: className,
        onMouseEnter: handleDragEnter,
        style: style
      }, props, {
        children: cells
      }))
    })
  });
}
var RowComponent = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(Row));
const RowComponent$1 = RowComponent;
function defaultRowRenderer(key, props) {
  return /*#__PURE__*/jsx(RowComponent, _extends$1({}, props), key);
}

function GroupCell({
  id,
  groupKey,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  row,
  groupColumnIndex,
  toggleGroup: toggleGroupWrapper
}) {
  const {
    ref,
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  function toggleGroup() {
    toggleGroupWrapper(id);
  }
  const isLevelMatching = column.rowGroup && groupColumnIndex === column.idx;
  return (
    /*#__PURE__*/
    jsx("div", {
      role: "gridcell",
      "aria-colindex": column.idx + 1,
      "aria-selected": isCellSelected,
      ref: ref,
      tabIndex: tabIndex,
      className: getCellClassname(column),
      style: {
        ...getCellStyle(column),
        cursor: isLevelMatching ? "pointer" : "default"
      },
      onClick: isLevelMatching ? toggleGroup : undefined,
      onFocus: onFocus,
      children: (!column.rowGroup || groupColumnIndex === column.idx) && column.groupFormatter?.({
        groupKey,
        childRows,
        column,
        row,
        isExpanded,
        isCellSelected,
        toggleGroup
      })
    }, column.key)
  );
}
const GroupCell$1 = /*#__PURE__*/memo(GroupCell);

const groupRow = "g1mvu2ep1-0-3";
const groupRowClassname = `rdg-group-row ${groupRow }`;
function GroupedRow({
  id,
  groupKey,
  viewportColumns,
  childRows,
  rowIdx,
  row,
  gridRowStart,
  height,
  level,
  isExpanded,
  selectedCellIdx,
  isRowSelected,
  selectGroup,
  toggleGroup,
  ...props
}) {
  const idx = viewportColumns[0].key === SELECT_COLUMN_KEY ? level + 1 : level;
  function handleSelectGroup() {
    selectGroup(rowIdx);
  }
  return /*#__PURE__*/jsx(RowSelectionProvider, {
    value: isRowSelected,
    children: /*#__PURE__*/jsx("div", {
      role: "row",
      "aria-level": level,
      "aria-expanded": isExpanded,
      className: clsx(rowClassname, groupRowClassname, `rdg-row-groupRow-${rowIdx % 2 === 0 ? "even" : "odd"}`, {
        [rowSelectedClassname]: selectedCellIdx === -1
      }),
      onClick: handleSelectGroup,
      style: getRowStyle(gridRowStart, height),
      ...props,
      children: viewportColumns.map(column => /*#__PURE__*/jsx(GroupCell$1, {
        id: id,
        groupKey: groupKey,
        childRows: childRows,
        isExpanded: isExpanded,
        isCellSelected: selectedCellIdx === column.idx,
        column: column,
        row: row,
        groupColumnIndex: idx,
        toggleGroup: toggleGroup
      }, `${column.key}`))
    }, `${rowIdx}`)
  });
}
const GroupRowRenderer = /*#__PURE__*/memo(GroupedRow);

const summaryCellClassname = "sny5x121-0-3";
function SummaryCell({
  column,
  colSpan,
  row,
  isCellSelected,
  selectCell
}) {
  const {
    ref,
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  const {
    summaryCellClass
  } = column;
  const className = getCellClassname(column, summaryCellClassname, `rdg-summary-column-${column.idx % 2 === 0 ? "even" : "odd"}`, typeof summaryCellClass === "function" ? summaryCellClass(row) : summaryCellClass);
  function onClick() {
    selectCell(row, column);
  }
  return (
    /*#__PURE__*/
    jsx("div", {
      role: "gridcell",
      "aria-colindex": column.idx + 1,
      "aria-colspan": colSpan,
      "aria-selected": isCellSelected,
      ref: ref,
      tabIndex: tabIndex,
      className: className,
      style: getCellStyle(column, colSpan),
      onClick: onClick,
      onFocus: onFocus,
      children: column.summaryFormatter?.({
        column,
        row,
        isCellSelected
      })
    })
  );
}
const SummaryCell$1 = /*#__PURE__*/memo(SummaryCell);

const summaryRow = "s1w3afir1-0-3";
const topSummaryRow = "t1dprx3i1-0-3";
const topSummaryRowBorderClassname = "t14kdlbe1-0-3";
const bottomSummaryRowBorderClassname = "bqiq5671-0-3";
const summaryRowClassname = `rdg-summary-row ${summaryRow}`;
const topSummaryRowClassname = `rdg-top-summary-row ${topSummaryRow}`;
function SummaryRow({
  rowIdx,
  gridRowStart,
  row,
  viewportColumns,
  top,
  bottom,
  lastFrozenColumnIndex,
  selectedCellIdx,
  lastTopRowIdx,
  selectCell,
  "aria-rowindex": ariaRowIndex
}) {
  const cells = [];
  for (let index = 0; index < viewportColumns.length; index++) {
    const column = viewportColumns[index];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "SUMMARY",
      row
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    const isCellSelected = selectedCellIdx === column.idx;
    cells.push( /*#__PURE__*/jsx(SummaryCell$1, {
      column: column,
      colSpan: colSpan,
      row: row,
      isCellSelected: isCellSelected,
      selectCell: selectCell
    }, `${column.key}`));
  }
  const isTop = lastTopRowIdx !== undefined;
  return /*#__PURE__*/jsx("div", {
    role: "row",
    "aria-rowindex": ariaRowIndex,
    className: clsx(rowClassname, `rdg-row-summary-row-${rowIdx % 2 === 0 ? "even" : "odd"}`, summaryRowClassname, {
      [rowSelectedClassname]: selectedCellIdx === -1,
      [topSummaryRowClassname]: isTop,
      [topSummaryRowBorderClassname]: isTop && lastTopRowIdx === rowIdx,
      [bottomSummaryRowBorderClassname]: !isTop && rowIdx === 0,
      "rdg-bottom-summary-row": !isTop
    }),
    style: {
      ...getRowStyle(gridRowStart),
      "--rdg-summary-row-top": top !== undefined ? `${top}px` : undefined,
      "--rdg-summary-row-bottom": bottom !== undefined ? `${bottom}px` : undefined
    },
    children: cells
  }, `${rowIdx}`);
}
const SummaryRow$1 = /*#__PURE__*/memo(SummaryRow);

const cellEditing = "cgu7dq51-0-3";
function EditCell({
  column,
  colSpan,
  row,
  allrow,
  rowIndex,
  onRowChange,
  api,
  node,
  closeEditor,
  handleReorderRow
}) {
  const frameRequestRef = useRef();
  const commitOnOutsideClick = column.editorOptions?.commitOnOutsideClick !== false;
  const commitOnOutsideMouseDown = useLatestFunc(() => {
    onClose(true);
  });
  useEffect(() => {
    if (!commitOnOutsideClick) return;
    function onWindowCaptureMouseDown() {
      frameRequestRef.current = requestAnimationFrame(commitOnOutsideMouseDown);
    }
    addEventListener("mousedown", onWindowCaptureMouseDown, {
      capture: true
    });
    return () => {
      removeEventListener("mousedown", onWindowCaptureMouseDown, {
        capture: true
      });
      cancelFrameRequest();
    };
  }, [commitOnOutsideClick, commitOnOutsideMouseDown]);
  function cancelFrameRequest() {
    cancelAnimationFrame(frameRequestRef.current);
  }
  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
    } else if (event.key === "Enter") {
      event.stopPropagation();
      onClose(true);
    } else {
      const onNavigation = column.editorOptions?.onNavigation ?? onEditorNavigation;
      if (!onNavigation(event)) {
        event.stopPropagation();
      }
    }
  }
  function onClose(commitChanges) {
    if (commitChanges) {
      onRowChange(row, true);
    } else {
      closeEditor();
    }
  }
  const {
    cellClass
  } = column;
  const className = getCellClassname(column, "rdg-editor-container", typeof cellClass === "function" ? cellClass(row) : cellClass, !column.editorOptions?.renderFormatter && cellEditing);
  const [{
    isDragging
  }, drag] = useDrag({
    type: "ROW_DRAG",
    item: {
      index: rowIndex
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  function onRowReorder(fromIndex, toIndex) {
    const newRows = [...allrow];
    newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
    handleReorderRow(newRows);
  }
  const [{
    isOver
  }, drop] = useDrop({
    accept: "ROW_DRAG",
    drop({
      index
    }) {
      onRowReorder(index, rowIndex);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  return /*#__PURE__*/jsxs("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-colspan": colSpan,
    "aria-selected": true,
    className: className,
    style: getCellStyle(column, colSpan),
    onKeyDown: onKeyDown,
    onMouseDownCapture: commitOnOutsideClick ? cancelFrameRequest : undefined,
    children: [column.rowDrag && /*#__PURE__*/jsxs("div", {
      ref: ele => {
        drag(ele);
        drop(ele);
      },
      children: [/*#__PURE__*/jsx("span", {
        style: {
          marginRight: "10px",
          cursor: "grab"
        },
        children: "\u25CA"
      }), (column.cellEditor != null || column.editable === true) && /*#__PURE__*/jsxs(Fragment, {
        children: [column.cellEditor({
          column,
          colDef: column,
          row,
          data: row,
          onRowChange,
          value: row[column.key],
          node,
          valueFormatted: column.valueFormatter,
          allrow,
          rowIndex,
          api,
          onClose
        }), column.editorOptions?.renderFormatter && column.editable !== true && column.formatter({
          colDef: column,
          column,
          data: row,
          row,
          api,
          node,
          value: row[column.key],
          valueFormatted: column.valueFormatter,
          onRowChange,
          isCellSelected: true
        }), column.editable && column.formatter({
          colDef: column,
          column,
          data: row,
          row,
          api,
          node,
          value: row[column.key],
          valueFormatted: column.valueFormatter,
          onRowChange,
          isCellSelected: true
        })]
      })]
    }), (column.cellEditor != null || column.editable === true) && !column.rowDrag && /*#__PURE__*/jsxs(Fragment, {
      children: [column.cellEditor({
        column,
        colDef: column,
        row,
        data: row,
        onRowChange,
        value: row[column.key],
        node,
        valueFormatted: column.valueFormatter,
        allrow,
        rowIndex,
        api,
        onClose
      }), column.editorOptions?.renderFormatter && column.editable !== true && column.formatter({
        colDef: column,
        column,
        data: row,
        row,
        api,
        node,
        value: row[column.key],
        valueFormatted: column.valueFormatter,
        onRowChange,
        isCellSelected: true
      }), column.editable && column.formatter({
        colDef: column,
        column,
        data: row,
        row,
        api,
        node,
        value: row[column.key],
        valueFormatted: column.valueFormatter,
        onRowChange,
        isCellSelected: true
      })]
    })]
  });
}

const cellDragHandle = "c1iurj8s1-0-3";
const cellDragHandleClassname = `rdg-cell-drag-handle ${cellDragHandle}`;
function DragHandle({
  rows,
  columns,
  selectedPosition,
  latestDraggedOverRowIdx,
  isCellEditable,
  onRowsChange,
  onFill,
  setDragging,
  setDraggedOverRowIdx
}) {
  function handleMouseDown(event) {
    if (event.buttons !== 1) return;
    setDragging(true);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseup", onMouseUp);
    function onMouseOver(event) {
      if (event.buttons !== 1) onMouseUp();
    }
    function onMouseUp() {
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseup", onMouseUp);
      setDragging(false);
      handleDragEnd();
    }
  }
  function handleDragEnd() {
    const overRowIdx = latestDraggedOverRowIdx.current;
    if (overRowIdx === undefined) return;
    const {
      rowIdx
    } = selectedPosition;
    const startRowIndex = rowIdx < overRowIdx ? rowIdx + 1 : overRowIdx;
    const endRowIndex = rowIdx < overRowIdx ? overRowIdx + 1 : rowIdx;
    updateRows(startRowIndex, endRowIndex);
    setDraggedOverRowIdx(undefined);
  }
  function handleDoubleClick(event) {
    event.stopPropagation();
    updateRows(selectedPosition.rowIdx + 1, rows.length);
  }
  function updateRows(startRowIdx, endRowIdx) {
    const {
      idx,
      rowIdx
    } = selectedPosition;
    const column = columns[idx];
    const sourceRow = rows[rowIdx];
    const updatedRows = [...rows];
    const indexes = [];
    for (let i = startRowIdx; i < endRowIdx; i++) {
      if (isCellEditable({
        rowIdx: i,
        idx
      })) {
        const updatedRow = onFill({
          columnKey: column.key,
          sourceRow,
          targetRow: rows[i]
        });
        if (updatedRow !== rows[i]) {
          updatedRows[i] = updatedRow;
          indexes.push(i);
        }
      }
    }
    if (indexes.length > 0) {
      onRowsChange?.(updatedRows, {
        indexes,
        column
      });
    }
  }
  return /*#__PURE__*/jsx("div", {
    className: cellDragHandleClassname,
    onMouseDown: handleMouseDown,
    onDoubleClick: handleDoubleClick
  });
}

const arrow = "adro4ad1-0-3";
const arrowClassname = `rdg-sort-arrow ${arrow}`;
function sortStatus({
  sortDirection,
  priority
}) {
  return /*#__PURE__*/jsxs(Fragment, {
    children: [sortIcon({
      sortDirection
    }), sortPriority({
      priority
    })]
  });
}
function sortIcon({
  sortDirection
}) {
  if (sortDirection === undefined) return null;
  return /*#__PURE__*/jsx("svg", {
    "data-testid": "sortIcon",
    viewBox: "0 0 12 8",
    width: "12",
    height: "8",
    className: arrowClassname,
    "aria-hidden": true,
    children: /*#__PURE__*/jsx("path", {
      d: sortDirection === "ASC" ? "M0 8 6 0 12 8" : "M0 0 6 8 12 0"
    })
  });
}
function sortPriority({
  priority
}) {
  return priority;
}

function CSVContent(fileData, columns) {
  const field = columns?.map(ele => ele.field);
  const header = columns?.map(ele => ele.headerName);
  const data = fileData.map(f => {
    let sample = [];
    field.map(d => {
      if (d !== undefined) {
        sample.push(f[d]);
      } else {
        sample.push("");
      }
    });
    if (sample.length > 0) {
      return sample;
    }
  });
  const content = [header, ...data].map(cells => cells.map(serialiseCellValue).join(",")).join("\n");
  return content;
}
async function exportToCsv(fileData, columns, fileName) {
  downloadFile(fileName, new Blob([CSVContent(fileData, columns)], {
    type: "text/csv;charset=utf-8;"
  }));
}
async function exportToPdf(fileData, columns, fileName) {
  let field = [];
  columns?.map(ele => {
    if (ele.field) {
      field.push({
        dataKey: ele.field,
        header: ele.headerName
      });
    }
  });
  let doc = new jsPDF("p", "pt", "letter");
  autoTable(doc, {
    margin: {
      top: 10
    },
    styles: {
      cellWidth: "wrap",
      overflow: "visible",
      halign: "center",
      lineColor: "white",
      lineWidth: 0.5,
      fontSize: 11
    },
    alternateRowStyles: {
      fillColor: "#e5edf8"
    },
    bodyStyles: {
      fillColor: "#f3f8fc"
    },
    headStyles: {
      fillColor: "#16365D",
      textColor: "white",
      halign: "center",
      lineColor: "White",
      lineWidth: 0.5,
      fontSize: 11
    },
    body: fileData,
    theme: "striped",
    columns: field
  });
  doc.save(fileName);
}
function exportToXlsx(fileData, columns, fileName) {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.json_to_sheet(fileData);
  const wb = {
    Sheets: {
      data: ws
    },
    SheetNames: ["data"]
  };
  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array"
  });
  const data = new Blob([excelBuffer], {
    type: fileType
  });
  FileSaver.saveAs(data, fileName + fileExtension);
}
function serialiseCellValue(value) {
  if (typeof value === "string") {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(",") ? `"${formattedValue}"` : formattedValue;
  }
  return value;
}
function downloadFile(fileName, data) {
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;
  const url = URL.createObjectURL(data);
  downloadLink.href = url;
  downloadLink.click();
  URL.revokeObjectURL(url);
}

function useCalculatedColumnswithIdx({
  rowData1
}) {
  const {
    columns4
  } = useMemo(() => {
    var columns4 = rowData1.map((rawColumn, pos) => {
      const column = {
        ...rawColumn
      };
      column.idx = pos;
      if (rawColumn.editable) {
        column.cellEditor = column.cellEditor ? column.cellEditor : props => {
          let value = props.row[props.column.key];
          return /*#__PURE__*/jsx("input", {
            className: TextEditor,
            value: value,
            onChange: event => props.onRowChange({
              ...props.row,
              [props.column.key]: event.target.value
            })
          });
        };
      }
      return column;
    });
    return {
      columns4
    };
  }, [rowData1]);
  return {
    columns4
  };
}

const DEFAULT_COLUMN_WIDTH = "auto";
const DEFAULT_COLUMN_MIN_WIDTH = 40;
function useCalculatedRowColumns({
  columns4,
  defaultColumnOptions,
  rawGroupBy,
  frameworkComponents,
  colSpanColumns
}) {
  const defaultWidth = defaultColumnOptions?.width ?? DEFAULT_COLUMN_WIDTH;
  const defaultMinWidth = defaultColumnOptions?.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH;
  const defaultMaxWidth = defaultColumnOptions?.maxWidth ?? undefined;
  const defaultFormatter = defaultColumnOptions?.formatter ?? valueFormatter;
  const defaultSortable = defaultColumnOptions?.sortable ?? false;
  const defaultResizable = defaultColumnOptions?.resizable ?? false;
  const defaultFilter = defaultColumnOptions?.dilter ?? false;
  const {
    columns5
  } = useMemo(() => {
    const groupBy = [];
    let lastFrozenColumnIndex = -1;
    const columns5 = columns4?.map((rawColumn, pos) => {
      const rowGroup = rawGroupBy?.includes(rawColumn.field) ?? false;
      const frozen = rowGroup || rawColumn.frozen;
      const cellRendererValue = rawColumn.cellRenderer;
      const components = frameworkComponents ? Object.keys(frameworkComponents) : null;
      const indexOfComponent = components?.indexOf(cellRendererValue);
      const customComponentName = indexOfComponent > -1 ? components[indexOfComponent] : null;
      const column = {
        ...rawColumn,
        key: rawColumn.field,
        parent: null,
        idx: 0,
        frozen,
        isLastFrozenColumn: false,
        rowGroup,
        width: rawColumn.width ?? defaultWidth,
        minWidth: rawColumn.minWidth ?? defaultMinWidth,
        maxWidth: rawColumn.maxWidth ?? defaultMaxWidth,
        sortable: rawColumn.sortable ?? defaultSortable,
        resizable: rawColumn.resizable ?? defaultResizable,
        formatter: rawColumn.cellRenderer ? rawColumn.cellRenderer : rawColumn.valueFormatter ?? defaultFormatter,
        filter: rawColumn.filter ?? defaultFilter,
        cellRenderer: frameworkComponents?.[customComponentName] ?? rawColumn.cellRenderer ?? rawColumn.valueFormatter ?? defaultFormatter
      };
      if (rowGroup) {
        column.groupFormatter ??= toggleGroupFormatter;
      }
      if (rawColumn.editable) {
        column.cellEditor = column.cellEditor ? column.cellEditor : props => {
          return /*#__PURE__*/jsx("input", {
            className: textEditorClassname,
            value: props.row[props.column.key],
            onChange: event => props.onRowChange({
              ...props.row,
              [props.column.key]: event.target.value
            })
          });
        };
      }
      return column;
    });
    return {
      columns5,
      colSpanColumns,
      lastFrozenColumnIndex,
      groupBy
    };
  }, [columns4, defaultWidth, defaultMinWidth, defaultMaxWidth, defaultFormatter, defaultResizable, defaultSortable, rawGroupBy]);
  return {
    columns5
  };
}

function useCalculatedColumnsWithTopHeader({
  raawColumns
}) {
  const {
    columns3
  } = useMemo(() => {
    const columns3 = raawColumns.map((raawColumn, pos) => {
      var recursiveChild = (subChild, raawColumn) => {
        return subChild.haveChildren === true && subChild?.children.map((subChild2, index1) => {
          const rawChild2 = {
            ...subChild2,
            topHeader: raawColumn.field,
            children: recursiveChild(subChild2, raawColumn)
          };
          return rawChild2;
        });
      };
      const column = {
        ...raawColumn,
        topHeader: raawColumn.field,
        haveChildren: raawColumn.children ? true : false,
        children: raawColumn.haveChildren === true && raawColumn?.children.map((child, index1) => {
          const rawChild = {
            ...child,
            topHeader: raawColumn.field,
            children: child.haveChildren === true && child?.children.map((subChild, index2) => {
              const rawChild1 = {
                ...subChild,
                topHeader: raawColumn.field,
                children: recursiveChild(subChild, raawColumn)
              };
              return rawChild1;
            })
          };
          return rawChild;
        })
      };
      return column;
    });
    return {
      columns3
    };
  }, [raawColumns]);
  return {
    columns3
  };
}

function MasterCell({
  id,
  isExpanded,
  isCellSelected,
  column,
  row,
  colSpan,
  treeColumnIndex,
  toggleMaster: toggleMasterWrapper,
  selection,
  serialNumber,
  viewportColumns,
  allrow,
  selectedCellIdx,
  selectedCellEditor,
  apiObject,
  onRowChange,
  node,
  rowIndex,
  isRowSelected,
  selectCell,
  valueChangedCellStyle,
  ...props
}) {
  const {
    ref,
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  function toggleMaster() {
    toggleMasterWrapper(id);
  }
  let style = getCellStyle(column, colSpan, row);
  const gridCell = useRef(null);
  const cellRendererParams = typeof column?.cellRendererParams === "function" ? column?.cellRendererParams() : column?.cellRendererParams;
  const [value, setValue] = useState(cellRendererParams?.value ?? row[column.key]);
  function handleClick(e) {
    selectCell(row, column);
    props.onRowClick?.({
      api: props.api,
      data: row,
      columnApi: props.columnApi,
      node: node,
      rowIndex: rowIndex,
      type: "rowClicked",
      event: e
    });
    props.onCellClick?.({
      api: props.api,
      colDef: {
        field: column.field,
        resizable: column.resizable ?? undefined,
        sortable: column.sortable ?? undefined,
        width: column.width
      },
      data: row,
      node: node,
      columnApi: props.columnApi,
      rowIndex: rowIndex,
      value: row[column.field] ?? undefined,
      type: "cellClicked",
      event: e
    });
  }
  function handleRowChange(newRow) {
    onRowChange(column, rowIndex, newRow, row);
  }
  const {
    cellClass
  } = column;
  const topRow = rowIndex === 0 && isRowSelected ? true : false;
  const bottomRow = rowIndex === allrow.length - 1 && isRowSelected ? true : false;
  const middleRow = !(topRow || bottomRow) && isRowSelected ? true : false;
  const className = getCellClassname(column, `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`, typeof cellClass === "function" ? cellClass(row) : cellClass, middleRow && rowIsSelectedClassName, topRow && topRowIsSelectedClassName, bottomRow && bottomRowIsSelectedClassName, row.gridRowType === "Detail" && "rdg-cell-detail");
  return (
    /*#__PURE__*/
    jsxs("div", {
      role: "gridcell",
      "aria-colindex": column.idx + 1,
      "aria-selected": isCellSelected,
      ref: ref,
      tabIndex: tabIndex,
      className: className,
      style: style,
      onClick: handleClick,
      onFocus: onFocus,
      children: [column.idx > 0 && row.gridRowType !== "Detail" && column.cellRenderer?.({
        column,
        row,
        isExpanded,
        isCellSelected,
        toggleMaster,
        colDef: column,
        viewportColumns,
        data: row,
        allrow,
        selectedCellIdx,
        selectedCellEditor,
        api: apiObject,
        node,
        value,
        rowIndex,
        selectCell,
        onRowChange: handleRowChange,
        onRowClick: props.onRowClick,
        onRowDoubleClick: props.onRowDoubleClick,
        valueFormatted: cellRendererParams?.valueFormatted,
        fullWidth: cellRendererParams?.fullWidth,
        eGridCell: gridCell.current,
        refreshCell: () => {
          const content = document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML;
          document.getElementById(`${rowIndex}${row[column.key]}`).innerHTML = content;
        },
        getValue: () => value,
        setValue: newValue => {
          setValue(newValue);
        },
        ...cellRendererParams
      }), column.idx === 0 && row.gridRowType !== "Detail" && /*#__PURE__*/jsx(Fragment, {
        children: /*#__PURE__*/jsx("span", {
          className: "tree-expand-icon",
          "data-testid": `tree-expand-icon-${rowIndex}`,
          style: {
            color: "black",
            fontSize: "12px",
            cursor: "pointer",
            textAlign: "center"
          },
          onClick: toggleMaster,
          children: isExpanded ? "\u25BC" : "\u25B6"
        })
      }), row.gridRowType === "Detail" && column.detailsGrid && column.detailsGrid({
        row,
        rowIndex,
        column,
        isExpanded,
        isCellSelected,
        toggleMaster,
        colDef: column,
        viewportColumns,
        allrow,
        selectedCellIdx,
        selectedCellEditor,
        api: apiObject,
        node
      })]
    }, column.key)
  );
}
const MasterCell$1 = /*#__PURE__*/memo(MasterCell);

const MasterRow = /*#__PURE__*/forwardRef(({
  id,
  viewportColumns,
  className,
  rowIdx,
  row,
  level,
  selection,
  gridRowStart,
  columnApi,
  height,
  isExpanded,
  selectedCellIdx,
  isRowSelected,
  selectGroup,
  serialNumber,
  toggleMaster,
  rowArray,
  sourceData,
  childRows,
  treeData,
  apiObject,
  selectTree,
  valueChangedCellStyle,
  onRowClick,
  onRowDoubleClick,
  onCellClick,
  onCellContextMenu,
  onCellDoubleClick,
  rowClass,
  handleRowChange,
  selectCell,
  selectedCellEditor,
  node,
  allrow,
  lastFrozenColumnIndex,
  expandedMasterRowIds,
  ...props
}, ref) => {
  let style = getRowStyle(gridRowStart, height);
  const cells = [];
  for (let index = 0; index < viewportColumns.length; index++) {
    const column = {
      ...viewportColumns[index],
      rowIndex: rowIdx
    };
    const {
      idx
    } = column;
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "ROW",
      row,
      rowIndex: rowIdx,
      expandedMasterIds: expandedMasterRowIds
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    cells.push( /*#__PURE__*/jsx(MasterCell$1, {
      id: id,
      childRows: row.children,
      isExpanded: isExpanded,
      isCellSelected: selectedCellIdx === column.idx,
      column: column,
      colSpan: colSpan,
      row: row,
      apiObject: apiObject,
      groupColumnIndex: idx,
      toggleMaster: toggleMaster,
      selection: selection,
      serialNumber: serialNumber,
      allrow: allrow,
      rowIndex: rowIdx,
      viewportColumns: viewportColumns,
      node: node,
      onRowClick: onRowClick,
      onRowChange: handleRowChange,
      onCellClick: onCellClick,
      onCellDoubleClick: onCellDoubleClick,
      onCellContextMenu: onCellContextMenu,
      onRowDoubleClick: onRowDoubleClick,
      columnApi: columnApi,
      selectTree: selectTree,
      isRowSelected: isRowSelected,
      selectCell: selectCell,
      selectedCellEditor: selectedCellEditor,
      valueChangedCellStyle: valueChangedCellStyle,
      treeData: treeData
    }, `${column.key}`));
  }
  return /*#__PURE__*/jsx(RowSelectionProvider, {
    value: isRowSelected,
    children: /*#__PURE__*/jsx("div", {
      role: "row",
      id: row?.id ?? rowIdx,
      ref: ref,
      "aria-level": level,
      "aria-expanded": isExpanded,
      className: clsx$1(`rdg-row-${rowIdx % 2 === 0 ? "even" : "odd"} rdg-row-${row.gridRowType === "Detail" ? "detail" : "master"}`, rowClassname, rowClass?.(row), className, isRowSelected && rowSelectedClassname),
      style: style,
      ...props,
      children: cells
    }, `${rowIdx}`)
  });
});
const MasterRowRenderer = /*#__PURE__*/memo(MasterRow);

var _excluded = ["columnData", "rowData", "topSummaryRows", "bottomSummaryRows", "onRowsChange", "rowHeight", "headerRowHeight", "summaryRowHeight", "selectedRows", "onSelectedRowsChange", "defaultColumnOptions", "groupBy", "expandedGroupIds", "onExpandedGroupIdsChange", "onRowClicked", "onRowDoubleClicked", "selectedCellHeaderStyle", "onScroll", "onColumnResize", "onFill", "serialNumber", "rowSelection", "onCopy", "onPaste", "selectedCellRowStyle", "onCellClicked", "onCellDoubleClicked", "onCellContextMenu", "cellNavigationMode", "enableVirtualization", "renderers", "className", "showSelectedRows", "style", "rowClass", "direction", "getContextMenuItems", "aria-label", "aria-labelledby", "aria-describedby", "testId", "columnReordering", "pagination", "paginationPageSize", "suppressPaginationPanel", "paginationAutoPageSize", "defaultPage", "frameworkComponents", "onGridReady", "valueChangedCellStyle", "rowFreezLastIndex", "innerRef", "onExpandedMasterIdsChange"];
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var initialPosition = {
  idx: -1,
  rowIdx: -2,
  mode: "SELECT"
};
function DataGrid(props) {
  var _raawColumns, _ref, _renderers$rowRendere, _ref2, _renderers$sortStatus, _ref3, _renderers$checkboxFo, _renderers$noRowsFall, _props$expandedTreeId, _props$expandedMaster, _flattedColumns, _topSummaryRows$lengt, _bottomSummaryRows$le, _document$getElementB, _props$restriction3, _props$restriction4, _clsx, _clsx2;
  var raawColumns = props.columnData,
    raawRows = props.rowData,
    topSummaryRows = props.topSummaryRows,
    bottomSummaryRows = props.bottomSummaryRows,
    onRowsChange = props.onRowsChange,
    rawRowHeight = props.rowHeight,
    rawHeaderRowHeight = props.headerRowHeight,
    rawSummaryRowHeight = props.summaryRowHeight,
    selectedRows = props.selectedRows,
    onSelectedRowsChange = props.onSelectedRowsChange,
    defaultColumnOptions = props.defaultColumnOptions,
    raawGroupBy = props.groupBy,
    expandedGroupIds = props.expandedGroupIds,
    onExpandedGroupIdsChange = props.onExpandedGroupIdsChange,
    onRowClick = props.onRowClicked,
    onRowDoubleClick = props.onRowDoubleClicked,
    selectedCellHeaderStyle = props.selectedCellHeaderStyle,
    onScroll = props.onScroll,
    onColumnResize = props.onColumnResize,
    onFill = props.onFill,
    serialNumber = props.serialNumber,
    rowSelection = props.rowSelection,
    onCopy = props.onCopy,
    onPaste = props.onPaste,
    selectedCellRowStyle = props.selectedCellRowStyle,
    onCellClick = props.onCellClicked,
    onCellDoubleClick = props.onCellDoubleClicked,
    onCellContextMenu = props.onCellContextMenu,
    rawCellNavigationMode = props.cellNavigationMode,
    rawEnableVirtualization = props.enableVirtualization,
    renderers = props.renderers,
    className = props.className,
    showSelectedRows = props.showSelectedRows,
    style = props.style,
    rowClass = props.rowClass,
    rawDirection = props.direction,
    getContextMenuItems = props.getContextMenuItems,
    ariaLabel = props["aria-label"],
    ariaLabelledBy = props["aria-labelledby"],
    ariaDescribedBy = props["aria-describedby"],
    testId = props.testId,
    columnReordering = props.columnReordering,
    tablePagination = props.pagination,
    paginationPageSize = props.paginationPageSize,
    suppressPaginationPanel = props.suppressPaginationPanel,
    paginationAutoPageSize = props.paginationAutoPageSize,
    defaultPage = props.defaultPage,
    frameworkComponents = props.frameworkComponents,
    onGridReady = props.onGridReady,
    valueChangedCellStyle = props.valueChangedCellStyle,
    rowFreezLastIndex = props.rowFreezLastIndex,
    innerRef = props.innerRef,
    onExpandedMasterIdsChange = props.onExpandedMasterIdsChange,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  var _useState = useState(),
    selectedRows1 = _useState[0],
    onSelectedRowsChange1 = _useState[1];
  selectedRows = selectedRows ? selectedRows : [];
  var selection = rest.selection && SelectColumn;
  if (rest.selection && serialNumber) {
    raawColumns = [SerialNumberColumn].concat(raawColumns);
    raawColumns = [selection].concat(raawColumns);
  } else if (rest.selection && !serialNumber) {
    raawColumns = [selection].concat(raawColumns);
  } else if (!rest.selection && serialNumber) {
    raawColumns = [SerialNumberColumn].concat(raawColumns);
  }
  var rowKeyGetter = props.rowKeyGetter ? props.rowKeyGetter : function (row) {
    return row.id;
  };
  var contextMenuItems = getContextMenuItems !== undefined ? getContextMenuItems() : [];
  var _useState2 = useState(),
    contextData = _useState2[0],
    setContextData = _useState2[1];
  function contextMenuRowRenderer(key, props) {
    return /*#__PURE__*/jsx(ContextMenuTrigger, {
      id: "grid-context-menu",
      collect: function collect() {
        setContextData(props);
      },
      children: /*#__PURE__*/jsx(RowComponent$1, _extends$1({}, props))
    }, key);
  }
  var _useState3 = useState();
    _useState3[0];
    var setHeaderHeightFromRef = _useState3[1];
  var depth = function depth(d) {
    return function (o) {
      o.depth = d;
      (o.children || []).forEach(depth(d + 1));
    };
  };
  raawColumns.forEach(depth(0));
  var cloneRaawColumns1 = raawColumns.slice();
  var getArrayDepth = function getArrayDepth(arr) {
    var _arr$children;
    if (Array.isArray(arr)) {
      return 1 + Math.max.apply(Math, arr.map(getArrayDepth));
    }
    if ((_arr$children = arr.children) != null && _arr$children.length) {
      return 1 + Math.max.apply(Math, arr.children.map(getArrayDepth));
    }
    return 0;
  };
  var arrayDepth = getArrayDepth(cloneRaawColumns1);
  var singleHeaderRowHeight = rawHeaderRowHeight ? rawHeaderRowHeight : 24;
  var headerheight = singleHeaderRowHeight * arrayDepth;
  var enableFilter = (_raawColumns = raawColumns) == null ? void 0 : _raawColumns.map(function (i) {
    return i.filter === true && i.depth === arrayDepth - 1;
  }).includes(true);
  var defaultComponents = useDefaultComponents();
  var rowHeight = rawRowHeight != null ? rawRowHeight : 24;
  var headerRowHeight = headerheight;
  var summaryRowHeight = rawSummaryRowHeight != null ? rawSummaryRowHeight : typeof rowHeight === "number" ? rowHeight : 24;
  var rowRenderer = contextMenuItems.length > 0 ? contextMenuRowRenderer : (_ref = (_renderers$rowRendere = renderers == null ? void 0 : renderers.rowRenderer) != null ? _renderers$rowRendere : defaultComponents == null ? void 0 : defaultComponents.rowRenderer) != null ? _ref : defaultRowRenderer;
  var sortStatus$1 = (_ref2 = (_renderers$sortStatus = renderers == null ? void 0 : renderers.sortStatus) != null ? _renderers$sortStatus : defaultComponents == null ? void 0 : defaultComponents.sortStatus) != null ? _ref2 : sortStatus;
  var checkboxFormatter$1 = (_ref3 = (_renderers$checkboxFo = renderers == null ? void 0 : renderers.checkboxFormatter) != null ? _renderers$checkboxFo : defaultComponents == null ? void 0 : defaultComponents.checkboxFormatter) != null ? _ref3 : checkboxFormatter;
  var noRowsFallback = (_renderers$noRowsFall = renderers == null ? void 0 : renderers.noRowsFallback) != null ? _renderers$noRowsFall : defaultComponents == null ? void 0 : defaultComponents.noRowsFallback;
  var cellNavigationMode = rawCellNavigationMode != null ? rawCellNavigationMode : "NONE";
  var enableVirtualization = rawEnableVirtualization != null ? rawEnableVirtualization : true;
  var direction = rawDirection != null ? rawDirection : "ltr";
  var _useState4 = useState([]),
    afterFilter = _useState4[0],
    setAfterFilter = _useState4[1];
  var _useState5 = useState([]),
    afterSort = _useState5[0],
    setAfterSort = _useState5[1];
  var _useState6 = useState(defaultColumnOptions),
    defaultColumnDef = _useState6[0],
    setDefaultColumnDef = _useState6[1];
  var _useState7 = useState(raawGroupBy),
    rawGroupBy = _useState7[0],
    setRawGroupBy = _useState7[1];
  var _useState8 = useState(null),
    expandAll = _useState8[0],
    setExpandAll = _useState8[1];
  useUpdateEffect$1(function () {
    setRawColumns(raawColumns);
  }, [props.columnData]);
  useUpdateEffect$1(function () {
    setExpandAll(null);
  }, [raawGroupBy, expandedGroupIds]);
  useUpdateEffect$1(function () {
    setRawGroupBy(raawGroupBy);
  }, [raawGroupBy]);
  var _useCalculatedColumns = useCalculatedColumnsWithTopHeader({
      raawColumns: raawColumns
    }),
    columns3 = _useCalculatedColumns.columns3;
  var _useState9 = useState(0),
    scrollTop = _useState9[0],
    setScrollTop = _useState9[1];
  var _useState10 = useState(0),
    scrollLeft = _useState10[0],
    setScrollLeft = _useState10[1];
  var _useState11 = useState(function () {
      return new Map();
    }),
    columnWidths = _useState11[0],
    setColumnWidths = _useState11[1];
  var _useState12 = useState(initialPosition),
    selectedPosition = _useState12[0],
    setSelectedPosition = _useState12[1];
  var _useState13 = useState(null),
    copiedCell = _useState13[0],
    setCopiedCell = _useState13[1];
  var _useState14 = useState(false),
    isDragging = _useState14[0],
    setDragging = _useState14[1];
  var _useState15 = useState(undefined),
    draggedOverRowIdx = _useState15[0],
    setOverRowIdx = _useState15[1];
  var _useState16 = useState([]),
    sortColumns = _useState16[0],
    setSortColumns = _useState16[1];
  var _useState17 = useState(raawRows),
    rawRows = _useState17[0],
    setRawRows = _useState17[1];
  var _useState18 = useState(columns3),
    rawColumns = _useState18[0],
    setRawColumns = _useState18[1];
  var _useState19 = useState(tablePagination),
    pagination = _useState19[0],
    _setPagination = _useState19[1];
  var _useState20 = useState(suppressPaginationPanel != null ? suppressPaginationPanel : false),
    suppressPagination = _useState20[0];
    _useState20[1];
  var _useState21 = useState(paginationPageSize != null ? paginationPageSize : 20),
    size = _useState21[0],
    setSize = _useState21[1];
  var _useState22 = useState(defaultPage != null ? defaultPage : 1),
    current = _useState22[0],
    setCurrent = _useState22[1];
  var _useState23 = useState((_props$expandedTreeId = props.expandedTreeIds) != null ? _props$expandedTreeId : []),
    expandedTreeIds = _useState23[0],
    setExpandedTreeIds = _useState23[1];
  var _useState24 = useState((_props$expandedMaster = props.expandedMasterRowIds) != null ? _props$expandedMaster : []),
    expandedMasterRowIds = _useState24[0],
    setExpandedMasterIds = _useState24[1];
  useUpdateEffect$1(function () {
    setExpandedMasterIds(props.expandedMasterRowIds);
  }, [props.expandedMasterRowIds]);
  var PaginationChange = function PaginationChange(page, pageSize) {
    setCurrent(page);
    setSize(pageSize);
  };
  var PrevNextArrow = function PrevNextArrow(type, originalElement) {
    if (type === "prev") {
      return /*#__PURE__*/jsx("button", {
        title: "Previous",
        "data-testid": "pagination-prev",
        children: /*#__PURE__*/jsx("i", {
          className: "fa fa-angle-double-left"
        })
      });
    }
    if (type === "next") {
      return /*#__PURE__*/jsx("button", {
        title: "Next",
        "data-testid": "pagination-next",
        children: /*#__PURE__*/jsx("i", {
          className: "fa fa-angle-double-right"
        })
      });
    }
    return originalElement;
  };
  var PerPageChange = function PerPageChange(value) {
    setSize(value);
    var newPerPage = Math.ceil(rawRows.length / value);
    if (current > newPerPage) {
      setCurrent(newPerPage);
    }
  };
  var onSortColumnsChange = function onSortColumnsChange(sortColumns) {
    setSortColumns(sortColumns.slice(-1));
  };
  var flattedColumns;
  var flat = function flat(rawColumns) {
    return function (o) {
      return o.children ? o.children.flatMap(flat(rawColumns || o.headerName)) : _extends$1({}, o, {
        rawColumns: rawColumns
      });
    };
  };
  var response = rawColumns;
  flattedColumns = response.flatMap(flat());
  var defaultFilters = {};
  (_flattedColumns = flattedColumns) == null ? void 0 : _flattedColumns.map(function (i) {
    return defaultFilters[i.field] = "";
  });
  rawColumns == null ? void 0 : rawColumns.map(function (i) {
    return defaultFilters[i.key] = "";
  });
  var subColumn = [];
  var _useState25 = useState(_extends$1({}, defaultFilters, {
      enabled: true
    })),
    filters = _useState25[0],
    setFilters = _useState25[1];
  var _useState26 = useState("Contain"),
    filterType = _useState26[0],
    setFilterType = _useState26[1];
  var _useState27 = useState(false),
    suppressRowClickSelection = _useState27[0],
    _setSuppressRowClickSelection = _useState27[1];
  var ChildColumnSetup = function ChildColumnSetup(value) {
    subColumn.push(value);
  };
  var filterFunction = useCallback(function (props) {
    if (filterType === "Contain") {
      return raawRows == null ? void 0 : raawRows.filter(function (val) {
        for (var _iterator = _createForOfIteratorHelperLoose(props), _step; !(_step = _iterator()).done;) {
          var _val$element$;
          var element = _step.value;
          var _value = typeof val[element[0]] !== "string" ? (_val$element$ = val[element[0]]) == null ? void 0 : _val$element$.toString() : val[element[0]];
          if (_value && !_value.toLowerCase().includes(element[1].toLowerCase())) return false;
        }
        return true;
      });
    } else if (filterType === "Starts With...") {
      return raawRows == null ? void 0 : raawRows.filter(function (val) {
        for (var _iterator2 = _createForOfIteratorHelperLoose(props), _step2; !(_step2 = _iterator2()).done;) {
          var _val$element$2;
          var element = _step2.value;
          var _value2 = typeof val[element[0]] !== "string" ? (_val$element$2 = val[element[0]]) == null ? void 0 : _val$element$2.toString() : val[element[0]];
          if (_value2 && !_value2.toLowerCase().startsWith(element[1].toLowerCase())) return false;
        }
        return true;
      });
    } else if (filterType === "Ends With...") {
      return raawRows == null ? void 0 : raawRows.filter(function (val) {
        for (var _iterator3 = _createForOfIteratorHelperLoose(props), _step3; !(_step3 = _iterator3()).done;) {
          var _val$element$3;
          var element = _step3.value;
          var _value3 = typeof val[element[0]] !== "string" ? (_val$element$3 = val[element[0]]) == null ? void 0 : _val$element$3.toString() : val[element[0]];
          if (_value3 && !_value3.toLowerCase().endsWith(element[1].toLowerCase())) return false;
        }
        return true;
      });
    } else if (filterType === "Equals") {
      return raawRows == null ? void 0 : raawRows.filter(function (val) {
        for (var _iterator4 = _createForOfIteratorHelperLoose(props), _step4; !(_step4 = _iterator4()).done;) {
          var _val$element$4;
          var element = _step4.value;
          var _value4 = typeof val[element[0]] !== "string" ? (_val$element$4 = val[element[0]]) == null ? void 0 : _val$element$4.toString() : val[element[0]];
          if (_value4 && _value4.toLowerCase() !== element[1].toLowerCase()) {
            return false;
          }
        }
        return true;
      });
    } else if (filterType === "Not Equals") {
      return raawRows == null ? void 0 : raawRows.filter(function (val) {
        for (var _iterator5 = _createForOfIteratorHelperLoose(props), _step5; !(_step5 = _iterator5()).done;) {
          var _val$element$5;
          var element = _step5.value;
          var _value5 = typeof val[element[0]] !== "string" ? (_val$element$5 = val[element[0]]) == null ? void 0 : _val$element$5.toString() : val[element[0]];
          if (_value5 && _value5.toLowerCase() === element[1].toLowerCase()) {
            return false;
          }
        }
        return true;
      });
    }
  }, [filterType, raawRows]);
  var sortedRows = useMemo(function () {
    var _sortedRows;
    var asArray = Object.entries(filters);
    var keys = asArray.filter(function (_ref4) {
      _ref4[0];
        var value = _ref4[1];
      return value.length > 0;
    });
    var filteredRows = filterFunction(keys);
    if (sortColumns.length === 0) return filteredRows;
    var _sortColumns$ = sortColumns[0],
      columnKey = _sortColumns$.columnKey,
      direction = _sortColumns$.direction;
    var sortedRows = filteredRows;
    sortedRows = (_sortedRows = sortedRows) == null ? void 0 : _sortedRows.sort(function (a, b) {
      var _a$columnKey;
      return typeof a[columnKey] === "number" ? a[columnKey] - b[columnKey] : (_a$columnKey = a[columnKey]) == null ? void 0 : _a$columnKey.localeCompare(b[columnKey]);
    });
    return direction === "DESC" ? sortedRows.reverse() : sortedRows;
  }, [raawRows, sortColumns, filters]);
  useUpdateEffect$1(function () {
    return setRawRows(sortedRows);
  }, [sortedRows]);
  var handleReorderColumn = function handleReorderColumn(value) {
    if (columnReordering) {
      setRawColumns(value);
    }
  };
  var handleReorderRow = function handleReorderRow(value) {
    return setRawRows(value);
  };
  var prevSelectedPosition = useRef(selectedPosition);
  var latestDraggedOverRowIdx = useRef(draggedOverRowIdx);
  var lastSelectedRowIdx = useRef(-1);
  var rowRef = useRef(null);
  var _useGridDimensions = useGridDimensions(),
    gridRef = _useGridDimensions[0],
    gridWidth = _useGridDimensions[1],
    gridHeight = _useGridDimensions[2],
    isWidthInitialized = _useGridDimensions[3];
  var headerRowsCount = 1;
  var topSummaryRowsCount = (_topSummaryRows$lengt = topSummaryRows == null ? void 0 : topSummaryRows.length) != null ? _topSummaryRows$lengt : 0;
  var bottomSummaryRowsCount = (_bottomSummaryRows$le = bottomSummaryRows == null ? void 0 : bottomSummaryRows.length) != null ? _bottomSummaryRows$le : 0;
  var summaryRowsCount = topSummaryRowsCount + bottomSummaryRowsCount;
  var clientHeight = gridHeight - headerRowHeight - summaryRowsCount * summaryRowHeight;
  var isSelectable = selectedRows != null && onSelectedRowsChange != null;
  var isRtl = direction === "rtl";
  var leftKey = isRtl ? "ArrowRight" : "ArrowLeft";
  var rightKey = isRtl ? "ArrowLeft" : "ArrowRight";
  var handlePrint = function handlePrint() {
    var printContents = document.getElementById('DataGrid').innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };
  var defaultGridComponents = useMemo(function () {
    return {
      sortStatus: sortStatus$1,
      checkboxFormatter: checkboxFormatter$1
    };
  }, [sortStatus$1, checkboxFormatter$1]);
  var allRowsSelected = useMemo(function () {
    var length = rawRows.length;
    return length !== 0 && selectedRows1 != null && rowKeyGetter != null && selectedRows1.size >= length && rawRows.every(function (row) {
      return selectedRows1.has(rowKeyGetter(row));
    });
  }, [rawRows, selectedRows1, rowKeyGetter]);
  function flatten(into, node) {
    if (node == null) return into;
    if (Array.isArray(node)) return node.reduce(flatten, into);
    into.push(node);
    return flatten(into, node.children);
  }
  var rowArray = flatten([], rawColumns);
  var value = false;
  var rowColD = rowArray.slice();
  rowColD = rowColD.filter(function (item) {
    return item !== value;
  });
  var rowArray1 = rowColD.slice();
  for (var i = 0; i < rowArray1.length; i++) {
    if (rowArray1[i].haveChildren) {
      rowArray1.splice(i, 1);
      i--;
    }
  }
  var groupingViaCommonProperty = Object.values(rowArray1.reduce(function (acc, current) {
    var _acc$current$topHeade;
    acc[current.topHeader] = (_acc$current$topHeade = acc[current.topHeader]) != null ? _acc$current$topHeade : [];
    acc[current.topHeader].push(current.width);
    return acc;
  }, {}));
  var arr2 = groupingViaCommonProperty.map(function (arr) {
    return arr.reduce(function (sum, item) {
      return sum += item;
    });
  });
  var newData = rawColumns.slice().map(function (item1, index) {
    var itemFromArr2 = arr2.find(function (item2, index2) {
      return index === index2;
    });
    if (itemFromArr2) {
      item1.width = itemFromArr2;
    }
    return item1;
  });
  var _useCalculatedColumns2 = useCalculatedColumns({
      newData: newData,
      columnWidths: columnWidths,
      scrollLeft: scrollLeft,
      viewportWidth: gridWidth,
      defaultColumnDef: defaultColumnDef,
      rawGroupBy: groupBy ? rawGroupBy : undefined,
      enableVirtualization: enableVirtualization,
      frameworkComponents: frameworkComponents,
      treeData: rest.treeData
    }),
    columns = _useCalculatedColumns2.columns,
    colSpanColumns = _useCalculatedColumns2.colSpanColumns,
    colOverscanStartIdx = _useCalculatedColumns2.colOverscanStartIdx,
    colOverscanEndIdx = _useCalculatedColumns2.colOverscanEndIdx,
    templateColumns = _useCalculatedColumns2.templateColumns,
    layoutCssVars = _useCalculatedColumns2.layoutCssVars,
    columnMetrics = _useCalculatedColumns2.columnMetrics,
    lastFrozenColumnIndex = _useCalculatedColumns2.lastFrozenColumnIndex,
    totalFrozenColumnWidth = _useCalculatedColumns2.totalFrozenColumnWidth,
    groupBy$1 = _useCalculatedColumns2.groupBy;
  var rowData = flatten([], columns);
  var value1 = false;
  rowData = rowData.filter(function (item) {
    return item !== value1;
  });
  var rowData1 = rowData.slice();
  for (var i = 0; i < rowData1.length; i++) {
    if (rowData1[i].haveChildren) {
      rowData1.splice(i, 1);
      i--;
    }
  }
  var _useCalculatedColumns3 = useCalculatedColumnswithIdx({
      rowData1: rowData1,
      columnWidths: columnWidths,
      scrollLeft: scrollLeft,
      viewportWidth: gridWidth,
      defaultColumnOptions: defaultColumnOptions,
      rawGroupBy: groupBy ? rawGroupBy : undefined,
      enableVirtualization: enableVirtualization,
      frameworkComponents: frameworkComponents
    }),
    columns4 = _useCalculatedColumns3.columns4;
  var merged = [];
  var _loop4 = function _loop4() {
    var element = _step6.value;
    merged.push(_extends$1({}, element, columns4.find(function (itmInner) {
      if (element.field) return itmInner.field === element.field;
      return element.headerName === itmInner.headerName;
    })));
  };
  for (var _iterator6 = _createForOfIteratorHelperLoose(rowData), _step6; !(_step6 = _iterator6()).done;) {
    _loop4();
  }
  for (var ii = 0, leng = merged.length; ii < leng; ii++) {
    merged[ii].children = undefined;
  }
  var regroupArray = function regroupArray(array) {
    var map = {};
    array.forEach(function (item) {
      map[item.field] = item;
      item.children = [];
    });
    array.forEach(function (item) {
      if (item.parent !== null) {
        map[item.parent].children.push(item);
      }
    });
    return array.filter(function (item) {
      return item.parent === null;
    });
  };
  for (var i = 0, len = regroupArray(merged).length; i < len; i++) {
    if (regroupArray(merged)[i].haveChildren === true) regroupArray(merged)[i].idx = regroupArray(merged)[i].index + columns4.length;
  }
  var _useCalculatedRowColu = useCalculatedRowColumns({
      columns4: columns4,
      columnWidths: columnWidths,
      scrollLeft: scrollLeft,
      viewportWidth: gridWidth,
      defaultColumnOptions: defaultColumnOptions,
      rawGroupBy: groupBy ? rawGroupBy : undefined,
      enableVirtualization: enableVirtualization,
      frameworkComponents: frameworkComponents
    }),
    columns5 = _useCalculatedRowColu.columns5;
  var _useViewportRows = useViewportRows({
      rawRows: rawRows,
      groupBy: groupBy$1,
      rowGrouper: groupBy,
      expandAll: expandAll,
      rowHeight: rowHeight,
      clientHeight: clientHeight,
      scrollTop: scrollTop,
      expandedGroupIds: expandedGroupIds,
      expandedMasterRowIds: expandedMasterRowIds,
      enableVirtualization: enableVirtualization,
      paginationPageSize: size,
      current: current,
      pagination: pagination
    }),
    rowOverscanStartIdx = _useViewportRows.rowOverscanStartIdx,
    rowOverscanEndIdx = _useViewportRows.rowOverscanEndIdx,
    rows = _useViewportRows.rows,
    rowsCount = _useViewportRows.rowsCount,
    totalRowHeight = _useViewportRows.totalRowHeight,
    gridTemplateRows = _useViewportRows.gridTemplateRows,
    isGroupRow = _useViewportRows.isGroupRow,
    getRowTop = _useViewportRows.getRowTop,
    getRowHeight = _useViewportRows.getRowHeight,
    findRowIdx = _useViewportRows.findRowIdx;
  var _useViewportColumns = useViewportColumns({
      columns: columns,
      colSpanColumns: colSpanColumns,
      colOverscanStartIdx: colOverscanStartIdx,
      colOverscanEndIdx: colOverscanEndIdx,
      lastFrozenColumnIndex: lastFrozenColumnIndex,
      rowOverscanStartIdx: rowOverscanStartIdx,
      rowOverscanEndIdx: rowOverscanEndIdx,
      rows: rows,
      topSummaryRows: topSummaryRows,
      bottomSummaryRows: bottomSummaryRows,
      columnWidths: columnWidths,
      isGroupRow: isGroupRow
    }),
    viewportColumns = _useViewportColumns.viewportColumns,
    flexWidthViewportColumns = _useViewportColumns.flexWidthViewportColumns;
  function getColumnWidths() {
    var keys = Array.from(columnMetrics.keys());
    var columnKeys = [];
    keys.forEach(function (key) {
      return columnKeys.push(key.key);
    });
    var values = Array.from(columnMetrics.values());
    var columnWidthValues = [];
    values.forEach(function (value) {
      return columnWidthValues.push(value.width);
    });
    var columnWidth = new Map(columnWidths);
    for (var _i = 0; _i < columnWidthValues.length; _i++) {
      columnWidth.set(columnKeys[_i], columnWidthValues[_i]);
    }
    return columnWidth;
  }
  function getColumns() {
    var columnObjects = [];
    columns.forEach(function (column) {
      var _ref5, _column$field, _column$frozen, _column$rowGroup;
      var index = raawColumns.findIndex(function (c) {
        if (column.field) return c.field === column.field;
        return c.headerName === column.headerName;
      });
      var userColDef = raawColumns[index];
      var indexOfRowGroup = rawGroupBy == null ? void 0 : rawGroupBy.findIndex(function (key) {
        return key === column.key;
      });
      var indexOfSort = sortColumns.findIndex(function (sortCol) {
        return sortCol.columnKey === column.key;
      });
      var sort = indexOfSort > -1 ? sortColumns[indexOfSort].direction : null;
      var columnState = {
        colId: (_ref5 = (_column$field = column.field) != null ? _column$field : column.key) != null ? _ref5 : "col_" + column.idx,
        columnIndex: column.idx,
        width: templateColumns[column.idx],
        frozen: (_column$frozen = column.frozen) != null ? _column$frozen : undefined,
        rowGroup: (_column$rowGroup = column.rowGroup) != null ? _column$rowGroup : undefined,
        rowGroupIndex: indexOfRowGroup > -1 ? indexOfRowGroup : null,
        sort: sort,
        userProvidedColDef: userColDef
      };
      columnObjects.push(columnState);
    });
    return columnObjects;
  }
  function moveColumn(colKey, toIndex) {
    var key = typeof colKey === "string" ? colKey : colKey.colId;
    var sourceColumnIndex = columns.findIndex(function (c) {
      return c.field === key;
    });
    var targetColumnIndex = toIndex < columns.length ? toIndex : sourceColumnIndex;
    var reorderedColumns = [].concat(columns);
    reorderedColumns.splice(targetColumnIndex, 0, reorderedColumns.splice(sourceColumnIndex, 1)[0]);
    setRawColumns(reorderedColumns);
  }
  function moveColumns(columnsToMove, toIndex) {
    var sourceColumns = [];
    var reorderedColumns = [].concat(columns);
    columns.map(function (c) {
      return columnsToMove.forEach(function (col) {
        var key = typeof col === "string" ? col : col.colId;
        if (key === c.field) sourceColumns.push(c);
      });
    });
    var valueAtPosition = columns[toIndex];
    sourceColumns.forEach(function (v) {
      return reorderedColumns.splice(reorderedColumns.indexOf(v), 1);
    });
    reorderedColumns.splice.apply(reorderedColumns, [reorderedColumns.indexOf(valueAtPosition) + 1, 0].concat(sourceColumns));
    setRawColumns(reorderedColumns);
  }
  function moveColumnByIndex(fromIndex, toIndex) {
    var sourceColumnIndex = fromIndex;
    var targetColumnIndex = toIndex < columns.length ? toIndex : sourceColumnIndex;
    var reorderedColumns = [].concat(columns);
    reorderedColumns.splice(targetColumnIndex, 0, reorderedColumns.splice(sourceColumnIndex, 1)[0]);
    setRawColumns(reorderedColumns);
  }
  function getDisplayNameForColumn(column, location) {
    var displayNameForCol;
    columns.forEach(function (col) {
      if (column.colId === col.key && location === col.idx) displayNameForCol = col.headerName;
    });
    return displayNameForCol;
  }
  function getDisplayedColAfter(column) {
    var columnObjects = getColumns();
    var displayedColAfterKey;
    for (var index = 0; index < columns.length; index++) {
      var col = columns[index];
      var nextCol = columns[index + 1];
      if (column.colId === col.key) displayedColAfterKey = nextCol.parentColumn ? nextCol.parentColumn.key || nextCol.parentColumn.field : nextCol.key;
    }
    var displayedColAfter;
    columnObjects.forEach(function (colObj) {
      if (colObj.colId === displayedColAfterKey) displayedColAfter = colObj;
    });
    return displayedColAfter;
  }
  function getDisplayedColBefore(column) {
    var columnObjects = getColumns();
    var displayedColBeforeKey;
    for (var index = 0; index < columns.length; index++) {
      var col = columns[index];
      var prevCol = columns[index - 1];
      if (column.colId === col.key) displayedColBeforeKey = prevCol.parentColumn ? prevCol.parentColumn.key || prevCol.parentColumn.field : prevCol.key;
    }
    var displayedColBefore;
    columnObjects.forEach(function (colObj) {
      if (colObj.colId === displayedColBeforeKey) displayedColBefore = colObj;
    });
    return displayedColBefore;
  }
  function getRowGroupColumns() {
    var columnObjects = getColumns();
    var rowGroupColumns = [];
    columnObjects.forEach(function (colObject) {
      if (rawGroupBy != null && rawGroupBy.includes(colObject.colId)) rowGroupColumns.push(colObject);
    });
    return rowGroupColumns;
  }
  function setRowGroupColumns(colKeys) {
    rawGroupBy.length = 0;
    colKeys.forEach(function (colKey) {
      typeof colKey === "string" ? rawGroupBy.push(colKey) : rawGroupBy.push(colKey.colId);
    });
    setRawColumns(raawColumns);
  }
  function addRowGroupColumn(colKey) {
    typeof colKey === "string" ? rawGroupBy.push(colKey) : rawGroupBy.push(colKey.colId);
    setRawColumns(raawColumns);
  }
  function addRowGroupColumns(colKeys) {
    colKeys.forEach(function (colKey) {
      typeof colKey === "string" ? rawGroupBy.push(colKey) : rawGroupBy.push(colKey.colId);
    });
    setRawColumns(raawColumns);
  }
  function removeRowGroupColumn(colKey) {
    var key = typeof colKey === "string" ? colKey : colKey.colId;
    var indexOfKey = rawGroupBy == null ? void 0 : rawGroupBy.findIndex(function (c) {
      return c === key;
    });
    if (indexOfKey > -1) rawGroupBy == null ? void 0 : rawGroupBy.splice(indexOfKey, 1);
    setRawColumns(raawColumns);
  }
  function removeRowGroupColumns(colKeys) {
    colKeys.forEach(function (colKey) {
      var key = typeof colKey === "string" ? colKey : colKey.colId;
      var indexOfKey = rawGroupBy == null ? void 0 : rawGroupBy.findIndex(function (c) {
        return c === key;
      });
      if (indexOfKey > -1) rawGroupBy == null ? void 0 : rawGroupBy.splice(indexOfKey, 1);
    });
    setRawColumns(raawColumns);
  }
  function moveRowGroupColumn(fromIndex, toIndex) {
    if (fromIndex > -1 && toIndex < (rawGroupBy == null ? void 0 : rawGroupBy.length)) {
      var element = rawGroupBy[fromIndex];
      rawGroupBy.splice(fromIndex, 1);
      rawGroupBy.splice(toIndex, 0, element);
      setRawColumns(columns);
    }
  }
  function setColumnWidth(key, newWidth) {
    var colKey = typeof key === "string" ? key : key.colId;
    var newColumnWidths = new Map(columnWidths);
    newColumnWidths.set(colKey, newWidth);
    setColumnWidths(newColumnWidths);
  }
  function setColumnsWidth(newColumnWidths) {
    var newColWidths = new Map(columnWidths);
    newColumnWidths.forEach(function (col) {
      var colKey = typeof col.key === "string" ? col.key : col.key.colId;
      var colWidth = col.newWidth;
      newColWidths.set(colKey, colWidth);
    });
    setColumnWidths(newColWidths);
  }
  function autoSizeColumn(key) {
    var colKey = typeof key === "string" ? key : key.colId;
    var columnIndex = columns.findIndex(function (col) {
      return col.key === colKey;
    });
    var column = columns[columnIndex];
    handleColumnResize(column, "max-content");
  }
  function autoSizeColumns(colKeys) {
    var columnObjects = getColumns();
    var style = gridRef.current.style;
    var newTemplateColumns = [].concat(templateColumns);
    var newColumnWidths = new Map(columnWidths);
    colKeys.forEach(function (colKey) {
      var key = typeof colKey === "string" ? colKey : colKey.colId;
      var index = columnObjects.findIndex(function (c) {
        return c.colId === key;
      });
      newTemplateColumns[index] = "max-content";
      style.gridTemplateColumns = newTemplateColumns.join(" ");
      var measuringCell = gridRef.current.querySelector("[data-measuring-cell-key=\"" + columns[index].key + "\"]");
      var measuredWidth = measuringCell.getBoundingClientRect().width;
      var measuredWidthPx = measuredWidth + "px";
      if (newTemplateColumns[columns[index].idx] !== measuredWidthPx) {
        newTemplateColumns[columns[index].idx] = measuredWidthPx;
        style.gridTemplateColumns = newTemplateColumns.join(" ");
      }
      if (columnWidths.get(columns[index].key) === measuredWidth) return;
      newColumnWidths.set(columns[index].key, measuredWidth);
    });
    setColumnWidths(newColumnWidths);
    templateColumns = [].concat(newTemplateColumns);
  }
  function autoSizeAllColumns() {
    var style = gridRef.current.style;
    var newTemplateColumns = [].concat(templateColumns);
    var newColumnWidths = new Map(columnWidths);
    for (var index = 0; index < newTemplateColumns.length; index++) {
      newTemplateColumns[index] = "max-content";
      style.gridTemplateColumns = newTemplateColumns.join(" ");
      var measuringCell = gridRef.current.querySelector("[data-measuring-cell-key=\"" + columns[index].key + "\"]");
      var measuredWidth = measuringCell.getBoundingClientRect().width;
      var measuredWidthPx = measuredWidth + "px";
      if (newTemplateColumns[columns[index].idx] !== measuredWidthPx) {
        newTemplateColumns[columns[index].idx] = measuredWidthPx;
        style.gridTemplateColumns = newTemplateColumns.join(" ");
      }
      if (columnWidths.get(columns[index].key) === measuredWidth) return;
      newColumnWidths.set(columns[index].key, measuredWidth);
    }
    setColumnWidths(newColumnWidths);
    templateColumns = [].concat(newTemplateColumns);
  }
  function sizeColumnsToFit(gridWidth) {
    var columnWidths = getColumnWidths();
    var widthSum = 0;
    var colWidthValues = Array.from(columnWidths.values());
    colWidthValues.forEach(function (colWidth) {
      widthSum += colWidth;
    });
    var scale = gridWidth / widthSum;
    var newColWidths = new Map(columnWidths);
    var colWidths = Array.from(columnWidths.keys());
    var sum = 0;
    for (var index = 0; index < colWidthValues.length; index++) {
      if (index === colWidthValues.length - 1) {
        var width = gridWidth - sum;
        newColWidths.set(colWidths[index], width);
      } else {
        var _width = Math.round(colWidthValues[index] * scale);
        newColWidths.set(colWidths[index], _width);
        sum += _width;
      }
    }
    setColumnWidths(newColWidths);
  }
  function getColumnState() {
    var columns = Array.from(columnMetrics.keys());
    var colStates = [];
    columns.forEach(function (col) {
      var _col$key, _col$frozen, _col$rowGroup;
      var index = sortColumns.findIndex(function (sortCol) {
        return sortCol.columnKey === col.key;
      });
      var sort = index > -1 ? sortColumns[index].direction : null;
      var indexOfRowGroup = rawGroupBy == null ? void 0 : rawGroupBy.findIndex(function (key) {
        return key === col.key;
      });
      var colState = {
        colId: (_col$key = col.key) != null ? _col$key : "col_" + col.idx,
        columnIndex: col.idx,
        frozen: (_col$frozen = col.frozen) != null ? _col$frozen : undefined,
        width: templateColumns[col.idx],
        rowGroup: (_col$rowGroup = col.rowGroup) != null ? _col$rowGroup : undefined,
        rowGroupIndex: indexOfRowGroup > -1 ? indexOfRowGroup : null,
        sort: sort
      };
      colStates.push(colState);
    });
    return colStates;
  }
  function applyColumnState(columnState) {
    var _columnState$defaultS;
    var colState = columnState.state;
    var defaultState = (_columnState$defaultS = columnState.defaultState) != null ? _columnState$defaultS : undefined;
    var newColWidths = new Map(columnWidths);
    colState.forEach(function (col) {
      var colKey = col.colId;
      if (col.frozen) {
        var index = columns.findIndex(function (c) {
          return c.key === colKey;
        });
        columns[index].frozen = col.frozen;
      }
      if (col.width !== undefined) {
        var width = isString(col.width) ? Number(col.width.match(/\d+/)[0]) : col.width;
        newColWidths.set(colKey, width);
      }
      if (col.rowGroup !== undefined) {
        if (col.rowGroup) {
          var _index = columns.findIndex(function (c) {
            return c.key === colKey;
          });
          columns[_index].rowGroup = col.rowGroup;
          addRowGroupColumn(colKey);
        } else {
          var _index2 = columns.findIndex(function (c) {
            return c.key === colKey;
          });
          columns[_index2].rowGroup = col.rowGroup;
          removeRowGroupColumn(colKey);
        }
      }
      if (col.rowGroupIndex !== undefined) {
        if (col.rowGroupIndex !== null && col.rowGroup) {
          var fromIndex = rawGroupBy.findIndex(function (groupCol) {
            return groupCol === colKey;
          });
          var toIndex = col.rowGroupIndex;
          if (fromIndex > -1 && toIndex < (rawGroupBy == null ? void 0 : rawGroupBy.length)) moveRowGroupColumn(fromIndex, toIndex);
        }
      }
      if (col.sort !== undefined) {
        if (col.sort !== null) {
          var _index3 = sortColumns.findIndex(function (sortCol) {
            return sortCol.columnKey === colKey;
          });
          if (_index3 === -1) sortColumns.push({
            columnKey: colKey,
            direction: col.sort
          });
          if (_index3 > -1 && sortColumns[_index3].direction !== col.sort) sortColumns[_index3].direction = col.sort;
          onSortColumnsChange(sortColumns);
        } else {
          var _index4 = sortColumns.findIndex(function (sortCol) {
            return sortCol.columnKey === colKey;
          });
          if (_index4 > -1) sortColumns.splice(_index4, 1);
          onSortColumnsChange(sortColumns);
        }
      }
      setColumnWidths(newColWidths);
    });
    if (defaultState) {
      var keysOfColumns = [];
      colState.map(function (col) {
        return keysOfColumns.push(col.colId);
      });
      columns.forEach(function (column) {
        if (!keysOfColumns.includes(column.key)) {
          if (defaultState.frozen !== undefined) column.frozen = defaultState.frozen;
          if (defaultState.width !== undefined) {
            newColWidths.set(column.key, defaultState.width);
          }
          if (defaultState.rowGroup !== undefined) {
            if (defaultState.rowGroup) {
              var index = columns.findIndex(function (c) {
                return c.key === column.key;
              });
              columns[index].rowGroup = defaultState.rowGroup;
              addRowGroupColumn(column.key);
            } else {
              var _index5 = columns.findIndex(function (c) {
                return c.key === column.key;
              });
              columns[_index5].rowGroup = defaultState.rowGroup;
              removeRowGroupColumn(column.key);
            }
          }
          if (defaultState.sort !== undefined) {
            if (defaultState.sort !== null) {
              var _index6 = sortColumns.findIndex(function (sortCol) {
                return sortCol.columnKey === column.key;
              });
              if (_index6 === -1) sortColumns.push({
                columnKey: column.key,
                direction: defaultState.sort
              });
              if (_index6 > -1 && sortColumns[_index6].direction !== defaultState.sort) sortColumns[_index6].direction = defaultState.sort;
              onSortColumnsChange(sortColumns);
            } else {
              var _index7 = sortColumns.findIndex(function (sortCol) {
                return sortCol.columnKey === column.key;
              });
              if (_index7 > -1) sortColumns.splice(_index7, 1);
              onSortColumnsChange(sortColumns);
            }
          }
        }
      });
      setColumnWidths(newColWidths);
    }
    setRawColumns(columns);
  }
  function isPinning() {
    var isPinning = false;
    columns.forEach(function (col) {
      if (col.frozen === true) isPinning = true;
    });
    return isPinning;
  }
  function setColumnPinned(key) {
    var colKey = typeof key === "string" ? key : key.colId;
    var columnIndex = columns.findIndex(function (col) {
      return col.key === colKey;
    });
    columns[columnIndex].frozen = true;
    setRawColumns(columns);
  }
  function setColumnsPinned(keys) {
    for (var _i2 = 0; _i2 < columns.length; _i2++) {
      var _loop = function _loop() {
        var element = _step7.value;
        var key = typeof element === "string" ? element : element.colId;
        var columnIndex = columns.findIndex(function (col) {
          return col.key === key;
        });
        if (_i2 === columnIndex) columns[_i2].frozen = true;
      };
      for (var _iterator7 = _createForOfIteratorHelperLoose(keys), _step7; !(_step7 = _iterator7()).done;) {
        _loop();
      }
    }
    setRawColumns(columns);
  }
  function getSortColumns() {
    var columnObjects = getColumns();
    var sortColumns = [];
    columnObjects.forEach(function (colObj) {
      if (colObj.sort !== null) sortColumns.push(colObj);
    });
    return sortColumns;
  }
  var columnApiObject = {
    columnModel: {
      columnDefs: raawColumns,
      rowGroupColumns: getRowGroupColumns(),
      sortColumns: getSortColumns()
    }
  };
  Object.setPrototypeOf(columnApiObject, {
    getColumns: getColumns,
    getColumn: function getColumn(colKey) {
      var columnObjects = getColumns();
      var colObject;
      var key = typeof colKey === "string" ? colKey : colKey.colId;
      columnObjects.forEach(function (columnObj) {
        if (columnObj.colId === key) colObject = columnObj;
      });
      return colObject;
    },
    getAllGridColumns: function getAllGridColumns() {
      return getColumns();
    },
    moveColumn: moveColumn,
    moveColumns: moveColumns,
    moveColumnByIndex: moveColumnByIndex,
    getDisplayNameForColumn: getDisplayNameForColumn,
    getDisplayedColAfter: getDisplayedColAfter,
    getDisplayedColBefore: getDisplayedColBefore,
    getAllDisplayedVirtualColumns: function getAllDisplayedVirtualColumns() {
      return viewportColumns;
    },
    getAllDisplayedColumns: function getAllDisplayedColumns() {
      return viewportColumns;
    },
    getRowGroupColumns: getRowGroupColumns,
    setRowGroupColumns: setRowGroupColumns,
    addRowGroupColumn: addRowGroupColumn,
    addRowGroupColumns: addRowGroupColumns,
    removeRowGroupColumn: removeRowGroupColumn,
    removeRowGroupColumns: removeRowGroupColumns,
    moveRowGroupColumn: moveRowGroupColumn,
    setColumnWidth: setColumnWidth,
    setColumnsWidth: setColumnsWidth,
    autoSizeColumn: autoSizeColumn,
    autoSizeColumns: autoSizeColumns,
    autoSizeAllColumns: autoSizeAllColumns,
    sizeColumnsToFit: sizeColumnsToFit,
    getColumnState: getColumnState,
    applyColumnState: applyColumnState,
    resetColumnState: function resetColumnState() {
      if ((rawGroupBy == null ? void 0 : rawGroupBy.length) > 0) rawGroupBy.length = 0;
      if ((sortColumns == null ? void 0 : sortColumns.length) > 0) {
        sortColumns.length = 0;
        onSortColumnsChange(sortColumns);
      }
      setRawColumns(raawColumns);
    },
    isPinning: isPinning,
    setColumnPinned: setColumnPinned,
    setColumnsPinned: setColumnsPinned
  });
  var hasGroups = groupBy$1.length > 0 && typeof groupBy === "function";
  var minColIdx = hasGroups ? -1 : 0;
  var maxColIdx = rowArray1.length - 1;
  var minRowIdx = -1 - topSummaryRowsCount;
  var maxRowIdx = rows.length + bottomSummaryRowsCount - 1;
  var selectedCellIsWithinSelectionBounds = isCellWithinSelectionBounds(selectedPosition);
  var selectedCellIsWithinViewportBounds = isCellWithinViewportBounds(selectedPosition);
  function selectRow(_ref6) {
    var row = _ref6.row,
      checked = _ref6.checked,
      isShiftClick = _ref6.isShiftClick;
    if (!onSelectedRowsChange1) return;
    assertIsValidKeyGetter(rowKeyGetter);
    var newSelectedRows = new Set(selectedRows1);
    var newSelectedRows1 = selectedRows;
    if (isGroupRow(row)) {
      for (var _iterator8 = _createForOfIteratorHelperLoose(row.childRows), _step8; !(_step8 = _iterator8()).done;) {
        var childRow = _step8.value;
        var _rowKey = rowKeyGetter(childRow);
        if (checked) {
          newSelectedRows.add(_rowKey);
          newSelectedRows1.push(childRow);
        } else {
          newSelectedRows.delete(_rowKey);
          newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
        }
      }
      onSelectedRowsChange1(newSelectedRows);
      if (onSelectedRowsChange) onSelectedRowsChange(newSelectedRows1);
      return;
    }
    function recursiveSelectRow(obj) {
      var rowKey = rowKeyGetter(obj);
      if (obj.children) {
        obj.children.map(function (childrenRow) {
          return recursiveSelectRow(childrenRow);
        });
      }
      if (checked) {
        newSelectedRows.add(rowKey);
        newSelectedRows1.push(obj);
      } else {
        newSelectedRows.delete(rowKey);
        newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
      }
    }
    if (props.treeData && row.children) {
      row.children.map(function (obj) {
        recursiveSelectRow(obj);
      });
    }
    var rowKey = rowKeyGetter(row);
    if (checked) {
      newSelectedRows.add(rowKey);
      newSelectedRows1.push(row);
      var previousRowIdx = lastSelectedRowIdx.current;
      var rowIdx = rows.indexOf(row);
      lastSelectedRowIdx.current = rowIdx;
      if (isShiftClick && previousRowIdx !== -1 && previousRowIdx !== rowIdx) {
        var step = sign(rowIdx - previousRowIdx);
        for (var _i3 = previousRowIdx + step; _i3 !== rowIdx; _i3 += step) {
          var _row = rows[_i3];
          if (isGroupRow(_row)) continue;
          newSelectedRows.add(rowKeyGetter(_row));
          newSelectedRows1.push(_row);
        }
      }
    } else {
      newSelectedRows.delete(rowKey);
      newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
      lastSelectedRowIdx.current = -1;
    }
    onSelectedRowsChange1(newSelectedRows);
    if (onSelectedRowsChange) onSelectedRowsChange(newSelectedRows1);
  }
  var handleColumnResizeLatest = useLatestFunc(handleColumnResize);
  var onSortColumnsChangeLatest = useLatestFunc(onSortColumnsChange);
  var onCellClickLatest = useLatestFunc(function (params) {
    var row = params.data;
    var rowKey = rowKeyGetter(row);
    if (onCellClick) onCellClick(params);
    var newSelectedRows = selectedRows1 !== undefined ? Object.values(selectedRows1) : [];
    var newSelectedRows1 = [];
    if ((rowSelection == null ? void 0 : rowSelection.toLowerCase()) === "single" && !suppressRowClickSelection && (!props.selection || props.selection && selectedPosition.idx !== 0)) {
      if (selectedRows1 === undefined || !selectedRows1.has(rowKey)) {
        if (!onSelectedRowsChange1) return;
        if (selectedRows1 !== undefined) newSelectedRows.splice(0, newSelectedRows.length);
        newSelectedRows.push(rowKey);
        newSelectedRows1 = [row];
      } else {
        newSelectedRows.pop(rowKey);
        newSelectedRows1 = [];
      }
      onSelectedRowsChange1(new Set(newSelectedRows));
      if (onSelectedRowsChange) onSelectedRowsChange(newSelectedRows1);
    } else if ((rowSelection == null ? void 0 : rowSelection.toLowerCase()) === "multiple" && (!props.selection || props.selection && selectedPosition.idx !== 0)) {
      if (selectedRows1 === undefined || params.event.ctrlKey || props.rowMultiSelectWithClick) {
        selectRow({
          row: row,
          checked: selectedRows1 === undefined ? true : !selectedRows1.has(rowKeyGetter(row)),
          isShiftClick: false
        });
      } else {
        if (selectedRows1 === undefined || !selectedRows1.has(rowKey)) {
          if (!onSelectedRowsChange1) return;
          if (selectedRows1 !== undefined) newSelectedRows.splice(0, newSelectedRows.length);
          newSelectedRows.push(rowKey);
          newSelectedRows1 = [row];
        } else {
          newSelectedRows.pop(rowKey);
          newSelectedRows1 = [];
        }
        onSelectedRowsChange1(new Set(newSelectedRows));
        if (onSelectedRowsChange) onSelectedRowsChange(newSelectedRows1);
      }
    }
  });
  var onCellDoubleClickLatest = useLatestFunc(onCellDoubleClick);
  var onCellContextMenuLatest = useLatestFunc(onCellContextMenu);
  var selectRowLatest = useLatestFunc(selectRow);
  var selectAllRowsLatest = useLatestFunc(selectAllRows);
  var handleFormatterRowChangeLatest = useLatestFunc(updateRow);
  var selectViewportCellLatest = useLatestFunc(function (row, column, enableEditor) {
    var rowIdx = rows.indexOf(row);
    selectCell({
      rowIdx: rowIdx,
      idx: column.idx
    }, enableEditor);
  });
  var selectGroupLatest = useLatestFunc(function (rowIdx) {
    selectCell({
      rowIdx: rowIdx,
      idx: -1
    });
  });
  var selectHeaderCellLatest = useLatestFunc(function (idx) {
    selectCell({
      rowIdx: minRowIdx,
      idx: idx
    });
  });
  var selectTopSummaryCellLatest = useLatestFunc(function (summaryRow, column) {
    var rowIdx = topSummaryRows.indexOf(summaryRow);
    selectCell({
      rowIdx: rowIdx + minRowIdx + 1,
      idx: column.idx
    });
  });
  var selectBottomSummaryCellLatest = useLatestFunc(function (summaryRow, column) {
    var rowIdx = bottomSummaryRows.indexOf(summaryRow) + rows.length;
    selectCell({
      rowIdx: rowIdx,
      idx: column.idx
    });
  });
  var toggleGroupLatest = useLatestFunc(toggleGroup);
  var toggleTreeLatest = useLatestFunc(toggleTree);
  var toggleMasterLatest = useLatestFunc(toggleMaster);
  useLayoutEffect(function () {
    if (!selectedCellIsWithinSelectionBounds || isSamePosition(selectedPosition, prevSelectedPosition.current)) {
      prevSelectedPosition.current = selectedPosition;
      return;
    }
    prevSelectedPosition.current = selectedPosition;
    if (selectedPosition.idx === -1) {
      rowRef.current.focus({
        preventScroll: true
      });
      scrollIntoView(rowRef.current);
    }
  });
  useLayoutEffect(function () {
    if (!isWidthInitialized || flexWidthViewportColumns.length === 0) return;
    setColumnWidths(function (columnWidths) {
      var newColumnWidths = new Map(columnWidths);
      var grid = gridRef.current;
      for (var _iterator9 = _createForOfIteratorHelperLoose(flexWidthViewportColumns), _step9; !(_step9 = _iterator9()).done;) {
        var _column$key;
        var column = _step9.value;
        var measuringCell = grid.querySelector("[data-measuring-cell-key=\"" + ((_column$key = column.key) != null ? _column$key : "grid_no_key" + column.idx) + "\"]");
        var _measuringCell$getBou = measuringCell.getBoundingClientRect(),
          width = _measuringCell$getBou.width;
        newColumnWidths.set(column.key, width);
      }
      return newColumnWidths;
    });
  }, [isWidthInitialized, flexWidthViewportColumns, gridRef]);
  useImperativeHandle(innerRef, function () {
    return {
      element: gridRef.current,
      scrollToColumn: scrollToColumn,
      scrollToRow: function scrollToRow(rowIdx) {
        var current = gridRef.current;
        if (!current) return;
        current.scrollTo({
          top: getRowTop(rowIdx),
          behavior: "smooth"
        });
      },
      selectCell: selectCell,
      api: apiObject,
      columnApi: columnApiObject,
      node: node
    };
  });
  var setDraggedOverRowIdx = useCallback(function (rowIdx) {
    setOverRowIdx(rowIdx);
    latestDraggedOverRowIdx.current = rowIdx;
  }, []);
  function handleColumnResize(column, width) {
    var style = gridRef.current.style;
    var newTemplateColumns = [].concat(templateColumns);
    newTemplateColumns[column.idx] = width === "max-content" ? width : width + "px";
    style.gridTemplateColumns = newTemplateColumns.join(" ");
    var measuringCell = gridRef.current.querySelector("[data-measuring-cell-key=\"" + column.key + "\"]");
    var measuredWidth = measuringCell.getBoundingClientRect().width;
    var measuredWidthPx = measuredWidth + "px";
    if (newTemplateColumns[column.idx] !== measuredWidthPx) {
      newTemplateColumns[column.idx] = measuredWidthPx;
      style.gridTemplateColumns = newTemplateColumns.join(" ");
    }
    if (columnWidths.get(column.key) === measuredWidth) return;
    var newColumnWidths = new Map(columnWidths);
    newColumnWidths.set(column.key, measuredWidth);
    setColumnWidths(newColumnWidths);
    onColumnResize == null ? void 0 : onColumnResize(column.idx, measuredWidth);
  }
  function selectAllRows(checked) {
    if (!onSelectedRowsChange1) return;
    assertIsValidKeyGetter(rowKeyGetter);
    var newSelectedRows = new Set(selectedRows1);
    var newSelectedRows1 = selectedRows;
    for (var _iterator10 = _createForOfIteratorHelperLoose(rawRows), _step10; !(_step10 = _iterator10()).done;) {
      var row = _step10.value;
      var rowKey = rowKeyGetter(row);
      if (checked) {
        newSelectedRows.add(rowKey);
        if (!newSelectedRows1.includes(row)) newSelectedRows1.push(row);
      } else {
        newSelectedRows.delete(rowKey);
        newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
      }
    }
    if (onSelectedRowsChange) onSelectedRowsChange(newSelectedRows1);
    onSelectedRowsChange1(newSelectedRows);
  }
  function toggleGroup(expandedGroupId) {
    if (!onExpandedGroupIdsChange) return;
    var newExpandedGroupIds = new Set(expandedGroupIds);
    if (newExpandedGroupIds.has(expandedGroupId)) {
      newExpandedGroupIds.delete(expandedGroupId);
    } else {
      newExpandedGroupIds.add(expandedGroupId);
    }
    onExpandedGroupIdsChange(newExpandedGroupIds);
  }
  function TreeViewHandle() {
    if (expandedTreeIds.length > 0) {
      var gatherRows = function gatherRows() {
        expandedTreeIds.map(function (id) {
          sampleRawRows.map(function (data, index) {
            var rowKey = rowKeyGetter(data);
            if (id === rowKey) {
              if (JSON.stringify(data.children[0]) !== JSON.stringify(sampleRawRows[index + 1])) {
                var _data$children;
                var sampleRow = (_data$children = data.children) == null ? void 0 : _data$children.map(function (obj) {
                  return obj;
                });
                if (index !== 0) {
                  sampleRawRows = [].concat(sampleRawRows.slice(0, index + 1), sampleRow, sampleRawRows.slice(index + 1));
                } else {
                  sampleRawRows = [sampleRawRows[index]].concat(sampleRow, sampleRawRows.slice(index + 1));
                }
              }
            }
          });
        });
      };
      var sampleRawRows = raawRows;
      gatherRows();
      sampleRawRows.map(function (row, index) {
        if (expandedTreeIds.includes(rowKeyGetter(row))) {
          if (JSON.stringify(row.children[0]) !== JSON.stringify(sampleRawRows[index + 1])) {
            gatherRows();
          }
        }
      });
      setRawRows([].concat(sampleRawRows));
    } else {
      setRawRows([].concat(raawRows));
    }
  }
  useEffect(function () {
    TreeViewHandle();
  }, [expandedTreeIds]);
  useEffect(function () {
    if (rest.masterData) {
      if (expandedMasterRowIds.length > 0) {
        var sampleRows = [];
        raawRows.map(function (row) {
          if (expandedMasterRowIds.includes(row.id)) {
            sampleRows.push(_extends$1({}, row, {
              gridRowType: "Master"
            }));
            sampleRows.push({
              gridRowType: "Detail",
              parentId: rowKeyGetter(row)
            });
          } else {
            sampleRows.push(_extends$1({}, row, {
              gridRowType: "Master"
            }));
          }
        });
        setRawRows([].concat(sampleRows));
      } else {
        setRawRows([].concat(raawRows));
      }
    }
  }, [expandedMasterRowIds]);
  function toggleMaster(newExpandedMasterId) {
    var sample;
    if (!expandedMasterRowIds.includes(newExpandedMasterId)) {
      setExpandedMasterIds([].concat(expandedMasterRowIds, [newExpandedMasterId]));
      sample = [].concat(expandedMasterRowIds, [newExpandedMasterId]);
    } else {
      sample = expandedMasterRowIds.filter(function (value) {
        return value !== newExpandedMasterId;
      });
      setExpandedMasterIds([].concat(sample));
    }
    if (onExpandedMasterIdsChange) onExpandedMasterIdsChange(sample);
  }
  function toggleTree(newExpandedTreeId) {
    if (!expandedTreeIds.includes(newExpandedTreeId)) {
      setExpandedTreeIds([].concat(expandedTreeIds, [newExpandedTreeId]));
    } else {
      setExpandedTreeIds(expandedTreeIds.filter(function (value) {
        return value !== newExpandedTreeId;
      }));
    }
  }
  function handleKeyDown(event) {
    if (!(event.target instanceof Element)) return;
    var isCellEvent = event.target.closest(".rdg-cell") !== null;
    var isRowEvent = hasGroups && event.target === rowRef.current;
    if (!(isCellEvent || isRowEvent)) return;
    var key = event.key,
      keyCode = event.keyCode;
    var rowIdx = selectedPosition.rowIdx;
    if (selectedCellIsWithinViewportBounds && (onPaste != null || onCopy != null) && isCtrlKeyHeldDown(event) && !isGroupRow(rows[rowIdx]) && selectedPosition.mode === "SELECT") {
      var cKey = 67;
      var vKey = 86;
      if (keyCode === cKey) {
        handleCopy();
        return;
      }
      if (keyCode === vKey) {
        handlePaste();
        return;
      }
    }
    if (isRowIdxWithinViewportBounds(rowIdx)) {
      var row = rows[rowIdx];
      if (isGroupRow(row) && selectedPosition.idx === -1 && (key === leftKey && row.isExpanded || key === rightKey && !row.isExpanded)) {
        event.preventDefault();
        toggleGroup(row.id);
        return;
      }
    }
    switch (event.key) {
      case "Escape":
        setCopiedCell(null);
        return;
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
      case "Tab":
      case "Home":
      case "End":
      case "PageUp":
      case "PageDown":
        navigate(event);
        break;
      default:
        handleCellInput(event);
        break;
    }
  }
  function handleScroll(event) {
    var _event$currentTarget = event.currentTarget,
      scrollTop = _event$currentTarget.scrollTop,
      scrollLeft = _event$currentTarget.scrollLeft;
    flushSync(function () {
      setScrollTop(scrollTop);
      setScrollLeft(abs(scrollLeft));
    });
    onScroll == null ? void 0 : onScroll(event);
  }
  function getRawRowIdx(rowIdx) {
    return hasGroups ? rawRows.indexOf(rows[rowIdx]) : rowIdx;
  }
  function findChangedKey(newObj, oldObj) {
    var _Object$keys, _Object$keys2;
    if (((_Object$keys = Object.keys(oldObj)) == null ? void 0 : _Object$keys.length) === 0 && ((_Object$keys2 = Object.keys(newObj)) == null ? void 0 : _Object$keys2.length) > 0) return newObj;
    var diff = {};
    for (var key in oldObj) {
      if (newObj[key] && oldObj[key] !== newObj[key]) {
        diff[key] = newObj[key];
      }
    }
    if (Object.keys(diff).length > 0) return Object.keys(diff);
    return [];
  }
  var _useState28 = useState([]),
    changedList = _useState28[0],
    setChangedList = _useState28[1];
  var _useState29 = useState([]),
    previousData = _useState29[0],
    setPreviousData = _useState29[1];
  useUpdateEffect$1(function () {
    setPreviousData([].concat(raawRows));
  }, [raawRows]);
  useEffect(function () {
    setPreviousData([].concat(raawRows));
  }, []);
  function updateRow(column, rowIdx, row, oldRow) {
    if (rest.treeData) {
      var replaceObject = function replaceObject(arr, oldObj, newObj) {
        return arr.map(function (obj) {
          if (obj === oldObj) {
            return newObj;
          } else if (obj.children) {
            return _extends$1({}, obj, {
              children: replaceObject(obj.children, oldObj, newObj)
            });
          } else {
            return obj;
          }
        });
      };
      var sample = [].concat(rawRows);
      var res = replaceObject(sample, oldRow, row);
      setRawRows(res);
      if (typeof onRowsChange === "function") {
        onRowsChange(sample);
      }
    } else {
      var sampleData = raawRows;
      if (valueChangedCellStyle) {
        var sampleChanged = changedList;
        sampleChanged[rowIdx] = findChangedKey(row, previousData[rowIdx]);
        setChangedList(sampleChanged);
      }
      sampleData[rowIdx] = row;
      setRawRows([].concat(sampleData));
      if (typeof onRowsChange !== "function") return;
      var rawRowIdx = getRawRowIdx(rowIdx);
      if (row === rawRows[rawRowIdx]) return;
      var updatedRows = [].concat(rawRows);
      updatedRows[rawRowIdx] = row;
      onRowsChange(updatedRows, {
        indexes: [rawRowIdx],
        column: column
      });
    }
  }
  function commitEditorChanges() {
    if (selectedPosition.mode !== "EDIT") return;
    updateRow(columns[selectedPosition.idx], selectedPosition.rowIdx, selectedPosition.row);
  }
  function handleCopy() {
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx;
    var sourceRow = rawRows[getRawRowIdx(rowIdx)];
    var sourceColumnKey = columns[idx].key;
    setCopiedCell({
      row: sourceRow,
      columnKey: sourceColumnKey
    });
    onCopy == null ? void 0 : onCopy({
      sourceRow: sourceRow,
      sourceColumnKey: sourceColumnKey
    });
  }
  function handlePaste() {
    if (!(onPaste && onRowsChange) || copiedCell === null || !isCellEditable(selectedPosition)) {
      return;
    }
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx;
    var targetColumn = columns[idx];
    var targetRow = rawRows[getRawRowIdx(rowIdx)];
    var updatedTargetRow = onPaste({
      sourceRow: copiedCell.row,
      sourceColumnKey: copiedCell.columnKey,
      targetRow: targetRow,
      targetColumnKey: targetColumn.key
    });
    updateRow(targetColumn, rowIdx, updatedTargetRow);
  }
  function handleCellInput(event) {
    var _column$editorOptions;
    if (!selectedCellIsWithinViewportBounds) return;
    var row = rows[selectedPosition.rowIdx];
    if (isGroupRow(row)) return;
    var key = event.key,
      shiftKey = event.shiftKey;
    if (isSelectable && shiftKey && key === " ") {
      assertIsValidKeyGetter(rowKeyGetter);
      var rowKey = rowKeyGetter(row);
      selectRow({
        row: row,
        checked: !selectedRows1.has(rowKey),
        isShiftClick: false
      });
      event.preventDefault();
      return;
    }
    var column = columns4[selectedPosition.idx];
    (_column$editorOptions = column.editorOptions) == null ? void 0 : _column$editorOptions.onCellKeyDown == null ? void 0 : _column$editorOptions.onCellKeyDown(event);
    if (event.isDefaultPrevented()) return;
    if (isCellEditable(selectedPosition) && isDefaultCellInput(event)) {
      setSelectedPosition(function (_ref7) {
        var idx = _ref7.idx,
          rowIdx = _ref7.rowIdx;
        return {
          idx: idx,
          rowIdx: rowIdx,
          mode: "EDIT",
          row: row,
          originalRow: row
        };
      });
    }
  }
  function isColIdxWithinSelectionBounds(idx) {
    return idx >= minColIdx && idx <= maxColIdx;
  }
  function isRowIdxWithinViewportBounds(rowIdx) {
    return rowIdx >= 0 && rowIdx < rows.length;
  }
  function isCellWithinSelectionBounds(_ref8) {
    var idx = _ref8.idx,
      rowIdx = _ref8.rowIdx;
    return rowIdx >= minRowIdx && rowIdx <= maxRowIdx && isColIdxWithinSelectionBounds(idx);
  }
  function isCellWithinViewportBounds(_ref9) {
    var idx = _ref9.idx,
      rowIdx = _ref9.rowIdx;
    return isRowIdxWithinViewportBounds(rowIdx) && isColIdxWithinSelectionBounds(idx);
  }
  function isCellEditable(position) {
    return isCellWithinViewportBounds(position) && isSelectedCellEditable({
      columns4: columns4,
      rows: rows,
      selectedPosition: position,
      isGroupRow: isGroupRow
    });
  }
  function selectCell(position, enableEditor) {
    if (!isCellWithinSelectionBounds(position)) return;
    commitEditorChanges();
    if (enableEditor && isCellEditable(position)) {
      var row = rows[position.rowIdx];
      setSelectedPosition(_extends$1({}, position, {
        mode: "EDIT",
        row: row,
        originalRow: row
      }));
    } else if (isSamePosition(selectedPosition, position)) {
      var _gridRef$current;
      scrollIntoView((_gridRef$current = gridRef.current) == null ? void 0 : _gridRef$current.querySelector('[tabindex="0"]'));
    } else {
      setSelectedPosition(_extends$1({}, position, {
        mode: "SELECT"
      }));
    }
  }
  function scrollToColumn(idx) {
    var current = gridRef.current;
    if (!current) return;
    if (idx > lastFrozenColumnIndex) {
      var rowIdx = selectedPosition.rowIdx;
      if (!isCellWithinSelectionBounds({
        rowIdx: rowIdx,
        idx: idx
      })) return;
      var clientWidth = current.clientWidth;
      var column = columns[idx];
      var _columnMetrics$get = columnMetrics.get(column),
        left = _columnMetrics$get.left,
        width = _columnMetrics$get.width;
      var right = left + width;
      var colSpan = getSelectedCellColSpan({
        rows: rows,
        topSummaryRows: topSummaryRows,
        bottomSummaryRows: bottomSummaryRows,
        rowIdx: rowIdx,
        lastFrozenColumnIndex: lastFrozenColumnIndex,
        column: column,
        isGroupRow: isGroupRow
      });
      if (colSpan !== undefined) {
        var _columnMetrics$get2 = columnMetrics.get(columns[column.idx + colSpan - 1]),
          _left = _columnMetrics$get2.left,
          _width2 = _columnMetrics$get2.width;
        right = _left + _width2;
      }
      var isCellAtLeftBoundary = left < scrollLeft + totalFrozenColumnWidth;
      var isCellAtRightBoundary = right > clientWidth + scrollLeft;
      var _sign = isRtl ? -1 : 1;
      if (isCellAtLeftBoundary) {
        current.scrollLeft = (left - totalFrozenColumnWidth) * _sign;
      } else if (isCellAtRightBoundary) {
        current.scrollLeft = (right - clientWidth) * _sign;
      }
    }
  }
  function getNextPosition(key, ctrlKey, shiftKey) {
    var idx = selectedPosition.idx,
      rowIdx = selectedPosition.rowIdx;
    var row = rows[rowIdx];
    var isRowSelected = selectedCellIsWithinSelectionBounds && idx === -1;
    if (key === leftKey && isRowSelected && isGroupRow(row) && !row.isExpanded && row.level !== 0) {
      var parentRowIdx = -1;
      for (var _i4 = selectedPosition.rowIdx - 1; _i4 >= 0; _i4--) {
        var parentRow = rows[_i4];
        if (isGroupRow(parentRow) && parentRow.id === row.parentId) {
          parentRowIdx = _i4;
          break;
        }
      }
      if (parentRowIdx !== -1) {
        return {
          idx: idx,
          rowIdx: parentRowIdx
        };
      }
    }
    switch (key) {
      case "ArrowUp":
        return {
          idx: idx,
          rowIdx: rowIdx - 1
        };
      case "ArrowDown":
        return {
          idx: idx,
          rowIdx: rowIdx + 1
        };
      case leftKey:
        return {
          idx: idx - 1,
          rowIdx: rowIdx
        };
      case rightKey:
        return {
          idx: idx + 1,
          rowIdx: rowIdx
        };
      case "Tab":
        return {
          idx: idx + (shiftKey ? -1 : 1),
          rowIdx: rowIdx
        };
      case "Home":
        if (isRowSelected) return {
          idx: idx,
          rowIdx: 0
        };
        return {
          idx: 0,
          rowIdx: ctrlKey ? minRowIdx : rowIdx
        };
      case "End":
        if (isRowSelected) return {
          idx: idx,
          rowIdx: rows.length - 1
        };
        return {
          idx: maxColIdx,
          rowIdx: ctrlKey ? maxRowIdx : rowIdx
        };
      case "PageUp":
        {
          if (selectedPosition.rowIdx === minRowIdx) return selectedPosition;
          var nextRowY = getRowTop(rowIdx) + getRowHeight(rowIdx) - clientHeight;
          return {
            idx: idx,
            rowIdx: nextRowY > 0 ? findRowIdx(nextRowY) : 0
          };
        }
      case "PageDown":
        {
          if (selectedPosition.rowIdx >= rows.length) return selectedPosition;
          var _nextRowY = getRowTop(rowIdx) + clientHeight;
          return {
            idx: idx,
            rowIdx: _nextRowY < totalRowHeight ? findRowIdx(_nextRowY) : rows.length - 1
          };
        }
      default:
        return selectedPosition;
    }
  }
  function navigate(event) {
    var key = event.key,
      shiftKey = event.shiftKey;
    var mode = cellNavigationMode;
    if (key === "Tab") {
      if (canExitGrid({
        shiftKey: shiftKey,
        cellNavigationMode: cellNavigationMode,
        maxColIdx: maxColIdx,
        minRowIdx: minRowIdx,
        maxRowIdx: maxRowIdx,
        selectedPosition: selectedPosition
      })) {
        commitEditorChanges();
        return;
      }
      mode = cellNavigationMode === "NONE" ? "CHANGE_ROW" : cellNavigationMode;
    }
    event.preventDefault();
    var ctrlKey = isCtrlKeyHeldDown(event);
    var nextPosition = getNextPosition(key, ctrlKey, shiftKey);
    if (isSamePosition(selectedPosition, nextPosition)) return;
    var nextSelectedCellPosition = getNextSelectedCellPosition({
      columns: columns,
      colSpanColumns: colSpanColumns,
      rows: rows,
      topSummaryRows: topSummaryRows,
      bottomSummaryRows: bottomSummaryRows,
      minRowIdx: minRowIdx,
      maxRowIdx: maxRowIdx,
      lastFrozenColumnIndex: lastFrozenColumnIndex,
      cellNavigationMode: mode,
      currentPosition: selectedPosition,
      nextPosition: nextPosition,
      isCellWithinBounds: isCellWithinSelectionBounds,
      isGroupRow: isGroupRow
    });
    selectCell(nextSelectedCellPosition);
  }
  function getDraggedOverCellIdx(currentRowIdx) {
    if (draggedOverRowIdx === undefined) return;
    var rowIdx = selectedPosition.rowIdx;
    var isDraggedOver = rowIdx < draggedOverRowIdx ? rowIdx < currentRowIdx && currentRowIdx <= draggedOverRowIdx : rowIdx > currentRowIdx && currentRowIdx >= draggedOverRowIdx;
    return isDraggedOver ? selectedPosition.idx : undefined;
  }
  function getLayoutCssVars() {
    if (flexWidthViewportColumns.length === 0) return layoutCssVars;
    var newTemplateColumns = [].concat(templateColumns);
    for (var _iterator11 = _createForOfIteratorHelperLoose(flexWidthViewportColumns), _step11; !(_step11 = _iterator11()).done;) {
      var column = _step11.value;
      newTemplateColumns[column.idx] = column.width;
    }
    return _extends$1({}, layoutCssVars, {
      gridTemplateColumns: newTemplateColumns.join(" ")
    });
  }
  function handleFill(_ref10) {
    var _extends2;
    var columnKey = _ref10.columnKey,
      sourceRow = _ref10.sourceRow,
      targetRow = _ref10.targetRow;
    return _extends$1({}, targetRow, (_extends2 = {}, _extends2[columnKey] = sourceRow[columnKey], _extends2));
  }
  function getDragHandle(rowIdx) {
    if (selectedPosition.rowIdx !== rowIdx || selectedPosition.mode === "EDIT" || hasGroups || onFill == null) {
      return;
    }
    return /*#__PURE__*/jsx(DragHandle, {
      rows: rawRows,
      columns: columns,
      selectedPosition: selectedPosition,
      isCellEditable: isCellEditable,
      latestDraggedOverRowIdx: latestDraggedOverRowIdx,
      onRowsChange: onRowsChange,
      onFill: onFill ? handleFill : null,
      setDragging: setDragging,
      setDraggedOverRowIdx: setDraggedOverRowIdx
    });
  }
  function getCellEditor(rowIdx) {
    if (selectedPosition.rowIdx !== rowIdx || selectedPosition.mode === "SELECT") return;
    var idx = selectedPosition.idx,
      row = selectedPosition.row;
    var column = columns4[idx];
    var colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "ROW",
      row: row,
      expandedMasterRowIds: expandedMasterRowIds
    });
    var closeEditor = function closeEditor() {
      setSelectedPosition(function (_ref11) {
        var idx = _ref11.idx,
          rowIdx = _ref11.rowIdx;
        return {
          idx: idx,
          rowIdx: rowIdx,
          mode: "SELECT"
        };
      });
    };
    var onRowChange = function onRowChange(row, commitChanges) {
      if (commitChanges) {
        updateRow(column, selectedPosition.rowIdx, row);
        closeEditor();
      } else {
        setSelectedPosition(function (position) {
          return _extends$1({}, position, {
            row: row
          });
        });
      }
    };
    if (rows[selectedPosition.rowIdx] !== selectedPosition.originalRow) {
      closeEditor();
    }
    return /*#__PURE__*/jsx(EditCell, {
      column: column,
      colSpan: colSpan,
      row: row,
      handleReorderRow: handleReorderRow,
      allrow: raawRows,
      rowIndex: rowIdx,
      api: apiObject,
      node: node,
      onRowChange: onRowChange,
      closeEditor: closeEditor
    }, "" + column.key);
  }
  function getRowViewportColumns(rowIdx) {
    var selectedColumn = columns[selectedPosition.idx];
    if (selectedColumn !== undefined && selectedPosition.rowIdx === rowIdx && !viewportColumns.includes(selectedColumn)) {
      return selectedPosition.idx > colOverscanEndIdx ? [].concat(viewportColumns, [selectedColumn]) : [].concat(viewportColumns.slice(0, lastFrozenColumnIndex + 1), [selectedColumn], viewportColumns.slice(lastFrozenColumnIndex + 1));
    }
    return viewportColumns;
  }
  var node;
  var endRowIdxForRender;
  var _useState30 = useState([]),
    RowNodes = _useState30[0],
    setRowNodes = _useState30[1];
  function forEachNode(newFunction) {
    RowNodes.forEach(function (data) {
      newFunction(data);
    });
  }
  function getRowBounds(index) {
    return {
      rowTop: RowNodes[index].rowTop,
      rowHeight: RowNodes[index].rowHeight
    };
  }
  function isRowPresent(object1) {
    var result = false;
    RowNodes.forEach(function (obj) {
      if (_.isEqual(object1, obj)) {
        result = true;
      }
    });
    return result;
  }
  function getNodesInRangeForSelection(obj1, obj2) {
    var firstIndex;
    var secondIndex;
    var startIndex;
    var endIndex;
    RowNodes.forEach(function (obj, idx) {
      if (_.isEqual(obj1, obj)) {
        firstIndex = idx;
      }
      return true;
    });
    RowNodes.forEach(function (obj, idx) {
      if (_.isEqual(obj2, obj)) {
        secondIndex = idx;
      }
      return true;
    });
    if (firstIndex && secondIndex) {
      if (firstIndex < secondIndex) {
        startIndex = firstIndex;
        endIndex = secondIndex;
      } else {
        endIndex = firstIndex;
        startIndex = secondIndex;
      }
    } else if (firstIndex) {
      startIndex = 0;
      endIndex = firstIndex;
    } else if (secondIndex) {
      startIndex = 0;
      endIndex = secondIndex;
    }
    return RowNodes.slice(startIndex, endIndex + 1);
  }
  var getModelObject = {
    getRow: function getRow(index) {
      return RowNodes[index];
    },
    getRowNode: function getRowNode(idValue) {
      return RowNodes.filter(function (data) {
        return data.id === idValue;
      });
    },
    getRowCount: function getRowCount() {
      return rows.length;
    },
    getTopLevelRowCount: function getTopLevelRowCount() {
      return rows.length;
    },
    getTopLevelRowDisplayedIndex: function getTopLevelRowDisplayedIndex(index) {
      return rows[index] ? index : null;
    },
    getRowIndexAtPixel: function getRowIndexAtPixel(pixel) {
      return Math.floor(pixel / rowHeight);
    },
    isRowPresent: isRowPresent,
    getRowBounds: getRowBounds,
    isEmpty: function isEmpty() {
      return raawRows.length === 0;
    },
    isRowsToRender: function isRowsToRender() {
      return endRowIdxForRender !== 0;
    },
    getNodesInRangeForSelection: getNodesInRangeForSelection,
    forEachNode: forEachNode,
    getType: function getType() {
      return "clientSide";
    },
    isLastRowIndexKnown: function isLastRowIndexKnown() {
      return true;
    }
  };
  function applyTransaction(transactionObject) {
    var _transactionObject$re;
    var newRows = rows;
    var updatedRowNodes = {
      added: [],
      updated: [],
      removed: []
    };
    var isUpdated = 0;
    var rowIndex1 = transactionObject.addIndex + 1;
    for (var _i5 = 0; _i5 < ((_transactionObject$ad = transactionObject.add) == null ? void 0 : _transactionObject$ad.length); _i5++) {
      var _transactionObject$ad;
      var rowIndex = void 0;
      if (rowKeyGetter) {
        rowIndex = findRowIndex(rowKeyGetter(transactionObject.add[_i5]));
      } else {
        rowIndex = findRowIndex(transactionObject.add[_i5].id);
      }
      if (rowIndex === -1) {
        if (transactionObject.addIndex) {
          if (transactionObject.addIndex > raawRows.length) return;
          var newRowNode = createNewRowNode(rowIndex1, transactionObject.add[_i5]);
          newRows.splice(rowIndex1, 0, newRowNode.data);
          LeafNodes.splice(rowIndex1, 0, newRowNode);
          updatedRowNodes.added.push(LeafNodes[rowIndex1]);
          rowIndex1++;
          isUpdated++;
        } else {
          rowIndex = transactionObject.add[_i5].id - 1;
          var _newRowNode = createNewRowNode(rowIndex, transactionObject.add[_i5]);
          newRows.splice(rowIndex, 0, _newRowNode.data);
          LeafNodes.splice(rowIndex, 0, _newRowNode);
          updatedRowNodes.added.push(_newRowNode);
          isUpdated++;
        }
      }
    }
    for (var _i6 = 0; _i6 < ((_transactionObject$up = transactionObject.update) == null ? void 0 : _transactionObject$up.length); _i6++) {
      var _transactionObject$up;
      var values = Object.entries(transactionObject.update[_i6]);
      var _rowIndex = void 0;
      if (rowKeyGetter) {
        _rowIndex = findRowIndex(rowKeyGetter(transactionObject.update[_i6]));
      } else {
        _rowIndex = findRowIndex(transactionObject.update[_i6].id);
      }
      for (var j = 0; j < values.length; j++) {
        var field = values[j][0];
        var _value6 = values[j][1];
        LeafNodes[_rowIndex].data[field] = _value6;
      }
      updatedRowNodes.updated.push(LeafNodes[_rowIndex]);
      isUpdated++;
    }
    (_transactionObject$re = transactionObject.remove) == null ? void 0 : _transactionObject$re.sort(function (a, b) {
      return a.id < b.id ? 1 : -1;
    });
    for (var _i7 = 0; _i7 < ((_transactionObject$re2 = transactionObject.remove) == null ? void 0 : _transactionObject$re2.length); _i7++) {
      var _transactionObject$re2;
      var _rowIndex2 = void 0;
      if (rowKeyGetter) {
        _rowIndex2 = findRowIndex(rowKeyGetter(transactionObject.remove[_i7]));
      } else {
        _rowIndex2 = findRowIndex(transactionObject.remove[_i7].id);
      }
      if (_rowIndex2 > -1) {
        newRows.splice(_rowIndex2, 1);
        updatedRowNodes.removed.push(LeafNodes[_rowIndex2]);
        LeafNodes.splice(_rowIndex2, 1);
        isUpdated++;
      }
    }
    if (isUpdated > 0) RowNodes[0].setDataValue("", "");
    return updatedRowNodes;
  }
  function setRowData(rowData) {
    if (rowData) {
      setRawRows(rowData);
    }
  }
  var LeafNodes = getAllLeafNodes();
  function getAllLeafNodes() {
    var leafNodes = [];
    for (var _i8 = 0; _i8 < raawRows.length; _i8++) {
      var _raawRows$_i8$id;
      var node = {
        rowIndex: _i8,
        childIndex: _i8 + 1,
        data: raawRows[_i8],
        rowHeight: getRowHeight(_i8),
        lastChild: raawRows.length === _i8 + 1,
        firstChild: _i8 === 0,
        id: (_raawRows$_i8$id = raawRows[_i8].id) != null ? _raawRows$_i8$id : String(_i8)
      };
      leafNodes.push(node);
    }
    return leafNodes;
  }
  function forEachLeafNode(callback, rowNodes) {
    var updatedLeafNodes = [];
    for (var _i9 = 0; (_ref12 = _i9 < (rowNodes == null ? void 0 : rowNodes.length)) != null ? _ref12 : LeafNodes.length; _i9++) {
      var _ref12, _rowNodes$_i, _rowNodes$_i9$data;
      callback((_rowNodes$_i = rowNodes[_i9]) != null ? _rowNodes$_i : LeafNodes[_i9]);
      updatedLeafNodes.push((_rowNodes$_i9$data = rowNodes[_i9].data) != null ? _rowNodes$_i9$data : LeafNodes[_i9].data);
    }
    setRawRows(updatedLeafNodes);
  }
  function forEachLeafNodeAfterFilter(callback) {
    forEachLeafNode(callback, RowNodes);
  }
  function forEachLeafNodeAfterFilterAndSort(callback) {
    forEachLeafNode(callback, RowNodes);
  }
  function findRowIndex(id) {
    var index = -1;
    for (var _i10 = 0; _i10 < LeafNodes.length; _i10++) {
      var _LeafNodes$_i10$data;
      if (id === ((_LeafNodes$_i10$data = LeafNodes[_i10].data) == null ? void 0 : _LeafNodes$_i10$data.id)) index = LeafNodes[_i10].rowIndex;
    }
    return index;
  }
  function createNewRowNode(index, data) {
    var _data$id;
    var newRowNode = {
      rowIndex: index,
      childIndex: index + 1,
      data: data,
      rowHeight: getRowHeight(index),
      lastChild: LeafNodes.length === index - 1,
      firstChild: index === 0,
      id: (_data$id = data.id) != null ? _data$id : String(index + 1)
    };
    return newRowNode;
  }
  function selectAll(filteredRows) {
    if (!onSelectedRowsChange) return;
    assertIsValidKeyGetter(rowKeyGetter);
    var newSelectedRows = new Set(selectedRows1);
    var newSelectedRows1 = selectedRows;
    for (var _iterator12 = _createForOfIteratorHelperLoose((_filteredRows$data = filteredRows == null ? void 0 : filteredRows.data) != null ? _filteredRows$data : rawRows), _step12; !(_step12 = _iterator12()).done;) {
      var _filteredRows$data;
      var row = _step12.value;
      var rowKey = rowKeyGetter(row);
      newSelectedRows.add(rowKey);
      if (!newSelectedRows1.includes(row)) newSelectedRows1.push(row);
    }
    onSelectedRowsChange1(newSelectedRows);
  }
  function deselectAll(filteredRows) {
    if (!onSelectedRowsChange) return;
    assertIsValidKeyGetter(rowKeyGetter);
    var newSelectedRows = new Set(selectedRows1);
    var newSelectedRows1 = selectedRows;
    for (var _iterator13 = _createForOfIteratorHelperLoose((_filteredRows$data2 = filteredRows == null ? void 0 : filteredRows.data) != null ? _filteredRows$data2 : rawRows), _step13; !(_step13 = _iterator13()).done;) {
      var _filteredRows$data2;
      var row = _step13.value;
      var rowKey = rowKeyGetter(row);
      newSelectedRows.delete(rowKey);
      newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
    }
    onSelectedRowsChange1(newSelectedRows);
  }
  function getSelectedNodes() {
    var selectedNodes = [];
    if (selectedRows1 === undefined) return selectedRows;
    var selectedRowsSet = Array.from(selectedRows1);
    RowNodes == null ? void 0 : RowNodes.forEach(function (rowNode) {
      var rowKey = rowKeyGetter == null ? void 0 : rowKeyGetter(rowNode.data);
      if (selectedRowsSet.includes(rowKey)) selectedNodes.push(rowNode);
    });
    return selectedNodes;
  }
  function getSelectedRows() {
    var selectedRows = [];
    if (selectedRows1 === undefined) return selectedRows;
    var selectedRowsSet = Array.from(selectedRows1);
    raawRows.forEach(function (row) {
      var rowKey = rowKeyGetter == null ? void 0 : rowKeyGetter(row);
      if (selectedRowsSet.includes(rowKey)) selectedRows.push(row);
    });
    return selectedRows;
  }
  function selectAllFiltered() {
    selectAll(RowNodes);
  }
  function deselectAllFiltered() {
    deselectAll(RowNodes);
  }
  var totalPages = Math.floor(raawRows.length / size) + (raawRows.length % size < 0 ? 1 : 0);
  function paginationGoToPage(pageNumberNew) {
    if (pagination) {
      if (0 < pageNumberNew && pageNumberNew <= totalPages) {
        setCurrent(pageNumberNew);
      } else if (pageNumberNew < 0) {
        setCurrent(1);
      } else if (pageNumberNew > totalPages) {
        setCurrent(totalPages);
      }
    }
  }
  function paginationGoToNextPage() {
    if (pagination && current + 1 <= totalPages) {
      setCurrent(current + 1);
    }
  }
  function paginationGoToPreviousPage() {
    if (pagination && current - 1 > 0) {
      setCurrent(current - 1);
    }
  }
  function getFocusedCell() {
    return selectedPosition.rowIdx >= 0 ? {
      rowIndex: selectedPosition.rowIdx,
      column: columns[selectedPosition.idx]
    } : undefined;
  }
  function setFocusedCell(idx, key) {
    var index;
    columns.map(function (obj, position) {
      if (obj.key === key) {
        index = position;
      }
      return true;
    });
    setSelectedPosition({
      idx: index,
      rowIdx: idx,
      mode: "SELECT"
    });
  }
  function tabToNextCell() {
    var columnLength = columns.length;
    var rowsLength = rows.length;
    var idx;
    var rowIdx;
    if (selectedPosition.idx + 1 < columnLength) {
      idx = selectedPosition.idx + 1;
      rowIdx = selectedPosition.rowIdx;
    } else {
      idx = 0;
      rowIdx = selectedPosition.rowIdx + 1 < rowsLength ? selectedPosition.rowIdx + 1 : 0;
    }
    setSelectedPosition({
      idx: idx,
      rowIdx: rowIdx,
      mode: "SELECT"
    });
  }
  function tabToPreviousCell() {
    var columnLength = columns.length;
    var rowsLength = rows.length;
    var idx;
    var rowIdx;
    if (selectedPosition.idx - 1 >= 0) {
      idx = selectedPosition.idx - 1;
      rowIdx = selectedPosition.rowIdx;
    } else {
      idx = columnLength - 1;
      rowIdx = selectedPosition.rowIdx - 1 >= 0 ? selectedPosition.rowIdx - 1 : rowsLength - 1;
    }
    setSelectedPosition({
      idx: idx,
      rowIdx: rowIdx,
      mode: "SELECT"
    });
  }
  function exportDataAsCsv(fileName) {
    var name = fileName != null ? fileName : "ExportToCSV";
    exportToCsv(rawRows, rawColumns, name);
  }
  function exportDataAsExcel(fileName) {
    var name = fileName != null ? fileName : "ExportToXlsx";
    exportToXlsx(rawRows, rawColumns, name);
  }
  function exportDataAsPdf(fileName) {
    var name = fileName != null ? fileName : "ExportToPdf";
    exportToPdf(rawRows, rawColumns, name);
  }
  function isAnyFilterPresent() {
    var filterPresent = false;
    viewportColumns.forEach(function (obj) {
      if (obj != null && obj.filter) filterPresent = true;
    });
    return filterPresent;
  }
  var getViewportRowsSample = function getViewportRowsSample(rowArray) {
    var rowElementsSample = [];
    var listOfRows = rowArray;
    var node;
    var selectedRowIdx = selectedPosition.rowIdx;
    var startRowIdx = 0;
    var endRowIdx = listOfRows.length - 1;
    var _loop2 = function _loop2() {
      var _row$id, _rows$rowIdx;
      var rowIdx = viewportRowIdx;
      var row = listOfRows[rowIdx];
      function setDataValue(key, newValue) {
        var data = row;
        data[key] = newValue;
        var list = [].concat(rawRows);
        list[rowIdx] = data;
        setRawRows(list);
      }
      function setData(newValue) {
        var list = [].concat(rawRows);
        list[rowIdx] = newValue;
        setRawRows(list);
      }
      node = {
        rowIndex: rowIdx,
        rowTop: rowIdx * rowHeight,
        childIndex: rowIdx + 1,
        data: row,
        rowHeight: rowHeight,
        lastChild: raawRows.length === rowIdx + 1,
        firstChild: rowIdx === 0,
        id: (_row$id = row == null ? void 0 : row.id) != null ? _row$id : String(rowIdx),
        selected: selectedRowIdx === rowIdx,
        setDataValue: setDataValue,
        setData: setData,
        parent: {
          allLeafChildren: RowNodes,
          childrenAfterFilter: afterFilter,
          childrenAfterSort: afterSort
        },
        expanded: (_rows$rowIdx = rows[rowIdx]) == null ? void 0 : _rows$rowIdx.isExpanded,
        isSelected: function isSelected() {
          return selectedRowIdx === rowIdx;
        },
        setSelected: function setSelected() {
          selectRow({
            row: row,
            checked: !selectedRows.includes(rowKeyGetter(row)),
            isShiftClick: false
          });
        },
        isExpandable: function isExpandable() {
          var _rows$rowIdx2;
          return (_rows$rowIdx2 = rows[rowIdx]) == null ? void 0 : _rows$rowIdx2.isExpanded;
        },
        setExpanded: function setExpanded(value) {
          var expandIds = new Set(expandedGroupIds);
          var rowKey = rowKeyGetter(rows[rowIdx]);
          if (value) {
            expandIds.add(rowKey);
          } else {
            expandIds.delete(rowKey);
          }
          onExpandedGroupIdsChange(expandIds);
        },
        updateData: setData
      };
      rowElementsSample.push(node);
    };
    for (var viewportRowIdx = startRowIdx; viewportRowIdx <= endRowIdx; viewportRowIdx++) {
      _loop2();
    }
    return rowElementsSample;
  };
  function setSuppressRowDrag(value) {
    if (value) {
      var sampleColumn = raawColumns.map(function (obj) {
        if (obj != null && obj.rowDrag) {
          return _extends$1({}, obj, {
            rowDrag: false
          });
        } else {
          return obj;
        }
      });
      setRawColumns(sampleColumn);
    }
  }
  function getVerticalPixelRange() {
    return {
      top: scrollTop,
      bottom: scrollTop + document.getElementById("DataGrid").offsetHeight
    };
  }
  function getHorizontalPixelRange() {
    return {
      left: scrollLeft,
      right: scrollLeft + document.getElementById("DataGrid").offsetWidth
    };
  }
  function isColumnFilterPresent() {
    var sampleKeys = Object.keys(filters);
    var result = false;
    sampleKeys.forEach(function (value) {
      if (value === "undefined" || value === "enabled") ; else {
        if (filters[value] !== "") {
          result = true;
        }
      }
    });
    return result;
  }
  var _useState31 = useState(null),
    selectedData = _useState31[0],
    setSelectedData = _useState31[1];
  useUpdateEffect$1(function () {
    if (selectedPosition.mode === "EDIT") {
      var _columns$selectedPosi;
      if ((_columns$selectedPosi = columns[selectedPosition.idx]) != null && _columns$selectedPosi.cellEditor) {
        setSelectedData(selectedPosition);
      }
    }
  }, [selectedPosition]);
  function getEditingCells() {
    return {
      rowIndex: selectedData.rowIdx,
      column: columns[selectedData.idx]
    };
  }
  function setRowNodeExpanded(rowNode, expanded, expandParents) {
    var rData = rowNode.data;
    var item = raawGroupBy == null ? void 0 : raawGroupBy.map(function (value) {
      return rData[value];
    });
    var sample = [];
    for (var _i11 = 1; _i11 <= item.length; _i11++) {
      sample.push(item.slice(0, _i11).join("__"));
    }
    if (expanded && expandParents) onExpandedGroupIdsChange(new Set(sample));
  }
  var _useState32 = useState(false),
    showHorizontalScroll = _useState32[0],
    setShowHorizontalScroll = _useState32[1];
  var _useState33 = useState(false),
    showVerticalScroll = _useState33[0],
    setShowVerticalScroll = _useState33[1];
  if (showHorizontalScroll || showVerticalScroll) {
    var gridDiv = document.getElementById("DataGrid");
    if (showHorizontalScroll && showVerticalScroll) {
      gridDiv.style.overflowX = "scroll";
      gridDiv.style.overflowY = "scroll";
    } else if (showHorizontalScroll) {
      gridDiv.style.overflowX = "scroll";
      gridDiv.style.overflowY = "auto";
    } else if (showVerticalScroll) {
      gridDiv.style.overflowY = "scroll";
      gridDiv.style.overflowX = "auto";
    }
  }
  function setAlwaysShowHorizontalScroll(show) {
    setShowHorizontalScroll(show);
  }
  function setAlwaysShowVerticalScroll(show) {
    setShowVerticalScroll(show);
  }
  function Scroll(index, rowCount, position, current) {
    if (position === "top") {
      current.scrollTo({
        top: getRowTop(index),
        behavior: "smooth"
      });
    } else if (position === undefined || position === null || position === "bottom") {
      current.scrollTo({
        top: getRowTop(index - rowCount + 2),
        behavior: "smooth"
      });
    } else if (position === "middle") {
      var visibile = rowCount + 2 % 1 !== 0 ? Math.floor((rowCount + 2) / 2) - 2 : Math.floor((rowCount + 2) / 2);
      current.scrollTo({
        top: getRowTop(index - visibile),
        behavior: "smooth"
      });
    }
  }
  var div_height = (_document$getElementB = document.getElementById("DataGrid")) == null ? void 0 : _document$getElementB.clientHeight;
  var rowCount = Math.floor(div_height / rowHeight);
  function ensureIndexVisible(index, position) {
    var current = gridRef.current;
    if (!current) return;
    Scroll(index, rowCount, position, current);
  }
  function ensureNodeVisible(rowNode, position) {
    var current = gridRef.current;
    var index;
    if (rowNode.rowIndex) {
      index = rowNode.rowIndex;
    } else {
      rows == null ? void 0 : rows.map(function (obj, idx) {
        if (JSON.stringify(rowNode) === JSON.stringify(obj)) {
          index = idx;
        }
        return true;
      });
    }
    if (!current) return;
    Scroll(index, rowCount, position, current);
  }
  function ensureColumnVisible(key) {
    var columnsValue = raawColumns.map(function (data) {
      return Object.values(data);
    });
    var index;
    if (typeof key === "string") {
      columnsValue.map(function (data, idx) {
        if (data.includes(key)) {
          index = idx;
        }
      });
    }
    scrollToColumn(index);
  }
  function setCellValue(rowIndex, colKey, newValue) {
    raawRows[rowIndex][colKey] = newValue;
    setRawRows([].concat(raawRows));
  }
  var apiObject = {
    setCellValue: setCellValue,
    updateColumns: function updateColumns(newColumns) {
      setRawColumns([].concat(newColumns));
    },
    getColumnDefs: function getColumnDefs() {
      return rawColumns;
    },
    handlePrint: handlePrint,
    getFirstRenderedData: function getFirstRenderedData() {
      return previousData;
    },
    setColumnDefs: function setColumnDefs(columns) {
      return setRawColumns(columns);
    },
    setRowData: setRowData,
    getRowNode: function getRowNode(value) {
      return RowNodes[value];
    },
    setHeaderHeight: function setHeaderHeight(height) {
      return setHeaderHeightFromRef(height);
    },
    getDisplayedRowCount: function getDisplayedRowCount() {
      return rawRows.length;
    },
    getDisplayedRowAtIndex: function getDisplayedRowAtIndex(index) {
      return rawRows[index];
    },
    getFirstDisplayedRow: function getFirstDisplayedRow() {
      return rawRows[0];
    },
    getLastDisplayedRow: function getLastDisplayedRow() {
      return raawRows[raawRows.length - 1];
    },
    getModel: function getModel() {
      return getModelObject;
    },
    forEachNode: forEachNode,
    forEachLeafNode: forEachLeafNode,
    forEachLeafNodeAfterFilter: forEachLeafNodeAfterFilter,
    forEachLeafNodeAfterFilterAndSort: forEachLeafNodeAfterFilterAndSort,
    getSelectedNodes: getSelectedNodes,
    applyTransaction: applyTransaction,
    getSelectedRows: getSelectedRows,
    getValue: function getValue(colKey, rowNode) {
      return LeafNodes[rowNode.rowIndex].data[colKey];
    },
    selectAll: selectAll,
    deselectAll: deselectAll,
    selectAllFiltered: selectAllFiltered,
    deselectAllFiltered: deselectAllFiltered,
    getRenderedNodes: function getRenderedNodes() {
      return renderedRowNodes;
    },
    setPagination: function setPagination(value) {
      return _setPagination(value);
    },
    paginationIsLastPageFound: function paginationIsLastPageFound() {
      return true;
    },
    paginationGetPageSize: function paginationGetPageSize() {
      return pagination ? size : raawRows.length;
    },
    paginationSetPageSize: function paginationSetPageSize(newPageSize) {
      return pagination ? setSize(newPageSize) : null;
    },
    paginationGetCurrentPage: function paginationGetCurrentPage() {
      return current - 1;
    },
    paginationGetTotalPages: function paginationGetTotalPages() {
      return Math.floor(raawRows.length / size) + (raawRows.length % size < 0 ? 1 : 0);
    },
    paginationGetRowCount: function paginationGetRowCount() {
      return pagination ? raawRows.length : 0;
    },
    paginationGoToPage: paginationGoToPage,
    paginationGoToNextPage: paginationGoToNextPage,
    paginationGoToPreviousPage: paginationGoToPreviousPage,
    paginationGoToFirstPage: function paginationGoToFirstPage() {
      return pagination ? setCurrent(1) : null;
    },
    paginationGoToLastPage: function paginationGoToLastPage() {
      return pagination ? setCurrent(totalPages) : null;
    },
    rowModel: {
      rowsToDisplay: RowNodes,
      rootNode: {
        allLeafChildren: RowNodes,
        childrenAfterFilter: afterFilter,
        childrenAfterSort: afterSort
      },
      columnModel: {
        columnDefs: rawColumns,
        displayedColumns: columns
      },
      nodeManager: {
        allNodesMap: RowNodes
      },
      csvCreator: {
        exportDataAsCsv: exportDataAsCsv
      }
    },
    getFocusedCell: getFocusedCell,
    setFocusedCell: setFocusedCell,
    clearFocusedCell: function clearFocusedCell() {
      return setSelectedPosition(initialPosition);
    },
    tabToNextCell: tabToNextCell,
    tabToPreviousCell: tabToPreviousCell,
    exportDataAsCsv: exportDataAsCsv,
    exportDataAsExcel: exportDataAsExcel,
    exportDataAsPdf: exportDataAsPdf,
    setDefaultColDef: function setDefaultColDef(value) {
      return setDefaultColumnDef(_extends$1({}, defaultColumnDef, value));
    },
    isAnyFilterPresent: isAnyFilterPresent,
    expandAll: function expandAll() {
      return setExpandAll(true);
    },
    collapseAll: function collapseAll() {
      return setExpandAll(false);
    },
    getFilterModel: function getFilterModel() {
      return filters;
    },
    setQuickFilter: function setQuickFilter(newValue) {
      var filteredRows = raawRows == null ? void 0 : raawRows.filter(function (row) {
        for (var key in row) {
          if (row && row[key].toString().toLowerCase().includes(newValue)) return true;
        }
      });
      setRawRows([].concat(filteredRows));
    },
    setFilterModel: function setFilterModel(value) {
      return setFilters(_extends$1({}, filters, value));
    },
    destroyFilter: function destroyFilter(key) {
      var sample = filters;
      setFilters(_extends$1({}, sample));
    },
    setSuppressRowDrag: setSuppressRowDrag,
    getVerticalPixelRange: getVerticalPixelRange,
    getHorizontalPixelRange: getHorizontalPixelRange,
    isColumnFilterPresent: isColumnFilterPresent,
    setSuppressRowClickSelection: function setSuppressRowClickSelection(value) {
      return _setSuppressRowClickSelection(value);
    },
    getEditingCells: getEditingCells,
    setRowNodeExpanded: setRowNodeExpanded,
    setAlwaysShowHorizontalScroll: setAlwaysShowHorizontalScroll,
    setAlwaysShowVerticalScroll: setAlwaysShowVerticalScroll,
    ensureIndexVisible: ensureIndexVisible,
    ensureNodeVisible: ensureNodeVisible,
    ensureColumnVisible: ensureColumnVisible,
    getRows: function getRows() {
      return rawRows;
    },
    getRenderedrows: function getRenderedrows() {
      return rows;
    }
  };
  if (onGridReady) {
    onGridReady({
      api: apiObject,
      columnApi: columnApiObject,
      type: "gridReady"
    });
  }
  useEffect(function () {
    setAfterFilter(getViewportRowsSample(sortedRows));
  }, [filters]);
  useEffect(function () {
    setAfterSort(getViewportRowsSample(sortedRows));
  }, [sortColumns, sortedRows]);
  useEffect(function () {
    setRowNodes(getViewportRowsSample(raawRows));
  }, [expandedGroupIds, expandAll, raawRows, afterFilter, afterSort]);
  var renderedRowNodes = [];
  function getViewportRows() {
    var node;
    var rowElements = [];
    var startRowIndex = 0;
    var selectedIdx = selectedPosition.idx,
      selectedRowIdx = selectedPosition.rowIdx;
    var startRowIdx = selectedCellIsWithinViewportBounds && selectedRowIdx < rowOverscanStartIdx ? rowOverscanStartIdx - 1 : rowOverscanStartIdx;
    var endRowIdx = selectedCellIsWithinViewportBounds && selectedRowIdx > rowOverscanEndIdx ? rowOverscanEndIdx + 1 : rowOverscanEndIdx;
    endRowIdxForRender = endRowIdx;
    var _loop3 = function _loop3() {
      var _row$id2, _rows$rowIdx3;
      var isRowOutsideViewport = viewportRowIdx === rowOverscanStartIdx - 1 || viewportRowIdx === rowOverscanEndIdx + 1;
      var rowIdx = isRowOutsideViewport ? selectedRowIdx : viewportRowIdx;
      var selectedColumn = columns4[selectedIdx];
      if (selectedColumn !== undefined) {
        if (isRowOutsideViewport) ; else {
          regroupArray(merged);
        }
      }
      var row = rows[rowIdx];
      var gridRowStart = headerRowsCount + topSummaryRowsCount + rowIdx + 1;
      if (isGroupRow(row)) {
        startRowIndex = row.startRowIndex;
        var isGroupRowSelected = isSelectable && row.childRows.every(function (cr) {
          return selectedRows1 == null ? void 0 : selectedRows1.has(rowKeyGetter(cr));
        });
        rowElements.push( /*#__PURE__*/jsx(GroupRowRenderer, {
          "aria-level": row.level + 1,
          "aria-setsize": row.setSize,
          "aria-posinset": row.posInSet + 1,
          "aria-rowindex": headerRowsCount + topSummaryRowsCount + startRowIndex + 1,
          "aria-selected": isSelectable ? isGroupRowSelected : undefined,
          id: rowKeyGetter(row),
          groupKey: row.groupKey,
          viewportColumns: regroupArray(merged),
          childRows: row.childRows,
          rowIdx: rowIdx,
          row: row,
          gridRowStart: gridRowStart,
          height: getRowHeight(rowIdx),
          level: row.level,
          isExpanded: row.isExpanded,
          selectedCellIdx: selectedRowIdx === rowIdx ? selectedIdx : undefined,
          isRowSelected: isGroupRowSelected,
          selectGroup: selectGroupLatest,
          toggleGroup: toggleGroupLatest
        }, "" + rowKeyGetter(row)));
        return "continue";
      }
      if (row.children && rest.treeData) {
        startRowIndex = row.startRowIndex;
        var isTreeRowSelected = selectedRows1 == null ? void 0 : selectedRows1.has(rowKeyGetter(row));
        rowElements.push( /*#__PURE__*/jsx(TreeRowRenderer, {
          "aria-level": row.level + 1,
          "aria-setsize": row.setSize,
          "aria-posinset": row.posInSet + 1,
          "aria-rowindex": headerRowsCount + topSummaryRowsCount + startRowIndex + 1,
          "aria-selected": isSelectable ? isTreeRowSelected : undefined,
          id: rowKeyGetter(row),
          viewportColumns: regroupArray(merged),
          childRows: row.childRows,
          rowIdx: rowIdx,
          row: row,
          rowArray: columns5,
          allrow: rows,
          gridRowStart: gridRowStart,
          height: getRowHeight(rowIdx),
          level: row.level,
          isExpanded: expandedTreeIds.includes(rowKeyGetter(row)),
          selectedCellIdx: selectedRowIdx === rowIdx ? selectedIdx : undefined,
          apiObject: apiObject,
          node: node,
          selection: rest.selection,
          serialNumber: serialNumber,
          sourceData: raawRows,
          isRowSelected: isTreeRowSelected != null ? isTreeRowSelected : false,
          selectTree: selectGroupLatest,
          handleRowChange: handleFormatterRowChangeLatest,
          toggleTree: toggleTreeLatest,
          onRowClick: onRowClick,
          onCellClick: onCellClickLatest,
          onCellDoubleClick: onCellDoubleClickLatest,
          onCellContextMenu: onCellContextMenuLatest,
          onRowDoubleClick: onRowDoubleClick,
          columnApi: columnApiObject,
          ref: key,
          valueChangedCellStyle: valueChangedCellStyle,
          headerheight: headerheight,
          rowClass: rowClass,
          onRowChange: handleFormatterRowChangeLatest,
          selectCell: selectViewportCellLatest,
          selectedCellEditor: getCellEditor(rowIdx),
          treeData: props.treeData,
          previousData: changedList
        }, "" + rowKeyGetter(row)));
        return "continue";
      }
      if (rest.masterData) {
        var masterRowRenderer = function masterRowRenderer(ref, props) {
          return /*#__PURE__*/jsx(MasterRowRenderer, _extends$1({
            ref: ref
          }, props));
        };
        var isMasterRowSelected = selectedRows1 == null ? void 0 : selectedRows1.has(rowKeyGetter(row));
        rowElements.push(masterRowRenderer(rowRef, {
          "aria-rowindex": headerRowsCount + topSummaryRowsCount + startRowIndex + 1,
          "aria-selected": isSelectable ? isMasterRowSelected : undefined,
          key: "" + rowKeyGetter(row),
          id: rowKeyGetter(row),
          viewportColumns: regroupArray(merged),
          childRows: row.childRows,
          rowIdx: rowIdx,
          row: row,
          rowArray: columns5,
          allrow: rows,
          gridRowStart: gridRowStart,
          height: getRowHeight(rowIdx),
          level: row.level,
          isExpanded: expandedMasterRowIds.includes(rowKeyGetter(row)),
          selectedCellIdx: selectedRowIdx === rowIdx ? selectedIdx : undefined,
          apiObject: apiObject,
          node: node,
          selection: rest.selection,
          serialNumber: serialNumber,
          sourceData: raawRows,
          isRowSelected: isMasterRowSelected != null ? isMasterRowSelected : false,
          selectTree: selectGroupLatest,
          handleRowChange: handleFormatterRowChangeLatest,
          toggleMaster: toggleMasterLatest,
          onRowClick: onRowClick,
          onCellClick: onCellClickLatest,
          onCellDoubleClick: onCellDoubleClickLatest,
          onCellContextMenu: onCellContextMenuLatest,
          onRowDoubleClick: onRowDoubleClick,
          columnApi: columnApiObject,
          ref: key,
          valueChangedCellStyle: valueChangedCellStyle,
          headerheight: headerheight,
          rowClass: rowClass,
          onRowChange: handleFormatterRowChangeLatest,
          selectCell: selectViewportCellLatest,
          selectedCellEditor: getCellEditor(rowIdx),
          lastFrozenColumnIndex: lastFrozenColumnIndex,
          expandedMasterRowIds: expandedMasterRowIds
        }));
        return "continue";
      }
      startRowIndex++;
      var key;
      var isRowSelected = false;
      if (typeof rowKeyGetter === "function") {
        var _selectedRows1$has;
        key = rowKeyGetter(row);
        isRowSelected = (_selectedRows1$has = selectedRows1 == null ? void 0 : selectedRows1.has(key)) != null ? _selectedRows1$has : false;
      } else {
        key = hasGroups ? startRowIndex : rowIdx;
      }
      function setDataValue(key, newValue) {
        var data = row;
        data[key] = newValue;
        var list = [].concat(rawRows);
        list[rowIdx] = data;
        setRawRows(list);
      }
      function setData(newValue) {
        var list = [].concat(rawRows);
        list[rowIdx] = newValue;
        setRawRows(list);
      }
      node = {
        rowIndex: rowIdx,
        rowTop: rowHeight * rowIdx,
        childIndex: rowIdx + 1,
        data: row,
        rowHeight: rowHeight,
        lastChild: raawRows.length === rowIdx + 1,
        firstChild: rowIdx === 0,
        id: (_row$id2 = row == null ? void 0 : row.id) != null ? _row$id2 : String(rowIdx),
        selected: selectedRowIdx === rowIdx,
        setDataValue: setDataValue,
        setData: setData,
        parent: {
          allLeafChildren: RowNodes,
          childrenAfterFilter: afterFilter,
          childrenAfterSort: afterSort
        },
        updateData: setData,
        expanded: (_rows$rowIdx3 = rows[rowIdx]) == null ? void 0 : _rows$rowIdx3.isExpanded,
        isSelected: function isSelected() {
          return selectedRowIdx === rowIdx;
        },
        setSelected: function setSelected() {
          selectRow({
            row: row,
            checked: !selectedRows.includes(rowKeyGetter(row)),
            isShiftClick: false
          });
        },
        isExpandable: function isExpandable() {
          var _rows$rowIdx4;
          return (_rows$rowIdx4 = rows[rowIdx]) == null ? void 0 : _rows$rowIdx4.isExpanded;
        },
        setExpanded: function setExpanded(value) {
          var expandIds = new Set(expandedGroupIds);
          var rowKey = rowKeyGetter(rows[rowIdx]);
          if (value) {
            expandIds.add(rowKey);
          } else {
            expandIds.delete(rowKey);
          }
          onExpandedGroupIdsChange(expandIds);
        }
      };
      renderedRowNodes.push(node);
      rowElements.push(rowRenderer(key, {
        "aria-rowindex": headerRowsCount + topSummaryRowsCount + (hasGroups ? startRowIndex : rowIdx) + 1,
        "aria-selected": isSelectable ? isRowSelected : undefined,
        valueChangedCellStyle: valueChangedCellStyle,
        previousData: changedList,
        totalColumns: columns.length,
        rowIdx: rowIdx,
        rows: rows,
        row: row,
        headerheight: headerheight,
        selectedCellRowStyle: selectedCellRowStyle,
        api: apiObject,
        columnApi: columnApiObject,
        node: node,
        viewportColumns: regroupArray(merged),
        isRowSelected: isRowSelected,
        onRowClick: onRowClick,
        onCellClick: onCellClickLatest,
        onCellDoubleClick: onCellDoubleClickLatest,
        onCellContextMenu: onCellContextMenuLatest,
        onRowDoubleClick: onRowDoubleClick,
        rowClass: rowClass,
        gridRowStart: gridRowStart,
        rowArray: columns4,
        height: getRowHeight(rowIdx),
        copiedCellIdx: copiedCell !== null && copiedCell.row === row ? columns.findIndex(function (c) {
          return c.key === copiedCell.columnKey;
        }) : undefined,
        selectedCellIdx: selectedRowIdx === rowIdx ? selectedIdx : undefined,
        draggedOverCellIdx: getDraggedOverCellIdx(rowIdx),
        setDraggedOverRowIdx: isDragging ? setDraggedOverRowIdx : undefined,
        lastFrozenColumnIndex: lastFrozenColumnIndex,
        onRowChange: handleFormatterRowChangeLatest,
        selectCell: selectViewportCellLatest,
        selectedCellDragHandle: getDragHandle(rowIdx),
        selectedCellEditor: getCellEditor(rowIdx),
        handleReorderRow: handleReorderRow,
        selectedPosition: selectedPosition,
        subColumn: subColumn,
        summaryRowHeight: topSummaryRows !== undefined ? summaryRowHeight : 0,
        rowFreezLastIndex: rowFreezLastIndex
      }));
    };
    for (var viewportRowIdx = startRowIdx; viewportRowIdx <= endRowIdx; viewportRowIdx++) {
      var _ret = _loop3();
      if (_ret === "continue") continue;
    }
    return rowElements;
  }
  if (selectedPosition.idx > maxColIdx || selectedPosition.rowIdx > maxRowIdx) {
    setSelectedPosition(initialPosition);
    setDraggedOverRowIdx(undefined);
  }
  var templateRows = headerRowHeight + "px";
  if (topSummaryRowsCount > 0) {
    templateRows += " repeat(" + topSummaryRowsCount + ", " + summaryRowHeight + "px)";
  }
  if (rows.length > 0) {
    templateRows += gridTemplateRows;
  }
  if (bottomSummaryRowsCount > 0) {
    templateRows += " repeat(" + bottomSummaryRowsCount + ", " + summaryRowHeight + "px)";
  }
  var isGroupRowFocused = selectedPosition.idx === -1 && selectedPosition.rowIdx !== -2;
  useUpdateEffect$1(function () {
    if (paginationAutoPageSize) {
      if (raawRows.length <= 500) {
        setSize(20);
      } else if (1000 >= raawRows.length && raawRows.length > 500) {
        setSize(30);
      } else {
        setSize(40);
      }
    }
  }, [raawRows, paginationAutoPageSize]);
  useEffect(function () {
    var _props$restriction, _props$restriction2;
    var target = document.getElementById("DataGrid");
    if ((_props$restriction = props.restriction) != null && _props$restriction.copy) {
      target.addEventListener("copy", function (event) {
        event.preventDefault();
      });
    }
    if ((_props$restriction2 = props.restriction) != null && _props$restriction2.paste) {
      target.addEventListener("paste", function (event) {
        event.preventDefault();
      });
    }
    return target != null && target.removeEventListener("copy", function () {}), target == null ? void 0 : target.removeEventListener("paste", function () {});
  }, [(_props$restriction3 = props.restriction) == null ? void 0 : _props$restriction3.paste, (_props$restriction4 = props.restriction) == null ? void 0 : _props$restriction4.copy]);
  var toolbarClassname = "t1sz1agu1-0-3";
  var jumpnext = document.getElementsByClassName("rc-pagination-jump-next");
  if (jumpnext) {
    var _jumpnext$;
    (_jumpnext$ = jumpnext[0]) == null ? void 0 : _jumpnext$.setAttribute("title", "");
  }
  var jumpprev = document.getElementsByClassName("rc-pagination-jump-prev");
  if (jumpprev) {
    var _jumpprev$;
    (_jumpprev$ = jumpprev[0]) == null ? void 0 : _jumpprev$.setAttribute("title", "");
  }
  return /*#__PURE__*/jsxs(Fragment, {
    children: [props.export && /*#__PURE__*/jsxs("div", {
      className: toolbarClassname,
      children: [props.export.csvFileName && /*#__PURE__*/jsx("button", {
        "data-testid": "Export to CSV",
        onClick: function onClick() {
          return exportDataAsCsv(props.export.csvFileName);
        },
        children: "Export to CSV"
      }), props.export.excelFileName && /*#__PURE__*/jsx("button", {
        "data-testid": "Export to XSLX",
        onClick: function onClick() {
          return exportDataAsExcel(props.export.excelFileName);
        },
        children: "Export to XSLX"
      }), props.export.pdfFileName && /*#__PURE__*/jsx("button", {
        "data-testid": "Export to PDF",
        onClick: function onClick() {
          return exportDataAsPdf(props.export.pdfFileName);
        },
        children: "Export to PDF"
      })]
    }), /*#__PURE__*/jsxs("div", {
      id: "DataGrid",
      role: hasGroups ? "treegrid" : "grid",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-multiselectable": isSelectable ? true : undefined,
      "aria-colcount": columns.length,
      "aria-rowcount": headerRowsCount + rowsCount + summaryRowsCount,
      className: clsx(rootClassname, (_clsx = {}, _clsx[viewportDraggingClassname] = isDragging, _clsx), className, enableFilter && filterContainerClassname),
      style: _extends$1({}, style, {
        background: "#B8CCE4",
        scrollPaddingInlineStart: selectedPosition.idx > lastFrozenColumnIndex ? totalFrozenColumnWidth + "px" : undefined,
        scrollPaddingBlock: selectedPosition.rowIdx >= 0 && selectedPosition.rowIdx < rows.length ? headerRowHeight + topSummaryRowsCount * summaryRowHeight + "px " + bottomSummaryRowsCount * summaryRowHeight + "px" : undefined,
        gridTemplateRows: templateRows,
        "--rdg-header-row-height": rowHeight + "px",
        "--rdg-summary-row-height": summaryRowHeight + "px",
        "--rdg-sign": isRtl ? -1 : 1
      }, getLayoutCssVars()),
      dir: direction,
      ref: gridRef,
      onScroll: handleScroll,
      onKeyDown: handleKeyDown,
      "data-testid": testId,
      children: [hasGroups && /*#__PURE__*/jsx("div", {
        ref: rowRef,
        tabIndex: isGroupRowFocused ? 0 : -1,
        className: clsx(focusSinkClassname, (_clsx2 = {}, _clsx2[rowSelected] = isGroupRowFocused, _clsx2[rowSelectedWithFrozenCell] = isGroupRowFocused && lastFrozenColumnIndex !== -1, _clsx2)),
        style: {
          gridRowStart: selectedPosition.rowIdx + 2
        },
        onKeyDown: handleKeyDown
      }), /*#__PURE__*/jsx(FilterContext$1.Provider, {
        value: filters,
        children: /*#__PURE__*/jsxs(DataGridDefaultComponentsProvider, {
          value: defaultGridComponents,
          children: [/*#__PURE__*/jsx(HeaderRow$1, {
            rows: rawRows,
            columns: regroupArray(merged),
            headerData: columns,
            sortCol: columns4,
            selectedPosition: selectedPosition,
            handleReorderColumn: handleReorderColumn,
            selectedCellHeaderStyle: selectedCellHeaderStyle,
            onColumnResize: handleColumnResizeLatest,
            allRowsSelected: allRowsSelected,
            arrayDepth: arrayDepth,
            onAllRowsSelectionChange: selectAllRowsLatest,
            sortColumns: sortColumns,
            onSortColumnsChange: onSortColumnsChangeLatest,
            lastFrozenColumnIndex: lastFrozenColumnIndex,
            selectedCellIdx: selectedPosition.rowIdx === minRowIdx ? selectedPosition.idx : undefined,
            selectCell: selectHeaderCellLatest,
            shouldFocusGrid: !selectedCellIsWithinSelectionBounds,
            direction: direction,
            headerheight: headerheight,
            headerRowHeight: singleHeaderRowHeight,
            rowArray: rowArray,
            cellHeight: headerRowHeight,
            setFilters: setFilters,
            setFilterType: setFilterType,
            ChildColumnSetup: ChildColumnSetup,
            gridWidth: gridWidth
          }), rows.length === 0 && noRowsFallback ? noRowsFallback : /*#__PURE__*/jsxs(Fragment, {
            children: [topSummaryRows == null ? void 0 : topSummaryRows.map(function (row, rowIdx) {
              var gridRowStart = headerRowsCount + rowIdx + 1;
              var summaryRowIdx = rowIdx + minRowIdx + 1;
              var isSummaryRowSelected = selectedPosition.rowIdx === summaryRowIdx;
              var top = headerRowHeight + summaryRowHeight * rowIdx;
              return /*#__PURE__*/jsx(SummaryRow$1, {
                "aria-rowindex": gridRowStart,
                rowIdx: rowIdx,
                gridRowStart: gridRowStart,
                row: row,
                top: top,
                bottom: undefined,
                lastTopRowIdx: topSummaryRowsCount - 1,
                viewportColumns: getRowViewportColumns(summaryRowIdx),
                lastFrozenColumnIndex: lastFrozenColumnIndex,
                selectedCellIdx: isSummaryRowSelected ? selectedPosition.idx : undefined,
                selectCell: selectTopSummaryCellLatest
              }, "" + rowIdx + summaryRowIdx);
            }), /*#__PURE__*/jsx(RowSelectionChangeProvider, {
              value: selectRowLatest,
              children: getViewportRows()
            }), bottomSummaryRows == null ? void 0 : bottomSummaryRows.map(function (row, rowIdx) {
              var gridRowStart = headerRowsCount + topSummaryRowsCount + rows.length + rowIdx + 1;
              var summaryRowIdx = rows.length + rowIdx;
              var isSummaryRowSelected = selectedPosition.rowIdx === summaryRowIdx;
              var top = clientHeight > totalRowHeight ? gridHeight - summaryRowHeight * (bottomSummaryRows.length - rowIdx) : undefined;
              var bottom = top === undefined ? summaryRowHeight * (bottomSummaryRows.length - 1 - rowIdx) : undefined;
              return /*#__PURE__*/jsx(SummaryRow$1, {
                "aria-rowindex": headerRowsCount + topSummaryRowsCount + rowsCount + rowIdx + 1,
                rowIdx: rowIdx,
                gridRowStart: gridRowStart,
                row: row,
                top: top,
                bottom: bottom,
                lastTopRowIdx: undefined,
                viewportColumns: getRowViewportColumns(summaryRowIdx),
                lastFrozenColumnIndex: lastFrozenColumnIndex,
                selectedCellIdx: isSummaryRowSelected ? selectedPosition.idx : undefined,
                selectCell: selectBottomSummaryCellLatest,
                selectedRows: selectedRows
              }, "" + rowIdx + summaryRowIdx);
            })]
          }), renderMeasuringCells(viewportColumns)]
        })
      }), /*#__PURE__*/createPortal( /*#__PURE__*/jsx("div", {
        dir: direction,
        children: /*#__PURE__*/jsx(ContextMenu, {
          id: "grid-context-menu",
          rtl: direction === "rtl",
          children: contextMenuItems.map(function (item) {
            var _item$subMenu, _item$cssClasses;
            return ((_item$subMenu = item.subMenu) == null ? void 0 : _item$subMenu.length) > 0 ? /*#__PURE__*/jsx(SubMenu, {
              title: item.name,
              children: item.subMenu.map(function (subItem) {
                var _subItem$cssClasses;
                return /*#__PURE__*/jsxs(MenuItem, {
                  onClick: function onClick(e) {
                    return subItem.action({
                      e: e,
                      contextData: contextData,
                      rowIndex: selectedPosition.rowIdx,
                      columnIndex: selectedPosition.idx,
                      handlePrint: handlePrint
                    });
                  },
                  disabled: subItem.disabled,
                  divider: subItem.divider,
                  className: "context-menu-Item " + ((_subItem$cssClasses = subItem.cssClasses) == null ? void 0 : _subItem$cssClasses.join(" ")),
                  children: [/*#__PURE__*/jsx("span", {
                    className: "context-menu-icon",
                    title: subItem.tooltip,
                    children: subItem.icon && /*#__PURE__*/jsx(subItem.icon, {
                      style: {
                        marginRight: "5px",
                        height: "10px"
                      }
                    })
                  }), /*#__PURE__*/jsx("span", {
                    className: "context-menu-name",
                    title: subItem.tooltip,
                    children: subItem.name
                  })]
                }, subItem.name);
              })
            }, item.name) : /*#__PURE__*/jsxs(MenuItem, {
              onClick: function onClick(e) {
                return item.action({
                  e: e,
                  contextData: contextData,
                  rowIndex: selectedPosition.rowIdx,
                  columnIndex: selectedPosition.idx,
                  handlePrint: handlePrint
                });
              },
              disabled: item.disabled,
              divider: item.divider,
              className: "context-menu-Item " + ((_item$cssClasses = item.cssClasses) == null ? void 0 : _item$cssClasses.join(" ")),
              children: [/*#__PURE__*/jsx("span", {
                className: "context-menu-icon",
                title: item.tooltip,
                children: item.icon && /*#__PURE__*/jsx(item.icon, {
                  style: {
                    marginRight: "5px"
                  }
                })
              }), /*#__PURE__*/jsx("span", {
                className: "context-menu-name",
                title: item.tooltip,
                children: item.name
              })]
            }, item.name);
          })
        })
      }), document.body)]
    }), (pagination || showSelectedRows) && /*#__PURE__*/jsxs("div", {
      style: {
        display: "flex",
        justifyContent: "space-between"
      },
      children: [showSelectedRows && /*#__PURE__*/jsx("div", {
        className: "footer-bottom",
        style: {
          width: "25%",
          height: 25,
          backgroundColor: "#f8f8f8",
          color: "black",
          fontSize: 12,
          paddingRight: 15,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center"
        },
        children: ((selectedRows1 == null ? void 0 : selectedRows1.size) === undefined ? 0 : selectedRows1 == null ? void 0 : selectedRows1.size) + " out of " + raawRows.length + " selected"
      }), pagination && !suppressPagination && /*#__PURE__*/jsx(Pagination, {
        className: "pagination-data",
        showTotal: function showTotal(total, range) {
          return "Showing " + range[0] + "-" + range[1] + " of " + total;
        },
        onChange: PaginationChange,
        total: rawRows.length,
        current: current,
        pageSize: size,
        showSizeChanger: false,
        itemRender: PrevNextArrow,
        onShowSizeChange: PerPageChange
      })]
    })]
  });
}
function isSamePosition(p1, p2) {
  return p1.idx === p2.idx && p1.rowIdx === p2.rowIdx;
}

function CheckBoxEditor({
  row,
  column,
  onRowChange,
  isCellSelected
}) {
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx(SelectCellFormatter, {
      value: row[column.key],
      onChange: () => {
        onRowChange({
          ...row,
          [column.key]: !row[column.key]
        });
      },
      isCellSelected: isCellSelected
    })
  });
}

const datePickerInternalClassname = "d1oxplqv1-0-3";
const datePickerClassname = `rdg-date-picker-editor ${datePickerInternalClassname}`;
function DateEditor({
  row,
  column,
  onRowChange
}) {
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx("input", {
      type: "date",
      className: datePickerClassname,
      value: moment(row[column.key]).format("YYYY-MM-DD"),
      placeholder: "dd-mmm-yyyy",
      disabled: column.editable ? column.editable : false,
      ...column.inputProps,
      onChange: e => {
        onRowChange({
          ...row,
          [column.key]: new Date(e.target.value)
        });
      }
    })
  });
}

const dateTimePickerInternalClassname = "dl1ge7s1-0-3";
const dateTimePickerClassname = `rdg-date-picker-editor ${dateTimePickerInternalClassname}`;
function DateTimeEditor({
  row,
  column,
  onRowChange
}) {
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx("input", {
      type: "datetime-local",
      value: moment(row[column.key]).format("YYYY-MM-DDThh:mm"),
      className: dateTimePickerClassname,
      disabled: column.editable ? column.editable : false,
      ...column.inputProps,
      onChange: e => onRowChange({
        ...row,
        [column.key]: new Date(e.target.value)
      })
    })
  });
}

const dropDownEditorInternalClassname = "d1ucr01u1-0-3";
const dropDownEditorClassname = `rdg-dropdown-editor ${dropDownEditorInternalClassname}`;
function DropDownEditor({
  row,
  onRowChange,
  column
}) {
  const options = column.options;
  const inputRef = useRef(null);
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx("select", {
      value: row[column.key],
      ref: inputRef,
      onBlurCapture: () => {},
      onChange: event => {
        onRowChange({
          ...row,
          [column.key]: event.target.value
        }, true);
        inputRef.current.blur();
      },
      className: dropDownEditorClassname,
      children: options?.map((data, index) => {
        return /*#__PURE__*/jsx("option", {
          children: data.label
        }, index);
      })
    }, column.rowIndex)
  });
}

const linkEditorInternalClassname = "lr7mwjr1-0-3";
const linkEditorClassname = `rdg-link-editor ${linkEditorInternalClassname}`;
function LinkEditor({
  row,
  column
}) {
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx("a", {
      href: row[column.key],
      className: linkEditorClassname,
      target: "blank",
      children: row[column.key]
    })
  });
}

const progressBar = "p7r0oqd1-0-3";
const progress = "pl6dc6g1-0-3";
const progressContainer = "p154wtak1-0-3";
function ProgressBarEditor({
  column,
  row,
  onRowChange
}) {
  const value = row[column.key];
  return /*#__PURE__*/jsxs("div", {
    className: `rdg-progressBar-container ${progressContainer}`,
    children: [/*#__PURE__*/jsx("div", {
      className: `rdg-progress-bar ${progressBar}`,
      children: /*#__PURE__*/jsx("div", {
        className: `rdg-progress ${progress}`,
        style: {
          width: `${value}%`
        }
      })
    }), Math.round(value), "%"]
  });
}

function RadioButtonEditor({
  row,
  column,
  onRowChange
}) {
  const options = column.options ? column.options : column.buttons;
  const radioButtonContainer = "r6gctoy1-0-3";
  const radioButton = "r1oalcvk1-0-3";
  return /*#__PURE__*/jsx("div", {
    className: `rdg-radio-container${radioButtonContainer}`,
    children: options.map((option, index) => {
      return /*#__PURE__*/jsxs("div", {
        children: [/*#__PURE__*/jsx("input", {
          type: "radio",
          value: option.value,
          className: `rdg-radiobutton ${radioButton}`,
          name: `options${column.rowIndex}`,
          checked: row[column.key] === option?.value,
          onChange: event => {
            onRowChange({
              ...row,
              [column.key]: event.target.value
            });
          }
        }, index), /*#__PURE__*/jsx("label", {
          children: option.label
        })]
      }, index);
    })
  });
}

const sliderContainer = "s1im19k91-0-3";
const sliderEditorInternalClassname = "s1539sf81-0-3";
const sliderEditorClassname = `rdg-slider-editor ${sliderEditorInternalClassname}`;
function SliderEditor({
  row,
  column,
  onRowChange,
  ...props
}) {
  const value = row[column.key];
  return /*#__PURE__*/jsxs("div", {
    className: sliderContainer,
    children: [/*#__PURE__*/jsx("input", {
      type: "range",
      value: value,
      "data-testid": `grid-slider-${props.rowIndex}`,
      className: sliderEditorClassname,
      ...column.inputProps,
      onChange: e => {
        onRowChange({
          ...row,
          [column.key]: e.target.value
        });
      }
    }), Math.round(value), "%"]
  });
}

const buttonInternalClassname = "b13qw47x1-0-3";
const buttonClassname = `rdg-button-editor ${buttonInternalClassname}`;
function ButtonEditor({
  row,
  column,
  ...props
}) {
  let text;
  if (column.inputProps?.text !== undefined || column.inputProps?.text !== "") {
    text = column.inputProps?.text;
  } else if (row[column.key] !== undefined || row[column.key] !== "") {
    text = row[column.key];
  } else {
    text = column.headerName;
  }
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx("button", {
      className: buttonClassname,
      "data-testid": `datagridbutton${props.rowIndex}`,
      disabled: column.editable ? column.editable : false,
      onClick: () => column.onClick({
        row,
        column,
        ...props
      }),
      ...column.inputProps,
      children: text
    })
  });
}

function TimeEditor({
  row,
  column,
  onRowChange
}) {
  const value = row[column.key] ? row[column.key] : moment(new Date()).format("hh:mm");
  const timeEditorClassName = "t1qgyh5i1-0-3";
  return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx("input", {
      type: "time",
      value: value,
      className: `rdg-time-editor ${timeEditorClassName}`,
      disabled: column.editable ? column.editable : false,
      ...column.inputProps,
      onChange: e => {
        onRowChange({
          ...row,
          [column.key]: e.target.value
        });
      }
    })
  });
}

const wrapperClassname = "woj02hs1-0-3";
const imageCellClassname = "i16g2l1y1-0-3";
function ImageFormatter({
  value
}) {
  return /*#__PURE__*/jsx("div", {
    className: wrapperClassname,
    children: /*#__PURE__*/jsx("div", {
      className: imageCellClassname,
      style: {
        backgroundImage: `url(${value})`
      }
    })
  });
}

function ImageViewer({
  row,
  column
}) {
  return /*#__PURE__*/jsx(ImageFormatter, {
    value: row[column.key]
  });
}

const colorInput = "c1vva2621-0-3";
const colorInputClassname = `rdg-color-input ${colorInput}`;
function ColorPicker({
  row,
  column,
  onRowChange
}) {
  let ref = useRef(null);
  const handleClick = () => {
    ref.current.click();
    setClicked(true);
  };
  const checkbox = "cmbaapg1-0-3";
  const colorPickerClassname = `rdg-colorPicker ${checkbox}`;
  const iconClass = "iuyc2r1-0-3";
  const [clicked, setClicked] = useState(false);
  return /*#__PURE__*/jsxs("div", {
    onClick: handleClick,
    style: {
      display: "flex",
      flexDirection: "row",
      height: "20px",
      margin: "2px 0"
    },
    children: [/*#__PURE__*/jsx("input", {
      type: "color",
      ref: ref,
      id: `color${column.rowIndex}`,
      className: colorInputClassname,
      value: row[column.key],
      onChange: event => {
        onRowChange({
          ...row,
          [column.key]: event.target.value
        });
        setClicked(false);
      }
    }), /*#__PURE__*/jsx("div", {
      className: colorPickerClassname,
      style: {
        backgroundColor: `${row[column.key] ?? "white"}`
      }
    }), /*#__PURE__*/jsx("div", {
      className: iconClass
    })]
  });
}

export { ButtonEditor, CheckBoxEditor, ColorPicker, DataGrid, DateEditor, DateTimeEditor, DropDownEditor, HeaderRenderer, ImageViewer, LinkEditor, ProgressBarEditor, RadioButtonEditor, RowComponent$1 as Row, SELECT_COLUMN_KEY, SERIAL_NUMBER_COLUMN_KEY, SelectCellFormatter, SelectColumn, SerialNumberColumn, SliderEditor, TextEditor, TimeEditor, ToggleGroup, checkboxFormatter, checkboxInputClassname, toggleGroupFormatter, valueFormatter };
//# sourceMappingURL=bundle.js.map
