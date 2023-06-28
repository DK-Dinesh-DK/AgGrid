import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState, useCallback } from "react";
import PrintComponent from "../components/datagrid/PrintComponent";
const columns = [
  { field: "id", headerName: "ID" },
  { field: "product", headerName: "Product" },
  { field: "price", headerName: "Price" },
];

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 1; i < 100; i++) {
      rows.push({
        id: i,
        product: `product${i}`,
        price: `price${i}`,
      });
    }

    return rows;
  }
  const [printTable, setPrintTable] = useState(false);
  const rowData = createRows();
  const getContextMenuItems = useCallback(() => {
    let result = [
      {
        name: "Alert ",
        action: () => {
          window.alert("Alerting about");
        },
        cssClasses: ["redFont", "bold"],
      },
      {
        name: "Print",
        tooltip: "Print the Document",
        action: (e) => {
          console.log("e", e);
          // e.handlePrint();
          setPrintTable(true);
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
    return result;
  }, []);
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        selection={true}
        getContextMenuItems={getContextMenuItems}
      />
      {printTable && (
        <PrintComponent
          rowData={rowData.slice(0, props.perPage)}
          columnData={columns}
          onClose={() => setPrintTable(false)}
          formName={"Product Details"}
          personName={"David"}
          rowsPerPage={32}
          userDetail={
            <div>
              <div>Time: User Name:</div>
            </div>
          }
          logo={
            "https://www.logodesign.net/logo/line-art-house-roof-and-buildings-4485ld.png"
          }
        />
      )}
    </>
  );
}

describe("Datagrid Unit test for contextmenu", () => {
  test("context menu and menu click ", async () => {
    const alertMock = jest.spyOn(window, "alert");
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    fireEvent.contextMenu(screenArea);
    const alertArea = screen.getByText("Alert");
    expect(alertArea).toBeInTheDocument();
    fireEvent.click(alertArea);
    expect(alertMock).toHaveBeenCalledWith("Alerting about");
  });

  test("sub contextmenu ", async () => {
    const consoleMock = jest.spyOn(console, "log");

    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    fireEvent.contextMenu(screenArea);
    const personMenu = screen.getByText("Person");
    expect(personMenu).toBeInTheDocument();
    fireEvent.mouseEnter(personMenu);
    const subMenu = screen.getByText("Niall");
    expect(subMenu).toBeInTheDocument();
    fireEvent.click(subMenu);
    expect(consoleMock).toHaveBeenCalledWith("Niall was pressed");
  });

  test("disabled menu onclick ", () => {
    const fireEventSpy = jest.fn();
    render(<LaiDataGrid onClick={fireEventSpy} />);

    const screenArea = screen.getByTestId("laidatagrid");
    // Open the context menu
    fireEvent.contextMenu(screenArea);

    // Find the disabled menu item
    const disabledMenuItem = screen.getByText("Always Disabled");

    // Assert that the disabled menu item is present
    expect(disabledMenuItem).toBeInTheDocument();

    // Click on the disabled menu item
    fireEvent.click(disabledMenuItem);
    expect(fireEventSpy).toBeCalledTimes(0);
  });
  test("print window check", () => {
    const printSpy = jest.spyOn(window, "open");
    render(<LaiDataGrid perPage={100} />);

    const screenArea = screen.getByTestId("laidatagrid");
    // Open the context menu
    fireEvent.contextMenu(screenArea);

    // Find the disabled menu item
    const printMenuItem = screen.getByText("Print");

    // Assert that the disabled menu item is present
    expect(printMenuItem).toBeInTheDocument();

    // Click on the disabled menu item
    fireEvent.click(printMenuItem);
    const printIcon = screen.getByTestId("print-svg");
    expect(printIcon).toBeInTheDocument();
    fireEvent.click(printIcon);

    // expect(printSpy).toHaveBeenCalledTimes(1);
  });
  test("print window check", () => {
    const printSpy = jest.spyOn(window, "open");
    render(<LaiDataGrid perPage={70} />);

    const screenArea = screen.getByTestId("laidatagrid");
    // Open the context menu
    fireEvent.contextMenu(screenArea);

    // Find the disabled menu item
    const printMenuItem = screen.getByText("Print");

    // Assert that the disabled menu item is present
    expect(printMenuItem).toBeInTheDocument();

    // Click on the disabled menu item
    fireEvent.click(printMenuItem);
    const printIcon = screen.getByTestId("print-svg");
    expect(printIcon).toBeInTheDocument();
    fireEvent.click(printIcon);

    // expect(printSpy).toHaveBeenCalledTimes(1);
  });
  test("print window check", () => {
    render(<LaiDataGrid perPage={70} />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridCell = screen.getByRole("gridcell", { name: "product1" });
    expect(gridCell).toBeInTheDocument();
    fireEvent.contextMenu(gridCell);
  });
});
