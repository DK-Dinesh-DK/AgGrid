import { useMemo } from "react";
import { floor, max, min } from "../utils";
function isReadonlyArray(arr) {
  return Array.isArray(arr);
}

export function useViewportRows({
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
  expandedMasterIds,
  detailedRowIds,
  detailedRow,
  columns,
}) {
  const [groupedRows, rowsCount] = useMemo(() => {
    if (groupBy.length === 0 || rowGrouper == null)
      return [undefined, rawRows.length];

    const groupRows = (
      rows,
      [groupByKey, ...remainingGroupByKeys],
      startRowIndex
    ) => {
      let groupRowsCount = 0;
      const groups = {};
      for (const [key, childRows] of Object.entries(
        rowGrouper(rows, groupByKey)
      )) {
        // Recursively group each parent group
        const [childGroups, childRowsCount] =
          remainingGroupByKeys.length === 0
            ? [childRows, childRows.length]
            : groupRows(
                childRows,
                remainingGroupByKeys,
                startRowIndex + groupRowsCount + 1
              ); // 1 for parent row
        groups[key] = {
          childRows,
          childGroups,
          startRowIndex: startRowIndex + groupRowsCount,
        };
        groupRowsCount += childRowsCount + 1; // 1 for parent row
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
        const id =
          parentId !== undefined ? `${parentId}__${groupKey}` : groupKey;
        const isExpanded =
          expandAll != null ? expandAll : expandedGroupIds?.has(id) ?? false;
        const { childRows, childGroups, startRowIndex } = rows[groupKey];

        const groupRow = {
          id,
          parentId,
          groupKey,
          isExpanded,
          childRows,
          level,
          posInSet,
          startRowIndex,
          setSize: keys.length,
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
    findRowIdx,
  } = useMemo(() => {
    if (typeof rowHeight === "number" && !detailedRow) {
      let templateR;
      if (pagination && rows.length > paginationPageSize) {
        templateR = ` repeat(${paginationPageSize}, ${rowHeight}px)`;
      } else {
        templateR = ` repeat(${rows.length}, ${rowHeight}px)`;
      }
      return {
        totalRowHeight: rowHeight * rows.length,
        gridTemplateRows: templateR,
        getRowTop: (rowIdx) => rowIdx * rowHeight,
        getRowHeight: () => rowHeight,
        findRowIdx: (offset) => floor(offset / rowHeight),
      };
    }

    let totalRowHeight = 0;
    let gridTemplateRows = " ";
    const rowPositions = rows.map((row, index) => {
      let height =
        typeof rowHeight === "number"
          ? rowHeight
          : rowHeight({ type: "ROW", row, index });
      function Cal() {
        return (columns.length - 1) * height + 20;
      }

      let currentRowHeight;
      if (row.gridRowType === "detailedRow") {
        currentRowHeight = Cal();
      } else if (typeof rowHeight === "number") {
        currentRowHeight = rowHeight;
      } else if (isGroupRow(row)) {
        currentRowHeight = rowHeight({ type: "GROUP", row });
      } else {
        currentRowHeight = rowHeight({
          type: "ROW",
          row,
          expandedMasterIds,
          index,
        });
      }
      const position = { top: totalRowHeight, height: currentRowHeight };
      gridTemplateRows += `${currentRowHeight}px `;
      totalRowHeight += currentRowHeight;
      return position;
    });
    const validateRowIdx = (rowIdx) => {
      return max(0, min(rows.length - 1, rowIdx));
    };

    return {
      totalRowHeight,
      gridTemplateRows,
      getRowTop: (rowIdx) => rowPositions[validateRowIdx(rowIdx)]?.top,
      getRowHeight: (rowIdx) => rowPositions[validateRowIdx(rowIdx)]?.height,
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
      },
    };
  }, [isGroupRow, rowHeight, rows, detailedRowIds, detailedRow]);

  let rowOverscanStartIdx = 0;
  let rowOverscanEndIdx = rows.length - 1;
  let numberOfRows =
    rows.length - (current - 1) * paginationPageSize >= paginationPageSize
      ? paginationPageSize - 1
      : rows.length - (current - 1) * paginationPageSize - 1;
  if (enableVirtualization) {
    const overscanThreshold = 4;
    const rowVisibleStartIdx = findRowIdx(scrollTop);
    const rowVisibleEndIdx = findRowIdx(scrollTop + clientHeight);
    rowOverscanStartIdx = max(0, rowVisibleStartIdx - overscanThreshold);

    rowOverscanEndIdx = min(
      pagination ? numberOfRows : rows.length - 1,
      rowVisibleEndIdx + overscanThreshold
    );
  }

  if (pagination) {
    let start = paginationPageSize * current - paginationPageSize;
    let end = paginationPageSize * current;

    return {
      rowOverscanStartIdx: 0,
      rowOverscanEndIdx: numberOfRows,
      rows: rows.slice(start, end),
      rowsCount: rows.slice(start, end).length - 1,
      totalRowHeight,
      gridTemplateRows,
      isGroupRow,
      getRowTop,
      getRowHeight,
      findRowIdx,
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
      findRowIdx,
    };
  }
}
