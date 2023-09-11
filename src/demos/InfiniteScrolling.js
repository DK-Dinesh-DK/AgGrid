import { useRef, useState } from "react";
import { css } from "@linaria/core";
import { faker } from "@faker-js/faker";
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
import moment from "moment";
const loadMoreRowsClassname = css`
  inline-size: 180px;
  padding-block: 8px;
  padding-inline: 16px;
  position: absolute;
  inset-block-end: 8px;
  inset-inline-end: 8px;
  color: white;
  line-height: 35px;
  background: rgb(0 0 0 / 0.6);
`;

function rowKeyGetter(row) {
  return row.id;
}

// const columns = [
//   {
//     field: "id",
//     headerName: "ID",
//     width: 80,
//     cellRenderer: (props) => {
//       return TextEditor(props);
//     },
//   },
//   {
//     field: "title",
//     headerName: "Title",
//     editable: true,
//     filter: true,
//   },
//   {
//     field: "firstName",
//     headerName: "First Name",
//     filter: true,
//     cellRenderer: (props) => {
//       return TextEditor(props);
//     },
//   },
//   {
//     field: "lastName",
//     headerName: "Last Name",
//     valueGetter: ({ row, column }) => `Last Name: ${row[column.key]}`,
//   },
//   {
//     field: "email",
//     headerName: "Email",
//     // valueFormatter: ({ row, column }) => `Email: ${row[column.key]}`,
//   },
// ];

function createFakeRowObjectData(index) {
  return {
    id: `id_${index}`,
    title: faker.name.prefix(),
    firstName: faker.name.firstName(),
    lastName: faker.name.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  };
}

function createRows(numberOfRows) {
  const rows = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows[i] = createFakeRowObjectData(i);
  }

  return rows;
}

function isAtBottom({ currentTarget }) {
  return (
    currentTarget.scrollTop + 10 >=
    currentTarget.scrollHeight - currentTarget.clientHeight
  );
}

function loadMoreRows(newRowsCount, length) {
  return new Promise((resolve) => {
    const newRows = [];

    for (let i = 0; i < newRowsCount; i++) {
      newRows[i] = createFakeRowObjectData(i + length);
    }

    setTimeout(() => resolve(newRows), 1000);
  });
}

export default function InfiniteScrolling({ direction }) {
  const [rows, setRows] = useState(() => createRows(100));
  const [isLoading, setIsLoading] = useState(false);

  async function handleScroll(event) {
    if (isLoading || !isAtBottom(event)) return;

    setIsLoading(true);

    const newRows = await loadMoreRows(50, rows.length);

    setRows([...rows, ...newRows]);
    setIsLoading(false);
  }
  const dataGridRef = useRef(null);
  // const [selectedRows, setSelectedRows] = useState([]);
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
  const rowData = createRows();
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      resizable: true,

      cellRenderer: (params) => {
        console.log(params.getValue());

        return TextEditor(params);
      },
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
      cellRenderer: TextEditor,
    },
    {
      field: "password",
      headerName: "Password",
      width: 200,
      cellStyle: { backgroundColor: "blue", color: "White" },
      cellRenderer: TextEditor,
      type: "mask",
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
      field: "gend",
      headerName: "GenderButton",
      cellRenderer: RadioButtonEditor,
      width: 200,
      buttons: [
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
  const [cellValue, setCellValue] = useState(null);
  return (
    <div className="App">
      <div className="sidebar"></div>
      <div className="right">
        <div className="header" />
        <div className="conent">
          <div className="submenu" />
          <div className="main">
            <div className="top"></div>
            <div className="middle">
              <DataGrid columnData={columns} rowData={rows} className="fill-grid" />
            </div>
            <div className="bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
