// import { createContext, useMemo, useState } from "react";

// import DataGrid from "../components/datagrid/DataGrid";

// import { SerialNumberColumn } from "../components/datagrid/Columns";

// function EmptyRowsRenderer() {
//   return (
//     <div style={{ textAlign: "center", gridColumn: "1/-1" }}>
//       Nothing to show
//       <span lang="ja" title="ショボーン">
//         (´・ω・`)
//       </span>
//     </div>
//   );
// }


// const FilterContext = createContext(undefined);

// function rowKeyGetter(row) {
//   return row.id;
// }

// export default function NoRows({ direction }) {

//   const [uploadfiles, setuploadFiles] = useState([]);
//   const [file, setFile] = useState([])
// console.log('uploadfiles', uploadfiles)
//   const handleDelete = (key) => {
//     console.log('uploadfiles', uploadfiles)
//     console.log('file', file)
//     uploadfiles.splice(key.rowIndex, 1);
//     file.splice(key.rowIndex, 1);
//     setuploadFiles([...uploadfiles]);
//     setFile([...file]);
//     console.log("delelte ", file);
//     console.log('key', key)
//   };
//   const frameworkComponents = {
//     CheckBox: (props) => (
//       <button style={{ width: "100%" }} onClick={()=>{
//         return handleDelete(props);
//       }}>
//         Delete
//       </button>
//     ),
//   };


//   const [selectedRows, onSelectedRowsChange] = useState(() => new Set());
//   const [filters, setFilters] = useState({
//     title: "",
//     count: "",
//     enabled: true,
//   });

//   const columns = useMemo(() => {
//     return [
//       SerialNumberColumn,
//       {
//         field: "id",
//         headerName: "ID",
//         width: 50,
//         haveChildren: false,
//         topHeader: "id",
//         cellWidth: 60,
//         frozen: true,
//       },
//       {
//         field: "rdrd",
//         headerName: "AASS",
//         haveChildren: false,
//         topHeader: "rdrd",
//         cellWidth: 60,
//         cellRenderer: "CheckBox",
//       },

//       {
//         field: "title",
//         headerName: "Title",
//         haveChildren: true,
//         // frozen: true,

//         children: [
//           // SelectColumn,
//           {
//             field: "aaaa",
//             headerName: "AAAA",

//             haveChildren: true,
//             children: [
//               {
//                 field: "vvvv",
//                 headerName: "VVVV",
//                 haveChildren: false,
//                 cellWidth: 100,
//                 topHeader: "title",
//               },

