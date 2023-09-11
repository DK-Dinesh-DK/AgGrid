import React,{ useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
export function FilterRendererWithSvg(
  column,
  filterClassname,
  filters,
  setFilters,
  setFilterType,
  gridWidth
) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const tooltipRef = useRef(null)
  const handleButtonClick = (event) => {
    setButtonRect(event.target.getBoundingClientRect());
    if (isOpen === false && !column.readOnly) {
      setIsOpen(true) ;
    } else if (isOpen === true) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipRef]);

  // Calculate the left position of the tooltip based on the buttonRect and viewport width
  const left = buttonRect && buttonRect.left + window.pageXOffset;
  const tooltipWidth = 200;

  const tooltipLeft =
    left + tooltipWidth > gridWidth ? left - tooltipWidth : left;

  const getFilterValue = useCallback(
    (event) => {
      const value = event.target.value;
      setFilterType(value);
    },
    [setFilterType]
  );

  const getInputValue = useCallback(
    (event, filters) => {
      const value = event.target.value;

      setFilters({
        ...filters,
        [column.field]: value,
      });
    },
    [setFilters, column.field]
  );

  return (
    <div className={filterClassname} style={{cursor:column.readOnly?"default":"pointer"}}>
      {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <svg
       data-testid={`filterIcon_${column.headerName}`}
        xmlns="http://www.w3.org/2000/svg"
        width="10px"
        height="10px"
        version="1.1"
        // style="shapeRendering:geometricPrecision; textRendering:geometricPrecision; imageRendering:optimizeQuality; fillRule:evenodd; clipRule:evenodd"
        viewBox="0 0 507 511.644"
        onClick={handleButtonClick}
        fill="white"
      >
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer" />
          <path
            className="fil0"
            d="M192.557 241.772c5.368,5.842 8.316,13.476 8.316,21.371l0 232.663c0,14.002 16.897,21.109 26.898,11.265l64.905 -74.378c8.684,-10.422 13.475,-15.581 13.475,-25.901l0 -143.597c0,-7.897 3.001,-15.529 8.318,-21.373l186.236 -202.081c13.947,-15.159 3.21,-39.741 -17.424,-39.741l-459.536 0c-14.188,0 -23.722,11.594 -23.745,23.784 -0.01,5.541 1.945,11.204 6.321,15.957l186.236 202.031 0 0z"
          />
        </g>
      </svg>
      {isOpen
        ? ReactDOM.createPortal(
            <div
            data-testid="filterDropdown"
              ref={tooltipRef}
              style={{
                position: "absolute",
                zIndex: 1300,
                top: buttonRect.top + buttonRect.height,
                left: tooltipLeft,
                // background:"white",
                // padding:"4px",
                // // width:"178px",
                // boxSizing:"border-box",
                // borderRadious:"4px"
              }}
              className="popover"
            >
              <form
                style={{
                  width: "200px",

                  padding: "10px 10px",
                  background: "white",
                  borderRadius: "6px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                <select
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    fontSize: "16px",
                    height: "24px",
                    margin: 0,
                    outline: 0,
                    border: '1px solid #b6b6b6',
                    width: "100%",
                    backgroundColor: "#e8eeef",
                    color: "black",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.03) inset",
                    marginBottom: "10px",
                    borderRadius: "2px",
                  }}
                  onChange={getFilterValue}
                >
                  <option>Contain</option>
                  <option>Starts With...</option>
                  <option>Ends With...</option>
                  <option>Equals</option>
                  <option>Not Equals</option>
                </select>

                <input
                  type="text"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    fontSize: "16px",
                    height: "24px",
                    margin: 0,
                    outline: 0,
                    border: '1px solid #b6b6b6',
                    boxSizing:"border-box",
                    width: "100%",
                    backgroundColor: "#e8eeef",
                    color: "black",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.03) inset",
                    marginBottom: "0px",
                    borderRadius: "2px",
                  }}
                  value={filters?.[column.field]}
                  placeholder="Search..."
                  onChange={(e) => getInputValue(e, filters)}
                  onKeyDown={inputStopPropagation}
                />
              </form>
            </div>,

            document.body
          )
        : null}
    </div>
  );
}

function inputStopPropagation(event) {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.stopPropagation();
  }
}
