import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const PrintComponent = (props) => {
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

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
            <Button
              style={{ width: "max-content" }}
              onClick={() => {
                handlePrint();
                props.onClose();
              }}
            >
              Print
            </Button>
          </div>
          <div>
            <div
              style={{
                width: "max-content",
                display: "flex",
                alignItems: "center",
              }}
              onClick={props.onClose}
            >
              X
            </div>
          </div>
        </div>
        <div ref={printRef} className="content-container">
          <div className="header">
            <div className="title-card">{props.formName} </div>
            <div className="details-card">
              <div className="log-container">
                <img
                  src={props.logo}
                  style={{
                    height: "100px",
                    width: "100px",
                  }}
                />
              </div>

              <div className="person-container">{props.personName} </div>
            </div>
          </div>
          <div className="body">
            <table>
              <tr>
                {props.columns.map((column, index) => (
                  <th
                    className="header-row"
                    style={{
                      width: column.width ?? "max-content",
                      borderRight:
                        props.columns.length - 1 === index
                          ? "1px solid black"
                          : "1px solid white",
                    }}
                  >
                    {column.headerName}
                  </th>
                ))}
              </tr>
              {props.rowData.map((row, idx) => {
                return (
                  <tr>
                    {props.columns.map((column, index) => (
                      <td
                        className={`row-${idx % 2 === 0 ? "even" : "odd"}`}
                        style={{
                          width: column.width ?? "max-content",
                          borderRight:
                            props.columns.length - 1 === index
                              ? "1px solid black"
                              : "1px solid white",
                        }}
                      >
                        {row[column.field]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </table>
          </div>
          <div className="modal-footer">
            <div style={{ width: "33%" }} className="footer-left">
              {props.userDetail}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PrintComponent;
