import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React from "react";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "product", headerName: "Product" },
  { field: "price", headerName: "Price" },
];

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 1; i < 30; i++) {
      rows.push({
        id: i,
        product: `product${i}`,
        price: `price${i}`,
      });
    }

    return rows;
  }

  const rowData = createRows();
  const getContextMenuItems = [
    {
      name: "Alert",
      action: () => {
        window.alert("Alerting about");
      },
    },

    {
      name: "Always Disabled",
      disabled: true,
      action: () => {
        props.onClick();
      },
      tooltip:
        "Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!",
    },
    {
      name: "Country",
      divider: true,
      subMenu: [
        {
          name: "Will",
          action: () => {
            console.log("Will was pressed");
          },
        },
        {
          name: "Armaan",
          action: () => {
            console.log("Armaan was pressed");
          },
          icon: () => (
            <>
              <img src="https://www.ag-grid.com/example-assets/skills/mac.png" />
            </>
          ),
        },
      ],
    },
    {
      name: "Person",
      subMenu: [
        {
          name: "Niall",
          action: () => {
            console.log("Niall was pressed");
          },
        },
        {
          name: "Sean",
          action: () => {
            console.log("Sean was pressed");
          },
        },
        {
          name: "Armaan",
          action: () => {
            console.log("Armaan was pressed");
          },
          icon: () => (
            <>
              <img src="https://www.ag-grid.com/example-assets/skills/mac.png" />
            </>
          ),
        },
      ],
    },
    {
      name: "Windows",
      shortcut: "Alt + W",
      action: () => {
        console.log("Windows Item Selected");
      },
      icon: () => (
        <img src="https://www.ag-grid.com/example-assets/skills/windows.png" />
      ),
    },
    {
      name: "Mac",
      shortcut: "Alt + M",
      action: () => {
        console.log("Mac Item Selected");
      },
      icon: () => (
        <img src="https://www.ag-grid.com/example-assets/skills/mac.png" />
      ),
    },
    {
      name: "Checked",
      checked: true,
      shortcut: "Alt+f",
      action: (props) => {
        console.log("Checked Selected", props);
      },
      icon: () => (
        <img src="https://www.ag-grid.com/example-assets/skills/mac.png" />
      ),
    },
  ];
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        getContextMenuItems={getContextMenuItems}
      />
    </>
  );
}

describe("Datagrid Unit test for contextmenu", () => {
  test("context menu and menu click ", async () => {
    const alertMock = jest.spyOn(window, "alert");
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const row = screen.getByText("product3");
    expect(row).toBeInTheDocument();
    fireEvent.contextMenu(row);
    const row1 = screen.getByText("product4");
    expect(row1).toBeInTheDocument();
    fireEvent.contextMenu(row1);
    const cell = screen.getByText("price3");
    expect(cell).toBeInTheDocument();
    fireEvent.contextMenu(cell);
    const alertArea = screen.getByTestId("context-menu-option-Alert");
    expect(alertArea).toBeInTheDocument();
    fireEvent.click(alertArea);
    expect(alertMock).toHaveBeenCalledWith("Alerting about");
  });

  test("sub contextmenu ", async () => {
    const consoleMock = jest.spyOn(console, "log");

    render(<LaiDataGrid />);
    const row = screen.getByText("product3");
    expect(row).toBeInTheDocument();
    fireEvent.contextMenu(row);
    const personMenu = screen.getByTestId("Person-sub-menu-icon");
    const countryMenu = screen.getByTestId("Country-sub-menu-icon");
    expect(personMenu).toBeInTheDocument();
    expect(countryMenu).toBeInTheDocument();
    fireEvent.mouseEnter(personMenu);
    fireEvent.mouseEnter(countryMenu);
    fireEvent.mouseEnter(personMenu);
    const subMenu = screen.getByText("Niall");
    expect(subMenu).toBeInTheDocument();
    fireEvent.click(subMenu);
    expect(consoleMock).toHaveBeenCalledWith("Niall was pressed");
    //  fireEvent.contextMenu(row);
  });

  test("disabled menu onclick ", () => {
    const fireEventSpy = jest.fn();
    render(<LaiDataGrid onClick={fireEventSpy} />);
    const row = screen.getByText("product3");
    expect(row).toBeInTheDocument();
    fireEvent.contextMenu(row);
    const disabledMenuItem = screen.getByText("Always Disabled");
    expect(disabledMenuItem).toBeInTheDocument();
    fireEvent.click(disabledMenuItem);
    expect(fireEventSpy).toBeCalledTimes(0);
  });
});
