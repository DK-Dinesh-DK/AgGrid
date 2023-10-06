import { useCallback, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import DataGrid from "../components/datagrid/DataGrid";

import { Button } from "react-bootstrap";

function createRows() {
  const rows = [];

  for (let i = 1; i < 1000; i++) {
    rows.push({
      id: i,
      product: faker.commerce.productName(),
      price: faker.commerce.price(),
    });
  }

  return rows;
}

const columns = [
  { field: "id", headerName: "ID" },
  { field: "product", headerName: "Product" },
  { field: "price", headerName: "Price" },
];

function rowKeyGetter(row) {
  return row.id;
}

export default function ContextMenuDemo({ direction }) {
  const getContextMenuItems = [
    {
      // custom item
      name: "Alert ",
      action: () => {
        window.alert("Alerting about ");
      },
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
          name: "John",
          action: () => {
            console.log("John was pressed");
          },
        },

        {
          name: "Kev",
          action: () => {
            console.log("Kev was pressed");
          },
        },
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
      style: { backgroundColor: "red", color: "white" },
    },
    {
      name: "Print",
      action: (e) => {
        console.log("e", e);
        // e.handlePrint();
        setPrintTable(true);
      },
    },
    {
      // custom item
      name: "Always Disabled",
      disabled: true,
      tooltip:
        "Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!",
    },
    {
      name: "Country",
      divider: true,
    },
    {
      name: "Person",
      icon: () => (
        <img src="https://www.ag-grid.com/example-assets/skills/windows.png" />
      ),
    },
    {
      // custom item
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
      // custom item
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
      // custom item
      name: "Checked",
      checked: true,
      shortcut: "Alt+f",
      action: (props) => {
        console.log("Checked Selected", props);
      },
      subMenu: [
        {
          name: "Alberto",
          action: () => {
            console.log("Alberto was pressed");
          },
        },
        {
          name: "Tony",
          action: () => {
            console.log("Tony was pressed");
          },
        },
        {
          name: "Andrew",
          action: () => {
            console.log("Andrew was pressed");
          },
        },
      ],
      icon: () => (
        <img src="https://www.ag-grid.com/example-assets/skills/mac.png" />
      ),
    },
  ];
  const getContextMenuItems1 = [
    {
      // custom item
      name: "NAme ",
      action: () => {
        window.alert("Alerting about ");
      },
      cssClasses: ["redFont", "bold"],
    },
    {
      name: "Print",
      action: (e) => {
        console.log("e", e);
        // e.handlePrint();
        setPrintTable(true);
      },
    },
    {
      // custom item
      name: "New Name",
      disabled: true,
      tooltip:
        "Very long tooltip, did I mention that I am very long, well I am! Long!  Very Long!",
    },
    {
      name: "Country",
      divider: true,
    },
    {
      // custom item
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
      // custom item
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
      // custom item
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

  const rowData = createRows();
  const [printTable, setPrintTable] = useState(false);

  return (
    <>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columnData={columns}
        rowData={rowData}
        id={"First-Table"}
        className="fill-grid"
        direction={direction}
        onCellClicked={(props) => console.log("Props", props)}
        getContextMenuItems={getContextMenuItems}
      />
      <div style={{ minHeight: "100px" }}></div>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columnData={columns}
        rowData={rowData}
        id={"Second-Table"}
        className="fill-grid"
        direction={direction}
        getContextMenuItems={getContextMenuItems1}
      />
    </>
  );
}
