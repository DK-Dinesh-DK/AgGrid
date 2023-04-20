import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose';
import { useEffect, useLayoutEffect as useLayoutEffect$1, useRef, useContext, createContext, useMemo, useState, useCallback, memo, forwardRef, useImperativeHandle } from 'react';
import { createPortal, flushSync } from 'react-dom';
import clsx from 'clsx';
import { groupBy, isString, _ } from 'lodash';
import { ContextMenu, SubMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import moment from 'moment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';  
import autoTable from 'jspdf-autotable';
import Pagination from 'rc-pagination';
import "./styles.css"

const cell = "c9tygie0-1-0";
const cellClassname = `rdg-cell ${cell}`;
const cellFrozen = "c2lsqdy0-1-0";
const cellFrozenClassname = `rdg-cell-frozen ${cellFrozen}`;
const cellFrozenLast = "cu9dmmf0-1-0";
const cellFrozenLastClassname = `rdg-cell-frozen-last ${cellFrozenLast}`;
const rowIsSelected = "r115cr3i0-1-0";
const rowIsSelectedClassName = `rdg-middle-row-is-selected ${rowIsSelected}`;
const topRowIsSelected = "trhevl70-1-0";
const topRowIsSelectedClassName = `rdg-top-row-is-selected ${topRowIsSelected}`;
const bottomRowIsSelected = "b1y6osgi0-1-0";
const bottomRowIsSelectedClassName = `rdg-bottom-row-is-selected ${bottomRowIsSelected}`;

const root = "r1fgqq0p0-1-0";
const rootClassname = `rdg ${root}`;
const viewportDragging = "v1qpiszo0-1-0";
const viewportDraggingClassname = `rdg-viewport-dragging ${viewportDragging}`;
const focusSinkClassname = "f1tdeyrt0-1-0";
const filterColumnClassName = "filter-cell";
const filterContainerClassname = "f1s6cm8w0-1-0";

const row = "rsqlkts0-1-0";
const rowClassname = `rdg-row ${row}`;
const rowSelected = "r1b98bt0-1-0";
const rowSelectedClassname = "rdg-row-selected";
const rowSelectedWithFrozenCell = "r1t9qo150-1-0";

const checkboxLabel = "c1kfjsid0-1-0";
const checkboxLabelClassname = `rdg-checkbox-label ${checkboxLabel}`;
const checkboxInput = "ca4mo9e0-1-0";
const checkboxInputClassname = `rdg-checkbox-input ${checkboxInput}`;
const checkbox = "ctrhvdq0-1-0";
const checkboxClassname = `rdg-checkbox ${checkbox}`;
const checkboxLabelDisabled = "c6bptqk0-1-0";
const checkboxLabelDisabledClassname = `rdg-checkbox-label-disabled ${checkboxLabelDisabled}`;
function checkboxFormatter({
  onChange,
  ...props
}, ref) {
  function handleChange(e) {
    onChange(e.target.checked, e.nativeEvent.shiftKey);
  }
  return /*#__PURE__*/jsxs("label", {
    className: clsx(checkboxLabelClassname, props.disabled && checkboxLabelDisabledClassname),
    children: [/*#__PURE__*/jsx("input", {
      type: "checkbox",
      ref: ref,
      ...props,
      className: checkboxInputClassname,
      onChange: handleChange
    }), /*#__PURE__*/jsx("div", {
      className: checkboxClassname
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

function valueFormatter(props) {
  try {
    return /*#__PURE__*/jsx(Fragment, {
      children: props.row[props.column.key]
    });
  } catch {
    return null;
  }
}

const groupCellContent = "gquyxkv0-1-0";
const groupCellContentClassname = `rdg-group-cell-content ${groupCellContent}`;
const caret = "cwe1f4s0-1-0";
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

const SERIAL_NUMBER_COLUMN_KEY = "serial-number";
const SELECT_COLUMN_KEY = "select-row";
const headerCellClassName = "hayp98z0-1-0";
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
  width: 45,
  resizable: false,
  sortable: false,
  frozen: true,
  filter: false,
  headerRenderer: () => {
    return /*#__PURE__*/jsx("div", {
      children: SerialNumberColumn.name
    });
  },
  cellClass: headerCellClassName,
  cellRenderer: props => {
    return /*#__PURE__*/jsxs(Fragment, {
      children: [props.column.rowIndex + 1, " "]
    });
  }
};

function getColSpan(column, lastFrozenColumnIndex, args) {
  const colSpan = typeof column.colSpan === "function" ? column.colSpan(args) : 1;
  if (Number.isInteger(colSpan) && colSpan > 1 && (!column.frozen || column.idx + colSpan - 1 <= lastFrozenColumnIndex)) {
    return colSpan;
  }
  return undefined;
}

function scrollIntoView(element) {
  element?.scrollIntoView({
    inline: "nearest",
    block: "nearest"
  });
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

const measuringCellClassname = "m22dhxs0-1-0";
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
      "data-measuring-cell-key": key
    }, key))
  });
}

function isSelectedCellEditable({
  selectedPosition,
  columns,
  rows,
  isGroupRow
}) {
  const column = columns[selectedPosition.idx];
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
    gridColumnStart: column.idx + 1,
    gridColumnEnd: colSpan !== undefined ? `span ${colSpan}` : undefined,
    gridRowEnd: rowSpan !== undefined ? `span ${rowSpan}` : undefined,
    insetInlineStart: column.frozen ? `var(--rdg-frozen-left-${column.idx})` : undefined
  };
}
function getCellClassname(column, ...extraClasses) {
  return clsx(cellClassname, ...extraClasses, column.frozen && cellFrozenClassname, column.isLastFrozenColumn && cellFrozenLastClassname);
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

const textEditorInternalClassname = "t1bswe1i0-1-0";
const textEditorClassname = `rdg-text-editor ${textEditorInternalClassname}`;

const DEFAULT_COLUMN_WIDTH = "auto";
const DEFAULT_COLUMN_MIN_WIDTH = 40;
function useCalculatedColumns({
  rawColumns,
  columnWidths,
  viewportWidth,
  scrollLeft,
  defaultColumnOptions,
  rawGroupBy,
  enableVirtualization,
  frameworkComponents
}) {
  const defaultWidth = defaultColumnOptions?.width ?? DEFAULT_COLUMN_WIDTH;
  const defaultMinWidth = defaultColumnOptions?.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH;
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
    const columns = rawColumns?.map(rawColumn => {
      const rowGroup = rawGroupBy?.includes(rawColumn.field) ?? false;
      const frozen = rowGroup || rawColumn.frozen;
      const cellRendererValue = rawColumn.cellRenderer;
      const components = frameworkComponents ? Object.keys(frameworkComponents) : null;
      const indexOfComponent = components?.indexOf(cellRendererValue);
      const customComponentName = indexOfComponent > -1 ? components[indexOfComponent] : null;
      const column = {
        ...rawColumn,
        colId: rawColumn.field,
        key: rawColumn.field,
        userProvidedColDef: rawColumn,
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
        cellRenderer: frameworkComponents?.[customComponentName] ?? rawColumn.cellRenderer ?? rawColumn.valueFormatter ?? defaultFormatter,
        filter: rawColumn.filter ?? defaultFilter
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
      if (frozen) {
        lastFrozenColumnIndex++;
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
  }, [rawColumns, defaultWidth, defaultMinWidth, defaultMaxWidth, defaultFormatter, defaultResizable, defaultSortable, rawGroupBy]);
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
  expandAll
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
    const rowPositions = rows.map(row => {
      const currentRowHeight = isGroupRow(row) ? rowHeight({
        type: "GROUP",
        row
      }) : rowHeight({
        type: "ROW",
        row
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
    const rowVisibleStartIdx = findRowIdx(scrollTop);
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

const FilterContext = /*#__PURE__*/createContext(undefined);
const FilterContext$1 = FilterContext;

const headerSortCell = "h2rl2fx0-1-0";
const headerSortCellClassname = `rdg-header-sort-cell ${headerSortCell}`;
const headerSortName = "ha29pcs0-1-0";
const headerSortNameClassname = `rdg-header-sort-name ${headerSortName}`;
const filterClassname = "f7qgdq50-1-0";
function HeaderRenderer({
  column,
  rows,
  sortDirection,
  priority,
  onSort,
  isCellSelected,
  setFilters,
  ...rest
}) {
  const alterHeaderName = column.field ? column.field.charAt(0).toUpperCase() + column.field.slice(1) : column.headerName.charAt(0).toUpperCase() + column.headerName.slice(1);
  if (!(column.sortable || column.filter)) return /*#__PURE__*/jsx(Fragment, {
    children: column.headerName ?? alterHeaderName
  });
  if (column.sortable && !column.filter) return /*#__PURE__*/jsx(SortableHeaderCell, {
    onSort: onSort,
    sortDirection: sortDirection,
    priority: priority,
    isCellSelected: isCellSelected,
    column: column,
    children: column.headerName ?? alterHeaderName
  });
  if (column.filter && !column.sortable) return /*#__PURE__*/jsx(Fragment, {
    children: /*#__PURE__*/jsx(FilterRenderer, {
      column: column,
      isCellSelected: isCellSelected,
      alterHeaderName: alterHeaderName,
      children: ({
        filters,
        ...rest
      }) => /*#__PURE__*/jsx("div", {
        className: filterClassname,
        children: /*#__PURE__*/jsx("input", {
          ...rest,
          value: filters?.[column.field],
          onChange: e => setFilters({
            ...filters,
            [column.field]: e.target.value
          }),
          onKeyDown: inputStopPropagation
        })
      })
    })
  });
  if (column.filter && column.sortable) return /*#__PURE__*/jsxs(Fragment, {
    children: [/*#__PURE__*/jsx(SortableHeaderCell, {
      onSort: onSort,
      sortDirection: sortDirection,
      priority: priority,
      isCellSelected: isCellSelected,
      children: column.headerName ?? alterHeaderName
    }), /*#__PURE__*/jsx(FilterRenderer, {
      column: column,
      isCellSelected: isCellSelected,
      alterHeaderName: alterHeaderName,
      children: ({
        filters,
        ...rest
      }) => /*#__PURE__*/jsx("div", {
        className: filterClassname,
        children: /*#__PURE__*/jsx("input", {
          ...rest,
          value: filters?.[column.field],
          onChange: e => setFilters({
            ...filters,
            [column.field]: e.target.value
          }),
          onKeyDown: inputStopPropagation
        })
      })
    })]
  });
}
function SortableHeaderCell({
  onSort,
  sortDirection,
  priority,
  children,
  isCellSelected,
  column
}) {
  const sortStatus = useDefaultComponents().sortStatus;
  const {
    ref,
    tabIndex
  } = useFocusRef(isCellSelected);
  function handleKeyDown(event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onSort(event.ctrlKey || event.metaKey);
    }
  }
  function handleClick(event) {
    onSort(event.ctrlKey || event.metaKey);
  }
  return /*#__PURE__*/jsxs("span", {
    ref: ref,
    tabIndex: tabIndex,
    className: headerSortCellClassname,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    children: [/*#__PURE__*/jsx("span", {
      className: headerSortNameClassname,
      children: children
    }), /*#__PURE__*/jsx("span", {
      children: sortStatus({
        sortDirection,
        priority
      })
    })]
  });
}
function inputStopPropagation(event) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}
function FilterRenderer({
  isCellSelected,
  column,
  children,
  alterHeaderName
}) {
  const filters = useContext(FilterContext$1);
  const {
    ref,
    tabIndex
  } = useFocusRef(isCellSelected);
  return /*#__PURE__*/jsxs(Fragment, {
    children: [!column.sortable && /*#__PURE__*/jsx("span", {
      className: headerSortNameClassname,
      children: column.headerName ?? alterHeaderName
    }), filters.enabled && /*#__PURE__*/jsx("div", {
      children: children({
        ref,
        tabIndex,
        filters
      })
    })]
  });
}

const cellResizable = "c5s4gs70-1-0";
const cellResizableClassname = `rdg-cell-resizable ${cellResizable}`;
function HeaderCell({
  column,
  columns,
  rows,
  colSpan,
  isCellSelected,
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
  handleReorderColumn
}) {
  const isRtl = direction === "rtl";
  const {
    ref,
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  const sortIndex = sortColumns?.findIndex(sort => sort.columnKey === column.key);
  const sortColumn = sortIndex !== undefined && sortIndex > -1 ? sortColumns[sortIndex] : undefined;
  const sortDirection = sortColumn?.direction;
  const priority = sortColumn !== undefined && sortColumns.length > 1 ? sortIndex + 1 : undefined;
  const ariaSort = sortDirection && !priority ? sortDirection === "ASC" ? "ascending" : "descending" : undefined;
  var style = getCellStyle(column, colSpan);
  selectedCellHeaderStyle && selectedPosition.idx === column.idx ? style = {
    ...style,
    ...selectedCellHeaderStyle
  } : style;
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
  function onSort(ctrlClick) {
    if (onSortColumnsChange == null) return;
    const {
      sortDescendingFirst
    } = column;
    if (sortColumn === undefined) {
      const nextSort = {
        columnKey: column.key,
        direction: sortDescendingFirst ? "DESC" : "ASC"
      };
      onSortColumnsChange(sortColumns && ctrlClick ? [...sortColumns, nextSort] : [nextSort]);
    } else {
      let nextSortColumn;
      if (sortDescendingFirst === true && sortDirection === "DESC" || sortDescendingFirst !== true && sortDirection === "ASC") {
        nextSortColumn = {
          columnKey: column.key,
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
  return (
    /*#__PURE__*/
    jsx("div", {
      role: "columnheader",
      "aria-colindex": column.idx + 1,
      "aria-selected": isCellSelected,
      "aria-sort": ariaSort,
      "aria-colspan": colSpan,
      ref: ele => {
        drag(ele);
        drop(ele);
      },
      tabIndex: shouldFocusGrid ? 0 : tabIndex,
      className: className,
      style: style,
      onFocus: handleFocus,
      onClick: onClick,
      onDoubleClick: column.resizable ? onDoubleClick : undefined,
      onPointerDown: column.resizable ? onPointerDown : undefined,
      children: headerRenderer({
        column,
        rows,
        sortDirection,
        priority,
        onSort,
        allRowsSelected,
        onAllRowsSelectionChange,
        isCellSelected,
        setFilters
      })
    })
  );
}

const headerRow = "h1w9imsy0-1-0";
const headerRowClassname = `rdg-header-row ${headerRow}`;
function HeaderRow({
  columns,
  rows,
  allRowsSelected,
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
  handleReorderColumn
}) {
  const cells = [];
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
      colSpan: colSpan,
      selectedPosition: selectedPosition,
      selectedCellHeaderStyle: selectedCellHeaderStyle,
      isCellSelected: selectedCellIdx === column.idx,
      onColumnResize: onColumnResize,
      allRowsSelected: allRowsSelected,
      onAllRowsSelectionChange: onAllRowsSelectionChange,
      onSortColumnsChange: onSortColumnsChange,
      sortColumns: sortColumns,
      selectCell: selectCell,
      shouldFocusGrid: shouldFocusGrid && index === 0,
      direction: direction,
      setFilters: setFilters
    }, `${column.key}`));
  }
  return /*#__PURE__*/jsx(DndProvider, {
    backend: HTML5Backend,
    children: /*#__PURE__*/jsx("div", {
      role: "row",
      "aria-rowindex": 1,
      className: clsx(headerRowClassname),
      style: getRowStyle(1),
      children: cells
    })
  });
}
const HeaderRow$1 = /*#__PURE__*/memo(HeaderRow);

const cellCopied = "c1tk6yq10-1-0";
const cellCopiedClassname = `rdg-cell-copied ${cellCopied}`;
const cellDraggedOver = "c1ldrpav0-1-0";
const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver}`;
function Cell({
  column,
  colSpan,
  isCellSelected,
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
  totalColumns,
  onCellClick,
  onCellDoubleClick,
  onCellContextMenu,
  columnApi,
  ...props
}) {
  const {
    ref,
    tabIndex,
    onFocus
  } = useRovingCellRef(isCellSelected);
  const {
    cellClass
  } = column;
  const topRow = rowIndex === 0 && isRowSelected ? true : false;
  const bottomRow = rowIndex === allrow.length - 1 && isRowSelected ? true : false;
  const middleRow = !(topRow || bottomRow) && isRowSelected ? true : false;
  const className = getCellClassname(column, `rdg-cell-column-${column.idx % 2 === 0 ? "even" : "odd"}`, typeof cellClass === "function" ? cellClass(row) : cellClass, isCopied && cellCopiedClassname, isDraggedOver && cellDraggedOverClassname, middleRow && rowIsSelectedClassName, topRow && topRowIsSelectedClassName, bottomRow && bottomRowIsSelectedClassName);
  function selectCellWrapper(openEditor) {
    selectCell(row, column, openEditor);
  }
  function handleClick(e) {
    selectCellWrapper(column.editorOptions?.editOnClick);
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
      colDef: {
        field: column.field,
        resizable: column.resizable ?? undefined,
        sortable: column.sortable ?? undefined,
        width: column.width
      },
      data: row,
      node: node,
      columnApi: columnApi,
      rowIndex: rowIndex,
      value: row[column.field] ?? undefined,
      type: "cellClicked",
      event: e
    });
  }
  function handleContextMenu(e) {
    selectCellWrapper();
    onCellContextMenu?.({
      api: api,
      colDef: {
        field: column.field,
        resizable: column.resizable ?? undefined,
        sortable: column.sortable ?? undefined,
        width: column.width
      },
      data: row,
      node: node,
      columnApi: columnApi,
      rowIndex: rowIndex,
      value: row[column.field] ?? undefined,
      type: "cellContextMenu",
      event: e
    });
  }
  function handleDoubleClick(e) {
    selectCellWrapper(true);
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
      colDef: {
        field: column.field,
        resizable: column.resizable ?? undefined,
        sortable: column.sortable ?? undefined,
        width: column.width
      },
      data: row,
      node: node,
      columnApi: columnApi,
      rowIndex: rowIndex,
      value: row[column.field] ?? undefined,
      type: "cellDoubleClicked",
      event: e
    });
  }
  function handleRowChange(newRow) {
    onRowChange(column, newRow);
  }
  var style = getCellStyle(column, colSpan);
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
    function alignmentUtils() {
      var styles = style;
      var symbol = ["£", "$", "₹", "€", "¥", "₣", "¢"];
      if (moment(row[column.key], "YYYY-MM-DD", true).isValid() || moment(row[column.key], "YYYY/MM/DD", true).isValid() || moment(row[column.key], "YYYY-DD-MM", true).isValid() || moment(row[column.key], "YYYY/DD/MM", true).isValid() || moment(row[column.key], "MM-DD-YYYY", true).isValid() || moment(row[column.key], "MM/DD-YYYY", true).isValid() || moment(row[column.key], "DD-MM-YYYY", true).isValid() || moment(row[column.key], "DD/MM/YYYY", true).isValid() || moment(row[column.key], "DD-MMM-YYYY", true).isValid() || moment(row[column.key], "DD/MMM/YYYY", true).isValid() || moment(row[column.key], "MMM-DD-YYYY", true).isValid() || moment(row[column.key], "MMM/DD/YYYY", true).isValid() || moment(row[column.key], "YYYY-MMM-DD", true).isValid() || moment(row[column.key], "YYYY/MMM/DD", true).isValid() || moment(row[column.key], "YYYY-DD-MMM", true).isValid() || moment(row[column.key], "YYYY/DD/MMM", true).isValid() || column.alignment.type && column.alignment.type.toLowerCase() === "date") {
        const alignmentStyle = column.alignment.align ? {
          textAlign: column.alignment.align
        } : {
          textAlign: "left"
        };
        styles = {
          ...styles,
          ...alignmentStyle
        };
        return styles;
      } else if (moment(row[column.key], "hh:mm", true).isValid() || moment(row[column.key], "hh:mm:ss", true).isValid() || moment(row[column.key], "hh:mm:ss a", true).isValid() || column.alignment.type && column.alignment.type.toLowerCase() === "time") {
        const alignment = column.alignment.align ? {
          textAlign: column.alignment.align
        } : {
          textAlign: "left"
        };
        styles = {
          ...styles,
          ...alignment
        };
        return styles;
      } else if (typeof row[column.key] === "number" && column.alignment.type !== "currency" || column.alignment.type && column.alignment.type.toLowerCase() === "number") {
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
      } else if (symbol.includes(JSON.stringify(row[column.key])[1]) || symbol.includes(JSON.stringify(row[column.key])[row[column.key].length]) || column.alignment.type && column.alignment.type.toLowerCase() === "currency") {
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
      } else if (column.alignment.type && column.alignment.type.toLowerCase() === "string" || column.alignment.type && column.alignment.type.toLowerCase() === "text" || typeof row[column.ley] === "string") {
        const alignment = column.alignment.align ? {
          textAlign: column.alignment.align
        } : {
          textAlign: "left"
        };
        styles = {
          ...styles,
          ...alignment
        };
        return styles;
      } else {
        const alignment = column.alignment.align ? {
          textAlign: column.alignment.align
        } : {
          textAlign: "center"
        };
        styles = {
          ...styles,
          ...alignment
        };
        return styles;
      }
    }
    style = column.alignment.align ? {
      ...style,
      textAlign: column.alignment.align
    } : alignmentUtils();
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
  var renderObject = {
    column,
    colDef: column,
    row,
    data: row,
    columnApi,
    allrow,
    api,
    node,
    rowIndex,
    isCellSelected,
    onRowChange: handleRowChange
  };
  return /*#__PURE__*/jsx("div", {
    role: "gridcell",
    "aria-colindex": column.idx + 1,
    "aria-selected": isCellSelected,
    "aria-colspan": colSpan,
    "aria-rowspan": rowSpan,
    "aria-readonly": !isCellEditable(column, row) || undefined,
    ref: ref,
    tabIndex: tabIndex,
    className: className,
    style: style,
    onClick: handleClick,
    onDoubleClick: handleDoubleClick,
    onContextMenu: handleContextMenu,
    onFocus: onFocus,
    ...props,
    children: !column.rowGroup && /*#__PURE__*/jsxs(Fragment, {
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
        }), column.cellRenderer(renderObject)]
      }), !column.rowDrag && column.cellRenderer(renderObject), dragHandle]
    })
  });
}
const Cell$1 = /*#__PURE__*/memo(Cell);

function Row({
  className,
  rowIdx,
  gridRowStart,
  height,
  selectedCellIdx,
  isRowSelected,
  copiedCellIdx,
  draggedOverCellIdx,
  lastFrozenColumnIndex,
  api,
  row,
  selectedCellRowStyle,
  rows,
  node,
  viewportColumns,
  selectedCellEditor,
  selectedCellDragHandle,
  onRowClick,
  onRowDoubleClick,
  rowClass,
  setDraggedOverRowIdx,
  onMouseEnter,
  onRowChange,
  selectCell,
  totalColumns,
  handleReorderRow,
  onCellClick,
  onCellDoubleClick,
  onCellContextMenu,
  columnApi,
  ...props
}, ref) {
  const handleRowChange = useLatestFunc((column, newRow) => {
    onRowChange(column, rowIdx, newRow);
  });
  function handleDragEnter(event) {
    setDraggedOverRowIdx?.(rowIdx);
    onMouseEnter?.(event);
  }
  className = clsx(rowClassname, `rdg-row-${rowIdx % 2 === 0 ? "even" : "odd"}`, rowClass?.(row), className, isRowSelected && rowSelectedClassname);
  const cells = [];
  var selectedCellRowIndex;
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
      row
    });
    if (colSpan !== undefined) {
      index += colSpan - 1;
    }
    const isCellSelected = selectedCellIdx === idx;
    if (isCellSelected) {
      selectedCellRowIndex = rowIdx;
    }
    if (isCellSelected && selectedCellEditor) {
      cells.push(selectedCellEditor);
    } else {
      cells.push( /*#__PURE__*/jsx(Cell$1, {
        column: column,
        colSpan: colSpan,
        api: api,
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
        selectCell: selectCell,
        onCellClick: onCellClick,
        onCellDoubleClick: onCellDoubleClick,
        onCellContextMenu: onCellContextMenu,
        columnApi: columnApi
      }, `${column.key}`));
    }
  }
  var style = getRowStyle(gridRowStart, height);
  if (rowIdx === selectedCellRowIndex) {
    style = {
      ...style,
      ...selectedCellRowStyle
    };
  }
  return /*#__PURE__*/jsx(DndProvider, {
    backend: HTML5Backend,
    children: /*#__PURE__*/jsx(RowSelectionProvider, {
      value: isRowSelected,
      children: /*#__PURE__*/jsx("div", {
        role: "row",
        ref: ref,
        id: row?.id ?? rowIdx,
        className: className,
        onMouseEnter: handleDragEnter,
        style: style,
        ...props,
        children: cells
      })
    })
  });
}
const RowComponent = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(Row));
function defaultRowRenderer(key, props) {
  return /*#__PURE__*/jsx(RowComponent, {
    ...props
  }, key);
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

const groupRow = "g1mvu2ep0-1-0";
const groupRowClassname = `rdg-group-row ${groupRow}`;
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
      className: clsx(rowClassname, groupRowClassname, `rdg-row-groupRow-${rowIdx % 2 === 0 ? "even" : "odd"}`, selectedCellIdx === -1 && rowSelectedClassname),
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
    })
  });
}
const GroupRowRenderer = /*#__PURE__*/memo(GroupedRow);

const summaryCellClassname = "sny5x120-1-0";
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

const summaryRow = "s1w3afir0-1-0";
const topSummaryRow = "t1dprx3i0-1-0";
const topSummaryRowBorderClassname = "t14kdlbe0-1-0";
const bottomSummaryRowBorderClassname = "bqiq5670-1-0";
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
    className: clsx(rowClassname, `rdg-row-summary-row-${rowIdx % 2 === 0 ? "even" : "odd"}`, summaryRowClassname, isTop ? [topSummaryRowClassname, lastTopRowIdx === rowIdx && topSummaryRowBorderClassname] : ["rdg-bottom-summary-row", rowIdx === 0 && bottomSummaryRowBorderClassname], selectedCellIdx === -1 && rowSelectedClassname),
    style: {
      ...getRowStyle(gridRowStart),
      "--rdg-summary-row-top": top !== undefined ? `${top}px` : undefined,
      "--rdg-summary-row-bottom": bottom !== undefined ? `${bottom}px` : undefined
    },
    children: cells
  });
}
const SummaryRow$1 = /*#__PURE__*/memo(SummaryRow);

const cellEditing = "cgu7dq50-1-0";
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
    // console.log("fromIndex", fromIndex, "toIndex", toIndex);
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

const cellDragHandle = "c1iurj8s0-1-0";
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

const arrow = "adro4ad0-1-0";
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
  var field = [];
  columns?.map(ele => {
    if (ele.field) {
      field.push({
        dataKey: ele.field,
        header: ele.headerName
      });
    }
  });
  var doc = new jsPDF("p", "pt", "letter");
  autoTable(doc, {
    html: "#my-table"
  });
  autoTable(doc, {
    margin: {
      top: 10
    },
    styles: {
      cellWidth: "wrap",
      overflow: "visible",
      halign: "center"
    },
    headStyles: {
      fillColor: "#16365D",
      textColor: "white",
      halign: "center",
      lineColor: "White",
      lineWidth: 1
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

function ExportButton({
  onExport,
  children
}) {
  const [exporting, setExporting] = useState(false);
  return /*#__PURE__*/jsx("button", {
    disabled: exporting,
    onClick: async () => {
      setExporting(true);
      await onExport();
      setExporting(false);
    },
    children: exporting ? "Exporting" : children
  });
}

var _excluded = ["columnData", "rowData", "topSummaryRows", "bottomSummaryRows", "rowKeyGetter", "onRowsChange", "rowHeight", "headerRowHeight", "summaryRowHeight", "selectedRows", "onSelectedRowsChange", "defaultColumnOptions", "groupBy", "expandedGroupIds", "onExpandedGroupIdsChange", "onRowClicked", "onRowDoubleClicked", "selectedCellHeaderStyle", "onScroll", "onColumnResize", "onFill", "serialNumber", "onCopy", "onPaste", "selectedCellRowStyle", "onCellClicked", "onCellDoubleClicked", "onCellContextMenu", "cellNavigationMode", "enableVirtualization", "renderers", "className", "showSelectedRows", "style", "rowClass", "direction", "getContextMenuItems", "aria-label", "aria-labelledby", "aria-describedby", "data-testid", "columnReordering", "pagination", "paginationPageSize", "suppressPaginationPanel", "paginationAutoPageSize", "defaultPage", "frameworkComponents", "onGridReady"];
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var initialPosition = {
  idx: -1,
  rowIdx: -2,
  mode: "SELECT"
};
function DataGrid(props, ref) {
  var _raawColumns, _ref, _ref2, _ref3, _renderers$rowRendere, _ref4, _renderers$sortStatus, _ref5, _renderers$checkboxFo, _renderers$noRowsFall, _topSummaryRows$lengt, _bottomSummaryRows$le, _props$restriction3, _props$restriction4;
  var raawColumns = props.columnData,
    raawRows = props.rowData,
    topSummaryRows = props.topSummaryRows,
    bottomSummaryRows = props.bottomSummaryRows,
    rowKeyGetter = props.rowKeyGetter,
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
    testId = props["data-testid"],
    columnReordering = props.columnReordering,
    tablePagination = props.pagination,
    paginationPageSize = props.paginationPageSize,
    suppressPaginationPanel = props.suppressPaginationPanel,
    paginationAutoPageSize = props.paginationAutoPageSize,
    defaultPage = props.defaultPage,
    frameworkComponents = props.frameworkComponents,
    onGridReady = props.onGridReady,
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  var _useState = useState(),
    selectedRows1 = _useState[0],
    onSelectedRowsChange1 = _useState[1];
  selectedRows = selectedRows ? selectedRows : [];
  var selection = rest.selection && SelectColumn;
  raawColumns = rest.selection ? [selection].concat(raawColumns) : raawColumns;
  var enableFilter = (_raawColumns = raawColumns) == null ? void 0 : _raawColumns.map(function (i) {
    return (i == null ? void 0 : i.filter) === true;
  }).includes(true);
  var contextMenuItems = getContextMenuItems !== undefined ? getContextMenuItems() : [];
  function contextMenuRowRenderer(key, props) {
    return /*#__PURE__*/jsx(ContextMenuTrigger, {
      id: "grid-context-menu",
      collect: function collect() {
        return {
          rowIdx: props.rowIdx
        };
      },
      children: /*#__PURE__*/jsx(RowComponent, _extends({}, props))
    }, key);
  }
  var _useState2 = useState(),
    headerHeightFromRef = _useState2[0],
    setHeaderHeightFromRef = _useState2[1];
  var defaultComponents = useDefaultComponents();
  var rowHeight = rawRowHeight != null ? rawRowHeight : 24;
  var headerWithFilter = enableFilter ? 70 : undefined;
  var headerRowHeight = (_ref = (_ref2 = headerHeightFromRef != null ? headerHeightFromRef : rawHeaderRowHeight) != null ? _ref2 : headerWithFilter) != null ? _ref : typeof rowHeight === "number" ? rowHeight : 24;
  var summaryRowHeight = rawSummaryRowHeight != null ? rawSummaryRowHeight : typeof rowHeight === "number" ? rowHeight : 24;
  var rowRenderer = contextMenuItems.length > 0 ? contextMenuRowRenderer : (_ref3 = (_renderers$rowRendere = renderers == null ? void 0 : renderers.rowRenderer) != null ? _renderers$rowRendere : defaultComponents == null ? void 0 : defaultComponents.rowRenderer) != null ? _ref3 : defaultRowRenderer;
  var sortStatus$1 = (_ref4 = (_renderers$sortStatus = renderers == null ? void 0 : renderers.sortStatus) != null ? _renderers$sortStatus : defaultComponents == null ? void 0 : defaultComponents.sortStatus) != null ? _ref4 : sortStatus;
  var checkboxFormatter$1 = (_ref5 = (_renderers$checkboxFo = renderers == null ? void 0 : renderers.checkboxFormatter) != null ? _renderers$checkboxFo : defaultComponents == null ? void 0 : defaultComponents.checkboxFormatter) != null ? _ref5 : checkboxFormatter;
  var noRowsFallback = (_renderers$noRowsFall = renderers == null ? void 0 : renderers.noRowsFallback) != null ? _renderers$noRowsFall : defaultComponents == null ? void 0 : defaultComponents.noRowsFallback;
  var cellNavigationMode = rawCellNavigationMode != null ? rawCellNavigationMode : "NONE";
  var enableVirtualization = rawEnableVirtualization != null ? rawEnableVirtualization : true;
  var direction = rawDirection != null ? rawDirection : "ltr";
  var _useState3 = useState([]),
    afterFilter = _useState3[0],
    setAfterFilter = _useState3[1];
  var _useState4 = useState(defaultColumnOptions),
    defaultColumnDef = _useState4[0],
    setDefaultColumnDef = _useState4[1];
  var _useState5 = useState(raawGroupBy),
    rawGroupBy = _useState5[0],
    setRawGroupBy = _useState5[1];
  var _useState6 = useState(null),
    expandAll = _useState6[0],
    setExpandAll = _useState6[1];
  useEffect(function () {
    setExpandAll(null);
  }, [raawGroupBy, expandedGroupIds]);
  useEffect(function () {
    setRawGroupBy(raawGroupBy);
  }, [raawGroupBy]);
  var _useState7 = useState(0),
    scrollTop = _useState7[0],
    setScrollTop = _useState7[1];
  var _useState8 = useState(0),
    scrollLeft = _useState8[0],
    setScrollLeft = _useState8[1];
  var _useState9 = useState(function () {
      return new Map();
    }),
    columnWidths = _useState9[0],
    setColumnWidths = _useState9[1];
  var _useState10 = useState(initialPosition),
    selectedPosition = _useState10[0],
    setSelectedPosition = _useState10[1];
  var _useState11 = useState(null),
    copiedCell = _useState11[0],
    setCopiedCell = _useState11[1];
  var _useState12 = useState(false),
    isDragging = _useState12[0],
    setDragging = _useState12[1];
  var _useState13 = useState(undefined),
    draggedOverRowIdx = _useState13[0],
    setOverRowIdx = _useState13[1];
  var _useState14 = useState([]),
    sortColumns = _useState14[0],
    setSortColumns = _useState14[1];
  var _useState15 = useState(raawRows),
    rawRows = _useState15[0],
    setRawRows = _useState15[1];
  var _useState16 = useState(serialNumber ? [SerialNumberColumn].concat(raawColumns) : raawColumns),
    rawColumns = _useState16[0],
    setRawColumns = _useState16[1];
  var _useState17 = useState(tablePagination),
    pagination = _useState17[0],
    _setPagination = _useState17[1];
  var _useState18 = useState(suppressPaginationPanel != null ? suppressPaginationPanel : false),
    suppressPagination = _useState18[0];
    _useState18[1];
  var _useState19 = useState(paginationPageSize != null ? paginationPageSize : 20),
    size = _useState19[0],
    setSize = _useState19[1];
  var _useState20 = useState(defaultPage != null ? defaultPage : 1),
    current = _useState20[0],
    setCurrent = _useState20[1];
  var PaginationChange = function PaginationChange(page, pageSize) {
    setCurrent(page);
    setSize(pageSize);
  };
  var PrevNextArrow = function PrevNextArrow(current, type, originalElement) {
    if (type === "prev") {
      return /*#__PURE__*/jsx("button", {
        title: "Previous",
        children: /*#__PURE__*/jsx("i", {
          className: "fa fa-angle-double-left"
        })
      });
    }
    if (type === "next") {
      return /*#__PURE__*/jsx("button", {
        title: "Next",
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
  var defaultFilters = {};
  raawColumns.forEach(function (rawCol) {
    if (rawCol.filter) defaultFilters[rawCol.field] = "";
  });
  var _useState21 = useState(_extends({}, defaultFilters, {
      enabled: true
    })),
    filters = _useState21[0],
    setFilters = _useState21[1];
  var filterFunction = useCallback(function (props) {
    return raawRows == null ? void 0 : raawRows.filter(function (val) {
      for (var i = 0; i < props.length; i++) if (!val[props[i][0]].includes(props[i][1])) return false;
      return true;
    });
  }, [raawRows]);
  var sortedRows = useMemo(function () {
    var asArray = Object.entries(filters);
    var keys = asArray.filter(function (_ref6) {
      _ref6[0];
        var value = _ref6[1];
      return value.length > 0;
    });
    var filteredRows = filterFunction(keys);
    if (sortColumns.length === 0) return filteredRows;
    var _sortColumns$ = sortColumns[0],
      columnKey = _sortColumns$.columnKey,
      direction = _sortColumns$.direction;
    var sortedRows = filteredRows;
    sortedRows = sortedRows.sort(function (a, b) {
      return typeof a[columnKey] === "number" ? a[columnKey] - b[columnKey] : a[columnKey].localeCompare(b[columnKey]);
    });
    return direction === "DESC" ? sortedRows.reverse() : sortedRows;
  }, [sortColumns, filters, filterFunction]);
  useEffect(function () {
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
  raawColumns = serialNumber ? [SerialNumberColumn].concat(raawColumns) : raawColumns;
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
  var _useCalculatedColumns = useCalculatedColumns({
      rawColumns: rawColumns,
      columnWidths: columnWidths,
      scrollLeft: scrollLeft,
      viewportWidth: gridWidth,
      defaultColumnDef: defaultColumnDef,
      rawGroupBy: groupBy ? rawGroupBy : undefined,
      enableVirtualization: enableVirtualization,
      frameworkComponents: frameworkComponents
    }),
    columns = _useCalculatedColumns.columns,
    colSpanColumns = _useCalculatedColumns.colSpanColumns,
    colOverscanStartIdx = _useCalculatedColumns.colOverscanStartIdx,
    colOverscanEndIdx = _useCalculatedColumns.colOverscanEndIdx,
    templateColumns = _useCalculatedColumns.templateColumns,
    layoutCssVars = _useCalculatedColumns.layoutCssVars,
    columnMetrics = _useCalculatedColumns.columnMetrics,
    lastFrozenColumnIndex = _useCalculatedColumns.lastFrozenColumnIndex,
    totalFrozenColumnWidth = _useCalculatedColumns.totalFrozenColumnWidth,
    groupBy$1 = _useCalculatedColumns.groupBy;
  var _useViewportRows = useViewportRows({
      rawRows: rawRows,
      groupBy: groupBy$1,
      rowGrouper: groupBy,
      expandAll: expandAll,
      rowHeight: rowHeight,
      clientHeight: clientHeight,
      scrollTop: scrollTop,
      expandedGroupIds: expandedGroupIds,
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
    keys.map(function (key) {
      return columnKeys.push(key.key);
    });
    var values = Array.from(columnMetrics.values());
    var columnWidthValues = [];
    values.map(function (value) {
      return columnWidthValues.push(value.width);
    });
    var columnWidth = new Map(columnWidths);
    for (var i = 0; i < columnWidthValues.length; i++) {
      columnWidth.set(columnKeys[i], columnWidthValues[i]);
    }
    return columnWidth;
  }
  function getColumns() {
    var columnObjects = [];
    columns.forEach(function (column) {
      var _ref7, _column$field, _column$frozen, _column$rowGroup, _column$children;
      var index = raawColumns.findIndex(function (c) {
        return c.field === column.field;
      });
      var userColDef = raawColumns[index];
      var indexOfRowGroup = rawGroupBy == null ? void 0 : rawGroupBy.findIndex(function (key) {
        return key === "" + column.key;
      });
      var indexOfSort = sortColumns.findIndex(function (sortCol) {
        return sortCol.columnKey === "" + column.key;
      });
      var sort = indexOfSort > -1 ? sortColumns[indexOfSort].direction : null;
      var columnState = {
        colId: (_ref7 = (_column$field = column.field) != null ? _column$field : "" + column.key) != null ? _ref7 : "col_" + column.idx,
        columnIndex: column.idx,
        width: templateColumns[column.idx],
        frozen: (_column$frozen = column.frozen) != null ? _column$frozen : undefined,
        rowGroup: (_column$rowGroup = column.rowGroup) != null ? _column$rowGroup : undefined,
        rowGroupIndex: indexOfRowGroup > -1 ? indexOfRowGroup : null,
        sort: sort,
        userProvidedColDef: userColDef
      };
      columnObjects.push(columnState);
      (_column$children = column.children) == null ? void 0 : _column$children.forEach(function (colChild) {
        var _ref8, _colChild$field, _colChild$frozen, _colChild$rowGroup;
        var columnState = {
          colId: (_ref8 = (_colChild$field = colChild.field) != null ? _colChild$field : colChild.key) != null ? _ref8 : "col_" + column.idx,
          columnIndex: column.idx,
          width: colChild.width,
          frozen: (_colChild$frozen = colChild.frozen) != null ? _colChild$frozen : undefined,
          rowGroup: (_colChild$rowGroup = colChild.rowGroup) != null ? _colChild$rowGroup : undefined,
          userProvidedColDef: userColDef
        };
        columnObjects.push(columnState);
      });
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
                return sortCol.columnKey === "" + column.key;
              });
              if (_index6 === -1) sortColumns.push({
                columnKey: "" + column.key,
                direction: defaultState.sort
              });
              if (_index6 > -1 && sortColumns[_index6].direction !== defaultState.sort) sortColumns[_index6].direction = defaultState.sort;
              onSortColumnsChange(sortColumns);
            } else {
              var _index7 = sortColumns.findIndex(function (sortCol) {
                return sortCol.columnKey === "" + column.key;
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
    for (var i = 0; i < columns.length; i++) {
      var _loop = function _loop() {
        var key = typeof keys[j] === "string" ? keys[j] : keys[j].colId;
        var columnIndex = columns.findIndex(function (col) {
          return col.key === key;
        });
        if (i === columnIndex) columns[i].frozen = true;
      };
      for (var j = 0; j < keys.length; j++) {
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
  var maxColIdx = columns.length - 1;
  var minRowIdx = -1 - topSummaryRowsCount;
  var maxRowIdx = rows.length + bottomSummaryRowsCount - 1;
  var selectedCellIsWithinSelectionBounds = isCellWithinSelectionBounds(selectedPosition);
  var selectedCellIsWithinViewportBounds = isCellWithinViewportBounds(selectedPosition);
  var handleColumnResizeLatest = useLatestFunc(handleColumnResize);
  var onSortColumnsChangeLatest = useLatestFunc(onSortColumnsChange);
  var onCellClickLatest = useLatestFunc(onCellClick);
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
      for (var _iterator = _createForOfIteratorHelperLoose(flexWidthViewportColumns), _step; !(_step = _iterator()).done;) {
        var column = _step.value;
        var measuringCell = grid.querySelector("[data-measuring-cell-key=\"" + column.key + "\"]");
        var _measuringCell$getBou = measuringCell.getBoundingClientRect(),
          width = _measuringCell$getBou.width;
        newColumnWidths.set(column.key, width);
      }
      return newColumnWidths;
    });
  }, [isWidthInitialized, flexWidthViewportColumns, gridRef]);
  useImperativeHandle(ref, function () {
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
  function selectRow(_ref9) {
    var row = _ref9.row,
      checked = _ref9.checked,
      isShiftClick = _ref9.isShiftClick;
    if (!onSelectedRowsChange1) return;
    assertIsValidKeyGetter(rowKeyGetter);
    var newSelectedRows = new Set(selectedRows1);
    var newSelectedRows1 = selectedRows;
    if (isGroupRow(row)) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(row.childRows), _step2; !(_step2 = _iterator2()).done;) {
        var childRow = _step2.value;
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
      onSelectedRowsChange(newSelectedRows1);
      return;
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
        for (var i = previousRowIdx + step; i !== rowIdx; i += step) {
          var _row = rows[i];
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
    onSelectedRowsChange(newSelectedRows1);
  }
  function selectAllRows(checked) {
    if (!onSelectedRowsChange1) return;
    assertIsValidKeyGetter(rowKeyGetter);
    var newSelectedRows = new Set(selectedRows1);
    var newSelectedRows1 = selectedRows;
    for (var _iterator3 = _createForOfIteratorHelperLoose(rawRows), _step3; !(_step3 = _iterator3()).done;) {
      var row = _step3.value;
      var rowKey = rowKeyGetter(row);
      if (checked) {
        newSelectedRows.add(rowKey);
        if (!newSelectedRows1.includes(row)) newSelectedRows1.push(row);
      } else {
        newSelectedRows.delete(rowKey);
        newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
      }
    }
    onSelectedRowsChange(newSelectedRows1);
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
  function updateRow(column, rowIdx, row) {
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
    var column = columns[selectedPosition.idx];
    (_column$editorOptions = column.editorOptions) == null ? void 0 : _column$editorOptions.onCellKeyDown == null ? void 0 : _column$editorOptions.onCellKeyDown(event);
    if (event.isDefaultPrevented()) return;
    if (isCellEditable(selectedPosition) && isDefaultCellInput(event)) {
      setSelectedPosition(function (_ref10) {
        var idx = _ref10.idx,
          rowIdx = _ref10.rowIdx;
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
  function isCellWithinSelectionBounds(_ref11) {
    var idx = _ref11.idx,
      rowIdx = _ref11.rowIdx;
    return rowIdx >= minRowIdx && rowIdx <= maxRowIdx && isColIdxWithinSelectionBounds(idx);
  }
  function isCellWithinViewportBounds(_ref12) {
    var idx = _ref12.idx,
      rowIdx = _ref12.rowIdx;
    return isRowIdxWithinViewportBounds(rowIdx) && isColIdxWithinSelectionBounds(idx);
  }
  function isCellEditable(position) {
    return isCellWithinViewportBounds(position) && isSelectedCellEditable({
      columns: columns,
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
      setSelectedPosition(_extends({}, position, {
        mode: "EDIT",
        row: row,
        originalRow: row
      }));
    } else if (isSamePosition(selectedPosition, position)) {
      var _gridRef$current;
      scrollIntoView((_gridRef$current = gridRef.current) == null ? void 0 : _gridRef$current.querySelector('[tabindex="0"]'));
    } else {
      setSelectedPosition(_extends({}, position, {
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
      for (var i = selectedPosition.rowIdx - 1; i >= 0; i--) {
        var parentRow = rows[i];
        if (isGroupRow(parentRow) && parentRow.id === row.parentId) {
          parentRowIdx = i;
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
    for (var _iterator4 = _createForOfIteratorHelperLoose(flexWidthViewportColumns), _step4; !(_step4 = _iterator4()).done;) {
      var column = _step4.value;
      newTemplateColumns[column.idx] = column.width;
    }
    return _extends({}, layoutCssVars, {
      gridTemplateColumns: newTemplateColumns.join(" ")
    });
  }
  function handleFill(_ref13) {
    var _extends2;
    var columnKey = _ref13.columnKey,
      sourceRow = _ref13.sourceRow,
      targetRow = _ref13.targetRow;
    return _extends({}, targetRow, (_extends2 = {}, _extends2[columnKey] = sourceRow[columnKey], _extends2));
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
    var column = columns[idx];
    var colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "ROW",
      row: row
    });
    var closeEditor = function closeEditor() {
      setSelectedPosition(function (_ref14) {
        var idx = _ref14.idx,
          rowIdx = _ref14.rowIdx;
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
          return _extends({}, position, {
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
  var _useState22 = useState(),
    RowNodes = _useState22[0],
    setRowNodes = _useState22[1];
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
    RowNodes.map(function (obj, idx) {
      if (_.isEqual(obj1, obj)) {
        firstIndex = idx;
      }
      return true;
    });
    RowNodes.map(function (obj, idx) {
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
    for (var i = 0; i < ((_transactionObject$ad = transactionObject.add) == null ? void 0 : _transactionObject$ad.length); i++) {
      var _transactionObject$ad;
      var rowIndex = void 0;
      if (rowKeyGetter) {
        rowIndex = findRowIndex(rowKeyGetter(transactionObject.add[i]));
      } else {
        rowIndex = findRowIndex(transactionObject.add[i].id);
      }
      if (rowIndex === -1) {
        if (transactionObject.addIndex) {
          if (transactionObject.addIndex > raawRows.length) return;
          var newRowNode = createNewRowNode(rowIndex1, transactionObject.add[i]);
          newRows.splice(rowIndex1, 0, newRowNode.data);
          LeafNodes.splice(rowIndex1, 0, newRowNode);
          updatedRowNodes.added.push(LeafNodes[rowIndex1]);
          rowIndex1++;
          isUpdated++;
        } else {
          rowIndex = transactionObject.add[i].id - 1;
          var _newRowNode = createNewRowNode(rowIndex, transactionObject.add[i]);
          newRows.splice(rowIndex, 0, _newRowNode.data);
          LeafNodes.splice(rowIndex, 0, _newRowNode);
          updatedRowNodes.added.push(_newRowNode);
          isUpdated++;
        }
      }
    }
    for (var _i = 0; _i < ((_transactionObject$up = transactionObject.update) == null ? void 0 : _transactionObject$up.length); _i++) {
      var _transactionObject$up;
      var values = Object.entries(transactionObject.update[_i]);
      var _rowIndex = void 0;
      if (rowKeyGetter) {
        _rowIndex = findRowIndex(rowKeyGetter(transactionObject.update[_i]));
      } else {
        _rowIndex = findRowIndex(transactionObject.update[_i].id);
      }
      for (var j = 0; j < values.length; j++) {
        var field = values[j][0];
        var value = values[j][1];
        LeafNodes[_rowIndex].data[field] = value;
      }
      updatedRowNodes.updated.push(LeafNodes[_rowIndex]);
      isUpdated++;
    }
    (_transactionObject$re = transactionObject.remove) == null ? void 0 : _transactionObject$re.sort(function (a, b) {
      return a.id < b.id ? 1 : -1;
    });
    for (var _i2 = 0; _i2 < ((_transactionObject$re2 = transactionObject.remove) == null ? void 0 : _transactionObject$re2.length); _i2++) {
      var _transactionObject$re2;
      var _rowIndex2 = void 0;
      if (rowKeyGetter) {
        _rowIndex2 = findRowIndex(rowKeyGetter(transactionObject.remove[_i2]));
      } else {
        _rowIndex2 = findRowIndex(transactionObject.remove[_i2].id);
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
    for (var i = 0; i < raawRows.length; i++) {
      var _raawRows$i$id;
      var node = {
        rowIndex: i,
        childIndex: i + 1,
        data: raawRows[i],
        rowHeight: getRowHeight(i),
        lastChild: raawRows.length === i + 1,
        firstChild: i === 0,
        id: (_raawRows$i$id = raawRows[i].id) != null ? _raawRows$i$id : String(i)
      };
      leafNodes.push(node);
    }
    return leafNodes;
  }
  function forEachLeafNode(callback, rowNodes) {
    var updatedLeafNodes = [];
    for (var i = 0; (_ref15 = i < (rowNodes == null ? void 0 : rowNodes.length)) != null ? _ref15 : LeafNodes.length; i++) {
      var _ref15, _rowNodes$i, _rowNodes$i$data;
      callback((_rowNodes$i = rowNodes[i]) != null ? _rowNodes$i : LeafNodes[i]);
      updatedLeafNodes.push((_rowNodes$i$data = rowNodes[i].data) != null ? _rowNodes$i$data : LeafNodes[i].data);
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
    for (var i = 0; i < LeafNodes.length; i++) {
      var _LeafNodes$i$data;
      if (id === ((_LeafNodes$i$data = LeafNodes[i].data) == null ? void 0 : _LeafNodes$i$data.id)) index = LeafNodes[i].rowIndex;
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
  function getSelectedRows() {
    return selectedRows1;
  }
  function selectAll(filteredRows) {
    if (!onSelectedRowsChange) return;
    assertIsValidKeyGetter(rowKeyGetter);
    var newSelectedRows = new Set(selectedRows1);
    var newSelectedRows1 = selectedRows;
    for (var _iterator5 = _createForOfIteratorHelperLoose((_filteredRows$data = filteredRows == null ? void 0 : filteredRows.data) != null ? _filteredRows$data : rawRows), _step5; !(_step5 = _iterator5()).done;) {
      var _filteredRows$data;
      var row = _step5.value;
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
    for (var _iterator6 = _createForOfIteratorHelperLoose((_filteredRows$data2 = filteredRows == null ? void 0 : filteredRows.data) != null ? _filteredRows$data2 : rawRows), _step6; !(_step6 = _iterator6()).done;) {
      var _filteredRows$data2;
      var row = _step6.value;
      var rowKey = rowKeyGetter(row);
      newSelectedRows.delete(rowKey);
      newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
    }
    onSelectedRowsChange1(newSelectedRows);
  }
  function getSelectedNodes() {
    var selectedNodes = new Set();
    for (var i = 0; i < RowNodes.length; i++) {
      RowNodes[i].selected ? selectedNodes.add(RowNodes[i]) : null;
    }
    return selectedNodes;
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
  var getViewportRowsSample = useLatestFunc(function (rowArray) {
    var rowElementsSample = [];
    var listOfRows = rowArray;
    var node;
    var selectedRowIdx = selectedPosition.rowIdx;
    var startRowIdx = 0;
    var endRowIdx = listOfRows.length - 1;
    var _loop2 = function _loop2() {
      var _row$id, _rows$rowIdx;
      var isRowOutsideViewport = viewportRowIdx === rowOverscanStartIdx - 1 || viewportRowIdx === rowOverscanEndIdx + 1;
      var rowIdx = isRowOutsideViewport ? selectedRowIdx : viewportRowIdx;
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
          childrenAfterSort: afterFilter
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
  });
  var apiObject = {
    getColumnDefs: function getColumnDefs() {
      return rawColumns;
    },
    setColumnDefs: function setColumnDefs(columns) {
      return setRawColumns(columns);
    },
    setRowData: setRowData,
    getRowNodes: function getRowNodes(value) {
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
        allLeafChildren: getViewportRowsSample(raawRows),
        childrenAfterFilter: getViewportRowsSample(rows),
        childrenAfterSort: getViewportRowsSample(rows)
      },
      columnModel: {
        columnDefs: rawColumns,
        displayedColumns: columns
      },
      nodeManager: {
        allNodesMap: getViewportRowsSample(raawRows)
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
      return setDefaultColumnDef(_extends({}, defaultColumnDef, value));
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
    setFilterModel: function setFilterModel(value) {
      return setFilters(_extends({}, filters, value));
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
    setAfterFilter(getViewportRowsSample(rows));
  }, [rows, getViewportRowsSample]);
  useEffect(function () {
    setRowNodes(getViewportRowsSample(raawRows));
  }, [expandedGroupIds, expandAll, raawRows, getViewportRowsSample]);
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
      var rowColumns = viewportColumns;
      var selectedColumn = columns[selectedIdx];
      if (selectedColumn !== undefined) {
        if (isRowOutsideViewport) {
          rowColumns = [selectedColumn];
        } else {
          rowColumns = getRowViewportColumns(rowIdx);
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
          id: row.id,
          groupKey: row.groupKey,
          viewportColumns: rowColumns,
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
        }, row.id));
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
          childrenAfterSort: afterFilter
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
        totalColumns: columns.length,
        rowIdx: rowIdx,
        rows: rows,
        row: row,
        selectedCellRowStyle: selectedCellRowStyle,
        api: apiObject,
        columnApi: columnApiObject,
        node: node,
        viewportColumns: rowColumns,
        isRowSelected: isRowSelected,
        onRowClick: onRowClick,
        onCellClick: onCellClickLatest,
        onCellDoubleClick: onCellDoubleClickLatest,
        onCellContextMenu: onCellContextMenuLatest,
        onRowDoubleClick: onRowDoubleClick,
        rowClass: rowClass,
        gridRowStart: gridRowStart,
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
        handleReorderRow: handleReorderRow
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
  useEffect(function () {
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
  var toolbarClassname = "t1sz1agu0-1-0";
  return /*#__PURE__*/jsxs(Fragment, {
    children: [props.export && /*#__PURE__*/jsxs("div", {
      className: toolbarClassname,
      children: [props.export.csvFileName && /*#__PURE__*/jsx(ExportButton, {
        onExport: function onExport() {
          return exportDataAsCsv(props.export.csvFileName);
        },
        children: "Export to CSV"
      }), props.export.excelFileName && /*#__PURE__*/jsx(ExportButton, {
        onExport: function onExport() {
          return exportDataAsExcel(props.export.excelFileName);
        },
        children: "Export to XSLX"
      }), props.export.pdfFileName && /*#__PURE__*/jsx(ExportButton, {
        onExport: function onExport() {
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
      className: clsx(rootClassname, className, isDragging && viewportDraggingClassname, enableFilter && filterContainerClassname),
      style: _extends({}, style, {
        scrollPaddingInlineStart: selectedPosition.idx > lastFrozenColumnIndex ? totalFrozenColumnWidth + "px" : undefined,
        scrollPaddingBlock: selectedPosition.rowIdx >= 0 && selectedPosition.rowIdx < rows.length ? headerRowHeight + topSummaryRowsCount * summaryRowHeight + "px " + bottomSummaryRowsCount * summaryRowHeight + "px" : undefined,
        gridTemplateRows: templateRows,
        "--rdg-header-row-height": headerRowHeight + "px",
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
        className: clsx(focusSinkClassname, isGroupRowFocused && [rowSelected, lastFrozenColumnIndex !== -1 && rowSelectedWithFrozenCell]),
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
            columns: getRowViewportColumns(-1),
            handleReorderColumn: handleReorderColumn,
            selectedPosition: selectedPosition,
            selectedCellHeaderStyle: selectedCellHeaderStyle,
            onColumnResize: handleColumnResizeLatest,
            allRowsSelected: allRowsSelected,
            onAllRowsSelectionChange: selectAllRowsLatest,
            sortColumns: sortColumns,
            onSortColumnsChange: onSortColumnsChangeLatest,
            lastFrozenColumnIndex: lastFrozenColumnIndex,
            selectedCellIdx: selectedPosition.rowIdx === minRowIdx ? selectedPosition.idx : undefined,
            selectCell: selectHeaderCellLatest,
            shouldFocusGrid: !selectedCellIsWithinSelectionBounds,
            direction: direction,
            setFilters: setFilters
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
              }, rowIdx);
            }), /*#__PURE__*/jsx(RowSelectionChangeProvider, {
              value: selectRowLatest,
              children: getViewportRows()
            }), bottomSummaryRows == null ? void 0 : bottomSummaryRows.map(function (row, rowIdx) {
              var gridRowStart = headerRowsCount + topSummaryRowsCount + rows.length + rowIdx + 1;
              var summaryRowIdx = rows.length + rowIdx;
              var isSummaryRowSelected = selectedPosition.rowIdx === summaryRowIdx;
              var top = clientHeight > totalRowHeight ? gridHeight - summaryRowHeight * (bottomSummaryRows.length - rowIdx) : undefined;
              var bottom = top === undefined ? summaryRowHeight * (bottomSummaryRows.length - 1 - rowIdx) : undefined;
              return /*#__PURE__*/jsx(Fragment, {
                children: /*#__PURE__*/jsx(SummaryRow$1, {
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
                }, rowIdx)
              });
            })]
          }), renderMeasuringCells(viewportColumns)]
        })
      }), /*#__PURE__*/createPortal( /*#__PURE__*/jsx("div", {
        dir: direction,
        children: /*#__PURE__*/jsx(ContextMenu, {
          id: "grid-context-menu",
          rtl: direction === "rtl",
          children: contextMenuItems.map(function (item) {
            var _item$subMenu;
            return ((_item$subMenu = item.subMenu) == null ? void 0 : _item$subMenu.length) > 0 ? /*#__PURE__*/jsx(SubMenu, {
              title: item.name,
              children: item.subMenu.map(function (subItem) {
                return /*#__PURE__*/jsx(MenuItem, {
                  onClick: subItem.action,
                  children: subItem.name
                });
              })
            }) : /*#__PURE__*/jsx(MenuItem, {
              onClick: item.action,
              children: item.name
            });
          })
        })
      }), document.body)]
    }), (pagination || showSelectedRows) && /*#__PURE__*/jsxs("div", {
      style: {
        display: "flex",
        justifyContent: "space-between"
      },
      children: [showSelectedRows ? /*#__PURE__*/jsx("div", {
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
        children: "Selected : " + selectedRows.length
      }) : undefined, pagination && !suppressPagination && /*#__PURE__*/jsx(Pagination, {
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
const DataGrid$1 = /*#__PURE__*/forwardRef(DataGrid);

export { DataGrid$1 as DataGrid };
//# sourceMappingURL=bundle.js.map
