import { css } from "@linaria/core";
import clsx from "clsx";
import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CloseIcon, MenuFlightIcon } from "../../assets/Icon";
export const toolPanelContainer = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #b8cce4;
  display: flex;
  flex-direction: column;
  border: 0.3px solid #0f243e;
  z-index: 1;
  align-items: center;
  border-radius: 8px;
  min-width: 300px;
  max-height: 400px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;
export const headerContainer = css`
  display: flex;
  height: max-content;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;
export const titleStyle = css`
  font-weight: bold;
  font-size: 11px;
  display: flex;
  justify-content: center;
  width: 100%;
`;
const numberInputStyle = css`
  width: 80px;
  border: none;
  &:focus-visible {
    outline: none;
  }
`;
export const closeIconStyle = css`
  width: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;
const gridStyle = css`
  display: grid;
  background-color: #fff;
  column-gap: 1px;
  height: inherit;
  overflow-y: auto;
`;
const cellStyle = css`
  background-color: inherit;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
`;
const headerRowStyle = css`
  display: contents;
  color: #fff;
  font-size: 11px;
  font-family: "Segoe UI";
  font-weight: bold;
  height: 24px;
  position: relative;
`;
const headerCellStyle = css`
  z-index: 5;
  position: sticky;
  top: 0;
`;
const rowStyle = css`
  display: contents;
  font-size: 11px;
  font-family: "Segoe UI";
  height: 24px;
`;
const buttonContainer = css`
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  column-gap: 10px;
  width: 100%;
  margin-top: 10px;
`;
const buttonStyle = css`
  border: 1px solid #fff;
  background-color: #4f81bd;
  color: #fff;
  height: 22px;
  &:active {
    background-color: #446ea1;
  }
`;
const toolPanelList = css`
  background-color: #fff;
  height: 20px;
  font-size: 11px;
  display: flex;
  align-items: center;
  padding: 2px 10px;
`;
export const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
`;
const dialogStyle = css`
  position: fixed;
  background-color: white;
  z-index: 1;
  display: flex;
