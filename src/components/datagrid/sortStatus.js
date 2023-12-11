import React from "react";
import { SortIcon, ASCSortIcon, DESCSortIcon } from "../../assets/Icon";

export default function sortStatus({ sortDirection, priority }) {
  return (
    <>
      {sortDirection === undefined && <SortIcon />}
      {sortDirection === "ASC" && <ASCSortIcon />}
      {sortDirection === "DESC" && <DESCSortIcon />}
      {sortPriority({ priority })}
    </>
  );
}

export function sortPriority({ priority }) {
  return priority;
}
