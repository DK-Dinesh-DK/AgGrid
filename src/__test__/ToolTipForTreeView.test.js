import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
function createRows() {
  const rows = [];
  for (let i = 0; i < 10; i++) {
    const price = Math.random() * 30;
    const id = `row${i}`;
    var row;
    if (i < 1 || i == 3) {
      row = {
        id,
        name: `supplier ${i}`,
        format: `package-${i}`,
        position: "Run of site",
        price,
        children: [
          {
            id: `${id}-0`,
            parentId: id,
            name: `supplier ${id}-0`,
            format: "728x90",
            position: "run of site",
            price: price / 2,
          },
          {
            id: `${id}-1`,
            parentId: id,
            name: `supplier ${id}-1`,
            format: "480x600",
            position: "run of site",
            price: price * 0.25,
            children: [
              {
                id: `${id}-1-1`,
                parentId: id,
                name: `supplier ${id}-1-1`,
                format: "728x90",
                position: "run of site",
                price: price / 2,
                children: [
                  {
                    id: `${id}-1-1-0`,
                    parentId: id,
                    name: `supplier ${id}-1-1-0`,
                    format: "728x90",
                    position: "run of site",
                    price: price / 2,
                  },
                ],
              },
            ],
          },
          {
            id: `${id}-2`,
            parentId: id,
            name: `supplier${id}-2`,
            format: "328x70",
            position: "run of site",
            price: price * 0.25,
          },
        ],
      };
    } else {
      row = {
        id,
        name: `supplier-${i}`,
        format: `package ${i}`,
        position: "Run of site",
        price,
      };
    }
    rows.push(row);
  }
  return rows;
}
function LaiDataGridTree(props) {
  const rowDataTree = createRows();

  const columnTree = [
    {
      field: "id",
      headerName: "id",
      frozen: true,
    },
    {
      field: "name",
      headerName: "Name",
      width: 100,
    },
    {
      field: "format",
      headerName: "format",
    },
    {
      field: "position",
      headerName: "position",
    },
    {
      field: "price",
      headerName: "price",
      sortable: true,
    },
  ];

  return (
    <>
      <DataGrid
        columnData={columnTree}
        testId={"laidatagridTree"}
        rowData={rowDataTree}
        headerRowHeight={24}
        className="fill-grid"
        rowSelection={"multiple"}
        treeData={true}
        {...props}
      />
    </>
  );
}
function LaiDataGridTree1(props) {
  const rowDataTree = createRows();

  return (
    <>
      <DataGrid
        testId={"laidatagridTree"}
        rowData={rowDataTree}
        headerRowHeight={24}
        className="fill-grid"
        rowSelection={"multiple"}
        treeData={true}
        {...props}
      />
    </>
  );
}

describe("ToolTip test for Tree view Row", () => {
  test("Tree view Default Row", async () => {
    render(<LaiDataGridTree rowLevelToolTip={true} />);

    const screenArea = screen.getByTestId("laidatagridTree");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("supplier 0");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseOut(content);
    const content1 = screen.getByText("row1");
    expect(content1).toBeInTheDocument();
    fireEvent.mouseOver(content1);
    fireEvent.mouseMove(content1);
    fireEvent.mouseOut(content1);
  });
  test("Tree view  Dynamic Tooltip for Row ", async () => {
    render(
      <LaiDataGridTree
        rowLevelToolTip={(params) => `Tree Row ${params.rowIndex}`}
      />
    );

    const screenArea = screen.getByTestId("laidatagridTree");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("supplier 0");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseOut(content);
  });

  test("Tree view Default Row without id", async () => {
    function createRows() {
      const rows = [];
      for (let i = 0; i < 10; i++) {
        const price = Math.random() * 30;
        const id = `row${i}`;
        var row;
        if (i < 1 || i === 3) {
          row = {
            id,
            name: `supplier ${i}`,
            format: `package-${i}`,
            position: "Run of site",
            price,
            children: [
              {
                id: `${id}-0`,
                parentId: id,
                name: `supplier ${id}-0`,
                format: "728x90",
                position: "run of site",
                price: price / 2,
              },
              {
                id: `${id}-1`,
                parentId: id,
                name: `supplier ${id}-1`,
                format: "480x600",
                position: "run of site",
                price: price * 0.25,
                children: [
                  {
                    id: `${id}-1-1`,
                    parentId: id,
                    name: `supplier ${id}-1-1`,
                    format: "728x90",
                    position: "run of site",
                    price: price / 2,
                    children: [
                      {
                        id: `${id}-1-1-0`,
                        parentId: id,
                        name: `supplier ${id}-1-1-0`,
                        format: "728x90",
                        position: "run of site",
                        price: price / 2,
                      },
                    ],
                  },
                ],
              },
              {
                id: `${id}-2`,
                parentId: id,
                name: `supplier${id}-2`,
                format: "328x70",
                position: "run of site",
                price: price * 0.25,
              },
            ],
          };
        } else {
          row = {
            id,
            name: `supplier-${i}`,
            format: `package ${i}`,
            position: "Run of site",
            price,
          };
        }
        rows.push(row);
      }
      return rows;
    }
    const rowDataTree = createRows();
    render(<LaiDataGridTree rowLevelToolTip={true} rowData={rowDataTree} />);

    const screenArea = screen.getByTestId("laidatagridTree");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("supplier 0");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseOut(content);
  });
  test("Tree view Default Cell", async () => {
    const columns = [
      {
        field: "id",
        headerName: "id",
        frozen: true,
      },
      {
        field: "name",
        headerName: "Name",
        width: 100,
        toolTip: true,
      },
      {
        field: "format",
        headerName: "format",
      },
      {
        field: "position",
        headerName: "position",
      },
      {
        field: "price",
        headerName: "price",
        sortable: true,
      },
    ];
    render(<LaiDataGridTree1 columnData={columns} />);

    const screenArea = screen.getByTestId("laidatagridTree");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("supplier 0");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
  });
  test("Tree view Default Dynamic", async () => {
    const columns = [
      {
        field: "id",
        headerName: "id",
        frozen: true,
      },
      {
        field: "name",
        headerName: "Name",
        width: 100,
        toolTip: (params) => `Name Column${params.rowIndex}`,
      },
      {
        field: "format",
        headerName: "format",
      },
      {
        field: "position",
        headerName: "position",
      },
      {
        field: "price",
        headerName: "price",
        sortable: true,
      },
    ];
    render(<LaiDataGridTree1 columnData={columns} />);

    const screenArea = screen.getByTestId("laidatagridTree");
    expect(screenArea).toBeInTheDocument();
    const content = screen.getByText("supplier 0");
    expect(content).toBeInTheDocument();
    fireEvent.mouseOver(content);
    fireEvent.mouseMove(content);
    fireEvent.mouseOut(content);
  });
});
