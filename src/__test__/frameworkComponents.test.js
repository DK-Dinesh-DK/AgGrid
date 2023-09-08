import { render, screen } from "@testing-library/react";
import DataGrid from "../components/datagrid/DataGrid";
const frameworkComponents = {
  checkbox: (props) => {
    return <input type={"checkbox"} name={props.data.id} data-testid="check" />;
  },
  btn: () => <button data-testid="btn" />,
};

function createRows() {
  const rows = [];

  for (let i = 1; i < 10; i++) {
    rows.push({
      id: i,
    });
  }

  return rows;
}

const columns = [
  {
    field: "Custom",
    width: 45,
    cellRenderer: "checkbox",
  },
  {
    field: "id",
    headerName: "ID",
    width: 80,
    rowDrag: true,
    cellRenderer: "btn",
  },
];

const rows = createRows();
describe("framework components render correctly", () => {
  test("Page has framework checkbox components in all rows", () => {
    render(
      <DataGrid
        columnData={columns}
        rowData={rows}
        frameworkComponents={frameworkComponents}
        enableVirtualization={false}
      />
    );
    const checkboxFrameworkComponents = screen.queryAllByTestId("check");
    expect(checkboxFrameworkComponents.length).toBe(rows.length);
  });
  test("Page has framework button components in all rows", () => {
    render(
      <DataGrid
        columnData={columns}
        rowData={rows}
        frameworkComponents={frameworkComponents}
        enableVirtualization={false}
      />
    );
    const buttonFrameworkComponents = screen.queryAllByTestId("btn");
    expect(buttonFrameworkComponents.length).toBe(rows.length);
  });
});
