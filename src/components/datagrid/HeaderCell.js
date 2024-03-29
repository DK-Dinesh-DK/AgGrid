import React, { useState } from "react";
import { css } from "@linaria/core";
import defaultHeaderRenderer from "./headerRenderer";
import { getCellStyle, getCellClassname } from "./utils";
import { useRovingCellRef } from "./hooks/useRovingCellRef";
import { filterColumnClassName } from "./style";
import { useDrag, useDrop } from "react-dnd";
import alignmentUtils from "./utils/alignMentUtils";

const cellResizable = css`
  @layer rdg.HeaderCell {
    touch-action: none;
    &::after {
      content: "";
      cursor: col-resize;
      position: absolute;
      inset-block-start: 0;
      inset-inline-end: 0;
      inset-block-end: 0;
      inline-size: 10px;
    }
  }
`;

const cellResizableClassname = `rdg-cell-resizable ${cellResizable}`;

export default function HeaderCell({
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
  gridWidth,
  handleDrag,
  filterType,
}) {
  const isRtl = direction === "rtl";
  const { tabIndex } = useRovingCellRef(isCellSelected);
  const [sortableColumnKey, setSortableColumnKey] = useState();
  const sortIndex = sortColumns?.findIndex(
    (sort) => sort.columnKey === sortableColumnKey
  );

  const sortColumn =
    sortIndex !== undefined && sortIndex > -1
      ? sortColumns[sortIndex]
      : undefined;

  const sortDirection = sortColumn?.direction;
  const priority =
    sortColumn !== undefined && sortColumns.length > 1
      ? sortIndex + 1
      : undefined;

  let ariaSort;
  if (sortDirection && !priority) {
    if (sortDirection === "ASC") ariaSort = "ascending";
    else ariaSort = "descending";
  } else ariaSort = undefined;
  let style = getCellStyle(column, colSpan);

  const className = getCellClassname(
    column,
    column.headerCellClass,
    column.filter && filterColumnClassName,
    {
      [cellResizableClassname]: column.resizable,
    },
    `rdg-header-column-${column.idx % 2 === 0 ? "even" : "odd"}`
  );

  const headerRenderer = column.headerRenderer ?? defaultHeaderRenderer;

  function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.buttons !== 1) {
      return;
    }

    const { currentTarget, pointerId } = event;
    const { right, left } = currentTarget.getBoundingClientRect();
    const offset = isRtl ? event.clientX - left : right - event.clientX;

    if (offset > 11) {
      // +1px to account for the border size
      return;
    }

    function onPointerMove(event) {
      // prevents text selection in Chrome, which fixes scrolling the grid while dragging, and fixes re-size on an autosized column
      event.preventDefault();
      const { right, left } = currentTarget.getBoundingClientRect();
      const width = isRtl
        ? right + offset - event.clientX
        : event.clientX + offset - left;
      if (width > 0) {
        onColumnResize(column, width);
      }
    }

    function onLostPointerCapture() {
      currentTarget.removeEventListener("pointermove", onPointerMove);
      currentTarget.removeEventListener(
        "lostpointercapture",
        onLostPointerCapture
      );
    }

    currentTarget.setPointerCapture(pointerId);
    currentTarget.addEventListener("pointermove", onPointerMove);
    currentTarget.addEventListener("lostpointercapture", onLostPointerCapture);
  }

  function onSort(ctrlClick, name, idx) {
    let matches = [];
    const recursiveSort = (cdata) => {
      if (cdata.haveChildren === true) {
        cdata.children.map((e, index) => {
          return recursiveSort(e);
        });
      } else {
        matches.push(cdata.headerName === name && cdata);
      }
    };

    if (column.haveChildren === true) {
      column.children.map((e) => {
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
    const { sortDescendingFirst } = matches[0];
    if (sortColumn === undefined) {
      // not currently sorted
      const nextSort = {
        columnKey: matches[0].field,
        direction: sortDescendingFirst ? "DESC" : "ASC",
      };
      onSortColumnsChange(
        sortColumns && ctrlClick ? [...sortColumns, nextSort] : [nextSort]
      );
    } else {
      let nextSortColumn;
      if (
        (sortDescendingFirst === true && sortDirection === "DESC") ||
        (sortDescendingFirst !== true && sortDirection === "ASC")
      ) {
        nextSortColumn = {
          columnKey: matches[0].field,
          direction: sortDirection === "ASC" ? "DESC" : "ASC",
        };
      }
      if (ctrlClick) {
        const nextSortColumns = [...sortColumns];
        if (nextSortColumn) {
          // swap direction
          nextSortColumns[sortIndex] = nextSortColumn;
        } else {
          // remove sort
          nextSortColumns.splice(sortIndex, 1);
        }
        onSortColumnsChange(nextSortColumns);
      } else {
        onSortColumnsChange(nextSortColumn ? [nextSortColumn] : []);
      }
    }
  }

  function handleColumnsReorder(sourceKey, targetKey) {
    const sourceColumnIndex = columns.findIndex((c) => c.field === sourceKey);
    const targetColumnIndex = columns.findIndex((c) => c.field === targetKey);
    const reorderedColumns = [...columns];
    if (
      columns[targetColumnIndex].frozen === columns[sourceColumnIndex].frozen
    ) {
      reorderedColumns.splice(
        targetColumnIndex,
        0,
        reorderedColumns.splice(sourceColumnIndex, 1)[0]
      );
      handleReorderColumn([...reorderedColumns]);
    }
  }
  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN_DRAG",
    item: { key: column.key },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (isDragging) {
    handleDrag(true);
  }
  const [{ isOver }, drop] = useDrop({
    accept: "COLUMN_DRAG",
    drop({ key }) {
      handleColumnsReorder(key, column.key);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  if (isOver) {
    handleDrag(false);
  }
  let headerStyle = {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "var(--rdg-cell-align)",
  };
  if (column.alignment) {
    headerStyle = column.alignment.align
      ? { ...headerStyle, justifyContent: column.alignment.align }
      : alignmentUtils(column, rows[0], headerStyle);
  }
  if (column.alignment) {
    style = column.alignment.align
      ? { ...style, justifyContent: column.alignment.align }
      : alignmentUtils(column, rows[0], style);
  }
  if (!column?.haveChildren && column.headerStyle) {
    style = { ...style, ...column.headerStyle };
  }
  return (
    <div
      role="parentcolumn"
      aria-colindex={column.idx + 1}
      aria-sort={ariaSort}
      aria-colspan={colSpan}
      ref={(ele) => {
        drag(ele);
        drop(ele);
      }}
      // set the tabIndex to 0 when there is no selected cell so grid can receive focus
      tabIndex={shouldFocusGrid ? 0 : tabIndex}
      className={className}
      style={style}
      onPointerDown={column.resizable ? onPointerDown : undefined}
    >
      <div style={headerStyle}>
        {headerRenderer({
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
          filterType,
          style,
          className,
          ChildColumnSetup,
          selectedPosition,
          headerRowHeight,
          selectedCellHeaderStyle,
          gridWidth,
          //need to be chnaged
          shouldFocusGrid,
          onPointerDown,
          onColumnResize,
          direction,
        })}
      </div>
    </div>
  );
}
