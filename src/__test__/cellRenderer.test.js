import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataGrid from "../components/datagrid/DataGrid";
import React, { useState } from "react";

function rowKeyGetter(row) {
  return row.personalnumber;
}

const columns = [
  {
    field: "name",
    headerName: "Name",
    cellRenderer(props){
        return <input  data-testid="name" type="text" value={props.value} onChange={(e)=> props.setValue(e.target.value)} />
    }
  },
  {
    field: "number",
    headerName: "Number",
    haveChildren: true,
    children: [
      { field: "homenumber", headerName: "Home Numer"},
      {
        field: "personalnumber",
        headerName: "Personal Number",
        cellRenderer(props){
            return <input  data-testid="personalnumber" type="text" onChange={(e)=> props.setValue(e.target.value)} value={props.value} />
        }
    
      },
    ],
  },
  { field: "address", headerName: "Address"},
  { field: "school", headerName: "School"},
  { field: "class", headerName: "Class"},
];
const initialRows = [
  {
    name: "John",
    lastname: "Doe",
    homenumber: "9987654336",
    personalnumber: "4545454534",
    address: "WhiteField",
    school: "DAV",
    class: "10th",
  },
  {
    name: "Suvendu",
    lastname: "Sahoo",
    homenumber: "8976543234",
    personalnumber: "8765789045",
    address: "Kodihali",
    school: "DPS",
    class: "7th",
  },
  {
    name: "Namit",
    lastname: "Singh",
    homenumber: "6765458907",
    personalnumber: "8769034156",
    address: "Marathahali",
    school: "DPS",
    class: "8th",
  },
  {
    name: "Pravalika",
    lastname: "Reddy",
    homenumber: "9098654567",
    personalnumber: "6578934123",
    address: "Indira Nagar",
    school: "DAV",
    class: "9th",
  },
];


function LaiDataGrid() {
  const [rows, setRows] = useState(initialRows);

  return (
    <DataGrid
      columnData={columns}
      testId={"laidatagrid"}
      rowData={rows}
      rowKeyGetter={rowKeyGetter}
      headerRowHeight={24}
      className="fill-grid"
      enableVirtualization={false}
    />
  );
}
describe('cellrenderer works properly', () => { 
    test('cellRenderer renders in every row for particular column', () => { 
        render(<LaiDataGrid/>)
        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument()

        const nameCellRendererCells = screen.queryAllByTestId("name");
        expect(nameCellRendererCells.length).toBe(initialRows.length);


     })
     test('cellRenderer renders in every row for particular multiline header column', () => { 
        render(<LaiDataGrid/>)
        const datagrid = screen.getByTestId("laidatagrid");
        expect(datagrid).toBeInTheDocument()

        const personalNumberCellRendererCells = screen.queryAllByTestId("personalnumber");
        expect(personalNumberCellRendererCells.length).toBe(initialRows.length);
      })
 })