import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import PrintIcon from "./Print.svg";
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

    for (let i = 0; i < data.length; i++) {
      currentArray.push(data[i]);

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
        >
          <div>
            <PrintIcon
              style={{ height: "20px", width: "20px" }}
              onClick={() => {
                handlePrint();
                // onClose();
              }}
            />
          </div>
          <div>
            <div className="close-icon" onClick={onClose}>
              X
            </div>
          </div>
        </div>
        <div ref={printRef} className="content-container">
          {rows?.map((newRows, index) => (
            <div
              style={{
                width: "100%",
                height: index !== 0 ? "1100px" : "1090px",
                marginTop: index !== 0 ? "20px" : "-5PX",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div className="header">
                <div className="title-card">{formName} </div>
                <div className="details-card">
                  <div className="log-container">
                    <img
                      src={logo}
                      style={{
                        height: "100px",
                        width: "100px",
                      }}
                    />
                  </div>

                  <div className="person-container">{personName} </div>
                </div>
              </div>
              <div className="body" styl>
                <DataGrid
                  columnData={columnData}
                  rowData={newRows}
                  {...props}
                />
              </div>
              <div className="modal-footer">
                <div className="footer-left">{userDetail}</div>
                <div className="footer-center">
                  Print date:{moment().format("DD-MMM-YYYY HH:MM")}
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
