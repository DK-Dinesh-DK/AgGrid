import React, { useMemo } from "react";
import { valueFormatter, toggleGroupFormatter } from "../formatters";
const DEFAULT_COLUMN_WIDTH = "auto";
const DEFAULT_COLUMN_MIN_WIDTH = 40;

export function useCalculatedRowColumns({
  columns4,
  defaultColumnOptions,
  rawGroupBy,
  frameworkComponents,
}) {
  const defaultWidth = defaultColumnOptions?.width ?? DEFAULT_COLUMN_WIDTH;
  const defaultMinWidth =
    defaultColumnOptions?.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH;
  const defaultMaxWidth = defaultColumnOptions?.maxWidth ?? undefined;
  const defaultFormatter = defaultColumnOptions?.formatter ?? valueFormatter;
  const defaultSortable = defaultColumnOptions?.sortable ?? false;
  const defaultResizable = defaultColumnOptions?.resizable ?? false;
  const defaultFilter = defaultColumnOptions?.dilter ?? false;

  const { columns5 } = useMemo(() => {
    // Filter rawGroupBy and ignore keys that do not match the columns prop

    const columns5 = columns4?.map((rawColumn, pos) => {
      const rowGroup = rawGroupBy?.includes(rawColumn.field) ?? false;
      const frozen = rowGroup || rawColumn.frozen;

      const cellRendererValue = rawColumn.cellRenderer;
      const components = frameworkComponents
        ? Object.keys(frameworkComponents)
        : null;
      const indexOfComponent = components?.indexOf(cellRendererValue);
      const customComponentName =
        indexOfComponent > -1 ? components[indexOfComponent] : null;

      const column = {
        ...rawColumn,
        key: rawColumn.field,
        parent: null,
        idx: 0,
        frozen,
        isLastFrozenColumn: false,
        rowGroup,
        readOnly: rawColumn.readOnly ?? false,
        width: rawColumn.width ?? defaultWidth,
        minWidth: rawColumn.minWidth ?? defaultMinWidth,
        maxWidth: rawColumn.maxWidth ?? defaultMaxWidth,
        sortable: rawColumn.sortable ?? defaultSortable,
        resizable: rawColumn.resizable ?? defaultResizable,
        formatter: rawColumn.cellRenderer
          ? rawColumn.cellRenderer
          : rawColumn.valueFormatter ?? defaultFormatter,
        filter: rawColumn.filter ?? defaultFilter,
        cellRenderer:
          frameworkComponents?.[customComponentName] ??
          rawColumn.cellRenderer ??
          rawColumn.valueFormatter ??
          defaultFormatter,
        // topHeader: rawColumn.field,
      };

      if (rowGroup) {
        column.groupFormatter ??= toggleGroupFormatter;
      }

      return column;
    });

    return {
      columns5,
    };
  }, [
    columns4,
    defaultWidth,
    defaultMinWidth,
    defaultMaxWidth,
    defaultFormatter,
    defaultResizable,
    defaultSortable,
    rawGroupBy,
  ]);

  return {
    columns5,
  };
}
