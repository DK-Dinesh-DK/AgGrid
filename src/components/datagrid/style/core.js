import { css } from "@linaria/core";
import { row } from "./row";

const lightTheme = `
  --rdg-color: #000;
  --rdg-border-color: #FFFFFF;
  --rdg-summary-border-color: #aaa;
  --rdg-background-color: hsl(0deg 0% 100%);
  --rdg-header-background-color:  #16365D;
  --rdg-header-row-color: #FFFFFF;
  --rdg-row-hover-background-color: #D7E3BC;
  --rdg-row-hover-color: #000;
  --rdg-row-selected-background-color: hsl(207deg 76% 92%);
  --rdg-row-selected-hover-background-color: hsl(207deg 76% 88%);
  --rdg-checkbox-color: hsl(207deg 100% 29%);
  --rdg-checkbox-focus-color: hsl(207deg 100% 69%);
  --rdg-checkbox-disabled-border-color: #ccc;
  --rdg-checkbox-disabled-background-color: #ddd;
  --rdg-textEditor-text-color: #000000;
  --rdg-row-even-background-color:#E5EDF8;
  --rdg-row-odd-background-color:#f3f8fc;
  --rdg-row-selected-background-color:#ebf1dd;
  --rdg-font-family:"Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  --rdg-header-font-size: 11px;
  --rdg-tree-icon-color:#000;
  --rdg-tree-icon-font-size:12px;
  --rdg-master-icon-color:#000;
  --rdg-master-icon-font-size:12px;
  --rdg-group-icon-color:#000;
  --rdg-group-icon-font-size:12px;
  --rdg-details-row-header-color: rgb(151, 164, 177);
  --details-minus-icon-color:#000;
  --rdg-filter-icon-color:#FFFF;
`;

const darkTheme = `
  --rdg-color: #000;
  --rdg-border-color: #FFFFFF;
  --rdg-summary-border-color: #555;
  --rdg-background-color: hsl(0deg 0% 13%);
  --rdg-header-background-color:  #16365D;
  --rdg-row-hover-background-color: #D7E3BC;
  --rdg-row-selected-background-color: hsl(207deg 76% 42%);
  --rdg-row-selected-hover-background-color: hsl(207deg 76% 38%);
  --rdg-checkbox-color: hsl(207deg 100% 79%);
  --rdg-checkbox-focus-color: hsl(207deg 100% 89%);
  --rdg-checkbox-disabled-border-color: #000;
  --rdg-checkbox-disabled-background-color: #333;
  --rdg-textEditor-text-color: #FFFFFF;
  --rdg-row-even-background-color:#E5EDF8;
  --rdg-row-odd-background-color:#f3f8fc;
  --rdg-row-selected-background-color:#ebf1dd;
  --rdg-font-family:"Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  --rdg-row-hover-color: #000;
  --rdg-header-font-size: 11px;
  --rdg-tree-icon-color:#000;
  --rdg-tree-icon-font-size:12px;
  --rdg-master-icon-color:#000;
  --rdg-master-icon-font-size:12px;
  --rdg-group-icon-color:#000;
  --rdg-group-icon-font-size:12px;
  --rdg-details-row-header-color: rgb(151, 164, 177);
  --details-minus-icon-color:#000;
  --rdg-filter-icon-color:#FFFF;
`;

const root = css`
  @layer rdg {
    @layer Defaults,
      FocusSink,
      CheckboxInput,
      CheckboxIcon,
      CheckboxLabel,
      Cell,
      HeaderCell,
      SummaryCell,
      EditCell,
      Row,
      HeaderRow,
      SummaryRow,
      GroupedRow,
      Root;

    @layer Defaults {
      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }
    }
    .rdg-row-even,
    .rdg-row-summary-row-even,
    .rdg-row-groupRow-even {
      background-color: var(--rdg-row-even-background-color);
    }
    .rdg-row-odd,
    .rdg-row-summary-row-odd,
    .rdg-row-groupRow-odd {
      background-color: var(--rdg-row-odd-background-color);
    }
    .rdg-row-selected {
      background-color: var(--rdg-row-selected-background-color);
      color: var(--rdg-row-selected-color);
    }
    .tree-expand-icon {
      color: var(--rdg-tree-icon-color) !important;
      font-size: var(--rdg-tree-icon-font-size) !important;
    }
    .master-expand-icon {
      color: var(--rdg-master-icon-color) !important;
      font-size: var(--rdg-master-icon-font-size) !important;
    }
    .AgGrid-Filter-Icon {
      fill: var(--rdg-filter-icon-color) !important;
    }
    .rdg-caret {
      color: var(--rdg-group-icon-color) !important;
      font-size: var(--rdg-group-icon-font-size) !important;
    }
    .rdg-cell-detail-header {
      color: var(--rdg-details-row-header-color);
      border-right: 1px solid white;
      width: 30%;
      height: 24px;
      background-color: inherit;
      text-align: start;
      padding-left: 8px;
      font-weight: bold;
    }
    .rdg-cell-detail-data {
      width: 70%;
      height: 24px;
      background-color: inherit;
      text-align: start;
      padding-left: 8px;
    }
    .rdg-detailed-row {
      height: 24px;
      width: 100%;
      display: flex;
      line-height: 24px;
      font-size: var(--rdg-font-size);
      &[aria-selected="true"] {
        outline: 1px solid var(--rdg-selection-color);
        outline-offset: -2px;
      }
    }
    .details-expand-icon {
      font-size: 12px;
      cursor: pointer;
      text-align: center;
      padding: 3px 10px;
    }

    .detailed-row-container {
      margin-top: 8px 5px;
    }
    .details-minus-icon {
      height: 12px;
      width: 12px;
      fill: #000;
    }
    .details-plus-icon {
      height: 12px;
      width: 12px;
      fill: #000;
    }
    @layer Root {
      ${lightTheme}
      --rdg-selection-color: #66afe9;
      --rdg-font-size: 11px;

      display: grid;

      color-scheme: var(--rdg-color-scheme, light dark);

      /* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context */
      /* We set a stacking context so internal elements don't render on top of external elements. */
      contain: strict;
      content-visibility: auto;
      block-size: 350px;
      border: none;
      box-sizing: border-box;
      overflow: auto;
      background-color: var(--rdg-background-color);
      color: var(--rdg-color);
      font-size: var(--rdg-font-size);
      font-family: var(--rdg-font-family);
      height: inherit;

      /* needed on Firefox */
      &::before {
        content: "";
        grid-column: 1/-1;
        grid-row: 1/-1;
      }

      &.rdg-dark {
        --rdg-color-scheme: dark;
        ${darkTheme}
      }

      &.rdg-light {
        --rdg-color-scheme: light;
      }

      @media (prefers-color-scheme: dark) {
        &:not(.rdg-light) {
          ${darkTheme}
        }
      }
    }
  }
`;

export const rootClassname = `rdg ${root}`;

const viewportDragging = css`
  @layer rdg.Root {
    user-select: none;

    & .${row} {
      cursor: move;
    }
  }
`;

export const viewportDraggingClassname = `rdg-viewport-dragging ${viewportDragging}`;

export const focusSinkClassname = css`
  @layer rdg.FocusSink {
    grid-column: 1/-1;
    pointer-events: none;
    /* Should have a higher value than 2 to show up above header row */
    z-index: 3;
  }
`;

export const filterColumnClassName = "filter-cell";

export const filterContainerClassname = css`
  .${filterColumnClassName} {
    padding: 0;
    > div {
      padding-block: 0;
    }
  }
`;
