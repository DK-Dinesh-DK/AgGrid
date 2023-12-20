import React from "react";
import { css } from "@linaria/core";
import { useRovingCellRef } from "./hooks";
import FilterRenderer from "./FilterRenderer";
import SortableHeaderCell from "./SortableHeaderCell";
import { RecordsFilter as FilterIcon } from "../../assets/Icon";
import { FilterRendererWithSvg } from "./FilterRendererWithSvg";
import alignmentUtils from "./utils/alignMentUtils";

const filterIcon = <FilterIcon />;

const filterClassname = css`
  display: flex;
  grid-gap: 10px;
  grid-template-columns: auto auto;
  padding: 2px;
  font-size: 18px;
  inline-size: 100%;
  cursor: pointer;
`;

const headerWrapperWithChildData = css`
  display: flex;
  align-items: center;
  height: inherit;
  justify-content: center;
  width: 100%;
`;

const headerWrapperWithcellData = css`
  display: flex;
  box-sizing: border-box;
`;
export default function HeaderRenderer({
  column,
  rows,
  sortDirection,
  priority,
  selectCell,
  onSort,
  shouldFocusGrid,
  setFilters,
  setFilterType,
  filterType,
  cellHeight,
  selectedPosition,
  selectedCellHeaderStyle,
  headerRowHeight,
  selectedCellIdx,
  arrayDepth,
  ChildColumnSetup,
  gridWidth,
  direction,
  onColumnResize,
}) {
  let isCellSelected;
  if (selectedCellIdx === column.idx) {
    isCellSelected = true;
  } else {
    isCellSelected = false;
  }
  const { onFocus } = useRovingCellRef(isCellSelected);
  if (column.haveChildren === true) {
    const getArrayDepth = (arr) => {
      if (Array.isArray(arr)) {
        return 1 + Math.max(...arr.map(getArrayDepth));
      }
      if (arr.children?.length) {
        return 1 + Math.max(...arr.children.map(getArrayDepth));
      }
      return 0;
    };

    const thisColumnDepth = getArrayDepth(column) + 1;
    return (
      <div>
        <div
          style={{
            borderBlockEnd: "var(--rdg-cell-border-vertical)",
            height: `${(headerRowHeight * arrayDepth) / thisColumnDepth - 1}px`,
            width: `${column.width}px`,
          }}
        >
          <div className={headerWrapperWithChildData}>
            {column.headerName ?? column.field}
          </div>
        </div>

        <div className={headerWrapperWithcellData}>
          {column.children?.map((info, index) => {
            let style_fg = {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight:
                column.children.length - 1 === index
                  ? "none"
                  : "var(--rdg-cell-border-vertical)",
            };

            return (
              <div style={style_fg} key={info.field}>
                {RecursiveScan(
                  column.children,
                  info,
                  cellHeight,
                  index,
                  headerRowHeight,
                  selectedPosition,
                  selectedCellHeaderStyle,
                  column,
                  selectCell,
                  shouldFocusGrid,
                  onSort,
                  sortDirection,
                  priority,
                  setFilters,
                  arrayDepth,
                  ChildColumnSetup,
                  selectedCellIdx,
                  filterIcon,
                  setFilterType,
                  gridWidth,
                  rows,
                  onColumnResize,
                  thisColumnDepth,
                  filterType
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    ChildColumnSetup(column);
    let style = {
      display: "flex",
      justifyContent: "var(--rdg-cell-align)",
      alignItems: "center",
      height: "inherit",
      width: column.width ?? "100%",
    };
    if (column.alignment) {
      style = column.alignment.align
        ? { ...style, justifyContent: column.alignment.align }
        : alignmentUtils(column, rows[0], style);
    }
    if (selectedCellHeaderStyle && selectedPosition.idx === column.idx)
      style = { ...style, ...selectedCellHeaderStyle };

    function onClick() {
      selectCell(column.idx);
    }
    const isRtl = direction === "rtl";
    function onDoubleClick(event) {
      if (!column.readOnly) {
        const { right, left } = event.currentTarget.getBoundingClientRect();
        const offset = isRtl ? event.clientX - left : right - event.clientX;
        if (offset > 11) {
          // +1px to account for the border size
          return;
        }
        onColumnResize(column, "max-content");
      }
    }

    function handleFocus(event) {
      onFocus?.(event);
      if (shouldFocusGrid) {
        // Select the first header cell if there is no selected cell
        selectCell(0);
      }
    }

    let style_1 = {
      height: `${cellHeight}px`,
      display: "flex",
      justifyContent: "var(--rdg-cell-align)",
      width: "100%",
      paddingLeft: "var(--rdg-cell-padding-left)",
      paddingRight: "var(--rdg-cell-padding-right)",
    };
    if (column.alignment) {
      style_1 = column.alignment.align
        ? { ...style_1, justifyContent: column.alignment.align }
        : alignmentUtils(column, rows[0], style_1);
    }
    if (column.headerCellStyle) {
      style = { ...style, ...column.headerCellStyle };
    }
    if (!(column.sortable || column.filter)) {
      return (
        <div
          key={column.idx}
          style={style_1}
          aria-selected={isCellSelected}
          role="columnheader"
          onFocus={handleFocus}
          onClick={onClick}
          onDoubleClick={column.resizable ? onDoubleClick : undefined}
          // onPointerDown={column.resizable ? onPointerDown : undefined}
        >
          <div style={{ ...style }}>{column.headerName ?? column.field}</div>
        </div>
      );
    }
    if (column.sortable && !column.filter) {
      return (
        <div
          key={column.idx}
          style={style_1}
          aria-selected={isCellSelected}
          role="columnheader"
          onFocus={handleFocus}
          onClick={onClick}
          onDoubleClick={column.resizable ? onDoubleClick : undefined}
        >
          <div style={{ ...style, width: "100%" }}>
            <SortableHeaderCell
              onSort={onSort}
              sortDirection={sortDirection}
              priority={priority}
              isCellSelected={isCellSelected}
              column={column}
              borderBottom={"none"}
              rowData={rows[0]}
            >
              {column.headerName ?? column.field}
            </SortableHeaderCell>
          </div>
        </div>
      );
    }
    if (column.filter && !column.sortable) {
      let style11 = {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "var(--rdg-cell-align)",
        height: "100%",
        paddingLeft: "var(--rdg-cell-padding-left)",
        paddingRight: "var(--rdg-cell-padding-right)",
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) {
        style11 = { ...style11, ...selectedCellHeaderStyle };
      }
      if (column.headerCellStyle) {
        style11 = { ...style11, ...column.headerCellStyle };
      }
      return (
        <div
          style={{ ...style11 }}
          key={column.idx}
          onClick={onClick}
          aria-selected={isCellSelected}
          role="columnheader"
        >
          <FilterRenderer
            selectedCellHeaderStyle={selectedCellHeaderStyle}
            selectedPosition={selectedCellHeaderStyle}
            onFocus={handleFocus}
            onClick={onClick}
            column={column}
            onDoubleClick={column.resizable ? onDoubleClick : undefined}
            isCellSelected={isCellSelected}
            rowData={rows[0]}
          >
            {({ filters, ...rest }) =>
              FilterRendererWithSvg(
                column,
                filterClassname,
                filters,
                setFilters,
                setFilterType,
                gridWidth,
                filterType
              )
            }
          </FilterRenderer>
        </div>
      );
    }
    if (column.filter && column.sortable) {
      let styleSF = {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "var(--rdg-cell-align)",
        height: "100%",
        paddingLeft: "var(--rdg-cell-padding-left)",
        paddingRight: "var(--rdg-cell-padding-right)",
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) {
        styleSF = { ...styleSF, ...selectedCellHeaderStyle };
      }
      if (column.alignment) {
        styleSF = column.alignment.align
          ? { ...styleSF, justifyContent: column.alignment.align }
          : alignmentUtils(column, rows[0], styleSF);
      }
      if (column.headerCellStyle) {
        styleSF = { ...styleSF, ...column.headerCellStyle };
      }
      return (
        <div
          key={column.idx}
          onFocus={handleFocus}
          aria-selected={isCellSelected}
          role="columnheader"
          onClick={onClick}
          onDoubleClick={column.resizable ? onDoubleClick : undefined}
          style={{ ...styleSF }}
        >
          <div style={{ width: "95%" }}>
            <SortableHeaderCell
              onSort={onSort}
              sortDirection={sortDirection}
              priority={priority}
              isCellSelected={isCellSelected}
              column={column}
              rowData={rows[0]}
            >
              {column.headerName ?? column.field}
            </SortableHeaderCell>
          </div>
          <FilterRenderer column={column} isCellSelected={isCellSelected}>
            {({ filters, ...rest }) =>
              FilterRendererWithSvg(
                column,
                filterClassname,
                filters,
                setFilters,
                setFilterType,
                gridWidth,
                filterType
              )
            }
          </FilterRenderer>
        </div>
      );
    }
  }
}

let columnsList = [];

const RecursiveScan = (
  masterData,
  subData,
  cellHeight,
  index,
  headerRowHeight,
  selectedPosition,
  selectedCellHeaderStyle,
  column,
  selectCell,
  shouldFocusGrid,
  onSort,
  sortDirection,
  priority,
  setFilters,
  arrayDepth,
  ChildColumnSetup,
  selectedCellIdx,
  filterIcon,
  setFilterType,
  gridWidth,
  direction,
  onColumnResize,
  thisColumnDepth,
  filterType
) => {
  ChildColumnSetup(subData);
  let isCellSelected;
  if (selectedCellIdx === subData.idx) {
    isCellSelected = true;
  } else {
    isCellSelected = false;
  }
  let rowData = direction;
  if (subData.haveChildren === true) {
    return (
      <div style={{ textAlign: "center" }}>
        {
          <div
            style={{
              borderBlockEnd: " var(--rdg-cell-border-horizontal)",
              height: `${(headerRowHeight * arrayDepth) / thisColumnDepth}px`,
              width: `${subData.width}px`,
            }}
          >
            <div className={headerWrapperWithChildData}>
              {subData.headerName ?? subData.field}
            </div>
          </div>
        }
        <div className={headerWrapperWithcellData}>
          {subData.children.map((subInfo, index) => {
            let style = {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              borderInlineEnd:
                subData.children.length - 1 > index
                  ? "var(--rdg-cell-border-vertical)"
                  : "none",
              width: `${subInfo.width}px`,
            };

            return (
              <div style={{ ...style }} key={subInfo.field}>
                {RecursiveScan(
                  subData.children,
                  subInfo,
                  cellHeight,
                  index,
                  headerRowHeight,
                  selectedPosition,
                  selectedCellHeaderStyle,
                  column,
                  selectCell,
                  shouldFocusGrid,
                  onSort,
                  sortDirection,
                  priority,
                  setFilters,
                  arrayDepth,
                  ChildColumnSetup,
                  selectedCellIdx,
                  filterIcon,
                  setFilterType,
                  gridWidth,
                  direction,
                  onColumnResize,
                  thisColumnDepth,
                  filterType
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    if (!columnsList.includes(subData.name)) columnsList.push(subData.name);

    let style = {
      display: "flex",
      justifyContent: "var(--rdg-cell-align)",
      alignItems: "center",
      width:
        masterData.length - 1 === index ? subData.width : subData.width - 1,
      boxSizing: "border-box",
      height: `${(headerRowHeight * arrayDepth) / thisColumnDepth}px`,
      outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px",
      paddingLeft: "var(--rdg-cell-padding-left)",
      paddingRight: "var(--rdg-cell-padding-right)",
    };
    if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx) {
      style = { ...style, ...selectedCellHeaderStyle };
    }

    if (subData.alignment) {
      style = subData.alignment.align
        ? { ...style, justifyContent: subData.alignment.align }
        : alignmentUtils(subData, rowData[0], style);
    }
    function onClick() {
      selectCell(subData.idx);
    }

    const isRtl = direction === "rtl";

    function onDoubleClick(event) {
      if (!subData.readOnly) {
        const { right, left } = event.currentTarget.getBoundingClientRect();
        const offset = isRtl ? event.clientX - left : right - event.clientX;
        if (offset > 11) {
          // +1px to account for the border size
          return;
        }
        onColumnResize(subData, "max-content");
      }
    }
    if (subData.headerStyle) {
      style = { ...style, ...subData.headerStyle };
    }
    if (!(subData.sortable || subData.filter)) {
      return (
        <>
          <div
            key={subData.idx}
            role="columnheader"
            aria-colindex={`${column.index + 1}.${
              columnsList.indexOf(subData.name) + 1
            }`}
            aria-selected={isCellSelected}
            style={{ ...style }}
            // onFocus={handleFocus}
            onClick={onClick}
            onDoubleClick={subData.resizable ? onDoubleClick : undefined}
          >
            {subData.headerName ?? subData.field}
          </div>
        </>
      );
    }
    if (subData.sortable && !subData.filter) {
      return (
        <div
          key={subData.idx}
          style={{ ...style }}
          aria-selected={isCellSelected}
          role="columnheader"
          onClick={onClick}
          onDoubleClick={subData.resizable ? onDoubleClick : undefined}
        >
          <SortableHeaderCell
            onSort={onSort}
            selectedPositionIdx={selectedPosition.idx}
            subCellIdx={subData.idx}
            sortDirection={sortDirection}
            priority={priority}
            isCellSelected={isCellSelected}
            column={subData}
          >
            {subData.headerName ?? subData.field}
          </SortableHeaderCell>
        </div>
      );
    }
    if (subData.filter && !subData.sortable) {
      let style1 = {
        display: "flex",
        justifyContent: "var(--rdg-cell-align)",
        width:
          masterData.length - 1 === index ? subData.width : subData.width - 1,
        alignItems: "center",
        height: `${(headerRowHeight * arrayDepth) / thisColumnDepth}px`,
        boxSizing: "border-box",
        // outline:
        //   selectedCellIdx === subData.idx
        //     ? "1px solid var(--rdg-selection-color)"
        //     : "none",
        outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px",
        paddingLeft: "var(--rdg-cell-padding-left)",
        paddingRight: "var(--rdg-cell-padding-right)",
      };

      if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx) {
        style1 = { ...style1, ...selectedCellHeaderStyle };
      }

      function onClickFilter() {
        selectCell(subData.idx);
      }
      if (subData.alignment) {
        style1 = subData.alignment.align
          ? { ...style1, justifyContent: subData.alignment.align }
          : alignmentUtils(subData, rowData[0], style1);
      }
      return (
        <div
          key={subData.idx}
          onClick={onClickFilter}
          aria-selected={isCellSelected}
          role="columnheader"
          onDoubleClick={subData.resizable ? onDoubleClick : undefined}
          style={{ ...style1 }}
        >
          <FilterRenderer
            column={subData}
            isCellSelected={isCellSelected}
            rowData={rowData}
          >
            {({ filters, ...rest }) =>
              FilterRendererWithSvg(
                subData,
                filterClassname,
                filters,
                setFilters,
                setFilterType,
                gridWidth,
                filterType
              )
            }
          </FilterRenderer>
        </div>
      );
    }
    if (subData.filter && subData.sortable) {
      let style1 = {
        display: "flex",
        justifyContent: "var(--rdg-cell-align)",
        borderRight:
          masterData.length - 1 === index
            ? "none"
            : "var(--rdg-cell-border-vertical)",
        width:
          masterData.length - 1 === index ? subData.width : subData.width - 1,
        alignItems: "center",
        height: `${(headerRowHeight * arrayDepth) / thisColumnDepth}px`,
        boxSizing: "border-box",
        // outline:
        //   selectedCellIdx === subData.idx
        //     ? "1px solid var(--rdg-selection-color)"
        //     : "none",
        outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px",
        paddingLeft: "var(--rdg-cell-padding-left)",
        paddingRight: "var(--rdg-cell-padding-right)",
      };

      if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx)
        style1 = { ...style1, ...selectedCellHeaderStyle };

      if (column.alignment) {
        style = column.alignment.align
          ? { ...style, justifyContent: column.alignment.align }
          : alignmentUtils(column, rowData[0], style);
      }

      function onClickFilter() {
        selectCell(subData.idx);
      }
      if (subData.headerStyle) {
        style1 = { ...style1, ...subData.headerStyle };
      }
      return (
        <div
          key={subData.idx}
          style={{ ...style1 }}
          // onFocus={handleFocus}
          aria-selected={isCellSelected}
          role="columnheader"
          onClick={onClickFilter}
          onDoubleClick={column.resizable ? onDoubleClick : undefined}
        >
          <div
            style={{
              width: "90%",
              ...style,
              outline: "none",
              borderInlineEnd: "none",
            }}
          >
            <SortableHeaderCell
              onSort={onSort}
              selectedPositionIdx={selectedPosition.idx}
              subCellIdx={subData.idx}
              sortDirection={sortDirection}
              priority={priority}
              isCellSelected={isCellSelected}
              column={subData}
            >
              {subData.headerName ?? subData.field}
            </SortableHeaderCell>
          </div>
          <FilterRenderer
            column={subData}
            isCellSelected={isCellSelected}
            rowData={rowData}
          >
            {({ filters, ...rest }) =>
              FilterRendererWithSvg(
                subData,
                filterClassname,
                filters,
                setFilters,
                setFilterType,
                gridWidth,
                filterType
              )
            }
          </FilterRenderer>
        </div>
      );
    }
  }
};
