import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import {PrintIcon} from "./../../assets/Icon";
import DataGrid from "./DataGrid";
import moment from "moment";

const PrintComponent = ({
  personName,
  formName,
  logo,
  onClose,
  userDetail,
  columnData,
  rowData,
  rowsPerPage,
  ...props
}) => {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  function createArrayOfArrays(data, count) {
    const result = [];
    let currentArray = [];

    for (const element of data) {
      currentArray.push(element);

      if (currentArray.length === count) {
        result.push(currentArray);
        currentArray = [];
      }
    }

    // Add the remaining elements if the count doesn't divide evenly
    if (currentArray.length > 0) {
      result.push(currentArray);
    }

    return result;
  }

  const rows = createArrayOfArrays(rowData, rowsPerPage);
  return (
    <>
      <Modal show={true}>
        <div className="control-container">
          <div className="control-row-first">
            <div>{formName.toUpperCase()} </div>
            <div className="close-icon" onClick={onClose}>
              X
            </div>
          </div>
          <div className="control-row-second">
            <PrintIcon
              data-testid={"print-svg"}
              style={{
                height: "20px",
                width: "20px",
                color: "white",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              onClick={() => {
                handlePrint();
              }}
            />
          </div>
        </div>
        <div ref={printRef} className="content-container">
          {rows?.map((newRows, index) => (
            <div
              style={{
                width: "98%",
                height: "1110px",
                margin: index === 0 ? "0 0 10px 5px " : "10px 0 10px 5px",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#B8CCE4",
              }}
            >
              <div className={index !== 0 ? "header not-fist-page" : "header"}>
                <div className="log-container">
                  <img
                    src={logo}
                    style={{
                      height: "100px",
                      width: "100px",
                    }}
                  />
                </div>
                <div className="title-card">
                  <div className="header-name">{props.headerName}</div>
                  <div className="sub-header-name">{props.subHeaderName}</div>
                </div>
                <div className="details-card">
                  <div className="person-container">{personName} </div>
                  <div className="date-container">
                    {props.date
                      ? props.date
                      : moment(new Date()).format("DD-MM-YYYY")}
                  </div>
                  <div className="time-container">
                    {props.time
                      ? props.time
                      : moment(new Date()).format("HH:MM")}
                  </div>
                </div>
              </div>
              <div className="body">
                <DataGrid
                  columnData={columnData}
                  rowData={newRows}
                  {...props}
                />
              </div>
              <div className="modal-footer">
                <div className="footer-left">{userDetail}</div>
                <div className="footer-center">
                    Printed by:  {props.printedBy}
                </div>
                <div className="footer-right">
                  Page {index + 1} of {rows.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default PrintComponent;
