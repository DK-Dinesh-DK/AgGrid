import { useState, useRef } from "react";
import { faker } from "@faker-js/faker";

import DataGrid from "../components/datagrid/DataGrid";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { SelectColumn } from "../components/datagrid";
import { act } from "react-dom/test-utils";
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
let rowGroupsOutput;
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
      year: 2015 + i,
      country: faker.address.country(),
      sport: sports[faker.random.numeric(0, sports.length - 1)],
      athlete: faker.name.fullName(),
      gold: i,
      silver: i,
      bronze: i,
    });
  }

  return rows.sort((r1, r2) => r2.country.localeCompare(r1.country));
}

const options = ["country", "year", "sport", "athlete"];

function LaiDataGrid(props) {
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
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(event) => toggleOption(option, event.target.checked)}
            />{" "}
            {option}
          </label>
        ))}
      </div>
      <button
        data-testId="getRowGroupColumnsBtn"
        onClick={() => {
          rowGroupsOutput = dataGridRef.current.columnApi.getRowGroupColumns();
        }}
      >
        getRowGroupColumns
      </button>
      <button
        data-testId="setRowGroupColumnsBtn"
        onClick={() => {
          dataGridRef.current.columnApi.setRowGroupColumns(
            props.setRowGroupCols
          );
        }}
      >
        setRowGroupColumns
      </button>
      <button
        data-testId="addRowGroupColumnBtn"
        onClick={() => {
          dataGridRef.current.columnApi.addRowGroupColumn(
            props.addRowGroupColumn
          );
        }}
      >
        addRowGroupColumn
      </button>
      <button
        data-testId="addRowGroupColumnsBtn"
        onClick={() => {
          dataGridRef.current.columnApi.addRowGroupColumns(
            props.addRowGroupColumns
          );
        }}
      >
        addRowGroupColumns
      </button>
      <button
        data-testId="removeRowGroupColumnBtn"
        onClick={() => {
          dataGridRef.current.columnApi.removeRowGroupColumn(
            props.removeRowGroupColumn
          );
        }}
      >
        removeRowGroupColumn
      </button>
      <button
        data-testId="removeRowGroupColumnsBtn"
        onClick={() => {
          dataGridRef.current.columnApi.removeRowGroupColumns(
            props.removeRowGroupColumns
          );
        }}
      >
        removeRowGroupColumns
      </button>
      <button
        data-testId="moveRowGroupColumnBtn"
        onClick={() => {
          dataGridRef.current.columnApi.moveRowGroupColumn(
            props.fromIndex,
            props.toIndex
          );
        }}
      >
        moveRowGroupColumn
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
describe("RowGrouping API", () => {
  test("getRowGroupColumns works correctly", () => {
    const expectedRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];

    render(<LaiDataGrid />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("setRowGroupColumns works correctly when columns are passed as array of objects", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "sport",
        columnIndex: 3,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "sport", headerName: "Sport", depth: 0 },
      },
      {
        colId: "athlete",
        columnIndex: 4,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "athlete",
          headerName: "Athlete",
          depth: 0,
        },
      },
    ];
    const rowGroupCols = [{ colId: "athlete" }, { colId: "sport" }];
    render(<LaiDataGrid setRowGroupCols={rowGroupCols} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const setRowGroupColumnsBtn = screen.queryByTestId("setRowGroupColumnsBtn");
    expect(setRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setRowGroupColumnsBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("setRowGroupColumns works correctly when columns are passed as array of strings", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "sport",
        columnIndex: 3,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "sport", headerName: "Sport", depth: 0 },
      },
      {
        colId: "athlete",
        columnIndex: 4,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "athlete",
          headerName: "Athlete",
          depth: 0,
        },
      },
    ];
    const rowGroupCols = ["athlete", "sport"];
    render(<LaiDataGrid setRowGroupCols={rowGroupCols} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const setRowGroupColumnsBtn = screen.queryByTestId("setRowGroupColumnsBtn");
    expect(setRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(setRowGroupColumnsBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("addRowGroupColumn works correctly when column is passed as object", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
      {
        colId: "athlete",
        columnIndex: 4,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 2,
        sort: null,
        userProvidedColDef: {
          field: "athlete",
          headerName: "Athlete",
          depth: 0,
        },
      },
    ];
    const addRowGroupColumn = { colId: "athlete" };
    render(<LaiDataGrid addRowGroupColumn={addRowGroupColumn} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const addRowGroupColumnBtn = screen.queryByTestId("addRowGroupColumnBtn");
    expect(addRowGroupColumnBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addRowGroupColumnBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("addRowGroupColumn works correctly when column is passed as string", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
      {
        colId: "athlete",
        columnIndex: 4,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 2,
        sort: null,
        userProvidedColDef: {
          field: "athlete",
          headerName: "Athlete",
          depth: 0,
        },
      },
    ];
    const addRowGroupColumn = "athlete";
    render(<LaiDataGrid addRowGroupColumn={addRowGroupColumn} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const addRowGroupColumnBtn = screen.queryByTestId("addRowGroupColumnBtn");
    expect(addRowGroupColumnBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addRowGroupColumnBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("addRowGroupColumns works correctly when columns are passed as array of objects", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
      {
        colId: "sport",
        columnIndex: 3,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 3,
        sort: null,
        userProvidedColDef: { field: "sport", headerName: "Sport", depth: 0 },
      },
      {
        colId: "athlete",
        columnIndex: 4,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 2,
        sort: null,
        userProvidedColDef: {
          field: "athlete",
          headerName: "Athlete",
          depth: 0,
        },
      },
    ];
    const addRowGroupColumns = [{ colId: "athlete" }, { colId: "sport" }];
    render(<LaiDataGrid addRowGroupColumns={addRowGroupColumns} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const addRowGroupColumnsBtn = screen.queryByTestId("addRowGroupColumnsBtn");
    expect(addRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addRowGroupColumnsBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("addRowGroupColumns works correctly when columns are passed as array of strings", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
      {
        colId: "sport",
        columnIndex: 3,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 3,
        sort: null,
        userProvidedColDef: { field: "sport", headerName: "Sport", depth: 0 },
      },
      {
        colId: "athlete",
        columnIndex: 4,
        width: "auto",
        frozen: undefined,
        rowGroup: false,
        rowGroupIndex: 2,
        sort: null,
        userProvidedColDef: {
          field: "athlete",
          headerName: "Athlete",
          depth: 0,
        },
      },
    ];
    const addRowGroupColumns = ["athlete", "sport"];
    render(<LaiDataGrid addRowGroupColumns={addRowGroupColumns} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const addRowGroupColumnsBtn = screen.queryByTestId("addRowGroupColumnsBtn");
    expect(addRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addRowGroupColumnsBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("removeRowGroupColumn works correctly when column is passed as an object", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const removeRowGroupColumn = { colId: "country" };
    render(<LaiDataGrid removeRowGroupColumn={removeRowGroupColumn} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const removeRowGroupColumnBtn = screen.queryByTestId(
      "removeRowGroupColumnBtn"
    );
    expect(removeRowGroupColumnBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(removeRowGroupColumnBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("removeRowGroupColumn works correctly when column is passed as string", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const removeRowGroupColumn = "country";
    render(<LaiDataGrid removeRowGroupColumn={removeRowGroupColumn} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const removeRowGroupColumnBtn = screen.queryByTestId(
      "removeRowGroupColumnBtn"
    );
    expect(removeRowGroupColumnBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(removeRowGroupColumnBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("removeRowGroupColumns works correctly when columns are passed an array of objects", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const removeRowGroupColumns = [{ colId: "country" }, { colId: "athlete" }];
    render(
      <LaiDataGrid
        removeRowGroupColumns={removeRowGroupColumns}
        addRowGroupColumn={"athlete"}
      />
    );
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const addRowGroupColumnBtn = screen.queryByTestId("addRowGroupColumnBtn");
    expect(addRowGroupColumnBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addRowGroupColumnBtn);
    });

    const removeRowGroupColumnsBtn = screen.queryByTestId(
      "removeRowGroupColumnsBtn"
    );
    expect(removeRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(removeRowGroupColumnsBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("removeRowGroupColumns works correctly when columns are passed an array of strings", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const removeRowGroupColumns = ["country", "athlete"];
    render(
      <LaiDataGrid
        removeRowGroupColumns={removeRowGroupColumns}
        addRowGroupColumn={"athlete"}
      />
    );
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const addRowGroupColumnBtn = screen.queryByTestId("addRowGroupColumnBtn");
    expect(addRowGroupColumnBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(addRowGroupColumnBtn);
    });

    const removeRowGroupColumnsBtn = screen.queryByTestId(
      "removeRowGroupColumnsBtn"
    );
    expect(removeRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(removeRowGroupColumnsBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
  test("moveRowGroupColumn works correctly", () => {
    const initialRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];
    const expectedRowGroupColumns = [
      {
        colId: "country",
        columnIndex: 1,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 1,
        sort: null,
        userProvidedColDef: {
          field: "country",
          headerName: "Country",
          depth: 0,
        },
      },
      {
        colId: "year",
        columnIndex: 2,
        width: "auto",
        frozen: true,
        rowGroup: true,
        rowGroupIndex: 0,
        sort: null,
        userProvidedColDef: { field: "year", headerName: "Year", depth: 0 },
      },
    ];

    render(<LaiDataGrid fromIndex={0} toIndex={1} />);
    const datagrid = screen.queryByTestId("laidatagrid");
    expect(datagrid).toBeInTheDocument();

    const getRowGroupColumnsBtn = screen.queryByTestId("getRowGroupColumnsBtn");
    expect(getRowGroupColumnsBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(initialRowGroupColumns);

    const moveRowGroupColumnBtn = screen.queryByTestId("moveRowGroupColumnBtn");
    expect(moveRowGroupColumnBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(moveRowGroupColumnBtn);
      fireEvent.click(getRowGroupColumnsBtn);
    });

    expect(rowGroupsOutput).toEqual(expectedRowGroupColumns);
  });
});
