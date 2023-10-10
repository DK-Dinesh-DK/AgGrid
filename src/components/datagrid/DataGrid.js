import React, {
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import useUpdateEffect from "./hooks/useUpdateEffect";
import TreeRowRenderer from "./TreeRow";
import { flushSync } from "react-dom";
import { clsx } from "clsx";
import { groupBy as rowGrouper, isString, _ } from "lodash";
import ContextMenu from "./ContextMenu";
import { css } from "@linaria/core";
import {
  rootClassname,
  viewportDraggingClassname,
  focusSinkClassname,
  rowSelected,
  rowSelectedWithFrozenCell,
  filterContainerClassname,
} from "./style";
import {
  useLayoutEffect,
  useGridDimensions,
  useCalculatedColumns,
  useViewportColumns,
  useViewportRows,
  useLatestFunc,
  RowSelectionChangeProvider,
} from "./hooks";
import HeaderRow from "./HeaderRow";
import RowComponent, { defaultRowRenderer } from "./Row";
import GroupRowRenderer from "./GroupRow";
import SummaryRow from "./SummaryRow";
import EditCell from "./EditCell";
import { default as defaultSortStatus } from "./sortStatus";
import { checkboxFormatter as defaultCheckboxFormatter } from "./formatters";
import {
  DataGridDefaultComponentsProvider,
  useDefaultComponents,
} from "./DataGridDefaultComponentsProvider";
import {
  getNextSelectedCellPosition,
  isSelectedCellEditable,
  canExitGrid,
  isCtrlKeyHeldDown,
  isDefaultCellInput,
  getColSpan,
  sign,
  abs,
  getSelectedCellColSpan,
  renderMeasuringCells,
  scrollIntoView,
} from "./utils";
import FilterContext from "./filterContext";
import {
  SelectColumn,
  SELECT_COLUMN_KEY,
  SerialNumberColumn,
  SERIAL_NUMBER_COLUMN_KEY,
} from "./Columns";
import { exportToCsv, exportToPdf, exportToXlsx } from "./exportUtils";
import Pagination from "rc-pagination";
import "./pagination.css";
import { useCalculatedColumnswithIdx } from "./hooks/useCalculatedColumnswithIdx";
import { useCalculatedRowColumns } from "./hooks/useCalculatedRowColumns";
import { useCalculatedColumnsWithTopHeader } from "./hooks/useCalculatedColumnsWithTopHeader";
import MasterRowRenderer from "./MasterRow";
import DetailsRow from "./DetailsRow";

const PrevNextArrow = (current, type, originalElement) => {
  if (type === "prev") {
    return (
      <button title="Previous" data-testid="pagination-prev">
        Prev
      </button>
    );
  }
  if (type === "next") {
    return (
      <button title="Next" data-testid="pagination-next">
        Next
      </button>
    );
  }
  return originalElement;
};

const initialPosition = {
  idx: -1,
  rowIdx: -2,
  mode: "SELECT",
};

/**
 * Main API Component to render a data grid of rows and columns
 *
 * @example
 *
 * <DataGrid columns={columns} rows={rows} />
 */
function DataGrid(props) {
  let {
    // Grid and data Props
    columnData: raawColumns,
    rowData: raawRows,
    topSummaryRows,
    bottomSummaryRows,
    onRowsChange,
    // Dimensions props
    rowHeight: rawRowHeight,
    headerRowHeight: rawHeaderRowHeight,
    summaryRowHeight: rawSummaryRowHeight,
    // Feature props
    selectedRows,
    onSelectedRowsChange,
    defaultColumnOptions,
    groupBy: raawGroupBy,
    expandedGroupIds,
    onExpandedGroupIdsChange,
    // Event props
    onRowClicked: onRowClick,
    onRowDoubleClicked: onRowDoubleClick,
    selectedCellHeaderStyle,
    onScroll,
    onColumnResize,
    onFill,
    serialNumber,
    rowSelection,
    onCopy,
    onPaste,
    selectedCellRowStyle,
    onCellClicked: onCellClick,
    onCellDoubleClicked: onCellDoubleClick,
    onCellContextMenu,
    // Toggles and modes
    cellNavigationMode: rawCellNavigationMode,
    enableVirtualization: rawEnableVirtualization,
    // Miscellaneous
    renderers,
    className,
    showSelectedRows,
    style,
    rowClass,
    direction: rawDirection,
    getContextMenuItems,
    // ARIA
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    testId,
    columnReordering,
    pagination: tablePagination,
    paginationPageSize,
    suppressPaginationPanel,
    paginationAutoPageSize,
    defaultPage,
    frameworkComponents,
    onGridReady,
    valueChangedCellStyle,
    rowFreezLastIndex,
    innerRef,
    onExpandedMasterIdsChange,
    onDetailedRowIdsChange,
    ...rest
  } = props;

  /**
   * defaults
   */

  const deviceWidth = window.innerWidth;
  let deviceType;
  if (deviceWidth > 900) {
    deviceType = "deskTop";
  } else if (deviceWidth >= 700) {
    deviceType = "tab";
  } else {
    deviceType = "mobile";
  }

  const [selectedRows1, onSelectedRowsChange1] = useState();
  selectedRows = selectedRows ? selectedRows : [];
  const selection = rest.selection && SelectColumn;
  let sam;
  if (rest.serialColumnStyle) {
    if (typeof rest.serialColumnStyle === "function") {
      sam = {
        ...SerialNumberColumn,
        cellStyle: (props) => rest.serialColumnStyle(props),
      };
    } else {
      sam = {
        ...SerialNumberColumn,
        cellStyle: rest.serialColumnStyle,
      };
    }
  } else {
    sam = SerialNumberColumn;
  }
  if (rest.selection && serialNumber) {
    raawColumns = [selection, ...raawColumns];

    raawColumns = [sam, ...raawColumns];
  } else if (rest.selection && !serialNumber) {
    raawColumns = [selection, ...raawColumns];
  } else if (!rest.selection && serialNumber) {
    raawColumns = [sam, ...raawColumns];
  }
  raawColumns = raawColumns.filter((col) => {
    if (!col.hide) return col;
  });
  if (
    rest.detailedRow &&
    (deviceType === "tab" ||
      deviceType === "mobile" ||
      rest.desktopDetailedRowEnable)
  ) {
    raawColumns = [
      { headerName: "", field: "details", width: 80 },
      ...raawColumns,
    ];
  }
  const rowKeyGetter = props.rowKeyGetter
    ? props.rowKeyGetter
    : (row) => row.id;
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextSubMenuItems, setContextSubMenuItems] = useState([]);
  const [contextSubMenuVisible, setContextSubMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [contextSubMenuPosition, setContextSubMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [contextData, setContextData] = useState();

  const handleContextMenu = (e, data) => {
    if (getContextMenuItems && getContextMenuItems.length > 0) {
      e.preventDefault();
      let position = { top: e.clientY + window.scrollY, left: e.clientX };
      setContextMenuPosition(position);
      setContextMenuVisible(true);
      setContextSubMenuVisible(false);
      setContextData(data);
    }
  };

  const closeContextMenu = () => {
    setContextMenuVisible(false);
    setContextSubMenuVisible(false);
  };
  const [headerHeightFromRef, setHeaderHeightFromRef] = useState(null);
  const depth = (d) => (o) => {
    o.depth = d;
    (o.children || []).forEach(depth(d + 1));
  };

  raawColumns.forEach(depth(0));

  const cloneRaawColumns1 = raawColumns.slice();
  const getArrayDepth = (arr) => {
    if (Array.isArray(arr)) {
      // if arr is an array, recurse over it
      return 1 + Math.max(...arr.map(getArrayDepth));
    }
    if (arr.children?.length) {
      // if arr is an object with a children property, recurse over the children
      return 1 + Math.max(...arr.children.map(getArrayDepth));
    }
    return 0;
  };
  const arrayDepth = getArrayDepth(cloneRaawColumns1);

  let singleHeaderRowHeight;
  if (rawHeaderRowHeight) {
    singleHeaderRowHeight = rawHeaderRowHeight;
  } else if (headerHeightFromRef) {
    singleHeaderRowHeight = headerHeightFromRef;
  } else {
    singleHeaderRowHeight = 24;
  }

  const headerheight = singleHeaderRowHeight * arrayDepth;

  const enableFilter = raawColumns
    ?.map((i) => i.filter === true && i.depth === arrayDepth - 1)
    .includes(true);

  const defaultComponents = useDefaultComponents();
  const rowHeight = rawRowHeight ?? 24;
  const headerRowHeight = headerheight;

  const summaryRowHeight =
    rawSummaryRowHeight ?? (typeof rowHeight === "number" ? rowHeight : 24);
  const rowRenderer =
    renderers?.rowRenderer ??
    defaultComponents?.rowRenderer ??
    defaultRowRenderer;
  const sortStatus =
    renderers?.sortStatus ?? defaultComponents?.sortStatus ?? defaultSortStatus;
  const checkboxFormatter =
    renderers?.checkboxFormatter ??
    defaultComponents?.checkboxFormatter ??
    defaultCheckboxFormatter;
  const noRowsFallback =
    renderers?.noRowsFallback ?? defaultComponents?.noRowsFallback;
  const cellNavigationMode = rawCellNavigationMode ?? "NONE";
  const enableVirtualization = rawEnableVirtualization ?? true;
  const direction = rawDirection ?? "ltr";

  /**
   * states
   */
  const [afterFilter, setAfterFilter] = useState([]);
  const [afterSort, setAfterSort] = useState([]);
  const [defaultColumnDef, setDefaultColumnDef] =
    useState(defaultColumnOptions);
  const [rawGroupBy, setRawGroupBy] = useState(raawGroupBy);
  const [expandAll, setExpandAll] = useState(null);

  const [detailedRowIds, setDetailedRowIds] = useState(
    rest.detailedRowIds ?? []
  );

  useUpdateEffect(() => {
    setRawColumns(raawColumns);
  }, [props.columnData]);

  useUpdateEffect(() => {
    setExpandAll(null);
  }, [raawGroupBy, expandedGroupIds]);
  useUpdateEffect(() => {
    setRawGroupBy(raawGroupBy);
  }, [raawGroupBy]);
  const { columns3 } = useCalculatedColumnsWithTopHeader({
    raawColumns, //need to be added
  });
  const [toolTip, setToolTip] = useState(false);
  const [toolTipContent, setToolTipContent] = useState("");
  const [mouseX, setMouseX] = useState();
  const [mouseY, setMouseY] = useState();
  const toolTipRef = useRef(null);

  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [columnWidths, setColumnWidths] = useState(() => new Map());
  const [selectedPosition, setSelectedPosition] = useState(initialPosition);
  const [copiedCell, setCopiedCell] = useState(null);
  const [isDragging, setDragging] = useState(false);
  const [draggedOverRowIdx, setOverRowIdx] = useState(undefined);
  const [sortColumns, setSortColumns] = useState([]);
  const [rawRows, setRawRows] = useState(raawRows);
  const [rawColumns, setRawColumns] = useState(
    // serialNumber ? [SerialNumberColumn, ...raawColumns] : columns3
    columns3
  );
  const [pagination, setPagination] = useState(tablePagination);
  const [suppressPagination, setSuppressPagination] = useState(
    suppressPaginationPanel ?? false
  );
  const [size, setSize] = useState(paginationPageSize ?? 20);
  const [current, setCurrent] = useState(defaultPage ?? 1);
  const [expandedTreeIds, setExpandedTreeIds] = useState(
    props.expandedTreeIds ?? []
  );
  const [expandedMasterRowIds, setExpandedMasterIds] = useState(
    props.expandedMasterRowIds ? [props.expandedMasterRowIds[0]] : []
  );
  useUpdateEffect(() => {
    if (Array.isArray(props.expandedMasterRowIds)) {
      setExpandedMasterIds([props.expandedMasterRowIds[0]]);
    }
  }, [props.expandedMasterRowIds]);

  const PaginationChange = (page, pageSize) => {
    setCurrent(page);
    setSize(pageSize);
  };

  const onSortColumnsChange = (sortColumns) => {
    setSortColumns(sortColumns.slice(-1));
  };

  let flattedColumns;
  const flat = (rawColumns) => (o) =>
    o.children
      ? o.children.flatMap(flat(rawColumns || o.headerName))
      : { ...o, rawColumns };
  const response = rawColumns;
  flattedColumns = response.flatMap(flat());
  const defaultFilters = {};
  flattedColumns?.map((i) => (defaultFilters[i.field] = ""));
  rawColumns?.map((i) => (defaultFilters[i.key] = ""));

  const subColumn = [];
  const [filters, setFilters] = useState({ ...defaultFilters, enabled: true });
  const [filterType, setFilterType] = useState("Contain");
  const [suppressRowClickSelection, setSuppressRowClickSelection] =
    useState(false);
  const ChildColumnSetup = (value) => {
    subColumn.push(value);
  };

  const filterFunction = useCallback(
    (props) => {
      if (filterType === "Contain") {
        return raawRows?.filter(function (val) {
          for (const element of props) {
            let value =
              typeof val[element[0]] !== "string"
                ? val[element[0]]?.toString()
                : val[element[0]];
            if (
              value &&
              !value.toLowerCase().includes(element[1].toLowerCase())
            )
              return false;
          }
          return true;
        });
      } else if (filterType === "Starts With...") {
        return raawRows?.filter(function (val) {
          for (const element of props) {
            let value =
              typeof val[element[0]] !== "string"
                ? val[element[0]]?.toString()
                : val[element[0]];
            if (
              value &&
              !value.toLowerCase().startsWith(element[1].toLowerCase())
            )
              return false;
          }
          return true;
        });
      } else if (filterType === "Ends With...") {
        return raawRows?.filter(function (val) {
          for (const element of props) {
            let value =
              typeof val[element[0]] !== "string"
                ? val[element[0]]?.toString()
                : val[element[0]];
            if (
              value &&
              !value.toLowerCase().endsWith(element[1].toLowerCase())
            )
              return false;
          }
          return true;
        });
      } else if (filterType === "Equals") {
        return raawRows?.filter(function (val) {
          for (const element of props) {
            let value =
              typeof val[element[0]] !== "string"
                ? val[element[0]]?.toString()
                : val[element[0]];
            if (value && value.toLowerCase() !== element[1].toLowerCase()) {
              return false;
            }
          }
          return true;
        });
      } else if (filterType === "Not Equals") {
        return raawRows?.filter(function (val) {
          for (const element of props) {
            let value =
              typeof val[element[0]] !== "string"
                ? val[element[0]]?.toString()
                : val[element[0]];
            if (value && value.toLowerCase() === element[1].toLowerCase()) {
              return false;
            }
          }
          return true;
        });
      }
    },
    [filterType, raawRows]
  );

  const sortedRows = useMemo(() => {
    const asArray = Object.entries(filters);
    const keys = asArray.filter(([key, value]) => value.length > 0);
    const filteredRows = filterFunction(keys);
    if (sortColumns.length === 0) return filteredRows;
    const { columnKey, direction } = sortColumns[0];
    let sortedRows = filteredRows;
    sortedRows = sortedRows?.sort((a, b) =>
      typeof a[columnKey] === "number"
        ? a[columnKey] - b[columnKey]
        : a[columnKey]?.localeCompare(b[columnKey])
    );
    return direction === "DESC" ? sortedRows.reverse() : sortedRows;
  }, [raawRows, sortColumns, filters]);

  useUpdateEffect(() => {
    return setRawRows(sortedRows);
  }, [sortedRows]);

  const handleReorderColumn = (value) => {
    if (columnReordering) {
      setRawColumns(value);
    }
  };

  const handleReorderRow = (value) => setRawRows(value);

  /**
   * refs
   */
  const prevSelectedPosition = useRef(selectedPosition);
  const latestDraggedOverRowIdx = useRef(draggedOverRowIdx);
  const lastSelectedRowIdx = useRef(-1);
  const rowRef = useRef(null);

  /**
   * computed values
   */
  const [gridRef, gridWidth, gridHeight, isWidthInitialized] =
    useGridDimensions();
  const headerRowsCount = 1;
  const topSummaryRowsCount = topSummaryRows?.length ?? 0;
  const bottomSummaryRowsCount = bottomSummaryRows?.length ?? 0;
  const summaryRowsCount = topSummaryRowsCount + bottomSummaryRowsCount;
  const clientHeight =
    gridHeight - headerRowHeight - summaryRowsCount * summaryRowHeight;
  const isSelectable = selectedRows != null && onSelectedRowsChange != null;
  const isRtl = direction === "rtl";
  const leftKey = isRtl ? "ArrowRight" : "ArrowLeft";
  const rightKey = isRtl ? "ArrowLeft" : "ArrowRight";

  const defaultGridComponents = useMemo(
    () => ({
      sortStatus,
      checkboxFormatter,
    }),
    [sortStatus, checkboxFormatter]
  );

  const allRowsSelected = useMemo(() => {
    // no rows to select = explicitely unchecked
    const { length } = rawRows;
    if (selectedRows1 === null || selectedRows1 === undefined) return null;
    return (
      length !== 0 &&
      selectedRows1 != null &&
      rowKeyGetter != null &&
      selectedRows1?.size >= length &&
      rawRows.every((row) => selectedRows1?.has(rowKeyGetter(row)))
    );
  }, [rawRows, selectedRows1, rowKeyGetter]);

  function flatten(into, node) {
    if (node == null) return into;
    if (Array.isArray(node)) return node.reduce(flatten, into);
    into.push(node);

    return flatten(into, node.children);
  }

  let rowArray = flatten([], rawColumns);

  let value = false;
  let rowColD = rowArray.slice();
  rowColD = rowColD.filter(function (item) {
    return item !== value;
  });

  let rowArray1 = rowColD.slice();
  for (let i = 0; i < rowArray1.length; i++) {
    if (rowArray1[i].haveChildren) {
      rowArray1.splice(i, 1);
      i--;
    }
  }

  let groupingViaCommonProperty = Object.values(
    rowArray1.reduce((acc, current) => {
      acc[current.topHeader] = acc[current.topHeader] ?? [];
      acc[current.topHeader].push(current.width);
      return acc;
    }, {})
  );

  let arr2 = groupingViaCommonProperty.map((arr) =>
    arr.reduce((sum, item) => sum + item)
  );

  const newData = rawColumns;

  let {
    columns,
    colSpanColumns,
    colOverscanStartIdx,
    colOverscanEndIdx,
    templateColumns,
    layoutCssVars,
    columnMetrics,
    lastFrozenColumnIndex,
    totalFrozenColumnWidth,
    groupBy,
  } = useCalculatedColumns({
    newData,
    columnWidths,
    scrollLeft,
    viewportWidth: gridWidth,
    defaultColumnDef,
    rawGroupBy: rowGrouper ? rawGroupBy : undefined,
    enableVirtualization,
    frameworkComponents,
    treeData: rest.treeData,
  });

  let rowData = flatten([], columns);
  let value1 = false;

  rowData = rowData.filter(function (item) {
    return item !== value1;
  });
  const rowData1 = rowData.slice();
  for (let i = 0; i < rowData1.length; i++) {
    if (rowData1[i].haveChildren) {
      rowData1.splice(i, 1);
      i--;
    }
  }

  const { columns4 } = useCalculatedColumnswithIdx({
    rowData1, //need to be added
    columnWidths,
    scrollLeft,
    viewportWidth: gridWidth,
    defaultColumnOptions,
    rawGroupBy: rowGrouper ? rawGroupBy : undefined,
    enableVirtualization,
    frameworkComponents,
  });

  let merged = [];
  for (const element of rowData) {
    merged.push({
      ...element,
      ...columns4.find((itmInner) => {
        if (element.field) return itmInner.field === element.field;
        return element.headerName === itmInner.headerName;
      }),
    });
  }

  for (let ii = 0, leng = merged.length; ii < leng; ii++) {
    merged[ii].children = undefined;
  }

  const regroupArray = (array) => {
    const map = {};
    array.forEach((item) => {
      if (item.field) map[item.field] = item;
      else if (item.headerName) map[item.headerName] = item;
      item.children = [];
    });
    array.forEach((item) => {
      if (item.parent !== null) {
        if (item.parent) map[item.parent].children.push(item);
      }
    });
    return array.filter((item) => item.parent === null);
  };

  for (let i = 0, len = regroupArray(merged).length; i < len; i++) {
    if (regroupArray(merged)[i].haveChildren === true)
      regroupArray(merged)[i].idx =
        regroupArray(merged)[i].index + columns4.length;
  }

  const { columns5 } = useCalculatedRowColumns({
    columns4,
    columnWidths,
    scrollLeft,
    viewportWidth: gridWidth,
    defaultColumnOptions,
    rawGroupBy: rowGrouper ? rawGroupBy : undefined,
    enableVirtualization,
    frameworkComponents, //need to be added
  });

  const {
    rowOverscanStartIdx,
    rowOverscanEndIdx,
    rows,
    rowsCount,
    totalRowHeight,
    gridTemplateRows,
    isGroupRow,
    getRowTop,
    getRowHeight,
    findRowIdx,
  } = useViewportRows({
    rawRows,
    groupBy,
    rowGrouper,
    expandAll,
    rowHeight,
    clientHeight,
    scrollTop,
    expandedGroupIds,
    expandedMasterRowIds,
    enableVirtualization,
    paginationPageSize: size,
    current,
    pagination,
    detailedRowIds,
    detailedRow: rest.detailedRow,
    columns: raawColumns,
    rowKeyGetter,
  });

  const { viewportColumns, flexWidthViewportColumns } = useViewportColumns({
    columns,
    colSpanColumns,
    colOverscanStartIdx,
    colOverscanEndIdx,
    lastFrozenColumnIndex,
    rowOverscanStartIdx,
    rowOverscanEndIdx,
    rows,
    topSummaryRows,
    bottomSummaryRows,
    columnWidths,
    isGroupRow,
  });

  function getLayoutCssVars() {
    if (flexWidthViewportColumns.length === 0) return layoutCssVars;
    const newTemplateColumns = [...templateColumns];
    for (const column of flexWidthViewportColumns) {
      newTemplateColumns[column.idx] = column.width;
    }

    return {
      ...layoutCssVars,
      gridTemplateColumns: newTemplateColumns.join(" "),
    };
  }
  const gridViewportTemplateColumns = getLayoutCssVars();
  //column Api
  function getColumnWidths() {
    let keys = Array.from(columnMetrics.keys());
    let columnKeys = [];
    keys.forEach((key) => columnKeys.push(key.key));
    let values = Array.from(columnMetrics.values());
    let columnWidthValues = [];
    values.forEach((value) => columnWidthValues.push(value.width));
    let columnWidth = new Map(columnWidths);
    for (let i = 0; i < columnWidthValues.length; i++) {
      columnWidth.set(columnKeys[i], columnWidthValues[i]);
    }
    return columnWidth;
  }
  function getColumns() {
    let columnObjects = [];
    columns.forEach((column) => {
      const index = raawColumns.findIndex((c) => {
        if (column.field) return c.field === column.field;
        return c.headerName === column.headerName;
      });
      const userColDef = raawColumns[index];
      const indexOfRowGroup = rawGroupBy?.findIndex(
        (key) => key === column.key
      );
      const indexOfSort = sortColumns.findIndex(
        (sortCol) => sortCol.columnKey === column.key
      );
      const sort = indexOfSort > -1 ? sortColumns[indexOfSort].direction : null;
      const columnState = {
        colId: column.field ?? column.key ?? `col_${column.idx}`,
        columnIndex: column.idx,
        width: templateColumns[column.idx],
        frozen: column.frozen ?? undefined,
        rowGroup: column.rowGroup ?? undefined,
        rowGroupIndex: indexOfRowGroup > -1 ? indexOfRowGroup : null,
        sort: sort,
        userProvidedColDef: userColDef,
      };
      columnObjects.push(columnState);
    });
    return columnObjects;
  }
  function moveColumn(colKey, toIndex) {
    const key = typeof colKey === "string" ? colKey : colKey.colId;
    const sourceColumnIndex = columns.findIndex((c) => c.field === key);
    const targetColumnIndex =
      toIndex < columns.length ? toIndex : sourceColumnIndex;
    const reorderedColumns = [...columns];
    reorderedColumns.splice(
      targetColumnIndex,
      0,
      reorderedColumns.splice(sourceColumnIndex, 1)[0]
    );
    setRawColumns(reorderedColumns);
  }
  function moveColumns(columnsToMove, toIndex) {
    let sourceColumns = [];
    const reorderedColumns = [...columns];
    columns.map((c) =>
      columnsToMove.forEach((col) => {
        const key = typeof col === "string" ? col : col.colId;
        if (key === c.field) sourceColumns.push(c);
      })
    );
    let valueAtPosition = columns[toIndex];
    sourceColumns.forEach((v) =>
      reorderedColumns.splice(reorderedColumns.indexOf(v), 1)
    );
    reorderedColumns.splice(
      reorderedColumns.indexOf(valueAtPosition) + 1,
      0,
      ...sourceColumns
    );
    setRawColumns(reorderedColumns);
  }
  function moveColumnByIndex(fromIndex, toIndex) {
    const sourceColumnIndex = fromIndex;
    const targetColumnIndex =
      toIndex < columns.length ? toIndex : sourceColumnIndex;
    const reorderedColumns = [...columns];
    reorderedColumns.splice(
      targetColumnIndex,
      0,
      reorderedColumns.splice(sourceColumnIndex, 1)[0]
    );
    setRawColumns(reorderedColumns);
  }
  function getDisplayNameForColumn(column, location) {
    let displayNameForCol;
    columns.forEach((col) => {
      if (column.colId === col.key && location === col.idx)
        displayNameForCol = col.headerName;
    });
    return displayNameForCol;
  }
  function getDisplayedColAfter(column) {
    let columnObjects = getColumns();
    let displayedColAfterKey;
    for (let index = 0; index < columns.length; index++) {
      let col = columns[index];
      let nextCol = columns[index + 1];
      if (column.colId === col.key)
        displayedColAfterKey = nextCol.parentColumn
          ? nextCol.parentColumn.key || nextCol.parentColumn.field
          : nextCol.key;
    }
    let displayedColAfter;
    columnObjects.forEach((colObj) => {
      if (colObj.colId === displayedColAfterKey) displayedColAfter = colObj;
    });
    return displayedColAfter;
  }
  function getDisplayedColBefore(column) {
    let columnObjects = getColumns();
    let displayedColBeforeKey;
    for (let index = 0; index < columns.length; index++) {
      let col = columns[index];
      let prevCol = columns[index - 1];
      if (column.colId === col.key)
        displayedColBeforeKey = prevCol.parentColumn
          ? prevCol.parentColumn.key || prevCol.parentColumn.field
          : prevCol.key;
    }
    let displayedColBefore;
    columnObjects.forEach((colObj) => {
      if (colObj.colId === displayedColBeforeKey) displayedColBefore = colObj;
    });
    return displayedColBefore;
  }
  function getRowGroupColumns() {
    let columnObjects = getColumns();
    let rowGroupColumns = [];
    columnObjects.forEach((colObject) => {
      if (rawGroupBy?.includes(colObject.colId))
        rowGroupColumns.push(colObject);
    });
    return rowGroupColumns;
  }

  function setRowGroupColumns(colKeys) {
    rawGroupBy.length = 0;
    colKeys.forEach((colKey) => {
      typeof colKey === "string"
        ? rawGroupBy.push(colKey)
        : rawGroupBy.push(colKey.colId);
    });
    setRawColumns(raawColumns);
  }
  function addRowGroupColumn(colKey) {
    typeof colKey === "string"
      ? rawGroupBy.push(colKey)
      : rawGroupBy.push(colKey.colId);
    setRawColumns(raawColumns);
  }
  function addRowGroupColumns(colKeys) {
    colKeys.forEach((colKey) => {
      typeof colKey === "string"
        ? rawGroupBy.push(colKey)
        : rawGroupBy.push(colKey.colId);
    });
    setRawColumns(raawColumns);
  }
  function removeRowGroupColumn(colKey) {
    const key = typeof colKey === "string" ? colKey : colKey.colId;
    const indexOfKey = rawGroupBy?.findIndex((c) => c === key);
    if (indexOfKey > -1) rawGroupBy?.splice(indexOfKey, 1);
    setRawColumns(raawColumns);
  }
  function removeRowGroupColumns(colKeys) {
    colKeys.forEach((colKey) => {
      const key = typeof colKey === "string" ? colKey : colKey.colId;
      const indexOfKey = rawGroupBy?.findIndex((c) => c === key);
      if (indexOfKey > -1) rawGroupBy?.splice(indexOfKey, 1);
    });
    setRawColumns(raawColumns);
  }
  function moveRowGroupColumn(fromIndex, toIndex) {
    if (fromIndex > -1 && toIndex < rawGroupBy?.length) {
      let element = rawGroupBy[fromIndex];
      rawGroupBy.splice(fromIndex, 1);
      rawGroupBy.splice(toIndex, 0, element);
      setRawColumns(columns);
    }
  }
  function setColumnWidth(key, newWidth) {
    const colKey = typeof key === "string" ? key : key.colId;
    const newColumnWidths = new Map(columnWidths);
    newColumnWidths.set(colKey, newWidth);
    setColumnWidths(newColumnWidths);
  }
  function setColumnsWidth(newColumnWidths) {
    const newColWidths = new Map(columnWidths);
    newColumnWidths.forEach((col) => {
      const colKey = typeof col.key === "string" ? col.key : col.key.colId;
      const colWidth = col.newWidth;
      newColWidths.set(colKey, colWidth);
    });
    setColumnWidths(newColWidths);
  }
  function autoSizeColumn(key) {
    const colKey = typeof key === "string" ? key : key.colId;
    const columnIndex = columns.findIndex((col) => col.key === colKey);
    const column = columns[columnIndex];
    handleColumnResize(column, "max-content");
  }
  function autoSizeColumns(colKeys) {
    let columnObjects = getColumns();
    const { style } = gridRef.current;
    const newTemplateColumns = [...templateColumns];
    const newColumnWidths = new Map(columnWidths);
    colKeys.forEach((colKey) => {
      const key = typeof colKey === "string" ? colKey : colKey.colId;
      const index = columnObjects.findIndex((c) => c.colId === key);
      newTemplateColumns[index] = "max-content";
      style.gridTemplateColumns = newTemplateColumns.join(" ");
      const measuringCell = gridRef.current.querySelector(
        `[data-measuring-cell-key="${columns[index].key}"]`
      );
      const measuredWidth = measuringCell.getBoundingClientRect().width;
      const measuredWidthPx = `${measuredWidth}px`;
      if (newTemplateColumns[columns[index].idx] !== measuredWidthPx) {
        newTemplateColumns[columns[index].idx] = measuredWidthPx;
        style.gridTemplateColumns = newTemplateColumns.join(" ");
      }
      if (columnWidths.get(columns[index].key) === measuredWidth) return;
      newColumnWidths.set(columns[index].key, measuredWidth);
    });
    setColumnWidths(newColumnWidths);
    templateColumns = [...newTemplateColumns];
  }
  function autoSizeAllColumns() {
    const { style } = gridRef.current;
    const newTemplateColumns = [...templateColumns];
    const newColumnWidths = new Map(columnWidths);
    for (let index = 0; index < newTemplateColumns.length; index++) {
      newTemplateColumns[index] = "max-content";
      style.gridTemplateColumns = newTemplateColumns.join(" ");
      const measuringCell = gridRef.current.querySelector(
        `[data-measuring-cell-key="${columns[index].key}"]`
      );
      const measuredWidth = measuringCell.getBoundingClientRect().width;
      const measuredWidthPx = `${measuredWidth}px`;
      if (newTemplateColumns[columns[index].idx] !== measuredWidthPx) {
        newTemplateColumns[columns[index].idx] = measuredWidthPx;
        style.gridTemplateColumns = newTemplateColumns.join(" ");
      }
      if (columnWidths.get(columns[index].key) === measuredWidth) return;
      newColumnWidths.set(columns[index].key, measuredWidth);
    }
    setColumnWidths(newColumnWidths);
    templateColumns = [...newTemplateColumns];
  }
  function sizeColumnsToFit(gridWidth) {
    let columnWidths = getColumnWidths();
    let widthSum = 0;
    let colWidthValues = Array.from(columnWidths.values());
    colWidthValues.forEach((colWidth) => {
      widthSum += colWidth;
    });
    let scale = gridWidth / widthSum;
    const newColWidths = new Map(columnWidths);
    let colWidths = Array.from(columnWidths.keys());
    let sum = 0;
    for (let index = 0; index < colWidthValues.length; index++) {
      if (index === colWidthValues.length - 1) {
        let width = gridWidth - sum;
        newColWidths.set(colWidths[index], width);
      } else {
        let width = Math.round(colWidthValues[index] * scale);
        newColWidths.set(colWidths[index], width);
        sum += width;
      }
    }
    setColumnWidths(newColWidths);
  }
  function getColumnState() {
    let columns = Array.from(columnMetrics.keys());
    let colStates = [];
    columns.forEach((col) => {
      const index = sortColumns.findIndex(
        (sortCol) => sortCol.columnKey === col.key
      );
      const sort = index > -1 ? sortColumns[index].direction : null;
      const indexOfRowGroup = rawGroupBy?.findIndex((key) => key === col.key);
      const colState = {
        colId: col.key ?? `col_${col.idx}`,
        columnIndex: col.idx,
        frozen: col.frozen ?? undefined,
        width: templateColumns[col.idx],
        rowGroup: col.rowGroup ?? undefined,
        rowGroupIndex: indexOfRowGroup > -1 ? indexOfRowGroup : null,
        sort: sort,
      };
      colStates.push(colState);
    });
    return colStates;
  }

  function applyColumnState(columnState) {
    const colState = columnState.state;
    const defaultState = columnState.defaultState ?? undefined;
    const newColWidths = new Map(columnWidths);
    colState?.forEach((col) => {
      const colKey = col.colId;
      if (col.frozen) {
        const index = columns.findIndex((c) => c.key === colKey);
        columns[index].frozen = col.frozen;
      }
      if (col.width !== undefined) {
        let width = isString(col.width)
          ? Number(col.width.match(/\d+/)[0])
          : col.width;
        newColWidths.set(colKey, width);
      }
      if (col.rowGroup !== undefined) {
        if (col.rowGroup) {
          const index = columns.findIndex((c) => c.key === colKey);
          columns[index].rowGroup = col.rowGroup;
          addRowGroupColumn(colKey);
        } else {
          const index = columns.findIndex((c) => c.key === colKey);
          columns[index].rowGroup = col.rowGroup;
          removeRowGroupColumn(colKey);
        }
      }
      if (col.rowGroupIndex !== undefined) {
        if (col.rowGroupIndex !== null && col.rowGroup) {
          const fromIndex = rawGroupBy.findIndex(
            (groupCol) => groupCol === colKey
          );
          const toIndex = col.rowGroupIndex;
          if (fromIndex > -1 && toIndex < rawGroupBy?.length)
            moveRowGroupColumn(fromIndex, toIndex);
        }
      }
      if (col.sort !== undefined) {
        if (col.sort !== null) {
          const index = sortColumns?.findIndex(
            (sortCol) => sortCol.columnKey === colKey
          );
          if (index === -1)
            sortColumns.push({ columnKey: colKey, direction: col.sort });
          if (index > -1 && sortColumns[index].direction !== col.sort)
            sortColumns[index].direction = col.sort;
          onSortColumnsChange(sortColumns);
        } else {
          const index = sortColumns?.findIndex(
            (sortCol) => sortCol.columnKey === colKey
          );
          if (index > -1) sortColumns?.splice(index, 1);
          onSortColumnsChange(sortColumns);
        }
      }
      setColumnWidths(newColWidths);
    });
    if (defaultState) {
      let keysOfColumns = [];
      if (colState) colState.map((col) => keysOfColumns.push(col.colId));
      columns.forEach((column) => {
        if (!keysOfColumns.includes(column.key)) {
          if (defaultState.frozen !== undefined)
            column.frozen = defaultState.frozen;
          if (defaultState.width !== undefined) {
            newColWidths.set(column.key, defaultState.width);
          }
          if (defaultState.rowGroup !== undefined) {
            if (defaultState.rowGroup) {
              const index = columns.findIndex((c) => c.key === column.key);
              columns[index].rowGroup = defaultState.rowGroup;
              addRowGroupColumn(column.key);
            } else {
              const index = columns.findIndex((c) => c.key === column.key);
              columns[index].rowGroup = defaultState.rowGroup;
              removeRowGroupColumn(column.key);
            }
          }
          if (defaultState.sort !== undefined) {
            if (defaultState.sort !== null) {
              const index = sortColumns.findIndex(
                (sortCol) => sortCol.columnKey === column.key
              );
              if (index === -1)
                sortColumns.push({
                  columnKey: column.key,
                  direction: defaultState.sort,
                });
              if (
                index > -1 &&
                sortColumns[index].direction !== defaultState.sort
              )
                sortColumns[index].direction = defaultState.sort;
              onSortColumnsChange(sortColumns);
            } else {
              const index = sortColumns.findIndex(
                (sortCol) => sortCol.columnKey === column.key
              );
              if (index > -1) sortColumns.splice(index, 1);
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
    let isPinning = false;
    columns.forEach((col) => {
      if (col.frozen === true) isPinning = true;
    });
    return isPinning;
  }
  function setColumnPinned(key) {
    const colKey = typeof key === "string" ? key : key.colId;
    const columnIndex = columns.findIndex((col) => col.key === colKey);
    columns[columnIndex].frozen = true;
    setRawColumns(columns);
  }
  function setColumnsPinned(keys) {
    for (let i = 0; i < columns.length; i++) {
      for (const element of keys) {
        const key = typeof element === "string" ? element : element.colId;
        const columnIndex = columns.findIndex((col) => col.key === key);
        if (i === columnIndex) columns[i].frozen = true;
      }
    }
    setRawColumns(columns);
  }
  function getSortColumns() {
    let columnObjects = getColumns();
    let sortColumns = [];
    columnObjects.forEach((colObj) => {
      if (colObj.sort !== null) sortColumns.push(colObj);
    });
    return sortColumns;
  }
  let columnApiObject = {
    columnModel: {
      columnDefs: raawColumns,
      rowGroupColumns: getRowGroupColumns(),
      sortColumns: getSortColumns(),
    },
  };
  Object.setPrototypeOf(columnApiObject, {
    // get columns
    getColumns,
    getColumn: (colKey) => {
      let columnObjects = getColumns();
      let colObject;
      let key = typeof colKey === "string" ? colKey : colKey.colId;
      columnObjects.forEach((columnObj) => {
        if (columnObj.colId === key) colObject = columnObj;
      });
      return colObject;
    },
    getAllGridColumns: () => getColumns(),
    //move columns
    moveColumn,
    moveColumns,
    moveColumnByIndex,
    //display names for column / column groups
    getDisplayNameForColumn,
    getDisplayedColAfter,
    getDisplayedColBefore,
    getAllDisplayedVirtualColumns: () => viewportColumns,
    getAllDisplayedColumns: () => viewportColumns,
    //row group columns
    getRowGroupColumns,
    setRowGroupColumns,
    addRowGroupColumn,
    addRowGroupColumns,
    removeRowGroupColumn,
    removeRowGroupColumns,
    moveRowGroupColumn,
    //column widths
    setColumnWidth,
    setColumnsWidth,
    autoSizeColumn,
    autoSizeColumns,
    autoSizeAllColumns,
    sizeColumnsToFit,
    //column states
    getColumnState,
    applyColumnState,
    resetColumnState: () => {
      // // groupBy = [...rawGroupBy];
      if (rawGroupBy?.length > 0) rawGroupBy.length = 0;
      if (sortColumns?.length > 0) {
        sortColumns.length = 0;
        onSortColumnsChange(sortColumns);
      }
      setRawColumns(raawColumns);
    },
    //pinning columns
    isPinning,
    setColumnPinned,
    setColumnsPinned,
  });

  const hasGroups = groupBy.length > 0 && typeof rowGrouper === "function";
  const minColIdx = hasGroups ? -1 : 0;
  const maxColIdx = rowArray1.length - 1;
  const minRowIdx = -1 - topSummaryRowsCount;
  const maxRowIdx = rows.length + bottomSummaryRowsCount - 1;
  const selectedCellIsWithinSelectionBounds =
    isCellWithinSelectionBounds(selectedPosition);
  const selectedCellIsWithinViewportBounds =
    isCellWithinViewportBounds(selectedPosition);

  function selectRow({ row, checked, isShiftClick }) {
    const newSelectedRows = new Set(selectedRows1);
    const newSelectedRows1 = selectedRows;
    if (isGroupRow(row)) {
      for (const childRow of row.childRows) {
        const rowKey = rowKeyGetter(childRow);
        if (checked) {
          newSelectedRows.add(rowKey);
          newSelectedRows1.push(childRow);
        } else {
          newSelectedRows.delete(rowKey);
          newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
        }
      }
      onSelectedRowsChange1(newSelectedRows);
      if (onSelectedRowsChange) onSelectedRowsChange(newSelectedRows1);
      return;
    }

    function recursiveSelectRow(obj) {
      const rowKey = rowKeyGetter(obj);
      if (obj.children) {
        obj.children.map((childrenRow) => recursiveSelectRow(childrenRow));
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
      row.children.map((obj) => {
        recursiveSelectRow(obj);
      });
    }

    const rowKey = rowKeyGetter(row);
    if (checked) {
      newSelectedRows.add(rowKey);
      newSelectedRows1.push(row);
      const previousRowIdx = lastSelectedRowIdx.current;
      const rowIdx = rows.indexOf(row);
      lastSelectedRowIdx.current = rowIdx;
      if (isShiftClick && previousRowIdx !== -1 && previousRowIdx !== rowIdx) {
        const step = sign(rowIdx - previousRowIdx);
        for (
          let i = previousRowIdx + step;
          i < rowIdx && i > rowIdx;
          i += step
        ) {
          const row = rows[i];
          if (isGroupRow(row)) continue;
          newSelectedRows.add(rowKeyGetter(row));
          newSelectedRows1.push(row);
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

  /**
   * The identity of the wrapper function is stable so it won't break memoization
   */
  const handleColumnResizeLatest = useLatestFunc(handleColumnResize);
  const onSortColumnsChangeLatest = useLatestFunc(onSortColumnsChange);
  const onCellClickLatest = useLatestFunc((params) => {
    const row = params.data;
    const rowKey = rowKeyGetter(row);
    if (onCellClick) onCellClick(params);
    const newSelectedRows =
      selectedRows1 !== undefined ? Object.values(selectedRows1) : [];
    let newSelectedRows1 = [];
    if (
      rowSelection?.toLowerCase() === "single" &&
      !suppressRowClickSelection &&
      (!props.selection || (props.selection && selectedPosition.idx !== 0))
    ) {
      if (selectedRows1 === undefined || !selectedRows1?.has(rowKey)) {
        if (!onSelectedRowsChange1) return;
        if (selectedRows1 !== undefined)
          newSelectedRows.splice(0, newSelectedRows.length);
        newSelectedRows.push(rowKey);
        newSelectedRows1 = [row];
      } else {
        newSelectedRows.pop(rowKey);
        newSelectedRows1 = [];
      }
      onSelectedRowsChange1(new Set(newSelectedRows));
      if (onSelectedRowsChange) onSelectedRowsChange(newSelectedRows1);
    } else if (
      rowSelection?.toLowerCase() === "multiple" &&
      (!props.selection || (props.selection && selectedPosition.idx !== 0))
    ) {
      if (
        selectedRows1 === undefined ||
        params.event.ctrlKey ||
        props.rowMultiSelectWithClick
      ) {
        selectRow({
          row,
          checked:
            selectedRows1 === undefined
              ? true
              : !selectedRows1?.has(rowKeyGetter(row)),
          isShiftClick: false,
        });
      } else {
        if (selectedRows1 === undefined || !selectedRows1?.has(rowKey)) {
          if (!onSelectedRowsChange1) return;
          if (selectedRows1 !== undefined)
            newSelectedRows.splice(0, newSelectedRows.length);
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
  const onCellDoubleClickLatest = useLatestFunc(onCellDoubleClick);
  const onCellContextMenuLatest = useLatestFunc(onCellContextMenu);
  const selectRowLatest = useLatestFunc(selectRow);
  const selectAllRowsLatest = useLatestFunc(selectAllRows);
  const handleFormatterRowChangeLatest = useLatestFunc(updateRow);
  const selectViewportCellLatest = useLatestFunc(
    (row, column, enableEditor) => {
      const rowIdx = rows.indexOf(row);
      selectCell({ rowIdx, idx: column.idx }, enableEditor);
    }
  );

  const selectGroupLatest = useLatestFunc((rowIdx) => {
    selectCell({ rowIdx, idx: -1 });
  });
  const selectHeaderCellLatest = useLatestFunc((idx) => {
    selectCell({ rowIdx: minRowIdx, idx });
  });
  const selectTopSummaryCellLatest = useLatestFunc((summaryRow, column) => {
    const rowIdx = topSummaryRows.indexOf(summaryRow);
    selectCell({ rowIdx: rowIdx + minRowIdx + 1, idx: column.idx });
  });
  const selectBottomSummaryCellLatest = useLatestFunc((summaryRow, column) => {
    const rowIdx = bottomSummaryRows.indexOf(summaryRow) + rows.length;
    selectCell({ rowIdx, idx: column.idx });
  });
  const toggleGroupLatest = useLatestFunc(toggleGroup);

  const toggleTreeLatest = useLatestFunc(toggleTree);

  const toggleMasterLatest = useLatestFunc(toggleMaster);

  const toggleDetailedLatest = useLatestFunc(toggleDetailed);

  /**
   * effects
   */
  useLayoutEffect(() => {
    if (
      !selectedCellIsWithinSelectionBounds ||
      isSamePosition(selectedPosition, prevSelectedPosition.current)
    ) {
      prevSelectedPosition.current = selectedPosition;
      return;
    }

    prevSelectedPosition.current = selectedPosition;

    if (selectedPosition.idx === -1) {
      rowRef.current.focus({ preventScroll: true });
      scrollIntoView(rowRef.current);
    }
  });

  useLayoutEffect(() => {
    if (!isWidthInitialized || flexWidthViewportColumns.length === 0) return;

    setColumnWidths((columnWidths) => {
      const newColumnWidths = new Map(columnWidths);
      const grid = gridRef.current;

      for (const column of flexWidthViewportColumns) {
        const measuringCell = grid.querySelector(
          `[data-measuring-cell-key="${
            column.key ?? `grid_no_key${column.idx}`
          }"]`
        );
        // Set the actual width of the column after it is rendered
        const { width } = measuringCell.getBoundingClientRect();
        newColumnWidths.set(column.key, width);
      }

      return newColumnWidths;
    });
  }, [isWidthInitialized, flexWidthViewportColumns, gridRef]);

  useImperativeHandle(innerRef, () => ({
    element: gridRef.current,
    scrollToColumn,
    scrollToRow(rowIdx) {
      const { current } = gridRef;
      if (!current) return;
      current.scrollTo({
        top: getRowTop(rowIdx),
        behavior: "smooth",
      });
    },
    selectCell,
    api: apiObject,
    columnApi: columnApiObject,
    node,
  }));

  /**
   * callbacks
   */
  const setDraggedOverRowIdx = useCallback((rowIdx) => {
    setOverRowIdx(rowIdx);
    latestDraggedOverRowIdx.current = rowIdx;
  }, []);

  /**
   * event handlers
   */
  function handleColumnResize(column, width) {
    const { style } = gridRef.current;
    const newTemplateColumns = [...templateColumns];
    newTemplateColumns[column.idx] =
      width === "max-content" ? width : `${width}px`;
    style.gridTemplateColumns = newTemplateColumns.join(" ");

    const measuringCell = gridRef.current.querySelector(
      `[data-measuring-cell-key="${column.key}"]`
    );
    const measuredWidth = measuringCell?.getBoundingClientRect().width;
    const measuredWidthPx = `${measuredWidth}px`;

    if (newTemplateColumns[column.idx] !== measuredWidthPx) {
      newTemplateColumns[column.idx] = measuredWidthPx;
      style.gridTemplateColumns = newTemplateColumns.join(" ");
    }

    if (columnWidths.get(column.key) === measuredWidth) return;

    const newColumnWidths = new Map(columnWidths);
    newColumnWidths.set(column.key, measuredWidth);
    setColumnWidths(newColumnWidths);

    onColumnResize?.(column.idx, measuredWidth);
  }

  function selectAllRows(checked) {
    const newSelectedRows = new Set(selectedRows1);
    const newSelectedRows1 = selectedRows;
    for (const row of rawRows) {
      const rowKey = rowKeyGetter(row);
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
    const newExpandedGroupIds = new Set(expandedGroupIds);
    if (newExpandedGroupIds.has(expandedGroupId)) {
      newExpandedGroupIds.delete(expandedGroupId);
    } else {
      newExpandedGroupIds.add(expandedGroupId);
    }
    onExpandedGroupIdsChange(newExpandedGroupIds);
  }

  function TreeViewHandle() {
    if (expandedTreeIds.length > 0) {
      let sampleRawRows = raawRows;
      function gatherRows() {
        expandedTreeIds.map((id) => {
          sampleRawRows.map((data, index) => {
            const rowKey = rowKeyGetter(data);
            if (id === rowKey) {
              if (
                JSON.stringify(data.children[0]) !==
                JSON.stringify(sampleRawRows[index + 1])
              ) {
                let sampleRow = data.children?.map((obj) => obj);
                if (index !== 0) {
                  sampleRawRows = [
                    ...sampleRawRows.slice(0, index + 1),
                    ...sampleRow,
                    ...sampleRawRows.slice(index + 1),
                  ];
                } else {
                  sampleRawRows = [
                    sampleRawRows[index],
                    ...sampleRow,
                    ...sampleRawRows.slice(index + 1),
                  ];
                }
              }
            }
          });
        });
      }
      gatherRows();
      sampleRawRows.map((row, index) => {
        if (expandedTreeIds.includes(rowKeyGetter(row))) {
          if (
            JSON.stringify(row.children[0]) !==
            JSON.stringify(sampleRawRows[index + 1])
          ) {
            gatherRows();
          }
        }
      });
      setRawRows([...sampleRawRows]);
    } else {
      setRawRows([...raawRows]);
    }
  }
  useEffect(() => {
    TreeViewHandle();
  }, [expandedTreeIds]);

  useEffect(() => {
    if (rest.masterData) {
      if (expandedMasterRowIds?.length > 0) {
        let sampleRows = [];
        raawRows.map((row) => {
          if (expandedMasterRowIds?.includes(rowKeyGetter(row))) {
            sampleRows.push({ ...row, gridRowType: "Master" });
            sampleRows.push({
              gridRowType: "Detail",
              parentId: rowKeyGetter(row),
              masterRowData: row,
            });
          } else {
            sampleRows.push({ ...row, gridRowType: "Master" });
          }
        });
        setRawRows([...sampleRows]);
      } else {
        setRawRows([...raawRows]);
      }
    }
  }, [expandedMasterRowIds, raawRows]);
  function handleDetailedRow(rows) {
    if (
      (rest.detailedRow && deviceType !== "deskTop") ||
      (rest.detailedRow && rest.desktopDetailedRowEnable)
    ) {
      if (detailedRowIds?.length > 0) {
        let sampleRows = [];
        rows.map((row) => {
          if (detailedRowIds?.includes(rowKeyGetter(row))) {
            sampleRows.push({ ...row, gridRowType: "master" });
            sampleRows.push({
              gridRowType: "detailedRow",
              parentId: rowKeyGetter(row),
              ...row,
            });
          } else {
            sampleRows.push({ ...row, gridRowType: "master" });
          }
        });
        setRawRows([...sampleRows]);
      } else {
        setRawRows([...rows]);
      }
    }
  }
  useEffect(() => {
    handleDetailedRow(raawRows);
  }, [detailedRowIds, raawRows]);
  function toggleMaster(newExpandedMasterId) {
    let sample = [];
    if (!expandedMasterRowIds?.includes(newExpandedMasterId)) {
      sample.push(newExpandedMasterId);
    }
    setExpandedMasterIds(sample);
    if (onExpandedMasterIdsChange) onExpandedMasterIdsChange(sample);
  }
  function toggleDetailed(newDetailedRowId) {
    let sample;
    if (!detailedRowIds?.includes(newDetailedRowId)) {
      setDetailedRowIds(
        rest.detailedRowType === "multiple"
          ? [...detailedRowIds, newDetailedRowId]
          : [newDetailedRowId]
      );
      sample =
        rest.detailedRowType === "multiple"
          ? [...detailedRowIds, newDetailedRowId]
          : [newDetailedRowId];
    } else {
      sample =
        rest.detailedRowType === "multiple"
          ? detailedRowIds?.filter((value) => value !== newDetailedRowId)
          : [];
      setDetailedRowIds(sample);
    }
    if (onDetailedRowIdsChange) onDetailedRowIdsChange(sample);
  }
  function toggleTree(newExpandedTreeId) {
    if (!expandedTreeIds.includes(newExpandedTreeId)) {
      setExpandedTreeIds([...expandedTreeIds, newExpandedTreeId]);
    } else {
      setExpandedTreeIds(
        expandedTreeIds.filter((value) => value !== newExpandedTreeId)
      );
    }
  }

  function handleKeyDown(event) {
    if (!(event.target instanceof Element)) return;
    const isCellEvent = event.target.closest(".rdg-cell") !== null;
    const isRowEvent = hasGroups && event.target === rowRef.current;
    if (!(isCellEvent || isRowEvent)) return;

    const { key, keyCode } = event;
    const { rowIdx } = selectedPosition;

    if (
      selectedCellIsWithinViewportBounds &&
      // (onPaste != null || onCopy != null) &&
      isCtrlKeyHeldDown(event) &&
      !isGroupRow(rows[rowIdx]) &&
      selectedPosition.mode === "SELECT"
    ) {
      // event.key may differ by keyboard input language, so we use event.keyCode instead
      // event.nativeEvent.code cannot be used either as it would break copy/paste for the DVORAK layout
      const cKey = 67;
      const vKey = 86;
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
      const row = rows[rowIdx];

      if (
        isGroupRow(row) &&
        selectedPosition.idx === -1 &&
        // Collapse the current group row if it is focused and is in expanded state
        ((key === leftKey && row.isExpanded) ||
          // Expand the current group row if it is focused and is in collapsed state
          (key === rightKey && !row.isExpanded))
      ) {
        event.preventDefault(); // Prevents scrolling
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
    const { scrollTop, scrollLeft } = event.currentTarget;
    flushSync(() => {
      setScrollTop(scrollTop);
      // scrollLeft is nagative when direction is rtl
      setScrollLeft(abs(scrollLeft));
    });
    onScroll?.(event);
  }

  function getRawRowIdx(rowIdx) {
    return hasGroups ? rawRows.indexOf(rows[rowIdx]) : rowIdx;
  }

  function findChangedKey(newObj, oldObj) {
    if (Object.keys(oldObj)?.length === 0 && Object.keys(newObj)?.length > 0)
      return newObj;
    let diff = {};
    for (const key in oldObj) {
      if (newObj[key] && oldObj[key] !== newObj[key]) {
        diff[key] = newObj[key];
      }
    }
    if (Object.keys(diff).length > 0) return Object.keys(diff);
    return [];
  }
  const [changedList, setChangedList] = useState([]);
  const [previousData, setPreviousData] = useState([]);

  useUpdateEffect(() => {
    setPreviousData([...raawRows]);
  }, [raawRows]);

  useEffect(() => {
    if (selectedRows.length > 0) {
      let sample = new Set(selectedRows1);
      selectedRows.forEach((r) => {
        if (!sample.has(rowKeyGetter(r))) {
          sample.add(rowKeyGetter(r));
        }
      });
      onSelectedRowsChange1(sample);
    }
    if (onGridReady) {
      onGridReady({
        api: apiObject,
        columnApi: columnApiObject,
        type: "gridReady",
      });
    }
    setPreviousData([...raawRows]);
  }, []);

  function updateRow(column, rowIdx, row, oldRow) {
    if (column && column.readOnly) return;
    if (rest.detailedRow) {
      function updateSource() {
        let sample = [...raawRows];
        let index;

        const { gridRowType, parentId, ...ty } = row;

        sample.forEach((dat, idx) => {
          const { gridRowType, parentId, ...rt } = oldRow;
          if (JSON.stringify(rt) === JSON.stringify(dat)) {
            index = idx;
          }
        });
        sample[index] = ty;
        if (typeof onRowsChange === "function") {
          onRowsChange([...sample]);
        }
      }
      if (row.gridRowType === "detailedRow") {
        let sam = rawRows;
        sam[rowIdx] = row;
        let fg = sam[rowIdx - 1];
        sam[rowIdx - 1] = { ...fg, [column.key]: row[column.key] };
        setRawRows([...sam]);
        updateSource();
      } else {
        let sam = rawRows;
        sam[rowIdx] = row;

        setRawRows([...sam]);

        updateSource();
      }
    } else if (rest.treeData) {
      let sample = [...rawRows];
      if (valueChangedCellStyle) {
        let sampleChanged = changedList;
        sampleChanged[rowIdx] = findChangedKey(row, previousData[rowIdx]);
        setChangedList(sampleChanged);
      }
      function replaceObject(arr, oldObj, newObj) {
        return arr.map((obj) => {
          if (obj === oldObj) {
            return newObj;
          } else if (obj.children) {
            return {
              ...obj,
              children: replaceObject(obj.children, oldObj, newObj),
            };
          } else {
            return obj;
          }
        });
      }

      const res = replaceObject(sample, oldRow, row);
      setRawRows(res);
      if (typeof onRowsChange === "function") {
        onRowsChange(sample);
      }
    } else if (rest.masterData) {
      if (
        Object.values(rawRows[rowIdx]).join("") !== Object.values(row).join("")
      ) {
        let originalRows = [...rawRows];
        originalRows[rowIdx] = row;
        setRawRows(originalRows);

        if (typeof onRowsChange !== "function") {
          if (expandedMasterRowIds.includes(rowKeyGetter(row))) {
            let sd = originalRows[rowIdx + 1];
            sd = { ...sd, masterRowData: row };
            originalRows[rowIdx + 1] = sd;
            setRawRows([...originalRows]);
          }
          return;
        }
        const updatedMasterRows = [];
        originalRows.forEach((row) => {
          if (row.gridRowType !== "Detail") {
            const { gridRowType, ...others } = row;
            updatedMasterRows.push(others);
          }
        });
        onRowsChange(updatedMasterRows, {
          column,
        });
      }
    } else {
      let sampleData = raawRows;
      if (valueChangedCellStyle) {
        let sampleChanged = changedList;
        sampleChanged[rowIdx] = findChangedKey(row, previousData[rowIdx]);
        setChangedList(sampleChanged);
      }
      sampleData[rowIdx] = row;
      setRawRows([...sampleData]);
      if (typeof onRowsChange !== "function") return;
      const rawRowIdx = getRawRowIdx(rowIdx);
      if (row === rawRows[rawRowIdx]) return;
      const updatedRows = [...rawRows];
      updatedRows[rawRowIdx] = row;
      onRowsChange(updatedRows, {
        indexes: [rawRowIdx],
        column,
      });
    }
  }

  function commitEditorChanges() {
    if (selectedPosition.mode !== "EDIT") return;
    updateRow(
      columns[selectedPosition.idx],
      selectedPosition.rowIdx,
      selectedPosition.row
    );
  }

  function handleCopy() {
    const { idx, rowIdx } = selectedPosition;
    const sourceRow = rawRows[getRawRowIdx(rowIdx)];
    const sourceColumnKey = columns[idx].key;
    setCopiedCell({ row: sourceRow, columnKey: sourceColumnKey });
    onCopy?.({ sourceRow, sourceColumnKey });
  }

  function handlePaste() {
    if (
      !(onPaste && onRowsChange) ||
      copiedCell === null ||
      !isCellEditable(selectedPosition)
    ) {
      return;
    }

    const { idx, rowIdx } = selectedPosition;
    const targetColumn = columns[idx];
    const targetRow = rawRows[getRawRowIdx(rowIdx)];

    const updatedTargetRow = onPaste({
      sourceRow: copiedCell.row,
      sourceColumnKey: copiedCell.columnKey,
      targetRow,
      targetColumnKey: targetColumn.key,
    });

    updateRow(targetColumn, rowIdx, updatedTargetRow);
  }

  function handleCellInput(event) {
    if (!selectedCellIsWithinViewportBounds) return;
    const row = rows[selectedPosition.rowIdx];
    if (isGroupRow(row)) return;
    const { key, shiftKey } = event;

    // Select the row on Shift + Space
    if (isSelectable && shiftKey && key === " ") {
      const rowKey = rowKeyGetter(row);
      selectRow({
        row,
        checked: !selectedRows1?.has(rowKey),
        isShiftClick: false,
      });
      // do not scroll
      event.preventDefault();
      return;
    }

    const column = columns4[selectedPosition.idx];
    column.editorOptions?.onCellKeyDown?.(event);
    if (event.isDefaultPrevented()) return;

    if (isCellEditable(selectedPosition) && isDefaultCellInput(event)) {
      setSelectedPosition(({ idx, rowIdx }) => ({
        idx,
        rowIdx,
        mode: "EDIT",
        row,
        originalRow: row,
      }));
    }
  }

  /**
   * utils
   */
  function isColIdxWithinSelectionBounds(idx) {
    return idx >= minColIdx && idx <= maxColIdx;
  }

  function isRowIdxWithinViewportBounds(rowIdx) {
    return rowIdx >= 0 && rowIdx < rows.length;
  }

  function isCellWithinSelectionBounds({ idx, rowIdx }) {
    return (
      rowIdx >= minRowIdx &&
      rowIdx <= maxRowIdx &&
      isColIdxWithinSelectionBounds(idx)
    );
  }

  function isCellWithinViewportBounds({ idx, rowIdx }) {
    return (
      isRowIdxWithinViewportBounds(rowIdx) && isColIdxWithinSelectionBounds(idx)
    );
  }

  function isCellEditable(position) {
    return (
      isCellWithinViewportBounds(position) &&
      isSelectedCellEditable({
        columns4,
        rows,
        selectedPosition: position,
        isGroupRow,
      })
    );
  }

  function selectCell(position, enableEditor) {
    if (!isCellWithinSelectionBounds(position)) return;
    commitEditorChanges();

    if (enableEditor && isCellEditable(position)) {
      const row = rows[position.rowIdx];
      setSelectedPosition({ ...position, mode: "EDIT", row, originalRow: row });
    } else if (isSamePosition(selectedPosition, position)) {
      // Avoid re-renders if the selected cell state is the same
      scrollIntoView(gridRef.current?.querySelector('[tabindex="0"]'));
    } else {
      setSelectedPosition({ ...position, mode: "SELECT" });
    }
  }

  function scrollToColumn(idx) {
    const { current } = gridRef;
    if (!current) return;

    if (idx > lastFrozenColumnIndex) {
      const { rowIdx } = selectedPosition;
      const { clientWidth } = current;
      const column = columns[idx];
      const { left, width } = columnMetrics.get(column);
      let right = left + width;

      const colSpan = getSelectedCellColSpan({
        rows,
        topSummaryRows,
        bottomSummaryRows,
        rowIdx,
        lastFrozenColumnIndex,
        column,
        isGroupRow,
      });

      if (colSpan !== undefined) {
        const { left, width } = columnMetrics.get(
          columns[column.idx + colSpan - 1]
        );
        right = left + width;
      }

      const isCellAtLeftBoundary = left < scrollLeft + totalFrozenColumnWidth;
      const isCellAtRightBoundary = right > clientWidth + scrollLeft;
      const sign = isRtl ? -1 : 1;
      if (isCellAtLeftBoundary) {
        current.scrollLeft = (left - totalFrozenColumnWidth) * sign;
      } else if (isCellAtRightBoundary) {
        current.scrollLeft = (right - clientWidth) * sign;
      }
    }
  }

  function getNextPosition(key, ctrlKey, shiftKey) {
    const { idx, rowIdx } = selectedPosition;
    const row = rows[rowIdx];
    const isRowSelected = selectedCellIsWithinSelectionBounds && idx === -1;

    // If a group row is focused, and it is collapsed, move to the parent group row (if there is one).
    if (
      key === leftKey &&
      isRowSelected &&
      isGroupRow(row) &&
      !row.isExpanded &&
      row.level !== 0
    ) {
      let parentRowIdx = -1;
      for (let i = selectedPosition.rowIdx - 1; i >= 0; i--) {
        const parentRow = rows[i];
        if (isGroupRow(parentRow) && parentRow.id === row.parentId) {
          parentRowIdx = i;
          break;
        }
      }
      if (parentRowIdx !== -1) {
        return { idx, rowIdx: parentRowIdx };
      }
    }

    switch (key) {
      case "ArrowUp":
        return { idx, rowIdx: rowIdx - 1 };
      case "ArrowDown":
        return { idx, rowIdx: rowIdx + 1 };
      case leftKey:
        return { idx: idx - 1, rowIdx };
      case rightKey:
        return { idx: idx + 1, rowIdx };
      case "Tab":
        return { idx: idx + (shiftKey ? -1 : 1), rowIdx };
      case "Home":
        // If row is selected then move focus to the first row
        if (isRowSelected) return { idx, rowIdx: 0 };
        return { idx: 0, rowIdx: ctrlKey ? minRowIdx : rowIdx };
      case "End":
        // If row is selected then move focus to the last row.
        if (isRowSelected) return { idx, rowIdx: rows.length - 1 };
        return { idx: maxColIdx, rowIdx: ctrlKey ? maxRowIdx : rowIdx };
      case "PageUp": {
        if (selectedPosition.rowIdx === minRowIdx) return selectedPosition;
        const nextRowY =
          getRowTop(rowIdx) + getRowHeight(rowIdx) - clientHeight;
        return { idx, rowIdx: nextRowY > 0 ? findRowIdx(nextRowY) : 0 };
      }
      case "PageDown": {
        if (selectedPosition.rowIdx >= rows.length) return selectedPosition;
        const nextRowY = getRowTop(rowIdx) + clientHeight;
        return {
          idx,
          rowIdx:
            nextRowY < totalRowHeight ? findRowIdx(nextRowY) : rows.length - 1,
        };
      }
      default:
        return selectedPosition;
    }
  }

  function navigate(event) {
    const { key, shiftKey } = event;
    let mode = cellNavigationMode;
    if (key === "Tab") {
      if (
        canExitGrid({
          shiftKey,
          cellNavigationMode,
          maxColIdx,
          minRowIdx,
          maxRowIdx,
          selectedPosition,
        })
      ) {
        commitEditorChanges();
        // Allow focus to leave the grid so the next control in the tab order can be focused
        return;
      }

      mode = cellNavigationMode === "NONE" ? "CHANGE_ROW" : cellNavigationMode;
    }

    // Do not allow focus to leave
    event.preventDefault();

    const ctrlKey = isCtrlKeyHeldDown(event);
    const nextPosition = getNextPosition(key, ctrlKey, shiftKey);
    if (isSamePosition(selectedPosition, nextPosition)) return;

    const nextSelectedCellPosition = getNextSelectedCellPosition({
      columns,
      colSpanColumns,
      rows,
      topSummaryRows,
      bottomSummaryRows,
      minRowIdx,
      maxRowIdx,
      lastFrozenColumnIndex,
      cellNavigationMode: mode,
      currentPosition: selectedPosition,
      nextPosition,
      isCellWithinBounds: isCellWithinSelectionBounds,
      isGroupRow,
    });

    selectCell(nextSelectedCellPosition);
  }

  function getDraggedOverCellIdx(currentRowIdx) {
    if (draggedOverRowIdx === undefined) return;
    const { rowIdx } = selectedPosition;

    const isDraggedOver =
      rowIdx < draggedOverRowIdx
        ? rowIdx < currentRowIdx && currentRowIdx <= draggedOverRowIdx
        : rowIdx > currentRowIdx && currentRowIdx >= draggedOverRowIdx;

    return isDraggedOver ? selectedPosition.idx : undefined;
  }

  function getCellEditor(rowIdx) {
    if (
      selectedPosition.rowIdx !== rowIdx ||
      selectedPosition.mode === "SELECT"
    )
      return;

    const { idx, row } = selectedPosition;
    const column = columns4[idx];
    const colSpan = getColSpan(column, lastFrozenColumnIndex, {
      type: "ROW",
      row,
      expandedMasterRowIds,
    });

    const closeEditor = () => {
      setSelectedPosition(({ idx, rowIdx }) => ({
        idx,
        rowIdx,
        mode: "SELECT",
      }));
    };

    const onRowChange = (row, commitChanges) => {
      if (commitChanges) {
        updateRow(column, selectedPosition.rowIdx, row);
        closeEditor();
      } else {
        setSelectedPosition((position) => ({ ...position, row }));
      }
    };

    if (rows[selectedPosition.rowIdx] !== selectedPosition.originalRow) {
      // Discard changes if rows are updated from outside
      closeEditor();
    }

    return (
      <EditCell
        key={`${column.key}`}
        column={column}
        colSpan={colSpan}
        row={row}
        handleReorderRow={handleReorderRow}
        allrow={raawRows}
        rowIndex={rowIdx}
        api={apiObject}
        node={node}
        onRowChange={onRowChange}
        closeEditor={closeEditor}
      />
    );
  }

  function getRowViewportColumns(rowIdx) {
    const selectedColumn = columns[selectedPosition.idx];
    if (
      // idx can be -1 if grouping is enabled
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      selectedColumn !== undefined &&
      selectedPosition.rowIdx === rowIdx &&
      !viewportColumns.includes(selectedColumn)
    ) {
      // Add the selected column to viewport columns if the cell is not within the viewport
      return selectedPosition.idx > colOverscanEndIdx
        ? [...viewportColumns, selectedColumn]
        : [
            ...viewportColumns.slice(0, lastFrozenColumnIndex + 1),
            selectedColumn,
            ...viewportColumns.slice(lastFrozenColumnIndex + 1),
          ];
    }
    return viewportColumns;
  }

  let node;

  let endRowIdxForRender;

  const [RowNodes, setRowNodes] = useState([]);
  function forEachNode(newFunction) {
    RowNodes.forEach((data) => {
      newFunction(data);
    });
  }
  function getRowBounds(index) {
    return {
      rowTop: RowNodes[index].rowTop,
      rowHeight: RowNodes[index].rowHeight,
    };
  }
  function isRowPresent(object1) {
    let result = false;
    RowNodes.forEach((obj) => {
      if (_.isEqual(object1, obj)) {
        result = true;
      }
    });
    return result;
  }
  function getNodesInRangeForSelection(obj1, obj2) {
    let firstIndex;
    let secondIndex;
    let startIndex;
    let endIndex;
    RowNodes.forEach((obj, idx) => {
      if (_.isEqual(obj1, obj)) {
        firstIndex = idx;
      }
      return true;
    });
    RowNodes.forEach((obj, idx) => {
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
  let getModelObject = {
    getRow: (index) => RowNodes[index],
    getRowNode: (idValue) => RowNodes.filter((data) => data.id === idValue),
    getRowCount: () => rows.length,
    getTopLevelRowCount: () => rows.length,
    getTopLevelRowDisplayedIndex: (index) => (rows[index] ? index : null),
    getRowIndexAtPixel: (pixel) => Math.floor(pixel / rowHeight),
    isRowPresent,
    getRowBounds,
    isEmpty: () => raawRows.length === 0,
    isRowsToRender: () => endRowIdxForRender !== 0,
    getNodesInRangeForSelection,
    forEachNode,
    getType: () => "clientSide",
    isLastRowIndexKnown: () => true,
    // ensureRowHeightsValid
    // start
  };
  function applyTransaction(transactionObject) {
    let newRows = rows;
    let updatedRowNodes = { added: [], updated: [], removed: [] };
    let isUpdated = 0;
    //Add Rows
    let rowIndex1 = transactionObject.addIndex + 1;
    for (let i = 0; i < transactionObject.add?.length; i++) {
      let rowIndex;
      if (rowKeyGetter) {
        rowIndex = findRowIndex(rowKeyGetter(transactionObject.add[i]));
      } else {
        rowIndex = findRowIndex(transactionObject.add[i].id);
      }
      if (rowIndex === -1) {
        if (transactionObject.addIndex) {
          if (transactionObject.addIndex > raawRows.length) return;
          const newRowNode = createNewRowNode(
            rowIndex1,
            transactionObject.add[i]
          );
          newRows.splice(rowIndex1, 0, newRowNode.data);
          LeafNodes.splice(rowIndex1, 0, newRowNode);
          updatedRowNodes.added.push(LeafNodes[rowIndex1]);
          rowIndex1++;
          isUpdated++;
        } else {
          rowIndex = transactionObject.add[i].id - 1;
          const newRowNode = createNewRowNode(
            rowIndex,
            transactionObject.add[i]
          );

          newRows.splice(rowIndex, 0, newRowNode.data);
          LeafNodes.splice(rowIndex, 0, newRowNode);
          updatedRowNodes.added.push(newRowNode);
          isUpdated++;
        }
      }
    }

    //Update Row Data
    for (let i = 0; i < transactionObject.update?.length; i++) {
      const values = Object.entries(transactionObject.update[i]);
      let rowIndex;
      if (rowKeyGetter) {
        rowIndex = findRowIndex(rowKeyGetter(transactionObject.update[i]));
      } else {
        rowIndex = findRowIndex(transactionObject.update[i].id);
      }
      for (const element of values) {
        const field = element[0];
        const value = element[1];
        LeafNodes[rowIndex].data[field] = value;
      }
      updatedRowNodes.updated.push(LeafNodes[rowIndex]);
      isUpdated++;
    }
    //Remove Rows
    transactionObject.remove?.sort((a, b) => (a.id < b.id ? 1 : -1));
    for (let i = 0; i < transactionObject.remove?.length; i++) {
      let rowIndex;
      if (rowKeyGetter) {
        rowIndex = findRowIndex(rowKeyGetter(transactionObject.remove[i]));
      } else {
        rowIndex = findRowIndex(transactionObject.remove[i].id);
      }

      if (rowIndex > -1) {
        newRows.splice(rowIndex, 1);
        updatedRowNodes.removed.push(LeafNodes[rowIndex]);
        LeafNodes.splice(rowIndex, 1);
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
    let leafNodes = [];
    for (let i = 0; i < raawRows.length; i++) {
      let node = {
        rowIndex: i,
        childIndex: i + 1,
        data: raawRows[i],
        rowHeight: getRowHeight(i),
        lastChild: raawRows.length === i + 1,
        firstChild: i === 0,
        id: raawRows[i].id ?? String(i),
        // selected: selectedRows.includes(i),
      };
      leafNodes.push(node);
    }
    return leafNodes;
  }
  function forEachLeafNode(callback) {
    let updatedLeafNodes = [];
    for (let i = 0; i < RowNodes?.length ?? LeafNodes.length; i++) {
      callback(RowNodes[i] ?? LeafNodes[i]);
      updatedLeafNodes.push(RowNodes[i].data ?? LeafNodes[i].data);
    }
    setRawRows(updatedLeafNodes);
  }
  function forEachLeafNodeAfterFilter(callback) {
    forEachLeafNode(callback);
  }
  function forEachLeafNodeAfterFilterAndSort(callback) {
    forEachLeafNode(callback);
  }

  function findRowIndex(id) {
    let index = -1;
    for (const element of LeafNodes) {
      if (id === element.data?.id) index = element.rowIndex;
    }
    return index;
  }

  function createNewRowNode(index, data) {
    const newRowNode = {
      rowIndex: index,
      childIndex: index + 1,
      data: data,
      rowHeight: getRowHeight(index),
      lastChild: LeafNodes.length === index - 1,
      firstChild: index === 0,
      id: data.id ?? String(index + 1),
    };
    return newRowNode;
  }

  function selectAll(filteredRows) {
    if (!onSelectedRowsChange) return;
    const newSelectedRows = new Set(selectedRows1);
    const newSelectedRows1 = selectedRows;
    for (const row of filteredRows?.data ?? rawRows) {
      const rowKey = rowKeyGetter(row);

      newSelectedRows.add(rowKey);
      if (!newSelectedRows1.includes(row)) newSelectedRows1.push(row);
    }

    onSelectedRowsChange1(newSelectedRows);
  }
  function deselectAll(filteredRows) {
    if (!onSelectedRowsChange) return;
    let newSelectedRows = new Set(selectedRows1);
    let newSelectedRows1 = selectedRows;
    for (const row of filteredRows?.data ?? rawRows) {
      const rowKey = rowKeyGetter(row);

      newSelectedRows.delete(rowKey);
      newSelectedRows1.splice(newSelectedRows1.indexOf(row), 1);
    }
    onSelectedRowsChange1(newSelectedRows);
  }
  function getSelectedNodes() {
    let selectedNodes = [];
    if (selectedRows1 === undefined) return selectedRows;
    const selectedRowsSet = Array.from(selectedRows1);
    RowNodes?.forEach((rowNode) => {
      const rowKey = rowKeyGetter?.(rowNode.data);
      if (selectedRowsSet.includes(rowKey)) selectedNodes.push(rowNode);
    });
    return selectedNodes;
  }
  function getSelectedRows() {
    let selectedRows = [];
    if (selectedRows1 === undefined) return selectedRows;
    const selectedRowsSet = Array.from(selectedRows1);
    rawRows.forEach((row) => {
      const rowKey = rowKeyGetter?.(row);
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
  let totalPages =
    Math.floor(raawRows.length / size) + (raawRows.length % size < 0 ? 1 : 0);
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
    return selectedPosition.rowIdx >= 0
      ? {
          rowIndex: selectedPosition.rowIdx,
          column: columns[selectedPosition.idx],
        }
      : undefined;
  }

  function setFocusedCell(idx, key) {
    let index;
    columns.map((obj, position) => {
      if (obj.key === key) {
        index = position;
      }
      return true;
    });
    setSelectedPosition({ idx: index, rowIdx: idx, mode: "SELECT" });
  }
  function tabToNextCell() {
    let columnLength = columns.length;
    let rowsLength = rows.length;
    let idx;
    let rowIdx;
    if (selectedPosition.idx + 1 < columnLength) {
      idx = selectedPosition.idx + 1;
      rowIdx = selectedPosition.rowIdx;
    } else {
      idx = 0;
      rowIdx =
        selectedPosition.rowIdx + 1 < rowsLength
          ? selectedPosition.rowIdx + 1
          : 0;
    }
    setSelectedPosition({ idx: idx, rowIdx: rowIdx, mode: "SELECT" });
  }
  function tabToPreviousCell() {
    let columnLength = columns.length;
    let rowsLength = rows.length;
    let idx;
    let rowIdx;
    if (selectedPosition.idx - 1 >= 0) {
      idx = selectedPosition.idx - 1;
      rowIdx = selectedPosition.rowIdx;
    } else {
      idx = columnLength - 1;
      rowIdx =
        selectedPosition.rowIdx - 1 >= 0
          ? selectedPosition.rowIdx - 1
          : rowsLength - 1;
    }
    setSelectedPosition({ idx: idx, rowIdx: rowIdx, mode: "SELECT" });
  }
  function exportDataAsCsv(fileName) {
    let name = fileName ?? "ExportToCSV";
    exportToCsv(rawRows, rawColumns, name);
  }
  function exportDataAsExcel(fileName) {
    let name = fileName ?? "ExportToXlsx";
    exportToXlsx(rawRows, rawColumns, name);
  }
  function exportDataAsPdf(fileName) {
    let name = fileName ?? "ExportToPdf";
    exportToPdf(rawRows, rawColumns, name);
  }
  function isAnyFilterPresent() {
    let filterPresent = false;
    viewportColumns.forEach((obj) => {
      if (obj?.filter) filterPresent = true;
    });
    return filterPresent;
  }
  function setData(newValue, rowIndex) {
    let list = [...rawRows];
    list[rowIndex] = newValue;
    setRawRows(list);
  }
  function setDataValue(key, newValue, row, rowIndex) {
    let data = row;
    data[key] = newValue;
    let list = [...rawRows];
    list[rowIndex] = data;
    setRawRows(list);
  }
  const getViewportRowsSample = (rowArray) => {
    let rowElementsSample = [];
    let listOfRows = rowArray;
    let node;

    const { rowIdx: selectedRowIdx } = selectedPosition;

    const startRowIdx = 0;
    const endRowIdx = listOfRows.length - 1;
    for (
      let viewportRowIdx = startRowIdx;
      viewportRowIdx <= endRowIdx;
      viewportRowIdx++
    ) {
      const rowIdx = viewportRowIdx;

      const row = listOfRows[rowIdx];

      node = {
        rowIndex: rowIdx,
        rowTop: rowIdx * rowHeight,
        childIndex: rowIdx + 1,
        data: row,
        rowHeight: rowHeight,
        lastChild: raawRows.length === rowIdx + 1,
        firstChild: rowIdx === 0,
        id: row?.id ?? String(rowIdx),
        selected: selectedRowIdx === rowIdx,
        setDataValue: (key, newValue) =>
          setDataValue(key, newValue, row, rowIdx),
        setData: (val) => setData(val, rowIdx),
        parent: {
          allLeafChildren: RowNodes,
          childrenAfterFilter: afterFilter,
          childrenAfterSort: afterSort,
        },

        expanded: rows[rowIdx]?.isExpanded,

        isSelected: () => selectedRowIdx === rowIdx,
        setSelected: () => {
          selectRow({
            row,
            checked: !selectedRows.includes(rowKeyGetter(row)),
            isShiftClick: false,
          });
        },
        isExpandable: () => {
          return rows[rowIdx]?.isExpanded;
        },
        setExpanded: (value) => {
          let expandIds = new Set(expandedGroupIds);
          let rowKey = rowKeyGetter(rows[rowIdx]);
          if (value) {
            expandIds.add(rowKey);
          } else {
            expandIds.delete(rowKey);
          }
          onExpandedGroupIdsChange(expandIds);
        },

        updateData: (val) => setData(val, rowIdx),
        // isSelected: () => isRowSelected,
      };
      rowElementsSample.push(node);
    }

    return rowElementsSample;
  };

  function setSuppressRowDrag(value) {
    if (value) {
      let sampleColumn = raawColumns.map((obj) => {
        if (obj?.rowDrag) {
          return { ...obj, rowDrag: false };
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
      bottom:
        scrollTop + document.getElementById(rest.id ?? "DataGrid").offsetHeight,
    };
  }
  function getHorizontalPixelRange() {
    return {
      left: scrollLeft,
      right:
        scrollLeft + document.getElementById(rest.id ?? "DataGrid").offsetWidth,
    };
  }
  function isColumnFilterPresent() {
    let sampleKeys = Object.keys(filters);
    let result = false;
    sampleKeys.forEach((value) => {
      if (
        value !== "undefined" &&
        value !== "enabled" &&
        filters[value] !== ""
      ) {
        result = true;
      }
    });
    return result;
  }
  const [selectedData, setSelectedData] = useState(null);
  useUpdateEffect(() => {
    if (selectedPosition.mode === "EDIT") {
      if (columns[selectedPosition.idx]?.cellEditor) {
        setSelectedData(selectedPosition);
      }
    }
  }, [selectedPosition]);
  function getEditingCells() {
    return { rowIndex: selectedData.rowIdx, column: columns[selectedData.idx] };
  }

  function setRowNodeExpanded(rowNode, expanded, expandParents) {
    let rData = rowNode.data;
    let item = raawGroupBy?.map((value) => {
      return rData[value];
    });
    let sample = [];
    for (let i = 1; i <= item.length; i++) {
      sample.push(item.slice(0, i).join("__"));
    }
    if (expanded && expandParents) onExpandedGroupIdsChange(new Set(sample));
  }
  const [showHorizontalScroll, setShowHorizontalScroll] = useState(false);
  const [showVerticalScroll, setShowVerticalScroll] = useState(false);
  if (showHorizontalScroll || showVerticalScroll) {
    let gridDiv = document.getElementById(rest.id ?? "DataGrid");
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
      current.scrollTo({ top: getRowTop(index), behavior: "smooth" });
    } else if (
      position === undefined ||
      position === null ||
      position === "bottom"
    ) {
      current.scrollTo({
        top: getRowTop(index - rowCount + 2),
        behavior: "smooth",
      });
    } else if (position === "middle") {
      let visibile =
        rowCount + (2 % 1) !== 0
          ? Math.floor((rowCount + 2) / 2) - 2
          : Math.floor((rowCount + 2) / 2);
      current.scrollTo({
        top: getRowTop(index - visibile),
        behavior: "smooth",
      });
    }
  }
  const div_height = document.getElementById(
    rest.id ?? "DataGrid"
  )?.clientHeight;
  const rowCount = Math.floor(div_height / rowHeight);
  function ensureIndexVisible(index, position) {
    const { current } = gridRef;
    if (!current) return;
    Scroll(index, rowCount, position, current);
  }
  function ensureNodeVisible(rowNode, position) {
    const { current } = gridRef;
    let index;
    if (rowNode.rowIndex) {
      index = rowNode.rowIndex;
    } else {
      rows?.map((obj, idx) => {
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
    let columnsValue = raawColumns.map((data) => {
      return Object.values(data);
    });
    let index;
    if (typeof key === "string") {
      columnsValue.map((data, idx) => {
        if (data.includes(key)) {
          index = idx;
        }
      });
    }
    scrollToColumn(index);
  }
  function setCellValue(rowIndex, colKey, newValue) {
    raawRows[rowIndex][colKey] = newValue;
    setRawRows([...raawRows]);
  }

  function addRow(row, replace) {
    let newReplace = replace ?? true;
    if (row && !Array.isArray(row) && typeof row === "object") {
      if (newReplace) {
        let sample = rawRows.filter((obj) => {
          if (JSON.stringify(obj) !== JSON.stringify(row)) return obj;
        });
        sample.push(row);
        setRawRows([...sample]);
      } else {
        setRawRows([...rawRows, row]);
      }
    }
  }
  function addRows(rows, replace) {
    let newReplace = replace ?? true;
    if (rows && Array.isArray(rows)) {
      if (newReplace) {
        let sampleRows = rawRows.filter(
          (itemA) =>
            !rows.some(
              (itemB) => JSON.stringify(itemB) === JSON.stringify(itemA)
            )
        );
        setRawRows([...sampleRows, ...rows]);
      } else {
        setRawRows([...rawRows, ...rows]);
      }
    }
  }
  function deleteRow(row) {
    if (row && !Array.isArray(row) && typeof row === "object") {
      let sampleRows = rawRows.filter((obj) => {
        if (JSON.stringify(obj) !== JSON.stringify(row)) return obj;
      });
      setRawRows([...sampleRows]);
    }
  }
  function deleteRows(rows) {
    let sampleRows;
    if (rows && Array.isArray(rows)) {
      sampleRows = rawRows.filter(
        (itemA) =>
          !rows.some((itemB) => JSON.stringify(itemB) === JSON.stringify(itemA))
      );
    }
    setRawRows(sampleRows);
  }

  var apiObject = {
    setCellValue: setCellValue,
    updateColumns: (newColumns) => {
      setRawColumns([...newColumns]);
    },
    getColumnDefs: () => rawColumns,
    getFirstRenderedData: () => previousData,
    setColumnDefs: (columns) => setRawColumns(columns),
    setRowData: setRowData,
    getRowNode: (value) => RowNodes[value],
    setHeaderHeight: (height) => setHeaderHeightFromRef(height),
    getDisplayedRowCount: () => rawRows.length,
    getDisplayedRowAtIndex: (index) => rawRows[index],
    getFirstDisplayedRow: () => rawRows[0],
    getLastDisplayedRow: () => raawRows[raawRows.length - 1],
    getModel: () => getModelObject,
    forEachNode,
    forEachLeafNode,
    forEachLeafNodeAfterFilter,
    forEachLeafNodeAfterFilterAndSort,
    getSelectedNodes,
    applyTransaction,
    getSelectedRows,
    getValue: (colKey, rowNode) => {
      return LeafNodes[rowNode.rowIndex].data[colKey];
    },
    selectAll: selectAll,
    deselectAll: deselectAll,
    selectAllFiltered,
    deselectAllFiltered,
    getRenderedNodes: () => renderedRowNodes,
    setPagination: (value) => setPagination(value),
    paginationIsLastPageFound: () => true,
    paginationGetPageSize: () => (pagination ? size : raawRows.length),
    paginationSetPageSize: (newPageSize) =>
      pagination ? setSize(newPageSize) : null,
    paginationGetCurrentPage: () => current - 1,
    paginationGetTotalPages: () =>
      Math.floor(raawRows.length / size) + (raawRows.length % size < 0 ? 1 : 0),
    paginationGetRowCount: () => (pagination ? raawRows.length : 0),
    paginationGoToPage: paginationGoToPage,
    paginationGoToNextPage: paginationGoToNextPage,
    paginationGoToPreviousPage: paginationGoToPreviousPage,
    paginationGoToFirstPage: () => (pagination ? setCurrent(1) : null),
    paginationGoToLastPage: () => (pagination ? setCurrent(totalPages) : null),
    rowModel: {
      rowsToDisplay: RowNodes,
      rootNode: {
        allLeafChildren: RowNodes,
        childrenAfterFilter: afterFilter,
        childrenAfterSort: afterSort,
      },
      columnModel: { columnDefs: rawColumns, displayedColumns: columns },
      nodeManager: { allNodesMap: RowNodes },
      csvCreator: { exportDataAsCsv: exportDataAsCsv },
    },
    getFocusedCell: getFocusedCell,
    setFocusedCell: setFocusedCell,
    clearFocusedCell: () => setSelectedPosition(initialPosition),
    tabToNextCell: tabToNextCell,
    tabToPreviousCell: tabToPreviousCell,
    exportDataAsCsv: exportDataAsCsv,
    exportDataAsExcel: exportDataAsExcel,
    exportDataAsPdf: exportDataAsPdf,
    setDefaultColDef: (value) =>
      setDefaultColumnDef({ ...defaultColumnDef, ...value }),
    isAnyFilterPresent: isAnyFilterPresent,
    expandAll: () => setExpandAll(true),
    collapseAll: () => setExpandAll(false),
    getFilterModel: () => filters,
    setQuickFilter: (newValue) => {
      if (newValue && newValue.toString().length > 0) {
        let filteredRows = raawRows?.filter((row) => {
          for (let key in row) {
            if (
              row?.[key] &&
              row?.[key].toString().toLowerCase().includes(newValue)
            )
              return true;
          }
        });
        setRawRows([...filteredRows]);
      } else {
        setRawRows(raawRows);
      }
    },
    setFilterModel: (value) => setFilters({ ...filters, ...value }),
    destroyFilter: (key) => {
      let sample = filters;
      sample[key] = "";
      setFilters({ ...sample });
    },
    setSuppressRowDrag,
    getVerticalPixelRange,
    getHorizontalPixelRange,
    isColumnFilterPresent,
    setSuppressRowClickSelection: (value) =>
      setSuppressRowClickSelection(value),
    getEditingCells,
    setRowNodeExpanded,
    setAlwaysShowHorizontalScroll,
    setAlwaysShowVerticalScroll,
    ensureIndexVisible,
    ensureNodeVisible,
    ensureColumnVisible,
    getRows: () => rawRows,
    getRenderedrows: () => rows,
    setSuppressPagination: (val) => setSuppressPagination(),
    addItem: addRow,
    addItems: addRows,
    removeItem: deleteRow,
    removeItems: deleteRows,
  };

  ///////////  start

  useEffect(() => {
    setAfterFilter(getViewportRowsSample(sortedRows));
  }, [filters]);

  useEffect(() => {
    setAfterSort(getViewportRowsSample(sortedRows));
  }, [sortColumns, sortedRows]);

  useEffect(() => {
    setRowNodes(getViewportRowsSample(raawRows));
  }, [expandedGroupIds, expandAll, raawRows, afterFilter, afterSort]);

  let renderedRowNodes = [];
  function getViewportRows() {
    let node;
    const rowElements = [];
    let startRowIndex = 0;

    const { idx: selectedIdx, rowIdx: selectedRowIdx } = selectedPosition;

    const startRowIdx =
      selectedCellIsWithinViewportBounds && selectedRowIdx < rowOverscanStartIdx
        ? rowOverscanStartIdx - 1
        : rowOverscanStartIdx;
    const endRowIdx =
      selectedCellIsWithinViewportBounds && selectedRowIdx > rowOverscanEndIdx
        ? rowOverscanEndIdx + 1
        : rowOverscanEndIdx;
    endRowIdxForRender = endRowIdx;
    for (
      let viewportRowIdx = startRowIdx;
      viewportRowIdx <= endRowIdx;
      viewportRowIdx++
    ) {
      const isRowOutsideViewport =
        viewportRowIdx === rowOverscanStartIdx - 1 ||
        viewportRowIdx === rowOverscanEndIdx + 1;
      const rowIdx = isRowOutsideViewport ? selectedRowIdx : viewportRowIdx;

      const row = rows[rowIdx];

      const gridRowStart = headerRowsCount + topSummaryRowsCount + rowIdx + 1;

      node = {
        rowIndex: rowIdx,
        rowTop: rowHeight * rowIdx,
        childIndex: rowIdx + 1,
        data: row,
        rowHeight: rowHeight,
        lastChild: raawRows.length === rowIdx + 1,
        firstChild: rowIdx === 0,
        id: row?.id ?? String(rowIdx),
        selected: selectedRowIdx === rowIdx,
        setDataValue: (key, newValue) =>
          setDataValue(key, newValue, row, rowIdx),
        setData: (val) => setData(val, rowIdx),
        parent: {
          allLeafChildren: RowNodes,
          childrenAfterFilter: afterFilter,
          childrenAfterSort: afterSort,
        },
        updateData: (val) => setData(val, rowIdx),
        expanded: rows[rowIdx]?.isExpanded,
        isSelected: () => selectedRowIdx === rowIdx,
        setSelected: () => {
          selectRow({
            row,
            checked: !selectedRows.includes(rowKeyGetter(row)),
            isShiftClick: false,
          });
        },
        isExpandable: () => {
          return rows[rowIdx]?.isExpanded;
        },
        setExpanded: (value) => {
          let expandIds = new Set(expandedGroupIds);
          let rowKey = rowKeyGetter(rows[rowIdx]);
          if (value) {
            expandIds.add(rowKey);
          } else {
            expandIds.delete(rowKey);
          }
          onExpandedGroupIdsChange(expandIds);
        },
      };

      if (isGroupRow(row)) {
        ({ startRowIndex } = row);
        const isGroupRowSelected =
          isSelectable &&
          row.childRows.every((cr) => selectedRows1?.has(rowKeyGetter(cr)));

        rowElements.push(
          <GroupRowRenderer
            // aria-level is 1-based
            aria-level={row.level + 1}
            aria-setsize={row.setSize}
            // aria-posinset is 1-based
            aria-posinset={row.posInSet + 1}
            // aria-rowindex is 1 based
            aria-rowindex={
              headerRowsCount + topSummaryRowsCount + startRowIndex + 1
            }
            aria-selected={isSelectable ? isGroupRowSelected : undefined}
            key={`${rowKeyGetter(row)}`}
            id={rowKeyGetter(row)}
            groupKey={row.groupKey}
            viewportColumns={
              rest.multilineHeader ? regroupArray(merged) : columns
            }
            childRows={row.childRows}
            rowIdx={rowIdx}
            row={row}
            gridRowStart={gridRowStart}
            height={getRowHeight(rowIdx)}
            level={row.level}
            isExpanded={row.isExpanded}
            selectedCellIdx={
              selectedRowIdx === rowIdx ? selectedIdx : undefined
            }
            isRowSelected={isGroupRowSelected}
            selectGroup={selectGroupLatest}
            toggleGroup={toggleGroupLatest}
            rowLevelToolTip={rest.rowLevelToolTip}
            setToolTip={(val) => setToolTip(val)}
            setToolTipContent={(val) => setToolTipContent(val)}
            setMouseY={(y) => {
              if (toolTip) setMouseY(y);
            }}
          />
        );
        continue;
      }

      if (row.children && rest.treeData) {
        ({ startRowIndex } = row);
        const isTreeRowSelected = selectedRows1?.has(rowKeyGetter(row));
        rowElements.push(
          <TreeRowRenderer
            // aria-level is 1-based
            aria-level={row.level + 1}
            aria-setsize={row.setSize}
            // aria-posinset is 1-based
            aria-posinset={row.posInSet + 1}
            // aria-rowindex is 1 based
            aria-rowindex={
              headerRowsCount + topSummaryRowsCount + startRowIndex + 1
            }
            aria-selected={isSelectable ? isTreeRowSelected : undefined}
            key={`${rowKeyGetter(row)}`}
            id={rowKeyGetter(row)}
            viewportColumns={
              rest.multilineHeader ? regroupArray(merged) : columns
            }
            childRows={row.childRows}
            rowIdx={rowIdx}
            row={row}
            allrow={rows}
            gridRowStart={gridRowStart}
            height={getRowHeight(rowIdx)}
            level={row.level}
            isExpanded={expandedTreeIds.includes(rowKeyGetter(row))}
            selectedCellIdx={
              selectedRowIdx === rowIdx ? selectedIdx : undefined
            }
            apiObject={apiObject}
            node={node}
            selection={rest.selection}
            serialNumber={serialNumber}
            sourceData={raawRows}
            isRowSelected={isTreeRowSelected ?? false}
            handleRowChange={handleFormatterRowChangeLatest}
            toggleTree={toggleTreeLatest}
            onRowClick={onRowClick}
            onCellClick={onCellClickLatest}
            onCellDoubleClick={onCellDoubleClickLatest}
            onCellContextMenu={onCellContextMenuLatest}
            onRowDoubleClick={onRowDoubleClick}
            columnApi={columnApiObject}
            valueChangedCellStyle={valueChangedCellStyle}
            headerheight={headerheight} //need to be added
            rowClass={rowClass}
            selectCell={selectViewportCellLatest}
            selectedCellEditor={getCellEditor(rowIdx)}
            treeData={props.treeData}
            previousData={changedList}
            rowLevelToolTip={rest.rowLevelToolTip}
            setToolTip={(val) => setToolTip(val)}
            setToolTipContent={(val) => setToolTipContent(val)}
            setMouseY={(y) => {
              if (toolTip) setMouseY(y);
            }}
          />
        );
        continue;
      }
      if (rest.masterData) {
        const isMasterRowSelected = selectedRows1?.has(rowKeyGetter(row));

        function masterRowRenderer(ref, props) {
          return <MasterRowRenderer ref={ref} {...props} />;
        }
        rowElements.push(
          masterRowRenderer(rowRef, {
            // aria-rowindex is 1 based
            "aria-rowindex":
              headerRowsCount + topSummaryRowsCount + startRowIndex + 1,

            "aria-selected": isSelectable ? isMasterRowSelected : undefined,
            key: `${rowKeyGetter(row)}`,
            id: rowKeyGetter(row),
            viewportColumns: rest.multilineHeader
              ? regroupArray(merged)
              : columns,
            childRows: row.childRows,
            rowIdx: rowIdx,
            row: row,
            allrow: rows,
            gridRowStart: gridRowStart,
            height: getRowHeight(rowIdx),
            level: row.level,
            isExpanded: expandedMasterRowIds?.includes(rowKeyGetter(row)),
            selectedCellIdx:
              selectedRowIdx === rowIdx ? selectedIdx : undefined,
            apiObject: apiObject,
            node: node,
            selection: rest.selection,
            serialNumber: serialNumber,
            sourceData: raawRows,
            isRowSelected: isMasterRowSelected ?? false,
            handleRowChange: handleFormatterRowChangeLatest,
            toggleMaster: toggleMasterLatest,
            onRowClick: onRowClick,
            onCellClick: onCellClickLatest,
            onCellDoubleClick: onCellDoubleClickLatest,
            onCellContextMenu: onCellContextMenuLatest,
            onRowDoubleClick: onRowDoubleClick,
            columnApi: columnApiObject,
            valueChangedCellStyle: valueChangedCellStyle,
            headerheight: headerheight, //need to be adde,
            rowClass: rowClass,
            selectCell: selectViewportCellLatest,
            selectedCellEditor: getCellEditor(rowIdx),
            lastFrozenColumnIndex,
            expandedMasterRowIds,
            rowLevelToolTip: rest.rowLevelToolTip,
            setToolTip,
            setToolTipContent,
            setMouseY: (y) => {
              if (toolTip) setMouseY(y);
            },
          })
        );

        continue;
      }
      if (
        (rest.detailedRow && deviceType !== "deskTop") ||
        (rest.detailedRow && rest.desktopDetailedRowEnable)
      ) {
        const isMasterRowSelected = selectedRows1?.has(rowKeyGetter(row));

        function detailsRowRenderer(ref, props) {
          return <DetailsRow ref={ref} {...props} />;
        }
        rowElements.push(
          detailsRowRenderer(rowRef, {
            // aria-rowindex is 1 based
            "aria-rowindex": headerRowsCount + topSummaryRowsCount + rowIdx + 1,

            "aria-selected": isSelectable ? isMasterRowSelected : undefined,
            key: `detailed-${rowIdx}-${rowKeyGetter(row)}`,
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
            isExpanded: detailedRowIds?.includes(rowKeyGetter(row)),
            selectedCellIdx:
              selectedRowIdx === rowIdx ? selectedIdx : undefined,
            apiObject: apiObject,
            node: node,
            selection: rest.selection,
            serialNumber: serialNumber,
            sourceData: raawRows,
            isRowSelected: isMasterRowSelected ?? false,
            toggleDetailed: toggleDetailedLatest,
            onRowClick: onRowClick,
            onCellClick: onCellClickLatest,
            onCellDoubleClick: onCellDoubleClickLatest,
            onCellContextMenu: onCellContextMenuLatest,
            onRowDoubleClick: onRowDoubleClick,
            columnApi: columnApiObject,
            valueChangedCellStyle: valueChangedCellStyle,
            headerheight: headerheight, //need to be adde,
            rowClass: rowClass,
            onRowChange: handleFormatterRowChangeLatest,
            selectCell: (a, b, c) => {
              let sa = typeof a === "number" ? a : rows.indexOf(a);
              selectCell({ rowIdx: sa, idx: b.idx, detailedRow: c });
            },
            selectedCellEditor: getCellEditor(rowIdx),
            lastFrozenColumnIndex,
            detailedRowIds,
            rowLevelToolTip: rest.rowLevelToolTip,
            setToolTip,
            setToolTipContent,
            setMouseY: (y) => {
              if (toolTip) setMouseY(y);
            },
            gridWidth,
            deviceType,
          })
        );
        continue;
      }

      startRowIndex++;
      let key;
      let isRowSelected = false;
      if (typeof rowKeyGetter === "function") {
        key = rowKeyGetter(row);
        isRowSelected = selectedRows1?.has(key) ?? false;
      } else {
        key = hasGroups ? startRowIndex : rowIdx;
      }

      renderedRowNodes.push(node);
      rowElements.push(
        rowRenderer(key, {
          // aria-rowindex is 1 based
          "aria-rowindex":
            headerRowsCount +
            topSummaryRowsCount +
            (hasGroups ? startRowIndex : rowIdx) +
            1,
          "aria-selected": isSelectable ? isRowSelected : undefined,
          valueChangedCellStyle,
          previousData: changedList,
          totalColumns: columns.length,
          setDragging: (val) => setDragging(val),
          rowIdx,
          rows,
          row,
          headerheight: headerheight, //need to be added
          selectedCellRowStyle,
          api: apiObject,
          columnApi: columnApiObject,
          node,
          viewportColumns: rest.multilineHeader
            ? regroupArray(merged)
            : columns,
          isRowSelected,
          handleContextMenu,
          onRowClick: onRowClick,
          onCellClick: onCellClickLatest,
          onCellDoubleClick: onCellDoubleClickLatest,
          onCellContextMenu: onCellContextMenuLatest,
          onRowDoubleClick: onRowDoubleClick,
          rowClass,
          gridRowStart,
          rowArray: columns4,
          height: getRowHeight(rowIdx),
          copiedCellIdx:
            copiedCell !== null && copiedCell.row === row
              ? columns.findIndex((c) => c.key === copiedCell.columnKey)
              : undefined,
          selectedCellIdx: selectedRowIdx === rowIdx ? selectedIdx : undefined,
          draggedOverCellIdx: getDraggedOverCellIdx(rowIdx),
          setDraggedOverRowIdx: isDragging ? setDraggedOverRowIdx : undefined,
          lastFrozenColumnIndex,
          onRowChange: handleFormatterRowChangeLatest,
          selectCell: selectViewportCellLatest,
          selectedCellEditor: getCellEditor(rowIdx),
          handleReorderRow: handleReorderRow,
          selectedPosition,
          subColumn,
          summaryRowHeight: topSummaryRows !== undefined ? summaryRowHeight : 0,
          rowFreezLastIndex,
          rowLevelToolTip: rest.rowLevelToolTip,
          setToolTip,
          setToolTipContent,
          setMouseY: (y) => {
            if (toolTip) setMouseY(y);
          },
        })
      );
    }
    return rowElements;
  }

  // Reset the positions if the current values are no longer valid. This can happen if a column or row is removed
  if (selectedPosition.idx > maxColIdx || selectedPosition.rowIdx > maxRowIdx) {
    setSelectedPosition(initialPosition);
    setDraggedOverRowIdx(undefined);
  }

  let templateRows = `${headerRowHeight}px`;

  if (topSummaryRowsCount > 0) {
    templateRows += ` repeat(${topSummaryRowsCount}, ${summaryRowHeight}px)`;
  }
  if (rows.length > 0) {
    templateRows += gridTemplateRows;
  }
  if (bottomSummaryRowsCount > 0) {
    templateRows += ` repeat(${bottomSummaryRowsCount}, ${summaryRowHeight}px)`;
  }

  const isGroupRowFocused =
    selectedPosition.idx === -1 && selectedPosition.rowIdx !== -2;

  useUpdateEffect(() => {
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

  const toolbarClassname = css`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-block-end: 8px;
  `;
  const jumpnext = document.getElementsByClassName("rc-pagination-jump-next");
  if (jumpnext) {
    jumpnext[0]?.setAttribute("title", "");
  }
  const jumpprev = document.getElementsByClassName("rc-pagination-jump-prev");
  if (jumpprev) {
    jumpprev[0]?.setAttribute("title", "");
  }

  if (toolTip && toolTipRef) {
    const toolTipWidth = toolTipRef.current?.scrollWidth + mouseX;
    const gridElement = document.getElementById(rest.id ?? "DataGrid");
    const dimensions = gridElement?.getBoundingClientRect();
    let gridWidth = dimensions?.width + dimensions?.x;

    if (typeof gridWidth === "number" && gridWidth < toolTipWidth) {
      let changeWidth = toolTipWidth - gridWidth;
      setMouseX(mouseX - changeWidth);
    }
  }

  return (
    <>
      {props.export && (
        <div className={toolbarClassname}>
          {props.export.csvFileName && (
            <button
              data-testid={"Export to CSV"}
              onClick={() => exportDataAsCsv(props.export.csvFileName)}
            >
              Export to CSV
            </button>
          )}
          {props.export.excelFileName && (
            <button
              data-testid={"Export to XSLX"}
              onClick={() => exportDataAsExcel(props.export.excelFileName)}
            >
              Export to XSLX
            </button>
          )}
          {props.export.pdfFileName && (
            <button
              data-testid={"Export to PDF"}
              onClick={() => exportDataAsPdf(props.export.pdfFileName)}
            >
              Export to PDF
            </button>
          )}
        </div>
      )}

      {rest.globalFilter && (
        <div
          role={"row"}
          className="filter-row"
          style={{
            height: rowHeight,
            display: "flex",
            marginBlockEnd: "8px",
            width: gridWidth,
          }}
        >
          {columns.map((col, index) => {
            let width =
              gridViewportTemplateColumns?.gridTemplateColumns.split(" ")[
                index
              ];
            return (
              <div
                role={"gridcell"}
                style={{
                  height: headerRowHeight,
                  width: width,
                  backgroundColor: "#D7E3BC",
                  borderRight: "1px solid white",
                }}
                key={`fiter-row-${col.headerName}`}
              >
                {!col.filterRenderer &&
                  col.key !== SERIAL_NUMBER_COLUMN_KEY &&
                  col.key !== SELECT_COLUMN_KEY && (
                    <input
                      className="filter-input"
                      data-testid={`filter-row-${col.headerName}`}
                      value={filters[col.field]}
                      onChange={(e) => {
                        if (col.filterType) {
                          setFilterType(col.filterType);
                        }
                        setFilters({ ...filters, [col.field]: e.target.value });
                      }}
                    />
                  )}

                {col.filterRenderer && col.filterRenderer()}
              </div>
            );
          })}
        </div>
      )}

      <div
        id={rest.id ?? "DataGrid"}
        onMouseMove={(e) => {
          let x = e.clientX;
          if (toolTip) {
            setMouseX(x + 75);
          }
        }}
        onCopy={(e) => {
          if (props.restriction?.copy) {
            e.preventDefault();
          }
        }}
        onPaste={(e) => {
          if (props.restriction?.paste) {
            e.preventDefault();
          }
        }}
        role={hasGroups ? "treegrid" : "grid"}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-multiselectable={isSelectable ? true : undefined}
        aria-colcount={columns.length}
        aria-rowcount={headerRowsCount + rowsCount + summaryRowsCount}
        className={clsx(
          rootClassname,
          {
            [viewportDraggingClassname]: isDragging,
          },
          className,
          "AgGrid-scroll-bar",
          enableFilter && filterContainerClassname
        )}
        style={{
          ...style,
          background: "#B8CCE4",
          // set scrollPadding to correctly position non-sticky cells after scrolling
          scrollPaddingInlineStart:
            selectedPosition.idx > lastFrozenColumnIndex
              ? `${totalFrozenColumnWidth}px`
              : undefined,

          scrollPaddingBlock:
            selectedPosition.rowIdx >= 0 &&
            selectedPosition.rowIdx < rows.length
              ? `${
                  headerRowHeight + topSummaryRowsCount * summaryRowHeight
                }px ${bottomSummaryRowsCount * summaryRowHeight}px`
              : undefined,
          overflowX: rest.detailedRow ? "hidden" : "auto",
          gridTemplateRows: templateRows,
          "--rdg-header-row-height": `${rowHeight}px`,
          "--rdg-summary-row-height": `${summaryRowHeight}px`,
          "--rdg-sign": isRtl ? -1 : 1,
          ...gridViewportTemplateColumns,
        }}
        dir={direction}
        ref={gridRef}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        data-testid={testId}
      >
        {/* extra div is needed for row navigation in a treegrid */}
        {hasGroups && (
          <div
            ref={rowRef}
            tabIndex={isGroupRowFocused ? 0 : -1}
            className={clsx(focusSinkClassname, {
              [rowSelected]: isGroupRowFocused,
              [rowSelectedWithFrozenCell]:
                isGroupRowFocused && lastFrozenColumnIndex !== -1,
            })}
            style={{
              gridRowStart: selectedPosition.rowIdx + 2,
            }}
            onKeyDown={handleKeyDown}
          />
        )}
        <FilterContext.Provider value={filters}>
          <DataGridDefaultComponentsProvider value={defaultGridComponents}>
            <HeaderRow
              rows={rawRows}
              columns={rest.multilineHeader ? regroupArray(merged) : columns}
              headerData={columns}
              sortCol={columns4}
              selectedPosition={selectedPosition}
              handleReorderColumn={handleReorderColumn}
              selectedCellHeaderStyle={selectedCellHeaderStyle}
              onColumnResize={handleColumnResizeLatest}
              allRowsSelected={allRowsSelected}
              arrayDepth={arrayDepth}
              onAllRowsSelectionChange={selectAllRowsLatest}
              sortColumns={sortColumns}
              onSortColumnsChange={onSortColumnsChangeLatest}
              lastFrozenColumnIndex={lastFrozenColumnIndex}
              selectedCellIdx={
                selectedPosition.rowIdx === minRowIdx
                  ? selectedPosition.idx
                  : undefined
              }
              setDragging={(val) => setDragging(val)}
              selectCell={selectHeaderCellLatest}
              shouldFocusGrid={!selectedCellIsWithinSelectionBounds}
              direction={direction}
              headerheight={headerheight}
              headerRowHeight={singleHeaderRowHeight}
              rowArray={rowArray}
              cellHeight={headerRowHeight}
              setFilters={setFilters}
              setFilterType={setFilterType}
              ChildColumnSetup={ChildColumnSetup}
              gridWidth={gridWidth}
            />
            {rows.length === 0 && noRowsFallback ? (
              noRowsFallback
            ) : (
              <>
                {topSummaryRows?.map((row, rowIdx) => {
                  const gridRowStart = headerRowsCount + rowIdx + 1;
                  const summaryRowIdx = rowIdx + minRowIdx + 1;
                  const isSummaryRowSelected =
                    selectedPosition.rowIdx === summaryRowIdx;
                  const top = headerRowHeight + summaryRowHeight * rowIdx;
                  return (
                    <SummaryRow
                      aria-rowindex={gridRowStart}
                      key={`top-summary-row-${summaryRowIdx}`}
                      rowIdx={rowIdx}
                      gridRowStart={gridRowStart}
                      row={row}
                      top={top}
                      bottom={undefined}
                      lastTopRowIdx={topSummaryRowsCount - 1}
                      viewportColumns={getRowViewportColumns(summaryRowIdx)}
                      lastFrozenColumnIndex={lastFrozenColumnIndex}
                      selectedCellIdx={
                        isSummaryRowSelected ? selectedPosition.idx : undefined
                      }
                      selectCell={selectTopSummaryCellLatest}
                      height={summaryRowHeight}
                      rowType={"Top"}
                      rowLevelToolTip={rest.rowLevelToolTip}
                      setToolTip={(val) => setToolTip(val)}
                      setToolTipContent={(val) => setToolTipContent(val)}
                      setMouseY={(y) => {
                        if (toolTip) setMouseY(y);
                      }}
                    />
                  );
                })}

                <RowSelectionChangeProvider value={selectRowLatest}>
                  {getViewportRows()}
                </RowSelectionChangeProvider>

                {bottomSummaryRows?.map((row, rowIdx) => {
                  const gridRowStart =
                    headerRowsCount +
                    topSummaryRowsCount +
                    rows.length +
                    rowIdx +
                    1;
                  const summaryRowIdx = rows.length + rowIdx;
                  const isSummaryRowSelected =
                    selectedPosition.rowIdx === summaryRowIdx;
                  const top =
                    clientHeight > totalRowHeight
                      ? gridHeight -
                        summaryRowHeight * (bottomSummaryRows.length - rowIdx)
                      : undefined;
                  const bottom =
                    top === undefined
                      ? summaryRowHeight *
                        (bottomSummaryRows.length - 1 - rowIdx)
                      : undefined;

                  return (
                    <SummaryRow
                      aria-rowindex={
                        headerRowsCount +
                        topSummaryRowsCount +
                        rowsCount +
                        rowIdx +
                        1
                      }
                      rowIdx={rowIdx}
                      key={`bottom-summary-row-${summaryRowIdx}`}
                      gridRowStart={gridRowStart}
                      row={row}
                      top={top}
                      bottom={bottom}
                      lastTopRowIdx={undefined}
                      viewportColumns={getRowViewportColumns(summaryRowIdx)}
                      lastFrozenColumnIndex={lastFrozenColumnIndex}
                      selectedCellIdx={
                        isSummaryRowSelected ? selectedPosition.idx : undefined
                      }
                      selectCell={selectBottomSummaryCellLatest}
                      selectedRows={selectedRows}
                      height={summaryRowHeight}
                      rowType={"Bottom"}
                      rowLevelToolTip={rest.rowLevelToolTip}
                      setToolTip={(val) => setToolTip(val)}
                      setToolTipContent={(val) => setToolTipContent(val)}
                      setMouseY={(y) => {
                        if (toolTip) setMouseY(y);
                      }}
                    />
                  );
                })}
              </>
            )}

            {/* render empty cells that span only 1 column so we can safely measure column widths, regardless of colSpan */}
            {renderMeasuringCells(viewportColumns)}
          </DataGridDefaultComponentsProvider>
        </FilterContext.Provider>
      </div>
      {(pagination || showSelectedRows) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "12px",
          }}
        >
          {showSelectedRows && (
            <div
              className="footer-bottom"
              style={{
                width: "25%",
                height: 25,
                backgroundColor: "#f8f8f8",
                color: "black",
                fontSize: 12,
                paddingRight: 15,
                fontWeight: "bold",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {`${
                selectedRows1?.size === undefined ? 0 : selectedRows1?.size
              } out of ${raawRows.length} selected`}
            </div>
          )}
          {pagination && !suppressPagination && (
            <Pagination
              className="pagination-data"
              showTotal={(total, range) => {
                let content = "";
                if (rest.showTotal) {
                  if (typeof rest.showTotal === "function") {
                    content = rest.showTotal(total, range);
                  } else {
                    content = `Showing ${range[0]}-${range[1]} of ${total}`;
                  }
                }
                return content;
              }}
              onChange={PaginationChange}
              total={rawRows.length}
              current={current}
              pageSize={size}
              showSizeChanger={false}
              itemRender={PrevNextArrow}
              style={{
                "--rc-pagination-button-active-background-color": "#000",
                "--rc-pagination-button-active-border-color": "#A9B7C6",
                "--rc-pagination-button-active-color": "#fff",
                "--rc-pagination-button-font-family":
                  '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                "--rc-pagination-button-color": "#fff",
                "--rc-pagination-button-background-color": "#4F81BD",
                "--rc-pagination-button-font-size": "10px",
                "--rc-pagination-button-border-radius": "0",
                "--rc-pagination-button-border": "#fff",
                "--rc-pagination-button-hover-border-color": "#B7D7A8",
                "--rc-pagination-button-hover-color": "#B7D7A8",
                ...props.paginationStyle,
              }}
            />
          )}
        </div>
      )}
      {contextMenuVisible && (
        <ContextMenu
          items={getContextMenuItems}
          onClose={closeContextMenu}
          position={contextMenuPosition}
          setSubMenuPosition={(pos) => {
            setContextSubMenuPosition({ ...pos });
          }}
          enableSubMenu={(val) => {
            setContextSubMenuVisible(val);
          }}
          setSubMenuItems={(items) => {
            setContextSubMenuItems(items);
          }}
          contextData={contextData}
          id={`${rest.id ?? "DataGrid"}-main-context-menu`}
        />
      )}
      {contextSubMenuVisible && (
        <ContextMenu
          items={contextSubMenuItems}
          onClose={closeContextMenu}
          position={contextSubMenuPosition}
          contextData={contextData}
          id={`${rest.id ?? "DataGrid"}-sub-context-menu`}
        />
      )}
      <div
        ref={toolTipRef}
        id="tool-tip-span"
        className="tooltiptext"
        style={{
          visibility:
            !toolTip ||
            toolTipContent === null ||
            toolTipContent === undefined ||
            toolTipContent.length === 0
              ? "hidden"
              : "visible",
          top: mouseY,
          left: mouseX,
          height: "max-content",
        }}
      >
        {toolTipContent}
      </div>
    </>
  );
}

function isSamePosition(p1, p2) {
  return p1.idx === p2.idx && p1.rowIdx === p2.rowIdx;
}

export default DataGrid;
