import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { styled } from "@mui/material/styles";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import PushPinIcon from "@mui/icons-material/PushPin";
// import WithTooltip from "./WithTooltip";
// import { useFormContext } from "./hooks/useFormContext";
// import {
//   getIsValid,
//   getTooltipMessage,
//   getValue,
//   validateField,
//   getThemeCriteria,
// } from "./utils";
// import { useField } from "./hooks/useField";
// import { useComboBoxStyle } from "./Theme/Theme";
import ReactDom from "react-dom";

const StyledInput = styled("input", {
  shouldForwardProp: (props) => props !== "width",
})((props) => ({
  width: "50px",
  backgroundColor: props.backgroundColor,
  ":focus-within": {
    border: "none",
    outline: "none",
  },
}));

const StyledDiv = styled("div", {
  shouldForwardProp: (props) => props !== "width",
})((props) => ({}));

const valueIncludes = (array, value) => {
  return array.some(
    (val) => val === value || (val && val.toString() === value?.toString())
  );
};

function ComboBox(props) {
  const {
    options,
    multiselect,
    onChange,
    checkmarks,
    multiLabelKeys,
    multiLabelGridRatio,
    "data-testid": dataTestid,
    headerName,
    isInsideAgGrid,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [pin, setPin] = useState(false);
  const [x, setX] = useState(false);

  const labelKey = props.labelKey || "listname";
  const valueKey = props.valueKey || "value";

  const handlePin = () => {
    setPin(!pin);

    setX(!x);
  };

  // const form = useFormContext();

  // const validate = useCallback(
  //   (value) => {
  //     return validateField({
  //       ...props,
  //       value,
  //       form,
  //       control: "Combo",
  //       type: props.type ?? "text",
  //     });
  //   },
  //   [props, form, props.type]
  // );

  // const [field, meta, helpers] = useField({
  //   name: props.name,
  //   validate: validate,
  // });

  // const isValid = useMemo(() => {
  //   return getIsValid(props?.isValid, meta, form?.submitCount);
  // }, [meta, props?.isValid, form?.submitCount]);

  // const criteria = getThemeCriteria({ ...props, type: "default" });
  // const styling = useComboBoxStyle(
  //   criteria.screen,
  //   criteria.state,
  //   criteria.type,
  //   isValid
  // );

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  const getColumnStyle = () => {
    if (multiselect && checkmarks && multiLabelGridRatio) {
      return `30px ${multiLabelGridRatio
        ?.map((ratio) => ratio)
        .join(" ")} auto`;
    } else if (multiLabelGridRatio) {
      return ` ${multiLabelGridRatio?.map((ratio) => ratio).join(" ")} auto`;
    } else return `30px repeat(${multiLabelKeys?.length}, 1fr) auto`;
  };

  const comboBoxContainerStyles = {
    borderRadius: "0px",
    width: props.width ? props.width : "100%",
    cursor: "pointer",
    boxSizing: "border-Box",

    // borderWidth: props.borderWidth ? props.borderWidth : styling.borderWidth,
    // borderStyle: props.borderStyle ? props.borderStyle : styling.borderStyle,
    // borderColor: props.borderColor ? props.borderColor : styling.borderColor,
    // backgroundColor: props.backgroundColor
    //   ? props.backgroundColor
    //   : styling.backgroundColor,
    // pointerEvents: props.pointerevent
    //   ? props.pointerevent
    //   : styling.pointerevent,
    gridTemplateColumns: getColumnStyle(),
    // ...styling,
  };

  const comboBoxRef = useRef(null);
  const comboBoxPositionRef = useRef(null);
  const [value1, setValue1] = React.useState();

  const toggleDropdown = (e) => {
    setIsOpen(!isOpen);
    let comboPosition = comboBoxRef?.current.getBoundingClientRect();
    let comboPositionStyle = e.target.getBoundingClientRect();
    setValue1({
      left: comboPosition.x,
      top: comboPositionStyle.top + comboPositionStyle.height + window.scrollY,
      height: comboPositionStyle.height,
      width: comboPositionStyle.width,
    });
  };
  const comboBoxPosiRef = useRef(null);

  // useEffect(() => {
  //   console.log("YEss", comboBoxPosiRef);
  // }, [comboBoxPosiRef]);
  if (isOpen) {
    console.log(
      "Nooo",
      value1.top,
      options.length,
      value1.top + options.length * 22,
      window.innerHeight
    );
  }
  const handleSelectAll = (e) => {
    const allValues = options?.map((item) => item[valueKey]);
    delete e.target.value;
    let event = { ...e, target: { ...e.target, value: allValues } };
    e.target.value = [...allValues];
    if (!selectAll) {
      onChange(event, options);
    } else {
      event = { ...e, target: { ...e.target, value: [] } };
      e.target.value = [];
      onChange(event, []);
    }
    setSelectAll(!selectAll);
  };

  const comboBoxListStyles = {
    listStyle: "none",
    padding: "0",
    overflowY: "auto",
    height: options?.length > 10 ? "180px" : "auto",
  };

  const handleItemClick = (e = { target: {} }, item) => {
    if (multiselect) {
      e.preventDefault();
      e.stopPropagation();
      const updatedValues = value.includes(item[valueKey])
        ? value.filter((val) => val !== item[valueKey])
        : [...value, item[valueKey]];
      const selectedObjects = updatedValues.map((val) =>
        options?.find((obj) => obj[valueKey] === val)
      );
      delete e.target.value;
      const event = { ...e, target: { ...e.target, value: updatedValues } };
      e.target.value = [...updatedValues];
      if (helpers) {
        helpers.setValue(event.target.value);

        if (onChange) {
          props?.onChange(event, selectedObjects);
        }
      } else if (onChange) {
        props?.onChange(event, selectedObjects);
      }
    } else {
      const selectedValue =
        typeof valueKey === "number"
          ? parseInt(item[valueKey])
          : item[valueKey];
      e.target.value = selectedValue;

      if (helpers) {
        helpers.setValue(e.target.value);

        if (onChange) {
          props?.onChange(e, [item]);
        }
      } else if (onChange) {
        props?.onChange(e, [item]);
      }

      setIsOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleBlur = useCallback(
    (e) => {
      setTimeout(() => {
        if (props.onBlur) {
          props.onBlur(e);
        } else if (form && props.name) {
          helpers?.setTouched(true);
        }
      }, 100);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.name, props.onBlur]
  );

  // const value = useMemo(() => {
  //   return getValue(props?.value, field?.value);
  // }, [props?.value, field?.value]);

  // const tooltipMessage = useMemo(() => {
  //   return getTooltipMessage(props?.tooltipMessage, meta, form?.submitCount);
  // }, [props?.tooltipMessage]);

  const HandleScroll = () => {
    if (comboBoxRef.current) {
      const { scrollTop, clientHeight } = comboBoxRef.current;
      const buffer = 100;
      const startIndex = Math.floor(scrollTop / 30);
      const endIndex = Math.min(
        startIndex + Math.ceil(clientHeight / 30) + buffer,
        options?.length
      );
      const visibleData = options?.slice(startIndex, endIndex);
      let isEvenRow = true;
      return visibleData?.map((item, index) => {
        const selectedValue =
          typeof valueKey === "number"
            ? parseInt(item[valueKey])
            : item[valueKey];
        // const isSelected = multiselect
        //   ? valueIncludes(value, selectedValue)
        //   : value === selectedValue;
        // const backgroundColor = isSelected
        // ? "#EBF1DD"
        // : isEvenRow
        // ? "#E5EDF8"
        // : "#F3F8FC";

        isEvenRow = !isEvenRow;

        // const getBackgroundColor = () => {
        //   // if (isSelected) {
        //   //   return props.selectedBackground
        //   //     ? props.selectedBackground
        //   //     : styling.selectedBackground;
        //   // }

        //   return item.id % 2 === 0
        //     ? props.evenBackground
        //       ? props.evenBackground
        //       : styling.evenBackground
        //     : props.oddBackground
        //     ? props.oddBackground
        //     : styling.oddBackground;
        // };

        const handleMouseEnter = (e) => {
          // e.currentTarget.style.backgroundColor = isSelected
          //   ? props.selectedBackground
          //     ? props.selectedBackground
          //     : styling.selectedBackground
          //   : "#D7E3BC";

          e.currentTarget.style.border = "1px solid #9BBB59";
        };

        const handleMouseLeave = (e) => {
          // e.currentTarget.style.backgroundColor = getBackgroundColor();

          e.currentTarget.style.border = "1px solid #ffffff";
        };

        return (
          <StyledDiv
            role="option"
            key={index}
            aria-label={item[labelKey]}
            aria-labelledby={item[labelKey]}
            className="option-item"
            onClick={(e) => handleItemClick(e, item)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              border: "1px solid white",
              cursor: "pointer",
              // fontSize: props.fontSize ? props.fontSize : styling.fontSize,
              // fontFamily: props.fontFamily
              //   ? props.fontFamily
              //   : styling.fontFamily,
              height: "22px",
              // color: props.fontColor ? props.fontColor : styling.fontColor,
              // fontStyle: props.fontStyle ? props.fontStyle : styling.fontStyle,
              // textDecoration: props.textDecoration
              //   ? props.textDecoration
              //   : styling.textDecoration,
              // textTransform: props.textTransform
              //   ? props.textTransform
              //   : styling.textTransform,
              // fontWeight: props.fontWeight
              //   ? props.fontWeight
              //   : styling.fontWeight,
              // lineHeight: props.lineHeight
              //   ? props.lineHeight
              //   : styling.lineHeight,
              // backgroundColor: backgroundColor,
              boxSizing: "border-box",
              display: "grid",
              alignItems: "center",
              // gridTemplateColumns: getColumnStyle(),
            }}
            data-testid={
              dataTestid === undefined ? null : `${dataTestid}-mouse`
            }
          >
            {multiLabelKeys && (
              <>
                {multiselect && checkmarks && (
                  <div
                    style={{
                      borderRight: "1px solid white",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "8px",
                    }}
                  >
                    <input
                      type="checkBox"
                      // checked={isSelected}
                      onClick={(e) => handleItemClick(e, item)}
                    />
                  </div>
                )}

                {multiLabelKeys.map((x, index) => (
                  <div
                    key={x}
                    style={{
                      borderRight:
                        index === multiLabelKeys.length - 1
                          ? ""
                          : "1px solid #ffffff",
                      boxSizing: "border-box",
                      paddingLeft: "8px",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item[x]}
                  </div>
                ))}
              </>
            )}

            {!multiLabelKeys && (
              <div
                id={item[labelKey]}
                style={{ display: "flex", paddingLeft: "8px" }}
              >
                {multiselect && checkmarks && (
                  <input
                    type="checkBox"
                    // checked={isSelected}
                    onClick={(e) => handleItemClick(e, item)}
                  />
                )}
                {item[labelKey]}
              </div>
            )}
          </StyledDiv>
        );
      });
    }
    return null;
  };

  const HandleOpenDiv = () => {
    return (
      <div
        style={{
          // backgroundColor: props.headerBackground
          //   ? props.headerBackground
          //   : styling.headerBackground,
          // color: props.headerFontColor
          //   ? props.headerFontColor
          //   : styling.headerFontColor,
          // fontSize: props.headerFontSize
          //   ? props.headerFontSize
          //   : styling.headerFontSize,
          // fontFamily: props.headerFontFamily
          //   ? props.headerFontFamily
          //   : styling.headerFontFamily,
          paddingLeft: multiLabelKeys ? "0px" : "8px",
          height: headerName ? "24px" : "0px",
          position: pin ? "sticky" : "",
          top: 0,
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "grid",
            fontSize: "11px",
            alignItems: "center",
            height: "24px",
            gridTemplateColumns: getColumnStyle(),
          }}
        >
          {headerName && multiLabelKeys ? (
            <>
              {checkmarks && (
                <div
                  style={{
                    borderRight: "1px solid white",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "8px",
                  }}
                >
                  <input
                    type="checkBox"
                    role="header"
                    onChange={handleSelectAll}
                    checked={selectAll}
                  ></input>
                </div>
              )}

              {headerName.map((x, index) => (
                <div
                  key={x}
                  style={{
                    borderRight:
                      index === multiLabelKeys.length - 1
                        ? ""
                        : "1px solid #ffffff",
                    boxSizing: "border-box",
                    paddingLeft: "8px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {x}
                </div>
              ))}

              {headerName && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {/* <PushPinIcon
                    style={{
                      transform: x === true ? "rotate(1deg)" : "rotate(180deg)",
                      fill: props.pinColor ? props.pinColor : styling.pinColor,
                      cursor: "pointer",
                      fontSize: "15px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                    data-testid={
                      dataTestid === undefined ? null : `${dataTestid}-pinicon`
                    }
                  /> */}
                  pushicon
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 15px",
                alignItems: "center",
              }}
              data-testid={
                dataTestid === undefined ? null : `${dataTestid}-header`
              }
            >
              {headerName}

              {headerName && (
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <PushPinIcon
                    style={{
                      transform: x === true ? "rotate(1deg)" : "rotate(180deg)",
                      // fill: props.pinColor ? props.pinColor : styling.pinColor,
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                    onClick={handlePin}
                    data-testid={
                      dataTestid === undefined ? null : `${dataTestid}-pinicon`
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // const selectedDisplay =
  //   multiselect && Array.isArray(value) && value.length > 0
  //     ? value
  //         .map(
  //           (val) => options?.find((item) => item[valueKey] === val)?.[labelKey]
  //         )
  //         .join(", ")
  //     : !multiselect &&
  //       (value === 0 ? true : value) &&
  //       options?.find((item) => valueIncludes([item[valueKey]], value))?.[
  //         labelKey
  //       ];

  const comboRef = useRef();
  let comboOptionWidth = `${comboRef.current?.clientWidth + 20}px`;

  return (
    // <WithTooltip
    //   type={isValid ? "default" : "error"}
    //   message={tooltipMessage}
    //   open={props.open}
    //   arrow={props.arrow}
    // >
    <div
      ref={comboBoxRef}
      style={comboBoxContainerStyles}
      onClick={toggleDropdown}
    >
      <div
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <StyledInput
          role="combobox"
          className="styledInput"
          onClick={handleClose}
          ref={comboRef}
          style={{
            cursor: "pointer",
            height: "20px",
            display: "grid",
            width: "100%",
            gridTemplateColumns: "100%",
            overflow: "hidden",
            borderRadius: "0px",
            boxSizing: "border-box",
            // backgroundColor: props.backgroundColor
            //   ? props.backgroundColor
            //   : styling.backgroundColor,
            // fontSize: props.fontSize ? props.fontSize : styling.fontSize,
            caretColor: "transparent",
            alignItems: "center",
            // fontFamily: props.fontFamily
            //   ? props.fontFamily
            //   : styling.fontFamily,
            // color: props.fontColor ? props.fontColor : styling.fontColor,
            // fontStyle: props.fontStyle ? props.fontStyle : styling.fontStyle,
            // textDecoration: props.textDecoration
            //   ? props.textDecoration
            //   : styling.textDecoration,
            // textTransform: props.textTransform
            //   ? props.textTransform
            //   : styling.textTransform,
            // fontWeight: props.fontWeight
            //   ? props.fontWeight
            //   : styling.fontWeight,
            // lineHeight: props.lineHeight
            //   ? props.lineHeight
            //   : styling.lineHeight,
            // pointerEvents: props.pointerevent
            //   ? props.pointerevent
            //   : styling.pointerevent,
            border: "none",
          }}
          id={props.id}
          onClose={handleBlur}
          // value={selectedDisplay === false ? [] : selectedDisplay}
          // isValid={isValid}
          // {...styling}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div
            style={{
              // height: props.iconHeight
              //   ? props.iconHeight
              //   : styling.iconHeight,
              // width: props.iconWidth ? props.iconWidth : styling.iconWidth,
              // backgroundColor: props.iconBackgroundColor
              //   ? props.iconBackgroundColor
              //   : styling.iconBackgroundColor,
              // border: `1px solid ${styling.iconborderColor}`,
              display: "flex",
              alignItems: "center",
              // boxSizing: props.boxSizing
              //   ? props.boxSizing
              //   : styling.boxSizingStyle,
              justifyContent: "center",
              cursor: "pointer",
              // transform: props.translateY
              //   ? props.translateY
              //   : styling.translateY,
              // pointerEvents: props.pointerevent
              //   ? props.pointerevent
              //   : styling.pointerevent,
              // borderLeftWidth: props.iconborderLeftWidth
              //   ? props.iconborderLeftWidth
              //   : styling.iconborderLeftWidth,
              // borderLeftStyle: props.iconborderLeftStyle
              //   ? props.iconborderLeftStyle
              //   : styling.iconborderLeftStyle,
              // borderLeftColor: props.iconborderLeftColor
              //   ? props.iconborderLeftColor
              //   : styling.iconborderLeftColor,
            }}
          >
            arrow
          </div>
        </div>
      </div>
      {!isInsideAgGrid ? (
        isOpen && options?.length > 0 ? (
          <div
            style={{
              backgroundColor: "white",
              width: comboOptionWidth,
              position: "absolute",
              zIndex: 9999,
            }}
            className="comboBoxToggle"
          >
            <HandleOpenDiv />
            <div style={comboBoxListStyles}>
              <HandleScroll></HandleScroll>
            </div>
          </div>
        ) : (
          isOpen && (
            <div
              style={{
                backgroundColor: "white",
                height: "22px",
                width: comboOptionWidth,
                position: "absolute",
                zIndex: 9999,
              }}
              className="comboBoxToggle"
            ></div>
          )
        )
      ) : (
        <div>
          {isOpen && options.length > 0
            ? ReactDom.createPortal(
                <div
                  ref={comboBoxPosiRef}
                  style={{
                    backgroundColor: "white",
                    width: comboOptionWidth,
                    position: "absolute",
                    zIndex: 22,
                    top: value1.top,
                    left: value1.left + window.pageXOffset,
                  }}
                  className="comboBoxToggle"
                >
                  <HandleOpenDiv />
                  <div style={comboBoxListStyles}>
                    <HandleScroll></HandleScroll>
                  </div>
                </div>,

                document.body
              )
            : isOpen && (
                <div
                  ref={comboBoxPositionRef}
                  style={{
                    backgroundColor: "#E5EDF8",
                    boxSizing: "borderBox",
                    border: "1px solid white",
                    width: comboOptionWidth,
                    position: "absolute",
                    zIndex: 22,
                    height: "22px",
                    top: value1.top + value1.height + window.scrollY,
                    left: value1.left + window.pageXOffset,
                  }}
                  className="comboBoxToggle"
                ></div>
              )}
        </div>
      )}
    </div>
    // </WithTooltip>
  );
}

export default ComboBox;