`;
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  dialog: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    borderRadius: "8px",
    zIndex: 1,
    display: "flex",
  },
};

export default function ColumnToolPanel(props) {
  const list = [
    {
      name: "All in One",
      action: () => {
        if (!modelOpen) {
          setModelOpen(true);
          setShowAllinOne(true);
          setToolPanelOption("All in One");
        }
      },
    },
    {
      name: "Show/ Hide Columns ",
      action: () => {
        if (!modelOpen) {
          setModelOpen(true);
          setShowHideDialogOpen(true);
          setToolPanelOption("Show/ Hide Columns");
        }
      },
    },
    {
      name: "Freeze Columns ",
      action: () => {
        if (!modelOpen) {
          setModelOpen(true);
          setShowFreezeDialogOpen(true);
          setToolPanelOption("Freeze Columns");
        }
      },
    },
    {
      name: "Find",
      action: () => {
        if (!modelOpen) {
          props.handleChangeFind();
          props.onClose();
        }
      },
    },
    {
      name: "Set Columns Width",
      action: () => {
        if (!modelOpen) {
          setModelOpen(true);
          setToolPanelOption("Set Columns Width");
          setShowSetColumnWidthDialogOpen(true);
        }
      },
    },
    {
      name: "Re-Arrange Columns",
      action: () => {
        if (!modelOpen) {
          setModelOpen(true);
          setToolPanelOption("Re-Arrange Columns");
          setReArrange(true);
        }
      },
    },
    {
      name: "Size Columns To Fit",
      action: () => {
        if (!modelOpen) {
          setModelOpen(true);
          props.sizeColumnToFit();
          props.onClose();
        }
      },
    },
    {
      name: "Reset Columns Width",
      action: () => {
        if (!modelOpen) {
          setModelOpen(true);
          props.resetColumn();
          props.onClose();
        }
      },
    },
  ];
  const [modelOpen, setModelOpen] = useState(false);
  const [showHideDialogOpen, setShowHideDialogOpen] = useState(false);
  const [showFreezeDialogOpen, setShowFreezeDialogOpen] = useState(false);
  const [showSetColumnWidthDialogOpen, setShowSetColumnWidthDialogOpen] =
    useState(false);
  const [showreArrange, setReArrange] = useState(false);
  const [showAllinOne, setShowAllinOne] = useState(false);
  const [toolPanelOption, setToolPanelOption] = useState("");
  const [columns, setColumns] = useState(props.raawColumns);
  const [hideColumnList, setHideColumnList] = useState(props.hideColumn);
  const [freezeColumnList, setFreezeColumnList] = useState(props.freezeColumn);
  const [columnsWidthList, setColumnsWidthList] = useState(
    props.changedColumnWidth
  );

  const moveRow = (fromIndex, toIndex) => {
    if (
      freezeColumnList.includes(columns[fromIndex].headerName) ===
      freezeColumnList.includes(columns[toIndex].headerName)
    ) {
      const newColumns = [...columns];
      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      setColumns(newColumns);
    }
  };

  return (
    <>
      <div className={overlayStyle} onClick={props.onClose} />

      <div style={props.style} className={dialogStyle}>
        <div>
          {list?.map((item) => {
            return (
              <div style={{ display: "flex" }} key={item.name}>
                <div
                  style={{
                    width: "25px",
                    backgroundColor: "#16365D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MenuFlightIcon />
                </div>
                <div
                  key={item.name}
                  className={toolPanelList}
                  onClick={item.action}
                  data-testid={`column-toolpanel-option-${item.name}`}
                >
                  {item.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showHideDialogOpen && (
        <ShowHideDialogBox
          isOpen={showHideDialogOpen}
          onClose={() => {
            setShowHideDialogOpen(false);
            setModelOpen(false);
          }}
          header={toolPanelOption}
          testId={"hide"}
          stylingThings={props?.stylingThings}
        >
          <div
            style={{
              gridTemplateColumns: "auto auto",
              gridTemplateRows: `24px reapeat(${columns.length} 24px)`,
            }}
            className={gridStyle}
            role={"grid"}
          >
            <div
              role={"rowheader"}
              style={{
                backgroundColor: props?.stylingThings.headerBackgroundColor,
              }}
              className={headerRowStyle}
            >
              <div
                role={"gridcell"}
                className={clsx(cellStyle, headerCellStyle)}
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                Visibile
              </div>
              <div
                role={"gridcell"}
                className={clsx(cellStyle, headerCellStyle)}
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                Column Name
              </div>
            </div>
            {columns?.map((col, index) => (
              <div
                key={col.headerName}
                role={"row"}
                className={rowStyle}
                style={{
                  backgroundColor: index % 2 === 0 ? "#E5EDF8" : "#F3F8FC",
                }}
              >
                <div role={"gridcell"} className={cellStyle}>
                  <input
                    data-testid={`${col.headerName}-hide-checkbox`}
                    type={"checkbox"}
                    checked={!hideColumnList?.includes(col.headerName)}
                    onChange={(e) => {
                      let sm = hideColumnList;
                      if (sm.includes(col.headerName)) {
                        sm = hideColumnList.filter((i) => i !== col.headerName);
                      } else {
                        sm.push(col.headerName);
                      }
                      setHideColumnList([...sm]);
                    }}
                  />
                </div>
                <div role={"gridcell"} className={cellStyle}>
                  {col.headerName}
                </div>
              </div>
            ))}
          </div>
          <div className={buttonContainer}>
            <button
              className={buttonStyle}
              onClick={() => {
                props.ChangeHide(hideColumnList);
                setShowHideDialogOpen(false);
                props.onClose();
                setModelOpen(false);
              }}
              data-testid={"hide-option-ok-btn"}
            >
              OK
            </button>
            <button
              className={buttonStyle}
              onClick={() => {
                setShowHideDialogOpen(false);
                setModelOpen(false);
              }}
              data-testid={"hide-option-cancel-btn"}
            >
              Cancel
            </button>
          </div>
        </ShowHideDialogBox>
      )}
      {showFreezeDialogOpen && (
        <ShowHideDialogBox
          isOpen={showFreezeDialogOpen}
          onClose={() => {
            setShowFreezeDialogOpen(false);
            setModelOpen(false);
          }}
          header={toolPanelOption}
          stylingThings={props?.stylingThings}
          testId={"freeze"}
        >
          <div
            className={gridStyle}
            style={{
              gridTemplateColumns: "auto auto",
              gridTemplateRows: `24px reapeat(${columns.length} 24px)`,
            }}
            role={"grid"}
          >
            <div
              role={"row"}
              style={{
                backgroundColor: props?.stylingThings.headerBackgroundColor,
              }}
              className={headerRowStyle}
            >
              <div
                role={"gridcell"}
                className={clsx(cellStyle, headerCellStyle)}
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                Freeze
              </div>
              <div
                role={"gridcell"}
                className={clsx(cellStyle, headerCellStyle)}
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                Column Name
              </div>
            </div>
            {columns?.map((col, index) => (
              <div
                key={col.headerName}
                role={"row"}
                className={rowStyle}
                style={{
                  backgroundColor: index % 2 === 0 ? "#E5EDF8" : "#F3F8FC",
                }}
              >
                <div role={"gridcell"} className={cellStyle}>
                  <input
                    data-testid={`${col.headerName}-freeze-radio-button`}
                    type={"radio"}
                    checked={freezeColumnList?.includes(col.headerName)}
                    onClick={() => {
                      let sm = freezeColumnList;

                      if (sm.includes(col.headerName)) {
                        sm = freezeColumnList.filter(
                          (i) => i !== col.headerName
                        );
                      } else {
                        sm.push(col.headerName);
                      }

                      setFreezeColumnList([...sm]);
                    }}
                  />
                </div>
                <div role={"gridcell"} className={cellStyle}>
                  {col.headerName}
                </div>
              </div>
            ))}
          </div>
          <div className={buttonContainer}>
            <button
              className={buttonStyle}
              onClick={() => {
                props.ChangeFreeze(freezeColumnList);
                setShowFreezeDialogOpen(false);
                props.onClose();
                setModelOpen(false);
              }}
              data-testid={"freeze-option-ok-btn"}
            >
              OK
            </button>
            <button
              className={buttonStyle}
              onClick={() => {
                setShowFreezeDialogOpen(false);
                setModelOpen(false);
              }}
              data-testid={"freeze-option-cancel-btn"}
            >
              Cancel
            </button>
          </div>
        </ShowHideDialogBox>
      )}
      {showSetColumnWidthDialogOpen && (
        <ShowHideDialogBox
          isOpen={showSetColumnWidthDialogOpen}
          onClose={() => {
            setShowSetColumnWidthDialogOpen(false);
            setModelOpen(false);
          }}
          header={toolPanelOption}
          stylingThings={props?.stylingThings}
          testId={"setColumnsWidth"}
        >
          <div
            className={gridStyle}
            style={{
              gridTemplateColumns: "auto auto",
              gridTemplateRows: `24px reapeat(${columns.length} 24px)`,
            }}
            role={"grid"}
          >
            <div
              role={"row"}
              style={{
                backgroundColor: props?.stylingThings.headerBackgroundColor,
              }}
              className={headerRowStyle}
            >
              <div
                role={"gridcell"}
                className={clsx(cellStyle, headerCellStyle)}
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                width
              </div>
              <div
                role={"gridcell"}
                className={clsx(cellStyle, headerCellStyle)}
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
              >
                Column Name
              </div>
            </div>
            {columns?.map((col, index) => (
              <div
                key={col.headerName}
                role={"row"}
                className={rowStyle}
                style={{
                  backgroundColor: index % 2 === 0 ? "#E5EDF8" : "#F3F8FC",
                }}
              >
                <div role={"gridcell"} className={cellStyle}>
                  <input
                    type={"number"}
                    className={numberInputStyle}
                    data-testid={`${col.headerName}-set-width-number-input`}
                    value={columnsWidthList[col.headerName] ?? col.width}
                    onChange={(e) => {
                      let newValue = e.target.value;
                      let width = { ...columnsWidthList };
                      if (String(newValue) === String(col.width)) {
                        delete width[`${col.headerName}`];
                      } else {
                        width[col.headerName] = newValue;
                      }
                      setColumnsWidthList(width);
                    }}
                  />
                </div>
                <div role={"gridcell"} className={cellStyle}>
                  {col.headerName}
                </div>
              </div>
            ))}
          </div>
          <div className={buttonContainer}>
            <button
              className={buttonStyle}
              onClick={() => {
                props.hanldeChangedColumnWidth(columnsWidthList);
                setShowSetColumnWidthDialogOpen(false);
                props.onClose();
                setModelOpen(false);
              }}
              data-testid={"setWidth-option-ok-btn"}
            >
              OK
            </button>
            <button
              className={buttonStyle}
              onClick={() => {
                setShowSetColumnWidthDialogOpen(false);
                setModelOpen(false);
              }}
              data-testid={"setWidth-option-cancel-btn"}
            >
              Cancel
            </button>
          </div>
        </ShowHideDialogBox>
      )}
      {showreArrange && (
        <DndProvider backend={HTML5Backend}>
          <ShowHideDialogBox
            isOpen={showreArrange}
            onClose={() => {
              setReArrange(false);
              setModelOpen(false);
            }}
            header={toolPanelOption}
            stylingThings={props?.stylingThings}
            testId={"reArrange"}
          >
            <DraggableGrid
              columns={columns}
              onMoveRow={moveRow}
              stylingThings={props?.stylingThings}
            />

            <div className={buttonContainer}>
              <button
                className={buttonStyle}
                onClick={() => {
                  let columnOrder = columns.map((col) => col.headerName);
                  props.hanldeChangedOrder(columnOrder);
                  setReArrange(false);
                  props.onClose();
                  setModelOpen(false);
                }}
                data-testid={"reArrange-option-ok-btn"}
              >
                OK
              </button>
              <button
                className={buttonStyle}
                onClick={() => {
                  setReArrange(false);
                  setModelOpen(false);
                }}
                data-testid={"reArrange-option-cancel-btn"}
              >
                Cancel
              </button>
            </div>
          </ShowHideDialogBox>
        </DndProvider>
      )}
      {showAllinOne && (
        <DndProvider backend={HTML5Backend}>
          <ShowHideDialogBox
            isOpen={showAllinOne}
            onClose={() => {
              setShowAllinOne(false);
              setModelOpen(false);
            }}
            header={toolPanelOption}
            stylingThings={props?.stylingThings}
            testId={"allinone"}
          >
            <DraggableAllOptionGrid
              columns={columns}
              onMoveRow={moveRow}
              stylingThings={props?.stylingThings}
              freezeColumnList={freezeColumnList}
              setHideColumnList={(cols) => setHideColumnList(cols)}
              hideColumnList={hideColumnList}
              columnsWidthList={columnsWidthList}
              handleColumnWidth={setColumnsWidthList}
              handleFreezeColumn={(cols) => setFreezeColumnList(cols)}
            />

            <div className={buttonContainer}>
              <button
                className={buttonStyle}
                onClick={() => {
                  props.ChangeHide(hideColumnList);

                  props.ChangeFreeze(freezeColumnList);
                  props.hanldeChangedColumnWidth(columnsWidthList);
                  let columnOrder = columns.map((col) => col.headerName);
                  props.hanldeChangedOrder(columnOrder);
                  setShowAllinOne(false);
                  props.onClose();
                  setModelOpen(false);
                }}
                data-testid={"allinOne-option-ok-btn"}
              >
                OK
              </button>
              <button
                className={buttonStyle}
                onClick={() => {
                  setShowAllinOne(false);
                  setModelOpen(false);
                }}
                data-testid={"allinOne-option-cancel-btn"}
              >
                Cancel
              </button>
            </div>
          </ShowHideDialogBox>
        </DndProvider>
      )}
    </>
  );
}

const ShowHideDialogBox = ({
  isOpen,
  children,
  onClose,
  header,
  testId,
  stylingThings,
}) => {
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <div className={overlayStyle} />
      <div className={toolPanelContainer}>
        <div
          className={headerContainer}
          style={{
            backgroundColor: stylingThings?.headerBackgroundColor,
            color: "#FFF",
          }}
        >
          <div className={titleStyle}>
            <span>{header}</span>
          </div>
          <div className={closeIconStyle}>
            <CloseIcon
              style={{ cursor: "pointer" }}
              onClick={onClose}
              data-testid={`${testId}-column-tool-panel-close-icon`}
            />
          </div>
        </div>
        <div style={{ padding: "10px" }}>{children}</div>
      </div>
    </div>
  );
};

const DraggableRow = ({ id, text, index, moveRow, stylingThings }) => {
  const [{ isDragging }, ref] = useDrag({
    type: "DRAGGABLE_ROW",
    item: { id, index },
  });

  const [{ isOver }, drop] = useDrop({
    accept: "DRAGGABLE_ROW",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      role="row"
      className={rowStyle}
      style={{
        backgroundColor: index % 2 === 0 ? "#E5EDF8" : "#F3F8FC",
      }}
    >
      <div
        role="gridcell"
        className={cellStyle}
        data-testid={`drag-div-${text}`}
        style={{
          backgroundColor: stylingThings?.headerBackgroundColor,
          width: "40px",
          height: "24px",
          borderBottom: "1px solid #FFF",
        }}
        ref={(node) => ref(drop(node))}
      ></div>
      <div role="gridcell" className={cellStyle}>
        {text}
      </div>
    </div>
  );
};

const DraggableGrid = ({ columns, onMoveRow, stylingThings }) => {
  return (
    <div
      className={gridStyle}
      style={{
        gridTemplateColumns: "auto auto",
        gridTemplateRows: `24px repeat(${columns.length} 24px)`,
      }}
      role="grid"
    >
      <div
        role="row"
        className={headerRowStyle}
        style={{
          backgroundColor: stylingThings?.headerBackgroundColor,
        }}
      >
        <div
          role="gridcell"
          className={clsx(cellStyle, headerCellStyle)}
          style={{ width: "40px", borderBottom: "1px solid #FFF" }}
        ></div>
        <div
          role="gridcell"
          className={clsx(cellStyle, headerCellStyle)}
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
        >
          Column Name
        </div>
      </div>

      {columns?.map((col, index) => (
        <DraggableRow
          key={col.headerName}
          id={col.headerName}
          text={col.headerName}
          index={index}
          moveRow={onMoveRow}
          stylingThings={stylingThings}
        />
      ))}
    </div>
  );
};
const DraggableAllOptionGrid = ({
  columns,
  onMoveRow,
  stylingThings,
  ...props
}) => {
  function handleHideColumn(cols) {
    props.setHideColumnList(cols);
  }
  function handleColumnWidthList(cols) {
    props.handleColumnWidth(cols);
  }
  function handleFreezdeChange(cols) {
    props.handleFreezeColumn(cols);
  }
  return (
    <div
      className={gridStyle}
      style={{
        gridTemplateColumns: "auto auto auto auto auto",
        gridTemplateRows: `24px repeat(${columns.length} 24px)`,
      }}
      role="grid"
    >
      <div
        role={"rowheader"}
        className={headerRowStyle}
        style={{
          backgroundColor: stylingThings?.headerBackgroundColor,
        }}
      >
        <div
          role="gridcell"
          className={clsx(cellStyle, headerCellStyle)}
          style={{ width: "40px", borderBottom: "1px solid #FFF" }}
        ></div>
        <div
          role="gridcell"
          className={clsx(cellStyle, headerCellStyle)}
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          Visibile
        </div>
        <div
          role="gridcell"
          className={clsx(cellStyle, headerCellStyle)}
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          Freeze
        </div>
        <div
          role="gridcell"
          className={clsx(cellStyle, headerCellStyle)}
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            borderBottom: "1px solid #FFF",
          }}
        >
          Width
        </div>
        <div
          role="gridcell"
          className={clsx(cellStyle, headerCellStyle)}
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          Column Name
        </div>
      </div>

      {columns?.map((col, index) => (
        <DraggableAllOptionRow
          column={col}
          key={col.headerName}
          id={col.headerName}
          text={col.headerName}
          index={index}
          moveRow={onMoveRow}
          stylingThings={stylingThings}
          handleHideColumnList={handleHideColumn}
          handleColumnWidthList={handleColumnWidthList}
          handleFreezdeChange={handleFreezdeChange}
          columnsWidthList={props?.columnsWidthList}
          {...props}
        />
      ))}
    </div>
  );
};

const DraggableAllOptionRow = ({
  id,
  text,
  index,
  moveRow,
  stylingThings,
  freezeColumnList,
  handleHideColumnList,
  hideColumnList,
  column: col,
  columnsWidthList,
  handleColumnWidthList,
  handleFreezdeChange,
}) => {
  const [{ isDragging }, ref] = useDrag({
    type: "DRAGGABLE_ROW",
    item: { id, index },
  });

  const [{ isOver }, drop] = useDrop({
    accept: "DRAGGABLE_ROW",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      role="row"
      className={rowStyle}
      style={{
        backgroundColor: index % 2 === 0 ? "#E5EDF8" : "#F3F8FC",
      }}
    >
      <div
        role="gridcell"
        data-testid={`drag-div-all-${text}`}
        className={cellStyle}
        style={{
          backgroundColor: stylingThings?.headerBackgroundColor,
          width: "40px",
          height: "24px",
          borderBottom: "1px solid #FFF",
        }}
        ref={(node) => ref(drop(node))}
      ></div>
      <div role={"gridcell"} className={cellStyle}>
        <input
          type={"checkbox"}
          data-testid={`${col.headerName}-hide-checkbox-all`}
          checked={!hideColumnList?.includes(col.headerName)}
          onChange={(e) => {
            let sm = hideColumnList;
            if (sm.includes(col.headerName)) {
              sm = hideColumnList.filter((i) => i !== col.headerName);
            } else {
              sm.push(col.headerName);
            }
            handleHideColumnList([...sm]);
          }}
        />
      </div>
      <div role={"gridcell"} className={cellStyle}>
        <input
          type={"radio"}
          checked={freezeColumnList?.includes(col.headerName)}
          data-testid={`${col.headerName}-allinone-freeze-radio-button`}
          onClick={() => {
            let sm = freezeColumnList;

            if (sm.includes(col.headerName)) {
              sm = freezeColumnList.filter((i) => i !== col.headerName);
            } else {
              sm.push(col.headerName);
            }
            handleFreezdeChange([...sm]);
          }}
        />
      </div>
      <div role={"gridcell"} className={cellStyle}>
        <input
          type={"number"}
          data-testid={`${col.headerName}-set-width-number-input-all`}
          className={numberInputStyle}
          value={columnsWidthList[col.headerName] ?? col.width}
          onChange={(e) => {
            let newValue = e.target.value;
            let width = { ...columnsWidthList };
            if (String(newValue) === String(col.width)) {
              delete width[`${col.headerName}`];
            } else {
              width[col.headerName] = newValue;
            }
            handleColumnWidthList(width);
          }}
        />
      </div>

      <div role="gridcell" className={cellStyle}>
        {text}
      </div>
    </div>
  );
};
