import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef } from "react";
import { TextEditor } from "../components/datagrid/editors";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 10; i++) {
      rows.push({
        id: `${i}`,

        erer: `email${i}`,
        title1: `title-1-${i}`,
        title2: `title-2-${i}`,
        ffff: `firstName${i}`,
        cvcv: `lastName${i}`,
        qqqq: `qq${i}`,
        oooo: `zipCode${i}`,
        xxxx: `xxx${i}`,
        eeee1: `name${i}`,
        rdrd: `words${i}`,
        pppp2: `sentence${i}`,
      });
    }

    return rows;
  }
  const rowData = createRows();
  const summaryRowsTop = [
    {
      id: "id",
      erer: `email`,
      title1: `title-1-`,
      title2: `title-2-`,
      ffff: `firstName}`,
      cvcv: `lastName`,
    },
  ];
  const summaryRowsBottom = [
    {
      id: "id-bottom",
      erer: `email-bottom`,
      title1: `title-1-bottom`,
      title2: `title-2-bottom`,
      ffff: `firstName-bottom`,
      cvcv: `lastName-bottom`,
    },
  ];
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      sortable: true,
      frozen: true,
      alignment: true,
      cellEditor: TextEditor,
      summaryFormatter(props) {
        return props.row.id;
      },
      colSpan: (props) => {
        if (props.type === "SUMMARY" && props.rowIndex === 0) {
          return 2;
        }
      },
    },
    {
      field: "rdrd",
      headerName: "AASS",
      resizable: true,
      frozen: true,
      width: 60,
      cellRenderer: TextEditor,
    },

    {
      headerName: "Title",
      frozen: true,
      haveChildren: true,
      children: [
        {
          field: "title1",
          headerName: "Title1",
          filter: true,
          sortable: true,
          alignment: true,
          cellRenderer: (params) => {
            return TextEditor(params);
          },
          width: 150,
        },
        { field: "title2", headerName: "Title2", width: 150 },
      ],
    },
    {
      field: "cvcv",
      headerName: "FGHT",
      frozen: true,
      filter: true,
      cellEditor: TextEditor,
      width: 80,
    },
    {
      field: "erer",
      headerName: "FGHT",
      sortable: true,
      filter: true,
      width: 80,
      frozen: true,
      alignment: true,
    },
    {
      field: "count",
      headerName: "Count",
      haveChildren: true,
      children: [
        {
          field: "nnnn",
          headerName: "NNNN",
          haveChildren: true,
          children: [
            {
              field: "xxxx",
              resizable: true,
              cellRenderer: TextEditor,
              width: 100,
              alignment: true,
            },
            {
              field: "jjjj",
              headerName: "JJJJ",
              haveChildren: true,
              children: [
                {
                  field: "ffff",
                  headerName: "FFFF",
                  width: 100,
                  alignment: true,
                  cellEditor: (params) => {
                    console.log(params.getValue());
                    TextEditor(params);
                  },
                },
                {
                  field: "qweasd",
                  headerName: "DFSDF",
                  width: 100,
                  alignment: true,
                  sortable: true,
                  cellRenderer: (params) => {
                    console.log(params.getValue());
                    TextEditor(params);
                  },
                },
                {
                  field: "vvvv1",
                  headerName: "VVVV1",
                  haveChildren: true,
                  children: [
                    {
                      field: "llll",
                      headerName: "LLLL",
                      width: 100,
                      alignment: true,
                      editable: true,
                    },
                    {
                      field: "pppp",
                      headerName: "PPPP",
                      haveChildren: true,
                      children: [
                        {
                          field: "eeee",
                          headerName: "EEEE",
                          resizable: true,
                          width: 100,
                          alignment: true,
                          validation: {
                            style: {
                              backgroundColor: "red",
                              color: "blue",
                            },
                            method: (value) => {
                              return typeof value !== "string";
                            },
                          },
                        },
                        {
                          field: "pppp1",
                          headerName: "PPPP1",
                          haveChildren: true,
                          children: [
                            {
                              field: "eeee1",
                              headerName: "EEEE1",
                              alignment: { align: "end" },
                              editable: true,
                              width: 100,
                              validation: {
                                style: {
                                  backgroundColor: "red",
                                  color: "blue",
                                },
                                method: (value) => {
                                  return typeof value === "string";
                                },
                              },
                              filter: true,
                            },
                            {
                              field: "pppp2",
                              headerName: "PPPP2",
                              sortable: true,
                              filter: true,
                              alignment: true,
                              width: 100,
                              validation: {
                                method: (value) => {
                                  return typeof value === "string";
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          field: "oooo",
          alignment: true,
          topHeader: "count",
          sortable: true,
          cellRenderer: TextEditor,
        },
        {
          field: "qqqq",
          headerName: "QQQQ",
          width: 100,
          sortable: true,
          filter: true,
          alignment: true,
        },
      ],
    },
  ];
  const gridRef = useRef(null);
  const selectedCellHeaderStyle = {
    backgroundColor: "red",
    fontSize: "12px",
  };
  const selectedCellRowStyle = {
    backgroundColor: "yellow",
  };
  return (
    <>
      <DataGrid
        columnData={columns}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        className="fill-grid"
        ref={gridRef}
        selectedCellHeaderStyle={selectedCellHeaderStyle}
        selectedCellRowStyle={selectedCellRowStyle}
        valueChangedCellstyle={{ backgroundColor: "red", color: "black" }}
        onCellClicked={() => console.log("Cell Clciked")}
        onCellDoubleClicked={() => console.log("Cell Double Clciked")}
        topSummaryRows={summaryRowsTop}
        bottomSummaryRows={summaryRowsBottom}
        {...props}
      />
    </>
  );
}

describe("Datagrid Unit test for MultiLine Header view", () => {
  test("Multiline header view", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridcell = screen.getByRole("gridcell", { name: "lastName0" });
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    fireEvent.doubleClick(gridcell);
    const sentence = screen.getByRole("gridcell", { name: "sentence0" });
    expect(sentence).toBeInTheDocument();
    fireEvent.click(sentence);
    fireEvent.doubleClick(sentence);
    const gridnamecell = screen.getByRole("gridcell", { name: "name0" });
    expect(gridnamecell).toBeInTheDocument();
    fireEvent.click(gridnamecell);
    fireEvent.doubleClick(gridnamecell);
    const inputEdit = screen.getByTestId("gird-text-editor-11-0");
    expect(inputEdit).toBeInTheDocument();
    fireEvent.change(inputEdit, { target: { value: "name000" } });
    fireEvent.click(gridnamecell);
    const qqcell = screen.getByRole("gridcell", { name: "qq0" });
    expect(qqcell).toBeInTheDocument();
    fireEvent.click(qqcell);
    fireEvent.doubleClick(qqcell);
  });

  test("value Formatter cell clcik and double clcik ", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridcell = screen.getByTestId("gird-text-editor-13-0");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    fireEvent.doubleClick(gridcell);
    fireEvent.contextMenu(gridcell);
  });
  test("Multiline sort  ", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridcell = screen.getByText("DFSDF");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    fireEvent.click(gridcell, {
      ctrlKey: true,
    });
    fireEvent.click(gridcell, {
      ctrlKey: true,
    });
  });
  test("Multiline sort  ", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridcell = screen.getByText("PPPP2");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
  });
  test("Multiline sort  ", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridcell = screen.getByTestId("filterIcon_EEEE1");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    fireEvent.click(gridcell);
    fireEvent.click(gridcell);
    const filterInput = screen.getByPlaceholderText("Search...");
    expect(filterInput).toBeInTheDocument();
    fireEvent.keyDown(filterInput, { key: "ArrowRight" });
  });
  test("Multiline sort  ", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const gridcell = screen.getByTestId("filterIcon_EEEE1");
    expect(gridcell).toBeInTheDocument();
    fireEvent.click(gridcell);
    fireEvent.mouseDown(document);
  });
  test("Multiline header doubleClcik ", async () => {
    render(<LaiDataGrid />);

    const screenArea = screen.getByTestId("laidatagrid");
    expect(screenArea).toBeInTheDocument();
    const headerCellEE = screen.getByText("EEEE");
    expect(headerCellEE).toBeInTheDocument();
    fireEvent.doubleClick(headerCellEE);
    const headerCell = screen.getByText("AASS");
    expect(headerCell).toBeInTheDocument();
    fireEvent.doubleClick(headerCell);
  });
});
