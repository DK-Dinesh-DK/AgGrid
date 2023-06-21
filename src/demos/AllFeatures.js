import { useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
import moment from "moment";
import {
  DateEditor,
  DropDownEditor,
  ImageViewer,
  TextEditor,
  CheckBoxEditor,
  ColorPicker,
  ButtonEditor,
  ProgressBarEditor,
  TimeEditor,
  RadioButtonEditor,
  DateTimeEditor,
  SliderEditor,
  LinkEditor,
} from "../components/datagrid/editors";

import DataGrid from "../components/datagrid/DataGrid";
import { random } from "lodash";

const highlightClassname = css`
  .rdg-cell {
    background-color: #9370db;
    color: white;
  }

  &:hover .rdg-cell {
    background-color: #800080;
  }
`;

function rowKeyGetter(row) {
  return row.id;
}

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    resizable: true,
    editable: true,
  },
  {
    field: "title",
    headerName: "Title",
    sortable: true,
    width: 200,
    resizable: true,
    valueFormatter(props) {
      return <>{props.row.title}</>;
    },
    options: [
      { label: "task1", value: "task1" },
      { label: "task2", value: "task2" },
    ],
    cellRenderer: DropDownEditor,
    editorOptions: {
      editOnClick: true,
    },
  },
  {
    field: "firstName",
    filter: true,
    headerName: "First Name",
    cellEditor: TextEditor,
    cellStyle: (props) => {
      return { backgroundColor: "blue", color: "White" };
    },
    width: 200,
    resizable: true,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 200,
    cellStyle: { backgroundColor: "blue", color: "White" },
    cellRenderer: TextEditor,
    resizable: true,
  },
  {
    field: "gender",
    headerName: "Gender",
    cellRenderer: RadioButtonEditor,
    width: 200,
    options: [
      { label: "Male", value: "male" },
      { label: "FeMale", value: "female" },
      { label: "Others", value: "others" },
    ],
  },
  {
    field: "datetime",
    headerName: "Birth Date and Time",
    cellRenderer: DateTimeEditor,
  },
  {
    field: "avatar",
    headerName: "Photo",
    cellRenderer: ImageViewer,
  },
  {
    headerName: "Money",
    field: "money",
    cellEditor: TextEditor,
    filter: true,
    sortable: true,
    width: 100,
  },

  {
    field: "zipCode",
    headerName: "ZipCode",
    width: 200,
    resizable: true,
    cellRenderer: TextEditor,
  },
  {
    field: "date",
    headerName: "Date",
    width: 200,
    editable: true,
    cellEditor: DateEditor,
  },
  {
    field: "datee",
    headerName: "Date-Without",
    width: 150,
    cellRenderer: DateEditor,
  },

  {
    field: "time",
    headerName: "Time",
    cellRenderer: TimeEditor,
  },
  {
    headerName: "New Time",
    editable: true,
    cellRenderer: TimeEditor,
  },
  {
    field: "valid",
    headerName: "Vaild",
    cellRenderer: CheckBoxEditor,
  },
  {
    field: "favcolor",
    headerName: "Favourite Color",
    cellRenderer: ColorPicker,
  },
  {
    field: "favcolour",
    headerName: "Favourite Colour",
    cellRenderer: ColorPicker,
  },
  {
    field: "progress",
    headerName: "Progress Level",
    cellRenderer: ProgressBarEditor,
  },
  {
    field: "range",
    headerName: "Range",
    width: 150,
    cellRenderer: SliderEditor,
  },
  {
    field: "save",
    headerName: "Save",
    cellRenderer: ButtonEditor,
    onClick: (params) => {
      console.log(params);
    },
  },
  {
    field: "delete",
    headerName: "Delete",
    cellRenderer: ButtonEditor,
    inputProps: { text: "ItemDelete" },
    editable: true,
  },
  {
    field: "link",
    headerName: "Link",
    cellRenderer: LinkEditor,
  },
];

function createRows() {
  const rows = [];

  for (let i = 0; i < 10; i++) {
    rows.push({
      id: `id_${i}`,
      avatar: faker.image.avatar(),
      title: faker.name.prefix(),
      firstName: faker.name.firstName(),
      lastName: `lastName${i}`,
      zipCode: faker.address.zipCode(),
      date: moment(new Date()).add(i, "day").format("DD-MM-YYYY"),
      sentence: faker.lorem.sentence(),
      money: `₹${100 + i}`,
      valid: i % 2 === true,
      favcolor: faker.color.rgb(),
      deletebtn: "Delete",
      range: Math.floor(Math.random() * 100 + 1),
      time: moment(new Date()).format("hh:mm"),
    });
  }

  return rows;
}

export default function AllFeatures({ direction }) {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  const selectedCellHeaderStyle = {
    backgroundColor: "red",
    fontSize: "12px",
  };
  const selectedCellRowStyle = {
    backgroundColor: "yellow",
  };
  function handlePaste({
    sourceColumnKey,
    sourceRow,
    targetColumnKey,
    targetRow,
  }) {
    const incompatibleColumns = ["email", "zipCode", "date"];
    if (
      sourceColumnKey === "avatar" ||
      ["id", "avatar"].includes(targetColumnKey) ||
      ((incompatibleColumns.includes(targetColumnKey) ||
        incompatibleColumns.includes(sourceColumnKey)) &&
        sourceColumnKey !== targetColumnKey)
    ) {
      return targetRow;
    }

    return { ...targetRow, [targetColumnKey]: sourceRow[sourceColumnKey] };
  }

  function handleCopy({ sourceRow, sourceColumnKey }) {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(sourceRow[sourceColumnKey]);
    }
  }

  return (
    <DataGrid
      columnData={columns}
      rowData={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      onFill={true}
      onCopy={handleCopy}
      onPaste={handlePaste}
      // sortColumns={sortColumns}
      // onSortColumnsChange={setSortColumns}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      // rowHeight={30}
      headerRowHeight={24}
      selectedCellHeaderStyle={selectedCellHeaderStyle}
      selectedCellRowStyle={selectedCellRowStyle}
      className="fill-grid"
      rowClass={(row) =>
        row.id.includes("7") ? highlightClassname : undefined
      }
      direction={direction}
      restriction={{
        copy: true,
        paste: true,
      }}
    />
  );
}
