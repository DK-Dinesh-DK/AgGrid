import DataGrid from "../components/datagrid/DataGrid";

const columns = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "title",
    headerName: "Title",
  },
  {
    field: "firstName",
    headerName: "First Name",
  },
  {
    field: "lastName",
    headerName: "Last Name",
  },
  {
    field: "email",
    headerName: "Email",
  },
];

export default function ExportFile({ direction }) {
  return (
    <>
      <DataGrid columnData={columns} rowData={[]} importExcel={true} />
    </>
  );
}
