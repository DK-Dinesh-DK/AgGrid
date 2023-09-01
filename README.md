# Introduction

DataGrid

# Getting Started

Import ag grid from the component library:

import {AgGrid} from “lai_webui”

# Necessary Props:

rowData and columnData are required props. Pass your defined rows and columns to Data grid as below:

Example rows and columns:
const columns = [
{field: “id”},
{field:” task”},
{field: “priority”}
];

const rows = [
{id: 1, task: “Task 1”, priority: “Low”},
{id: 2, task: “Task 2”, priority: “High”},
{id: 3, task: “Task 3”, priority: “Medium”},
{id: 4, task: “Task 4”, priority: “Low”},
]

Pass them to rowData and columnData like below:

<AgGrid rowData={rows} columnData={columns} />

# Props:

rowData: used to pass rows to Datagrid

columnData: used to pass columns to DataGrid

defaultColumnOptions: used to define default column options, it will apply all properties defined in it to all columns in the grid

columnReordering: used to enable reordering of columns

rowHeight : used to pass custom row height to the grid

headerRowHeight: used to pass custom header row height to the grid

summaryRowHeight: used to pass custom summary row height to the grid

direction: Used to set the direction in which to display the grid data direction={"ltr"} - to set direction left to right direction={"rtl"} - to set direction right to left. Grid default is ltr

className: Used to pass custom css className to the grid

rowClass: Used to pass custom css to to rows of the grid. (Will need to install and import css from linaria for using cell classnames)
Example:
const highlightClassname = css`
	
	.rdg-cell {
    	background-color: #9370db;
    	color: white;
  	}`;
rowClass={(row) =>
row.id.includes("7") ? highlightClassname : undefined
}

selectedCellHeaderStyle: To pass custom style object to header
Example:

    const selectedCellHeaderStyle = {
    	backgroundColor: "red",
    	fontSize: "12px",
    };

selectedCellRowStyle: To pass custom style object for selected row
Example:

    const selectedCellRowStyle = {
    	backgroundColor: "yellow",
    };

selectedRows: To pass selected rows array (required for multiple row selection using checkbox)

onSelectedRowsChange: To pass function to be called on selected rows change (required for multiple row selection using checkbox)

onCopy: Accepts a function that gets called when a cell is copied

onPaste: Accepts a function that gets called when a cell is pasted

onScroll: Accepts a function that gets called user scrolls

onColumnResize: A function receiving column resize updates

restriction: Used to set restriction on copy and paste feature
restriction prop to the AgGrid will allow you to enable or disable the copy/paste feature
Example:

    restriction={{
        copy: true,  // it should be not allowed table content copy
        paste: false, // it should be allow paste
    }}

rowKeyGetter: A function returning a unique key/identifier per row. rowKeyGetter is required for row selection to work.

Example:

    function rowKeyGetter(row) {
        return row.id;
    }
    rowKeyGetter={rowKeyGetter}

onRowsChange: A function receiving row updates. The first parameter is a new rows array with both the updated rows and the other untouched rows. The second parameter is an object with an indexes array highlighting which rows have changed by their index, and the column where the change happened.

Example:

    const [rows, setRows] = useState(initialRows);

    <AgGrid
        columns={columns}
        rows={rows}
        onRowsChange={setRows}
    />;

cellNavigationMode: Used to set the cell navigation mode
It has folllowing options:
"NONE" : No cell navigation
"CHANGE_ROW": Goes over to the first cell of the next row after the last cell in current row
"LOOP_OVER_ROW": Goes over to the first cell of the same row after the last cell
The grid default is NONE

Example:
cellNavigationMode={"CHANGE_ROW"} to change the cell navigation mode

SummaryRows: An optional array of summary rows, usually used to display total values for example.
topSummaryRows: Used to set the top summary row/s

bottomSummaryRows: Used to set the bottom summary row/s

showSelectedRows: Used to show selected row count

export: To export grid to various formats pdf,csv,xlsx

groupBy: To pass array to perform row grouping on

rowGrouper: To pass function to perform row grouping

expandedGroupIds: To pass ids for group that should stay expanded

onExpandedGroupIdsChange: To pass function

enableVirtualization: to enable or disable virtualization of rows, it's enabled by default

frameworkComponents: to pass custom frameworkComponents to cells of the grid

style: Used to pass custom styling to the grid

serialNumber: to display serial number column in the grid

onCellClicked: Used to pass function to be performed on click of a cell
Example: onCellClicked={(e)=> console.log(e)} // Will Print contents about the clicked cell and gridAPI and columnAPI actions to the console

