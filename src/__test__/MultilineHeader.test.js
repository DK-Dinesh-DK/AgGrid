import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useRef } from "react";
import { TextEditor } from "../components/datagrid/editors";

function LaiDataGrid(props) {
  function createRows() {
    const rows = [];

    for (let i = 0; i < 50; i++) {
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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      sortable: true,
      frozen: true,
      alignment: true,
      cellEditor: TextEditor,
    },
    {
      field: "rdrd",
      headerName: "AASS",
      frozen: true,
      width: 60,
      cellRenderer: TextEditor,
    },

    {
      field: "title",
      cellEditor: TextEditor,
      frozen: true,
      width: 300,
      children: [
        {
          field: "title1",
          headerName: "Title1",
          filter: true,
          sortable: true,
          alignment: true,
        },
        { field: "title2", headerName: "Title2" },
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
                  cellRenderer: TextEditor,
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
                          width: 100,
                          children: [
                            {
                              field: "eeee1",
                              headerName: "EEEE1",
                              alignment: { align: "end" },
                              editable: true,
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
    const qqcell = screen.getByRole("gridcell", { name: "qq0" });
    expect(qqcell).toBeInTheDocument();
    fireEvent.click(qqcell);
    fireEvent.doubleClick(qqcell);
  });
});
