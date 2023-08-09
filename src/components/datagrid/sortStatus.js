import React from "react";
import { css } from "@linaria/core";

const arrow = css`
  @layer rdg.SortIcon {
    fill: currentColor;

    > path {
      transition: d 0.1s;
    }
  }
`;

const arrowClassname = `rdg-sort-arrow ${arrow}`;

export default function sortStatus({ sortDirection, priority }) {
  return (
    <>
      {sortIcon({ sortDirection })}
      {sortPriority({ priority })}
    </>
  );
}

export function sortIcon({ sortDirection }) {
  if (sortDirection === undefined) return null;

  return (
    <svg
      data-testid="sortIcon"
      fill="#fff"
      id="Layer_2"
      height="8"
      viewBox="0 0 32 32"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 2"
    >
      <path d="m7 13h18a1 1 0 0 0 .707-1.707l-9-9a.9994.9994 0 0 0 -1.414 0l-9 9a1 1 0 0 0 .707 1.707z" />
      <path d="m25 19h-18a1 1 0 0 0 -.707 1.707l9 9a.9995.9995 0 0 0 1.414 0l9-9a1 1 0 0 0 -.707-1.707z" />
    </svg>
  );
}

export function sortPriority({ priority }) {
  return priority;
}