onCellDoubleClicked: Used to pass function to be performed on double click of a cell
Example:

    onCellDoubleClicked={(e)=> console.log(e)} // Will Print contents about the double clicked cell and gridAPI and columnAPI actions to the console

onCellContextMenu: Used to pass function to be performed on right click of a cell
Example:

    onCellContextMenu={(e)=> console.log(e)} // Will Print contents about the right clicked cell and gridAPI and columnAPI actions to the console

onRowClicked: Used to pass function to be performed on click of a row
Example:

    onRowClicked={(e)=> console.log(e)} // Will Print contents about the clicked row and gridAPI and columnAPI actions to the console

onRowDoubleClicked: Used to pass function to be performed on double click of a row
Example:

    onRowDoubleClicked={(e)=> console.log(e)} // Will Print contents about the clicked row and gridAPI and columnAPI actions to the console

onGridReady: Used to pass function to be performed when grid is ready and will get the grid details and datas like gridApi,columnApi etc..
Example:

    function gridReady(){
        alert("Grid is Ready to Show Details")
    }

    ongridReady={(props)=>{
        console.log(props);
        // Will Print contents about grid
        gridReady()
        // then what ever functionalities we need to perform once grid
        is ready those functionalities we need to pass here.
    }}

# Column Properties:

DataGrid provides following functionalities for column definitions:

    const columns=[
    {headerName: "PAXType", field: "PAXType", width: 160 },
    {
    	headerName: “Title”,
    	field: “task”,
    	width: 40, //To set column width
    	maxWidth: 40, //To set column max width
    	frozen: true, //To enable or disable given column as frozen
    	filter: true,  // To enable or isable filtering for given column
    	sortable:true,  //To enable or disable sorting for given column
    	resizable: true, //To enable or disable resizing for the given column
    	editable: false, //To enable or disable editing for given column
    	cellEditor: textEditor, //To pass custom text editor component to the grid
    	cellRenderer: () => <button> Save </button>, //To pass custom component in cell, can also pass it using  framework components
    	validation:{
      		style: { backgroundColor: "red", color: "blue" },
      		method: (value) => value.slice(1) >= 100,
    	}, //To pass validation function to perform on all cells in column
    	formatter(props) {
      		return <>{props.row.title}</>;
    	}, //To pass custom formatter for every cell in column
    	alignment: {type:"Date"}, //To align data in cells according to datatype. Available formats are : "Date","DateTime","Number"

},
]

# Sample Declaration:

    <AgGrid
        columnData={columns}
        rowData={rows}
        rowKeyGetter={rowKeyGetter}
        onRowsChange={setRows}
        onCopy={handleCopy}
        onPaste={handlePaste}
        rowHeight={30} //To pass custom rowHeight
        serialNumber={true} // To display a serial number column in the grid
        showSelectedRows={true} // To display the count of selected rows
        selectedCellHeaderStyle={selectedCellHeaderStyle}
        selectedCellRowStyle={selectedCellRowStyle}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
        className="fill-grid"
        rowClass={(row) => row.id.includes("7") ?
            highlightClassname : undefined
        }
        direction={direction}
        // To set the grid direction, default is ltr-left to right
        restriction={{
        copy: true,  // it should be not allowed table content copy
        paste: false, // it should be allow paste
        }}
    />

# Features in datagrid:

Default Column Options
Can pass default column options using the defaultColumnOptions prop

    Example:
    const default={ resizable: true, sortable: true }
    <AgGrid defaultColumnOption={default}>

Serial Number:
To have a serial number column in your grid, pass serialNumber = {true} or serialNumber prop to the AgGrid declaration.

Cell validation:
We can be able to high light cell data is valid or not for column vise. For example we are setting one column data is valid for more than 100 only means, it will high light background color will be red in which cell of column is below 100.

    const columns= [{
    field:” age”,
    headerName:” Age”,
    validation: {
            style: { backgroundColor: "red", color: "blue" },
            // not valid cell style ,suppose not giving style it will set only default background color red.
            method: (value) => value >= 18, // validation method
        },
    }]

Alignment according to DataTypes:

Based on data type (number, text, date, time, datetime, money, etc.) column vise align (start, center, end) data is possible for column definition area.

Auto detect data type and align

While setting alignment: true will detect automatically data type and alignment method.

    const columns= [{
        headerName:” Name”,
        field:” name”,
        alignment: true
    }]

    Example Data Types and default align method:

    “Victor” =text   // start

    12345 = number // end

    “₹100” = currency // end      maximum auto detectable currencies  £, $, ₹, €, ¥, ₣, ¢

    Mar/23/2020, 30-02-20220, 2020/27/April = date // end

    Mar/23/2020 19:40:23, 30-02-20220 09:20:55, 2020/27/April 01:46:12 am = datetime // end

    Not able to detect perfect data type to set as a center.

