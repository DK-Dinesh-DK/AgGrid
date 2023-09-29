import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { SelectColumn } from "../components/datagrid";
function LaiDataGrid() {
  function createRows() {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const price = Math.random() * 30;
      const id = `row${i}`;
      var row;

      row = {
        id,
        name: `supplier-${i}`,
        format: `package-${i}`,
        position: "Run of site",
        price,
      };

      rows.push(row);
    }
    return rows;
  }
  const [rowData, setRowData] = useState(createRows());

  const columns = [
    {
      field: "id",
      headerName: "id",
      frozen: true,
      width: 400,
    },
    {
      field: "name",
      headerName: "Name",
      width: 400,
      filter: true,
    },
    {
      field: "format",
      headerName: "format",
      width: 400,
    },
    {
      field: "position",
      headerName: "position",
      width: 400,
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
      width: 400,
    },
  ];
  const gridlocalRef = useRef(null);

  return (
    <>
      <button
        data-testid={"isSelected"}
        onClick={() => {
          let nodes = gridlocalRef.current.api.getRenderedNodes();
          console.log(nodes[1].isSelected());
        }}
      >
        isSelected
      </button>
      <button
        data-testid={"setSelected"}
        onClick={() => {
          let nodes = gridlocalRef.current.api.getRenderedNodes();
          nodes[1].setSelected();
        }}
      >
        setSelected
      </button>
      <button
        data-testid={"setData"}
        onClick={() => {
          let nodes = gridlocalRef.current.api.getRenderedNodes();
          nodes[2].setData({
            id: 4,
            name: `supplier-4-0`,
            format: `package-4-0`,
            position: "Run of site",
            price: "Price-4-0",
          });
        }}
      >
        setData
      </button>
      <button
        data-testid={"setDataValue"}
        onClick={() => {
          let nodes = gridlocalRef.current.api.getRenderedNodes();
          nodes[2].setDataValue("position", "Run of site-1");
        }}
      >
        setDataValue
      </button>
      <button
        data-testid={"updateData"}
        onClick={() => {
          let nodes = gridlocalRef.current.api.getRenderedNodes();
          nodes[2].updateData({
            id: 4,
            name: `supplier-4-0-1`,
            format: `package-4-0`,
            position: "Run of site",
            price: "Price-4-0",
          });
        }}
      >
        updateData
      </button>
      <DataGrid
        columnData={columns}
        innerRef={gridlocalRef}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        enableVirtualization={false}
        className="fill-grid"
      />
    </>
  );
}

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

function LaiDataGrid1() {
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
  const [expand, setExpand] = useState(false);
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
        data-testid={"isExpandable"}
        onClick={() => {
          let nodes = dataGridRef.current.api.getRenderedNodes();
          nodes[2].isExpandable();
        }}
      >
        isExpandable
      </button>
      <button
        data-testid={"setExpanded"}
        onClick={() => {
          let nodes = dataGridRef.current.api.getRenderedNodes();
          nodes[3].setExpanded(!expand);
          setExpand(!expand);
        }}
      >
        setExpanded
      </button>
      <DataGrid
        columnData={columns}
        rowData={rows}
        selectedRows={selectedRows}
        headerRowHeight={24}
        onSelectedRowsChange={setSelectedRows}
        groupBy={selectedOptions}
        expandedGroupIds={expandedGroupIds}
        onExpandedGroupIdsChange={setExpandedGroupIds}
        defaultColumnOptions={{ resizable: true }}
        innerRef={dataGridRef}
        testId={"laidatagrid1"}
      />
    </div>
  );
}

describe("Datagrid Unit test for rowNode", () => {
  test("Datagrid Unit test for rownode isSelected,setSelected", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();

    const isSelectedBtn = screen.getByTestId("isSelected");
    expect(isSelectedBtn).toBeInTheDocument();
    fireEvent.click(isSelectedBtn);

    const setSelectedBtn = screen.getByTestId("setSelected");
    expect(setSelectedBtn).toBeInTheDocument();
    fireEvent.click(setSelectedBtn);
    const setDataBtn = screen.getByTestId("setData");
    expect(setDataBtn).toBeInTheDocument();
    fireEvent.click(setDataBtn);
    const setDataValueBtn = screen.getByTestId("setDataValue");
    expect(setDataValueBtn).toBeInTheDocument();
    fireEvent.click(setDataValueBtn);
    const updateDataBtn = screen.getByTestId("updateData");
    expect(updateDataBtn).toBeInTheDocument();
    fireEvent.click(updateDataBtn);
  });
  test("Datagrid Unit test for rownode isExpanded", async () => {
    render(<LaiDataGrid1 />);

    const screenArea = screen.getByTestId("laidatagrid1");
    expect(screenArea).toBeInTheDocument();
    const isExpandableBtn = screen.getByTestId("isExpandable");
    expect(isExpandableBtn).toBeInTheDocument();
    fireEvent.click(isExpandableBtn);
    const setExpandedBtn = screen.getByTestId("setExpanded");
    expect(setExpandedBtn).toBeInTheDocument();
    fireEvent.click(setExpandedBtn);
    fireEvent.click(setExpandedBtn);
  });
});
