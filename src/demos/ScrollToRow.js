import { useRef, useState } from "react";
import DataGrid from "../components/datagrid/DataGrid";
import "../App.css";

import { TextEditor } from "../components/datagrid/editors";

export default function ScrollToRow({ direction }) {
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
        data-testid={"isExpandable"}
        onClick={() => {
          let nodes = gridlocalRef.current.api.getRenderedNodes();
          nodes[0].isExpandable();
        }}
      >
        isExpandable
      </button>
      <button
        data-testid={"setExpanded"}
        onClick={() => {
          let nodes = gridlocalRef.current.api.getRenderedNodes();
          //   nodes[3].setExpanded(expand);
          //   setExpand(!expand);
        }}
      >
        setExpanded
      </button>
      <DataGrid
        columnData={columns}
        innerRef={gridlocalRef}
        testId={"laidatagrid"}
        rowData={rowData}
        headerRowHeight={24}
        enableVirtualization={false}
        className="fill-grid"
        serialNumber={true}
        style={{
          fontColor: "#000",
          borderColor: "#D9E1E6",
          summaryBorderColor: "#555",
          backgroundColor: "#000000",
          headerBackgroundColor: "#97A4B1",
          headerRowColor: "#FFFFFF",
          hoverBackgroundColor: "#D7E3BC",
          hoverColor: "#000",
          selectedHoverBackgroundColor: "#7C94B6",
          checkboxColor: "#97A4B1",
          checkboxFocusColor: "#A9B7C6",
          disabledBorderColor: "#A9B7C6",
          disabledBackgroundColor: "#ddd",
          textEditorFontColor: "#000000",
          rowEvenBackgroundColor: "#EBF0F5",
          rowOddBackgroundColor: "#FFFF",
          selectedBackgroundColor: "#ebf1dd",
          fontFamily: "Segoe UI",
          headerFontSize: "12px",
          treeIconColor: "#FFFF",
          treeIconFontSize: "12px",
          masterIconColor: "#FFFF",
          masterIconFontSize: "12px",
          groupIconColor: "#FFFF",
          groupIconFontSize: "12px",
        }}
      />
    </>
  );
}