Manually set the Type and alignment method:

    To set the property like this alignment: {type:” text”, align:” end”}. Suppose not setting alignment method it will take default method.

Framework Components:
You can also pass custom framework components to the cellRenderer in a column definition.

    const customComponents={
        Btn:() => <Button> Save </Button> // Return your required component in frameworkComponents definition
    }

    In the column definition, pass "Btn" as string to the cellRenderer:

    const columns=[
        {field: "id" , headerName:"ID"},
        {field: "save", cellRenderer: "Btn"}, //Will render the button in every cell of given column
    ]

    Pass customComponents to the frameworkComponents prop in the AgGrid declaration

    <AgGrid
        rowData={rows}
        columnData={columns}
        frameworkComponents={customComponents}
    />

Export to various formats pdf, csv, xlsx:

We can export the table data into file formats like pdf, csv and xlsx(excel), it should be achievable for accessing export property. AgGird will show buttons automatically in table top right corner. AgGird provides a separate button for each format.

Example:

    <AgGrid
        columnData={columns}
        rowData={rows}
        export= {{
          pdfFileName: "TableData",  //  To export pdf file
          csvFileName: "TableData", // To export csv file
          excelFileName:"TableData", // To export excel or xlsx file
        }}
    />

Row selection using checkbox
Pass selection, onSelecteRowsChange and rowKeyGetter function for multiple row selection using checkbox

Example:

    const [selectedRows,setSelectedRows]=useState([]);

    function rowKeyGetter(row) {
        return row.id;
    }
    <AgGrid
        columnData={columns}
        rowData={rows}
    	selection={true}
        onSelectedRowsChange={setSelectedRows}
        rowKeyGetter={rowKeyGetter}
    />

Row Selection without checkbox
Pass rowKeyGetter function, and rowSelection prop. There are two modes of row selection, "single" and "multiple".
Single: Can only select one row
Multiple: Can select multiple rows

Example:

    function rowKeyGetter(row) {
        return row.id;
    }
    <AgGrid
        columnData={columns}
        rowData={rows}
        rowKeyGetter={rowKeyGetter}
    	rowSelection={"multiple"} //Can select multiple rows
    />

Status Bar:
Shows selected row count. Pass prop showSelectedRows to view status bar
Example:

    <AgGrid
        columnData={columns}
        rowData={rows}
        showSelectedRows={true}
    />

Filtering:
To enable filtering for any column, pass filter: true in that column's definition

    Example:
      const columns= [{
        headerName:” Name”,
        field:” name”,
        filter: true //to enable filtering
    }]

Sorting
To enable sorting for any column, pass sortable: true in that column's definition

    Example:
      const columns= [{
        headerName:” Name”,
        field:” name”,
        sortable: true //to enable sorting
    }]

Column Spanning:

To merge column vise two are more cells is possible to pass the function of colSpan in column defintion area. And also possible to Span particular rows only.

Example:

      const columns= [{
        headerName:” Name”,
        field:” name”,
     	colSpan: (params) => {
    	// params will give the type of row
    	// normal row cell in second row only
         if (params.type === "ROW" &&
    	 	params.rowIndex === 1) {
           return 2;
    	// need to retrun number of ells   	 going to merge/span
         }
    	// header row cell
         if (params.type === "HEADER") {
           return 2;
         }
       },
    },
    {
        headerName:” Department”,
        field:” department”,
    }
    ]

Copy/Paste with or without restrictions :
Some time table will contain sensitive data’s ,so need to stop easy cloning it should be possible to set restriction property. In that case, passing the restriction prop to the AgGrid will allow you to enable or disable the copy/paste feature

    restriction={{
        copy: true,  // it should be not allowed table content copy
        paste: false, // it should be allow paste
      }}

Pagination:
Pagination allows the grid to paginate rows, removing the need for a vertical scroll to view more data and pagination based better view and user experience.
Example:

    <AgGrid
        columnData={columns}
        rowData={rows}
        pagination={true}
        // used to enable Grid Pagination
        defaultPage={3}
        // used to set default showing page
        paginationAutoPageSize={true}
        // used to set  number of rows perpage to auto
        paginationPageSize={20}
        // used to set number of rows perpage
        suppressPaginationPanel={true}
        // used to hide the pagination panel but pagination was enabled and
        will control some other way means with help of gridApi
    />

