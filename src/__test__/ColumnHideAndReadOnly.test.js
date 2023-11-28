import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";

function TextInput(props) {
  return (
    <>
      <input
        data-testid={`text-input-${props.column.headerName}-${props.rowIndex}`}
        value={props.getValue()}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
      />
    </>
  );
}

function LaiDataGrid(props) {
  const [hide, setHide] = useState(true);
  function createRows() {
    const rows = [];

    for (let i = 1; i < 10; i++) {
      rows.push({
        id: i,
        task: `Task-${i}`,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ["Critical", "High", "Medium", "Low"][
          Math.round(Math.random() * 3)
        ],
        issueType: ["Bug", "Improvement", "Epic", "Story"][
          Math.round(Math.random() * 3)
        ],
      });
    }

    return rows;
  }
  const rowData = createRows();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      topHeader: "id",
      width: 80,
    },
    {
      field: "task",
      headerName: "Title",
      readOnly: true,
    },
    {
      field: "priority",
      headerName: "Priority",
    },
    {
      field: "issueType",
      headerName: "Issue Type",
    },
    {
      field: "complete",
      headerName: "% Complete",
      hide: hide,
    },
  ];

  return (
    <>
      <button data-testid={"hide-btn"} onClick={() => setHide(!hide)}>
        Hide
      </button>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for column hide", () => {
  test("column Hide", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const elementNotPresent = screen.queryByText("% Complete");

    expect(elementNotPresent).toBeNull();
    const hideBtn = screen.getByTestId("hide-btn");
    expect(hideBtn).toBeInTheDocument();
    fireEvent.click(hideBtn);
    // const elementPresent = screen.queryByText("% Complete");
    // expect(elementPresent).toBeInTheDocument();
  });
  test("column readOnly", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const element = screen.queryByText("Task-1");
    expect(element).toBeInTheDocument();
    fireEvent.click(element);
    fireEvent.doubleClick(element);
  });
  test("Grid Key Down ", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    fireEvent.keyDown(screenArea, { key: "PageDown" });
  });
  test("column readOnly multiline area", async () => {
    const columns = [
      {
        headerName: "ID",
        field: "id",
        width: 100,
      },
      {
        headerName: "From",
        field: "FromCity",
        width: 100,
        cellRenderer: <TextInput />,
      },
      {
        headerName: "Unit",
        field: "unit",
        width: 200,
        haveChildren: true,
        children: [
          {
            headerName: "Unint (Kg)",
            field: "Weightkg",
            width: 100,
          },
          {
            headerName: "Unint-Pound",
            field: "Weightpound",
            cellRenderer: <TextInput />,
            width: 100,
          },
        ],
      },
      {
        headerName: "To",
        field: "ToCity",
        width: 100,
      },
    ];
    const row = [
      {
        id: "1",
        FromCity: "Delhi",
        Weightpound: "100",
        Weightkg: "150Kg",
        ToCity: "Mumbai",
        SOLFemalesdWeight: "SOLFemalesdWeight-1",
      },
    ];
    render(
      <DataGrid
        columnData={columns}
        rowData={row}
        testId={"laidatagrid"}
        multilineHeader={true}
        onRowClicked={(p) => console.log("rowClick", p)}
        onRowDoubleClicked={(p) => console.log("rowClick", p)}
      />
    );

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const element = screen.queryByText("150Kg");
    expect(element).toBeInTheDocument();
    fireEvent.click(element);
    fireEvent.doubleClick(element);
    const textInput = screen.getByTestId("text-input-Unint-Pound-0");
    expect(textInput).toBeInTheDocument();
    fireEvent.change(textInput, { target: { value: "AAAA" } });
  });
});
