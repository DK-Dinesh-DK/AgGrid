import { useState, useRef } from "react";
import { faker } from "@faker-js/faker";

import DataGrid from "../components/datagrid/DataGrid";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { SelectColumn } from "../components/datagrid";
const sports = [
  "Swimming",
  "Gymnastics",
  "Speed Skating",
  "Cross Country Skiing",
  "Short-Track Speed Skating",
  "Diving",
  "Cycling",
  "Biathlon",
  "Alpine Skiing",
  "Ski Jumping",
  "Nordic Combined",
  "Athletics",
  "Table Tennis",
  "Tennis",
  "Synchronized Swimming",
  "Shooting",
  "Rowing",
  "Fencing",
  "Equestrian",
  "Canoeing",
  "Bobsleigh",
  "Badminton",
  "Archery",
  "Wrestling",
  "Weightlifting",
  "Waterpolo",
  "Wrestling",
  "Weightlifting",
];

const columns = [
  SelectColumn,
  {
    field: "country",
    headerName: "Country",
  },
  {
    field: "year",
    headerName: "Year",
  },
  {
    field: "sport",
    headerName: "Sport",
  },
  {
    field: "athlete",
    headerName: "Athlete",
  },
  {
    field: "gold",
    headerName: "Gold",
    groupFormatter({ childRows }) {
      return <>{childRows.reduce((prev, { gold }) => prev + gold, 0)}</>;
    },
  },
  {
    field: "silver",
    headerName: "Silver",
    groupFormatter({ childRows }) {
      return <>{childRows.reduce((prev, { silver }) => prev + silver, 0)}</>;
    },
  },
  {
    field: "bronze",
    headerName: "Bronze",
    groupFormatter({ childRows }) {
      return <>{childRows.reduce((prev, { silver }) => prev + silver, 0)}</>;
    },
  },
  {
    field: "total",
    headerName: "Total",
    formatter({ row }) {
      return <>{row.gold + row.silver + row.bronze}</>;
    },
    groupFormatter({ childRows }) {
      return (
        <>
          {childRows.reduce(
            (prev, row) => prev + row.gold + row.silver + row.bronze,
            0
          )}
        </>
      );
    },
  },
];

function rowKeyGetter(row) {
  return row.id;
}

function createRows() {
  const rows = [];
  for (let i = 1; i < 1000; i++) {
    rows.push({
      id: i,
      year: 2015 + faker.datatype.number(3),
      country: faker.address.country(),
      sport: sports[faker.datatype.number(sports.length - 1)],
      athlete: faker.name.fullName(),
      gold: faker.datatype.number(5),
      silver: faker.datatype.number(5),
      bronze: faker.datatype.number(5),
    });
  }

  return rows.sort((r1, r2) => r2.country.localeCompare(r1.country));
}

const options = ["country", "year", "sport", "athlete"];

function LaiDataGrid() {
  const [rows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState();
  const [selectedOptions, setSelectedOptions] = useState([
    options[0],
    options[1],
  ]);
  const [expandedGroupIds, setExpandedGroupIds] = useState(() => new Set([]));

  function toggleOption(option, enabled) {
    const index = selectedOptions.indexOf(option);
    if (enabled) {
      if (index === -1) {
        setSelectedOptions((options) => [...options, option]);
      }
    } else if (index !== -1) {
      setSelectedOptions((options) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        return newOptions;
      });
    }
    setExpandedGroupIds(new Set());
  }
  const dataGridRef = useRef(null);

  return (
    <div>
      <b>Group by columns:</b>
      <div>
        {options.map((option) => (
          <label key={option}>
            <input
              data-testid={`checkbox-${option}`}
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(event) => toggleOption(option, event.target.checked)}
            />{" "}
            {option}
          </label>
        ))}
      </div>
      <button
        data-testid={"collapseAll"}
        onClick={() => {
          dataGridRef.current.api.collapseAll();
        }}
        style={{ color: "white", backgroundColor: "red" }}
      >
        collapseAll
      </button>
      <button
        data-testid={"expandAll"}
        onClick={() => {
          dataGridRef.current.api.expandAll();
        }}
        style={{ color: "white", backgroundColor: "red" }}
      >
        expandAll
      </button>
      <button
        data-testid={"setRowNodeExpanded"}
        onClick={() => {
          let node = dataGridRef.current.api.getRowNode(2);
          dataGridRef.current.api.setRowNodeExpanded(node, true, true);
        }}
      >
        setRowNodeExpanded
      </button>
      <DataGrid
        columnData={columns}
        rowData={rows}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        headerRowHeight={24}
        onSelectedRowsChange={setSelectedRows}
        groupBy={selectedOptions}
        expandedGroupIds={expandedGroupIds}
        onExpandedGroupIdsChange={setExpandedGroupIds}
        defaultColumnOptions={{ resizable: true }}
        innerRef={dataGridRef}
        testId={"laidatagrid"}
      />
    </div>
  );
}

describe("Datagrid Unit test for Group Row", () => {
  test("group view", async () => {
    render(<LaiDataGrid />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const toggleBtn = screen.getByRole("gridcell", { name: "Zimbabwe" });
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    const checkboxInput = screen.getByTestId("checkbox-year");
    expect(checkboxInput).toBeInTheDocument();
    fireEvent.click(checkboxInput);
  });
  test("group view api ", async () => {
    render(<LaiDataGrid />);
    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const expandAllBtn = screen.getByTestId("expandAll");
    expect(expandAllBtn).toBeInTheDocument();
    fireEvent.click(expandAllBtn);
    const setRowNodeExpandedBtn = screen.getByTestId("setRowNodeExpanded");
    expect(setRowNodeExpandedBtn).toBeInTheDocument();
    fireEvent.click(setRowNodeExpandedBtn);
    const collapseAllBtn = screen.getByTestId("collapseAll");
    expect(collapseAllBtn).toBeInTheDocument();
    fireEvent.click(collapseAllBtn);
    const checkBoxInput = screen.getByTestId("grid-checkbox-0");
    expect(checkBoxInput).toBeInTheDocument();
    fireEvent.click(checkBoxInput);
    fireEvent.click(checkBoxInput);
  });
});