Context Menu :
You can customise the context menu by providing a getContextMenuItems() callback. Each time the context menu is to be shown, the callback is called to retrieve the menu items.

Example:

    const getContextMenuItems = useCallback(() => {
    let menu = [
    {
        name: "Alert ", // Option Name
        action: () => {window.alert("Alerting about ") }, // Option OnClick Function
        cssClasses: ["redFont", "bold"], // css class for styling the option
    },
    {
        name: "Always Disabled",
        disabled: true, // to disable the option by using boolean
        tooltip:" Always Disabled ", // to show tooltip
    },
    {
        name: "Country",
        divider: true, // to show the separator line between two option
    },
    {
        name: "Person",
        subMenu: [ // to add the submenu
                {
                    name: "John",
                    action: () => {console.log("John was pressed"); },
                },
                {
                    name: "Tony",
                    action: () => { console.log("Tony was pressed"); },
                },
                {
                    name: "Mac",
                    action: () => { console.log("Mac Item Selected"); },
                    icon: () => {
                            return <img src="https://www.ag-grid.com/example-assets/skills/mac.png" />},
                            // to show the icon before option text
                },
                ];
    }
    return menu;
    }, []);

    <AgGrid
        columnData={columns}
        rowData={rows}
        getContextMenuItems={getContextMenuItems}
    />

ToolTip:
    A tooltip is a small pop-up box that appears when you hover over an element, providing brief contextual information or explanations about that element in user interfaces.And we can able to get row vise and cell vise tooltip.But possible to use tooltip any one in at the time.If suppose you are enable both means rowlevel tool tip only will work.
   
    RowLevel Example:

    Default Tooltip:
    <AgGrid
        columnData={columns}
        rowData={rows}
        rowLevelToolTip={true}
        // it will enable the row level tooltip and will show the rowIndex
    />

    Dynamic Tooltip:
    <AgGrid
        columnData={columns}
        rowData={rows}
        rowLevelToolTip={(props)=>{
            // props will give particular row data and row index with help of that you can able to set your tooltip dynamically
            return `Dynamic Tool Tip-${props.rowIndex}`
        }}
        // it will enable the row level tooltip and will show the dynamic Tooltip
    />


    CellLevel Example:

    const columns = [
                    {
                        field: "task",
                        headerName: "Title",
                        toolTip: true,
                        // it will enable the cell vise tooltip for this column only.
                        // setting true will enable default tooltip it will show the particular cell value only
                    },
                    {
                        field: "priority",
                        headerName: "Priority",
                    },
                    {
                        field: "issueType",
                        headerName: "Issue Type",
                        toolTip: (params) => {
                        return`Issue Type${params.row[params.column.field]}`
                        },
                        // params will give the particular row data and column etc.. with help of that we can able to set dynamic tooltip for cell vise
                    },
                    ];

                 <AgGrid
                    columnData={columns}
                    rowData={rows}
                />

Master/Detail -Detail Grid:
    When a row in the Master Grid is expanded, a new Detail Grid appears underneath that row.
Master row/grid readonly and detail grid will work usual aggrid.
Example:

    const columns =  [
                    // this first colunm definition need to pass because its required
                    {
                        field: "expanded",
                        headerName: "",
                        width: 30,
                        colSpan(args) {
                                return args.type === "ROW" && args.row?.gridRowType === "Detail"
                                ? 3: 1;
                        },
                        // with help of colspan we can able to set the how many column need to contain/will show detail grid
                        cellClass(row) {
                            return row.gridRowType === "DETAIL"
                                ? css`
                            padding: 30px;
                            background-color: black;`
                            : undefined;
                        },
                        // with the help of cellClass we can able to style detail grid like background-color,padding,margin etc..
                    detailsGrid: (props) => {
                    // props will provide particular rowdata and parentId (rowid or what ever we are setting in rowKeyGetter)
                        return (
                        <AgGrid
                            rowData={rows}
                            columnData={productColumns}
                            style={{ blockSize: 250 }}
                        />);
                    },
                    // detailsGrid is required property need to pass something.Basically here not only grid we can show some other things also like div elements.And props will give the particular row details so with the help of props will dynamic view in detail row area
                },
                {
                    field: "id",
                    headerName: "ID",
                },
                {
                    field: "department",
                    headerName: "Department,
                },
            ];


    <AgGrid
        columnData={columns}
        rowData={rows}
        masterData={true} // need to set true to enable the master/detail grid
        rowHeight={(args) => {
          return args.type === "ROW" && args.row.gridRowType === "Detail"
            ? 300
            : 30;
        }}
        // to set the detail grid height dynamically
        expandedMasterRowIds={masterIds}
        // if suppose we need some default detail grid view means we need pass the particular rows id in array format
        onExpandedMasterIdsChange={(ids)=>{
        console.log(ids);
        // it will print all expanded master ids
        setMasterIds(ids);
        }
        // this property will return expanded/currently detail grid show master rows ids
    />

TreeView/Parent-Child relationship:

A tree view is a hierarchical representation of data in a UI, often used to show relationships and structures through expandable/collapsible nodes.
Example:

    const rows=[{
        name:"Dani",
        sports:"Cricket",
        child:[
            {name:"Dani-45",
            sports:"Cricket-Bowler"},
            {name:"Daniel-67",
            sprots:"Cricket-wicketkeeper"
            }
        ]
        // if the rowData having child and enabled treeData in grid property, it will automatically go to the treeview format.And it will accept multilevel also.
        },
        {name:"John",
        sports:"Football"
        },
        {name:"Victor",
        sports:"Basketball"
        }
        ]
    <AgGrid
        columnData={columns}
        rowData={rows}
        treeData={true}
        // need to set true this proprty to enable tree view
        expandedTreeIds={treeIds}
        // if suppose we need some default detail expanded tree view/structure means we need to pass the particular rows id in array format
    />

Multiline Header:
    Some times our headerNames wants sub headername like consider Name is the headerName but it should have FirstName and LastName in these case we can use it.One main column no limit for many child columns and also child columns able to show grand child columns.
    when ever multiline header feature iniating in that time we need to give fixed width for children columns and no need to give parent column.
    

Example:

        const columns=[ {headerName:"ID",field:"id"},
                    {headerName:"Name",
                    haveChildren:true, 
                    // need to enable children column required
                    children:[
                        {headerName:"FirstName",field:"firstname"},
                        {headerName:"LastName",
                         field:"lastname",
                         //  heaveChildren:true, need sub column 
                         //  children:[{}...]
                        }] 
                    }
                ]
        <AgGrid 
            columnData={columns}
            rowData={rows}
        />
        
Detail row/Responsive Row:
When a grid having number of columns and there is chance to user can see the grid/website in mobile/tab we can use this detailed/responsive row method.Because most of the time screen width will not fit to content,so in that case visual vise not look better.In that case we need to enable to this feature.Automatically plus icon will come in first column

Example:

    <AgGrid
        columnData={columns}
        rowData={rows}
        detailedRow={true}
        // to enable the detailedRow will initiate the detailed row when ever the grid was working in mobile/tab
         detailedRowType={"multiple"}
         // at the time multiple rows can able show the detaily
         default it will be single only.
        desktopDetailedRowEnable={true}
        // incase we want this option in desktop/laptop we need to enable seperately default is mobile/tab size screens only
        detailedRowIds={expandedId}
        // if suppose we need some default detailedrow view means we need to pass the particular rows id in array format
        onDetailedRowIdsChange={(ids) =>{
        console.log(ids)
        // it will print when ever the detailed row ids
        setExpandedId(ids)
        }
        }
          // this property will return expanded/currently  showing detailed rows ids
    />

ReadOnly/Hide/show:
To set the particular column will be only readable that means disabled all actions like click,doubleClick,filter and etc. to handle by set the readonly column property.
To set some columns show/hide dynamically will be handled by hide column proprty.With help this property no need to recreate the columnData
Example:

        const columnData=[
        {headerName:"Name",field:"name",readOnly:true},
        // this column will not allow any action like click,filter and etc
        {headerName:"FullName",field:"fullname",hide:true},
        // this column will not come in visual
        {headerName:"Department",field:"department"},
        ]


# API FEATURES:

# GridAPI:

Column Definitions:

     getColumnDefs:
    	Returns the current column definitions.
    	api.getColumnDefs()
    	returns [ {field: “id”,headerName:”ID},
    	{field:” task”, headerName:” Task”},
    	{field: “priority”, headerName:” Priority”}]

     setColumnDefs:
    	Call to set new column definitions. The grid will redraw all the column headers, and then redraw all the rows.
    	const columns = [
    		{field: “id”,headerName:”ID},
    		{field:” task”,headerName:”Task”},
    		{field: “priority”, headerName:” Priority”}
    	];
    	api.setColumnDefs(columns)

     setDefaultColDef:
    	Call to set new Default Column Definition.
    	const defaultColumn={
    		sortable: true,
    		resizable: true
    	}
    	api.setDefaultColDef(defaultColumn)

Column Headers:

     setHeaderHeight:
    	Sets the height in pixels for the row containing the column label header.
    	api.setHeaderHeight(20) // row height

Editing:

     getEditingCells:
    	If the grid is editing, returns details of the editing cell(s).
    	api.getEditingCells()
    	returns  [{column: Columns //The Grid Column
    	rowIndex: number // Editing row index
    	}]
    addItem:
        When ever we need to add  row without modifying original passed data in that case will use this.
        api.addItem(row:Object,replace:boolean)
        // argu1 is data then argu2 is to tell if suppose same data already presented what will be the action.If not passing second argument it will take default value true that will replace if existing row presents
    addItems:
        this is same for addItem only difference we can able to add multiple rows same time
        api.addItems(rows:arrayOfObjects,replace:boolean)
    removeItem:
        When ever we need to delete row without modifying original passed data in that case will use this.
        api.removeItem(row:Object)
    addItems:
        this is same for removeItem only difference we can able to delete multiple rows same time
        api.removeItems(rows:arrayOfObjects)

Export:

     exportDataAsCsv:
    	Downloads a CSV export of the grid's data.
    	api.exportDataAsCsv(filename)

     exportDataAsExcel:
    	Downloads a CSV export of the grid's data.
    	api.exportDataAsExcel(filename).

     exportDataAsPdf:
    	Downloads a Pdf export of the grid's data.
    	api.exportDataAsPdf(filename).

Filtering:

     isColumnFilterPresent:
    	Returns true if any column filter is set, otherwise false.
    	api.isColumnFilterPresent()

     isAnyFilterPresent:
    	Returns true if any filter is set. This includes quick filter, advanced filter or external filter.
    	api.isAnyFilterPresent()

     getFilterModel:
    	Gets the current state of all the advanced filters. Used for saving filter state.
    	api.getFilterModel()
    	returns {
    		enabled:true,
    		[key]:string
    	}

     setFilterModel:
    	Sets the state of all the advanced filters. Provide it with what you get from getFilterModel() to restore filter state.
    	Const filter={
    	key:string
    	}
    	api.setFilterModel(filter)

     destroyFilter:
    	Destroys a filter. Useful to force a particular filter to be created from scratch again.
    	api.destroyFilter(key)

Keyboard Navigation:

     getFocusedCell:
    	Returns the focused cell (or the last focused cell if the grid lost focus).
    	api.getFocusedCell()
    	returns {rowIndex:number,column:column} // undefined if not focused any cell

     setFocusedCell:
    	Sets the focus to the specified cell. rowPinned can be either 'top', 'bottom' or null (for not pinned).
    	const cellFocus={
    	rowIndex:number,
    	key:string  // column field
    	}
    	api.setFocusedCell(cellFocus)

     clearFocusedCell:
    	Clears the focused cell.
    	api.clearFocusedCell()

     tabToNextCell:
    	Navigates the grid focus to the next cell, as if tabbing.
    	api.tabToNextCell()

     tabToPreviousCell():
    	Navigates the grid focus to the previous cell, as if shift-tabbing.
    	api.tabToPreviousCell()

Rendering:

     getRenderedNodes:
    	Retrieve rendered nodes. Due to virtualisation this will contain only the current visible rows and those in the buffer.
    	api.getRenderedNodes()
    	returns array of objects

Row Displayed:

     getDisplayedRowAtIndex:
    	Returns the displayed RowNode at the given index.
    	api.getDisplayedRowAtIndex(index) // index must be number
    	return RowNode object or undefined

     getDisplayedRowCount:
    	Returns the total number of displayed rows.
    	api.getDisplayedToRowCount() // returns number

     getFirstDispldayedRow:
    	Get the index of the first displayed row due to scrolling (includes invisible rendered rows in the buffer).
    	api.getFirstDisplayedRow() // returns number

     getLastDisplayedRow:
    	Get the index of the last displayed row due to scrolling (includes invisible rendered rows in the buffer).
    	api.getLastDisplayedRow() // returns number

Row Drag and Drop:

     setSuppressRowDrag:
    	To disable the Row Drag icon.
    	api.setSuppressRowDrag(boolean)

Row Grouping:

     expandAll:
    	Expand all groups.
    	api.expandAll()

     collapseAll:
    	Collapse all groups.
    	api.collapseAll()

     setRowNodeExpanded:
    	Expand or collapse a specific row node, optionally expanding/collapsing all of its parent nodes.
    	api.setRowNodeExpanded(rowNode:RowNode,
    	expanded: boolean,expandParents?: boolean)

RowNode:

     getRowNode:
    	Returns the row node with the given ID. The row node ID is the one you provide from the callback getRowId(params), otherwise the ID is a number 		(cast as string) auto-generated by the grid when the row data is set.
    	api.getRowNode(id) // id must be string

     forEachNode:
    	Iterates through each node (row) in the grid and calls the callback for each node. This works similar to the forEach method on a JavaScript 			array. This is called for every node, ignoring any filtering or sorting applied within the grid. If using the Infinite Row Model, then this gets 		called for each page loaded in the page cache.
    	api.forEachNode(callbackFunction)

Row Pinning:

     setPinnedTopRowData:
    	Set the top pinned rows. Call with no rows / undefined to clear top pinned rows.
    	api.setPinnedTopRowData(rows) // rows array of object

     setPinnedBottomData:
    	Set the bottom pinned rows. Call with no rows / undefined to clear bottom pinned rows.
    	api.setPinnedBottomRowData(rows) // rows array of object

     getPinnedTopRowCount:
    	Gets the number of top pinned rows.
    	api.getPinnedTopRowCount() // returns number

     getPinnedBottomRowCount:
    	Gets the number of bottom pinned rows.
    	api.getPinnedBottomRowCount() // returns number

     getPinnedTopRowData:
        Gets the top pinned row with the specified index.
    	api.getPinnedTopRowData(index) // index must be number

    getPinnedBottomRowData:
        Gets the top pinned row with the specified index.
    	api.getPinnedBottomRowData(index) // index must be number

RowModel:

    getRowModel:
    	Returns the row model inside the table. From here you can see the original rows, rows after filter has been applied, rows after aggregation has been applied, and the final set of 'to be displayed' rows.
    	api.getRowModel()

     getRow:
     	Returns the rowNode at the given index.
    	api.getRow(index: number): RowNode | undefined;

     getRowNode:
    	Returns the rowNode for given id.
    	api.getRowNode(id: string): RowNode | undefined;

    getRowCount:
    	Returns the number of rows

api.getRowCount(): number;

     getTopLevelRowCount(): number;

     getTopLevelRowDisplayedIndex(topLevelIndex: number): number;

     getRowIndexAtPixel(pixel: number): number;
    	Returns the row index at the given pixel

     isRowPresent(rowNode: RowNode): boolean;
    	Returns true if the provided rowNode is in the list of rows to render

     getRowBounds(index: number): RowBounds | null;
    	Returns row top and bottom for a given row


     isEmpty(): boolean;
    	Returns true if this model has no rows, regardless of model filter. EG if rows present, but filtered
    	out, this still returns false. If it returns true, then the grid shows the 'no rows' overlay - but we
    	don't show that overlay if the rows are just filtered out.

    isRowsToRender(): boolean;
        Returns true if no rows (either no rows at all, or the rows are filtered out). This is what the grid uses to know if there are rows to render or not.

    getNodesInRangeForSelection(first: RowNode, last: RowNode | null): RowNode[];
        Returns all rows in range that should be selected. If there is a gap in range (non ClientSideRowModel) then
        then no rows should be returned

    forEachNode(callback: (rowNode: RowNode, index: number) => void, includeFooterNodes?: boolean): void;
    	Iterate through each node. What this does depends on the model type. For clientSide, goes through
    	all nodes. For serverSide, goes through what's loaded in memory.

    getType(): RowModelType;
        The base class returns the type. We use this instead of 'instanceof' as the client might provide
        their own implementation of the models in the future.

    isLastRowIndexKnown(): boolean;
    	It tells us if this row model knows about the last row that it can produce. This is used by the
    	PaginationPanel, if last row is not found, then the 'last' button is disabled and the last page is
    	not shown. This is always true for ClientSideRowModel. It toggles for InfiniteRowModel.
    	Used by CSRM only - is makes sure there are now estimated row heights within the range.

# columnAPI:

colKey in function arguments refers to to either a string with the colId of a column or an column object which should have coldId property mentioned
Example: As string: columnApi.getColumn("priority")
As object: columnApi.getColumn({colId:"priority"})
Both with return the column object for the priority column

colKeys is the same as colKey except it accepts an array of strings containing colIds of the columns or an array of objects with the colId property
Example: As array of strings: columnApi.getColumns(["priority","id"])
As array of objects: columnApi.getColumns([{colId:"priority"},{colId:"id"}])
Both with return the column objects for the priority and id columns

Get Column Objects:
getColumn:
returns column object for a single column
columnApi.getColumn(colKey)

    getColumns:
    	returns column objects for multiple columns
    	columnApi.getColumns(colKeys)

     getAllGridColumns:
    	returns column objects for all columns in the grid
    	columnApi.getAllGridColumns()

Move Column/s:

     moveColumn:
    	moves given column to specified index
    	columnApi.moveColumn(colKey,toIndex) //toIndex must be a number

     moveColumns:
    	moves given columns to specified index
    	columnApi.moveColumns(colKeys,toIndex) //toIndex must be a number

     moveColumnByIndex:
    	moves columns by index value
    	columnApi.moveColumnByIndex(fromIndex,toIndex) //fromIndex and toIndex must be numbers

Column Pinning:

     isPinning:
    	returns true if grid has atleast one frozen column
    	otherwise returns false
    	columnApi.isPinning()

     setColumnPinned:
    	pins the given column (makes the frozen property true)
    	columnApi.setColumnPinned(colKey)

     setColumnsPinned:
    	pins the given columns (makes the frozen property true)
    	columnApi.setColumnsPinned(colKeys)

Row Group Columns:

    getRowGroupColumns:
    	Returns currently set rowgroup column names
    	columnApi.getRowGroupColumns()

    setRowGroupColumns:
    	Set new row group columns
    	const cols=["sport","athlete"];
    	columnApi.setRowGroupColumns(cols)
    	will set sport and athlete as the new rowgroup columns

    addRowGroupColumn:
    	Add a new column to existing row group columns
    	columnApi.addRowGroupColumn("sport")

    addRowGroupColumns:
    	Add a new columns to existing row group columns
    	columnApi.addRowGroupColumns(["sport","athlete"])

    removeRowGroupColumn:
    	Remove a column from existing row group columns
    	columnApi.removeRowGroupColumn("sport")

    removeRowGroupColumns:
    	Remove columns from existing row group columns
    	columnApi.removeRowGroupColumns(["sport","athlete"])

    moveRowGroupColumn:
    	Moves the row group column from one position to other. This changes the order in which row groups are ordered.
    	columnApi.moveRowGroupColumns(fromIndex,toIndex) //fromIndex and toIndex must be numbers

Column Sizing:

    setColumnWidth:
    	Sets width of particular column in grid. Width will be set in pixels.
    	columnApi.setColumnWidth(colKey,newWidth) //newWidth should be a number

    setColumnsWidth:
    	Sets widths of multiple columns in grid. Width will be set in pixels.
    	const newColumnWidths = [
    		{key:"sport",newWidth: 60},
    		{key:"athlete",newWidth: 100},
    		{key:"country",newWidth: 80}
    	]
    	columnApi.setColumnsWidth(newColumnWidths) //newColumnWidths contains an array of objects

    sizeColumnsToFit:
    	Sizes columns to fit particular grid width in pixels.
    	columnApi.sizeColumnsToFitz(1000) //Will size all columns so that they fit 1000px width

    autoSizeColumn:
    	Auto size a column according to content width.
    	columnApi.autoSizeColumn(colKey)

    autoSizeColumns:
    	Auto sizes multiple columns according to content width.
    	columnApi.autoSizeColumns(colKeys)

    autoSizeAllColumns:
    	Auto sizes all columns according to content width.
    	columnApi.autoSizeAllColumns()

Column State:

    getColumnState:
    	Returns current state of the all columns.
    	columnApi.getColumnState()

    applyColumnState:
    	To apply a new state to all the columns. Accepts an object with two parameters. state(array of objects) compulsory and defaultState optional property that accepts an object.

    	const newState=[
    		{colId: "sport" , width: 200, frozen:false },
    		{colId: "athlete" , sortable:true }
    	] // add new state to particular columns, colId is needed to recognoze the column
    	const defaultState={ width:50 } // adds default state to remaining columns(the columns not mentioned in newState)
    	columnApi.applyColumnState({ state: newState, defaultState: defaultState});

    resetColumnState:
    	Resets columns to initial state.
    	columnApi.resetColumnState()

Column Display Names:

    getDisplayNameForColumn:
    	Returns display name(header name) for given column
    	columnApi.getDisplayNameForColumn(colKey)

    getDisplayedColAfter:
    	Returns the column object for the column next to the column that is passed to the function
    	columnApi.getDisplayedColAfter(colKey)

    getDisplayedColBefore:
    	Returns the column object for the column before the column that is passed to the function
    	columnApi.getDisplayedColBefore(colKey)

    getAllDisplayedVirtualColumns:
    	Returns all columns in the view.
    	columnApi.getAllDisplayedVirtualColumns()

    getAllDisplayedColumns
    	Returns all columns in the grid.
    	columnApi.getAllDisplayedColumns()
