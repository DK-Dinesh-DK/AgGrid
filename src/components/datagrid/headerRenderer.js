import React from "react";
import { css } from "@linaria/core";
import { useRovingCellRef } from "./hooks";
import FilterRenderer from "./FilterRenderer";
import SortableHeaderCell from "./SortableHeaderCell";
import { RecordsFilter as FilterIcon } from "../../assets/Icon";
import { FilterRendererWithSvg } from "./FilterRendererWithSvg";
import alignmentUtilsHeader from "./alignMentUtils";

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
  border-inline-end: 1px solid var(--rdg-border-color);
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
  cellHeight,
  selectedPosition,
  selectedCellHeaderStyle,
  headerRowHeight,
  selectedCellIdx,
  arrayDepth,
  ChildColumnSetup,
  gridWidth,
}) {
  if (column.haveChildren === true) {
    return (
      <div>
        <div
          style={{
            borderBlockEnd: "1px solid var(--rdg-border-color)",
            height: `${headerRowHeight}px`,
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
                  rows
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    let isCellSelected;
    if (selectedCellIdx === column.idx) {
      isCellSelected = true;
    } else {
      isCellSelected = false;
    }
    const { onFocus } = useRovingCellRef(isCellSelected);

    ChildColumnSetup(column);
    let style = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "inherit",
      width: column.width ?? "100%",
      paddingLeft: "5px",
      paddingRight: "5px",
    };
    if (column.alignment) {
      style = column.alignment.align
        ? { ...style, justifyContent: column.alignment.align }
        : alignmentUtilsHeader(column, rows[0], style);
    }
    if (selectedCellHeaderStyle && selectedPosition.idx === column.idx)
      style = { ...style, ...selectedCellHeaderStyle };

    function onClick() {
      selectCell(column.idx);
    }
    function onDoubleClick(event) {
      const { right, left } = event.currentTarget.getBoundingClientRect();
      const offset = isRtl ? event.clientX - left : right - event.clientX;

      if (offset > 11) {
        // +1px to account for the border size
        return;
      }

      onColumnResize(column, "max-content");
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
      justifyContent: "center",
      width: "100%",
    };
    if (column.alignment) {
      style_1 = column.alignment.align
        ? { ...style_1, justifyContent: column.alignment.align }
        : alignmentUtilsHeader(column, rows[0], style_1);
    }
    if (!(column.sortable || column.filter)) {
      return (
        // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>

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
          <div style={{ ...style }}>
            <SortableHeaderCell
              onSort={onSort}
              sortDirection={sortDirection}
              priority={priority}
              isCellSelected={isCellSelected}
              column={column}
              borderBottom={"none"}
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
        justifyContent: "center",
        height: "100%",
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) {
        style11 = { ...style11, ...selectedCellHeaderStyle };
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
          >
            {({ filters, ...rest }) =>
              FilterRendererWithSvg(
                column,
                filterClassname,
                filters,
                setFilters,
                setFilterType,
                gridWidth
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
        justifyContent: "center",
        height: "100%",
      };
      if (selectedCellHeaderStyle && selectedPosition.idx === column.idx) {
        styleSF = { ...styleSF, ...selectedCellHeaderStyle };
      }
      if (column.alignment) {
        styleSF = column.alignment.align
          ? { ...styleSF, justifyContent: column.alignment.align }
          : alignmentUtilsHeader(column, rows[0], styleSF);
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
          <div style={{ width: "90%" }}>
            <SortableHeaderCell
              onSort={onSort}
              sortDirection={sortDirection}
              priority={priority}
              isCellSelected={isCellSelected}
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
                gridWidth
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
  direction
) => {
  var cellHeight = cellHeight - headerRowHeight;
  ChildColumnSetup(subData);
  let isCellSelected;
  if (selectedCellIdx === subData.idx) {
    isCellSelected = true;
  } else {
    isCellSelected = false;
  }
  const { onFocus } = useRovingCellRef(isCellSelected);
  let rowData = direction;
  if (subData.haveChildren === true) {
    return (
      <div style={{ textAlign: "center" }}>
        {
          <div
            style={{
              borderBlockEnd: "1px solid var(--rdg-border-color)",
              height: `${headerRowHeight}px`,
            }}
          >
            <div className={headerWrapperWithChildData}>
              {subData.headerName ?? subData.field}
            </div>
          </div>
        }
        <div className={headerWrapperWithcellData}>
          {subData.children.map((subInfo, index) => {
            var style = {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
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
                  direction
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
      justifyContent: "center",
      alignItems: "center",
      borderInlineEnd: "1px solid var(--rdg-border-color)",
      width: subData.width,
      boxSizing: "border-box",
      height: `${cellHeight}px`,
      outline:
        selectedCellIdx === subData.idx
          ? "1px solid var(--rdg-selection-color)"
          : "none",
      outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px",
      paddingLeft: "5px",
      paddingRight: "5px",
    };
    if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx) {
      style = { ...style, ...selectedCellHeaderStyle };
    }

    if (subData.alignment) {
      style = subData.alignment.align
        ? { ...style, justifyContent: subData.alignment.align }
        : alignmentUtilsHeader(subData, rowData[0], style);
    }
    function onClick() {
      selectCell(subData.idx);
    }

    const isRtl = direction === "rtl";

    function onDoubleClick(event) {
      const { right, left } = event.currentTarget.getBoundingClientRect();
      const offset = isRtl ? event.clientX - left : right - event.clientX;

      if (offset > 11) {
        // +1px to account for the border size
        return;
      }

      onColumnResize(subData, "max-content");
    }

    if (!subData.sortable && !subData.filter) {
      return (
        // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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
            onDoubleClick={column.resizable ? onDoubleClick : undefined}
            // onPointerDown={column.resizable ? onPointerDown : undefined}
          >
            {subData.headerName ?? subData.field}
          </div>
        </>
      );
    }
    if (subData.sortable && !subData.filter)
      return (
        // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          key={subData.idx}
          style={{ ...style }}
          // onFocus={handleFocus}
          aria-selected={isCellSelected}
          role="columnheader"
          onClick={onClick}
          onDoubleClick={subData.resizable ? onDoubleClick : undefined}
          // onPointerDown={column.resizable ? onPointerDown : undefined}
        >
          <SortableHeaderCell
            onSort={onSort}
            selectedPositionIdx={selectedPosition.idx}
            subCellIdx={subData.idx}
            sortDirection={sortDirection}
            priority={priority}
            isCellSelected={isCellSelected}
          >
            {subData.headerName ?? subData.field}
          </SortableHeaderCell>
        </div>
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
        outline:
          selectedCellIdx === subData.idx
            ? "1px solid var(--rdg-selection-color)"
            : "none",
        outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px",
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
          : alignmentUtilsHeader(subData, rowData[0], style1);
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
                gridWidth
              )
            }
          </FilterRenderer>
        </div>
      );
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
        outline:
          selectedCellIdx === subData.idx
            ? "1px solid var(--rdg-selection-color)"
            : "none",
        outlineOffset: selectedCellIdx === subData.idx ? "-1px" : "0px",
      };

      if (selectedCellHeaderStyle && selectedPosition.idx === subData.idx)
        style1 = { ...style1, ...selectedCellHeaderStyle };

      if (column.alignment) {
        style = column.alignment.align
          ? { ...style, justifyContent: column.alignment.align }
          : alignmentUtilsHeader(column, rowData[0], style);
      }

      function onClickFilter() {
        selectCell(subData.idx);
      }

      return (
        // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          key={subData.idx}
          style={{ ...style1 }}
          // onFocus={handleFocus}
          aria-selected={isCellSelected}
          role="columnheader"
          onClick={onClickFilter}
          onDoubleClick={column.resizable ? onDoubleClick : undefined}
          // onPointerDown={column.resizable ? onPointerDown : undefined}
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
                gridWidth
              )
            }
          </FilterRenderer>
        </div>
      );
    }
  }
};