//               {
//                 field: "rrrr",
//                 headerName: "RRRR",
//                 haveChildren: false,
//                 cellWidth: 100,
//                 topHeader: "title",
//               },
//               {
//                 field: "uuuu",
//                 headerName: "UUUU",
//                 haveChildren: false,
//                 cellWidth: 100,
//                 topHeader: "title",
//               },
//             ],
//           },
//           {
//             field: "bbbb",
//             headerName: "BBBB",
//             haveChildren: true,
//             children: [
//               {
//                 field: "wsdc",
//                 headerName: "HGTF",
//                 haveChildren: false,
//                 cellWidth: 100,
//                 topHeader: "title",
//               },
//               {
//                 field: "yugd",
//                 headerName: "HGFBGV",
//                 haveChildren: false,
//                 cellWidth: 100,
//                 topHeader: "title",
//               },
//             ],
//           },
//           {
//             field: "cccc",
//             headerName: "CCCC",
//             cellWidth: 100,
//             haveChildren: true,
//             children: [
//               {
//                 field: "yugd",
//                 headerName: "HGFBGV",
//                 haveChildren: false,
//                 cellWidth: 100,
//                 topHeader: "title",
//               },
//               {
//                 field: "yugd",
//                 headerName: "HGFBGV",
//                 haveChildren: true,
//                 topHeader: "title",
//                 cellWidth: 100,
//                 children: [
//                   {
//                     field: "cvdcv",
//                     headerName: "FGHT",
//                     haveChildren: false,
//                     topHeader: "title",
//                     cellWidth: 60,
//                   },
//                   {
//                     field: "cvacv",
//                     headerName: "FGHT",
//                     haveChildren: false,
//                     topHeader: "title",
//                     cellWidth: 60,
//                   },
//                 ],
//               },
//             ],
//           },
//         ],
//       },
//       {
//         field: "cvcv",
//         headerName: "FGHT",
//         haveChildren: false,
//         topHeader: "cvcv",
//         cellWidth: 60,
//       },
//       {
//         field: "erer",
//         headerName: "FGHT",
//         haveChildren: false,
//         topHeader: "erer",
//         cellWidth: 60,
//       },
//       {
//         field: "count",
//         headerName: "Count",
//         haveChildren: true,
//         children: [
//           // SelectColumn,
//           {
//             field: "nnnn",
//             headerName: "NNNN",
//             haveChildren: true,
//             children: [
//               {
//                 field: "xxxx",
//                 headerName: "XXXX",
//                 haveChildren: false,
//                 cellWidth: 100,
//                 topHeader: "count",
//               },
//               {
//                 field: "jjjj",
//                 headerName: "JJJJ",
//                 haveChildren: true,
//                 children: [
//                   {
//                     field: "ffff",
//                     headerName: "FFFF",
//                     haveChildren: false,
//                     cellWidth: 100,
//                     topHeader: "count",
//                   },
//                   {
//                     field: "vvvv",
//                     headerName: "VVVV",
//                     haveChildren: true,
//                     children: [
//                       {
//                         field: "llll",
//                         headerName: "LLLL",
//                         haveChildren: false,
//                         cellWidth: 100,
//                         topHeader: "count",
//                       },
//                       {
//                         field: "pppp",
//                         headerName: "PPPP",
//                         haveChildren: true,
//                         children: [
//                           {
//                             field: "eeee",
//                             headerName: "EEEE",
//                             haveChildren: false,
//                             cellWidth: 100,
//                             topHeader: "count",
//                           },
//                           {
//                             field: "pppp",
//                             headerName: "PPPP",
//                             haveChildren: true,
//                             cellWidth: 100,
//                             topHeader: "count",
//                             children: [
//                               {
//                                 field: "eeee",
//                                 headerName: "EEEE",
//                                 haveChildren: false,
//                                 cellWidth: 100,
//                                 topHeader: "count",
//                               },
//                               {
//                                 field: "pppp",
//                                 headerName: "PPPP",
//                                 haveChildren: false,
//                                 cellWidth: 100,
//                                 topHeader: "count",
//                               },
//                             ],
//                           },
//                         ],
//                       },
//                     ],
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             field: "oooo",
//             headerName: "OOOO",
//             cellWidth: 100,
//             haveChildren: false,
//             topHeader: "count",
//           },
//           {
//             field: "qqqq",
//             headerName: "QQQQ",
//             cellWidth: 100,
//             haveChildren: false,
//             topHeader: "count",
//           },
//         ],
//       },
//     ];
//   }, []);

//   const rows = [
//     {
//       id: 3,
//       oooo: "JGRF",
//       aaaa: "wsws",
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 4,
//       vvvv: "assdd",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 5,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 6,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrr: "wrerer",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 7,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 8,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 9,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 10,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 11,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 12,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 13,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 14,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 15,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       ccrcc: "dfhhgh",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 16,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 17,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 18,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 19,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 20,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 21,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 22,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 23,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 24,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 25,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 26,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 27,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 28,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 29,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 30,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 31,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 32,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 33,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 34,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 35,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//     {
//       id: 36,
//       vvvv: "Ssss",
//       nnnn: "gege",
//       qqqq: "kjkj",
//       llll: "llll",
//       rrrrr: "thgf",
//       uuuu: "iugy",
//       bbbb: "vfvf",
//       cccc: "sdsd",
//       xxxx: "sdsa",
//       ffff: "aqaq",
//       eeee: "tyty",
//       pppp: "frfr",
//     },
//   ];

//   return (
//     <FilterContext.Provider value={filters}>
//       <DataGrid
//         columnData={columns}
//         rowData={rows}
//         renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
//         selectedRows={selectedRows}
//         onSelectedRowsChange={onSelectedRowsChange}
//         frameworkComponents={frameworkComponents}
//         headerRowHeight={24}
//         rowKeyGetter={rowKeyGetter}
//         className="fill-grid"
//         // direction={direction}
//       />
//     </FilterContext.Provider>
//   );
// }
