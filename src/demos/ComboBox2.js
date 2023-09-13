import React, { useState, useCallback, useMemo, useRef } from "react";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import { getIsValid, getTooltipMessage, getValue, validateField, getThemeCriteria } from "../../src/component/12Pins/utils";
// import { useComboBoxStyle } from "../../src/component/12Pins/Theme/Theme";
import { styled } from "@mui/material/styles";
// import PushPinIcon from "@mui/icons-material/PushPin";
// import { useField } from "../component/12Pins/hooks/useField";
// import { useFormContext } from "../../src/component/12Pins/hooks/useFormContext";
// import WithTooltip from "../../src/component/12Pins/WithTooltip";

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

function ComboBox2(props) {
  const {
    options,
    multiselect,
    onChange,
    checkmarks,
    multiLabelKeys,
    multiLabelGridRatio,
    "data-testid": dataTestid,
    headerName,
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
  //     return validateField({ ...props, value, form, control: "Combo", type: props.type ?? "text" });
  //   },
  //   [props, form, props.type]
  // );

  // const [field, meta, helpers] = useField({ name: props.name });

  // const isValid = useMemo(() => {
  //   return getIsValid(props?.isValid, meta, form?.submitCount);
  // }, [meta, props?.isValid, form?.submitCount]);

  // const criteria = getThemeCriteria({ ...props, type: "default" });
  // const styling = useComboBoxStyle(
  //   criteria.theme,
  //   criteria.screen,
  //   criteria.state,
  //   criteria.type,
  //   // isValid
  // );

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  // const getColumnStyle = () => {
  //   if (multiselect && checkmarks && multiLabelGridRatio) {
  //     return `30px ${multiLabelGridRatio
  //       ?.map((ratio) => ratio)
  //       .join(" ")} auto`;
  //   } else if (multiLabelGridRatio) {
  //     return ` ${multiLabelGridRatio?.map((ratio) => ratio).join(" ")} auto`;
  //   } else return `30px repeat(${multiLabelKeys?.length}, 1fr) auto`;
  // };

  const comboBoxContainerStyles = {
    borderRadius: "0px",
    width: props.width ? props.width : "100%",
    cursor: "pointer",
    position: "absolute",
    boxSizing: "border-Box",

    // borderWidth: "50px",
    // borderStyle: props.borderStyle ? props.borderStyle : styling.borderStyle,
    // borderColor: props.borderColor ? props.borderColor : styling.borderColor,
    // backgroundColor: props.backgroundColor
    //   ? props.backgroundColor
    //   : styling.backgroundColor,
    // pointerEvents: props.pointerevent
    //   ? props.pointerevent
    //   : styling.pointerevent,
    // gridTemplateColumns: getColumnStyle(),
    // ...styling,
    // zIndex:9999,
    // position:"absolute",
    // left:0,
  };

  const comboBoxRef = useRef(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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

      if (onChange) {
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

  const value = "Dfg";

  // const tooltipMessage = useMemo(() => {
  //   return getTooltipMessage(props?.tooltipMessage, meta, form?.submitCount);
  // }, [props?.tooltipMessage, meta, form?.submitCount]);

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
      return visibleData?.map((item) => {
        const selectedValue =
          typeof valueKey === "number"
            ? parseInt(item[valueKey])
            : item[valueKey];
        const isSelected = multiselect
          ? valueIncludes(value, selectedValue)
          : value === selectedValue;
        const backgroundColor = isSelected
          ? "#EBF1DD"
          : isEvenRow
          ? "#E5EDF8"
          : "#F3F8FC";

        isEvenRow = !isEvenRow;

        const getBackgroundColor = () => {
          if (isSelected) {
            return props.selectedBackground
              ? props.selectedBackground
              : styling.selectedBackground;
          }

          return item.id % 2 === 0
            ? props.evenBackground
              ? props.evenBackground
              : styling.evenBackground
            : props.oddBackground;
        };

        const handleMouseEnter = (e) => {
          e.currentTarget.style.backgroundColor = isSelected
            ? props.selectedBackground
              ? props.selectedBackground
              : styling.selectedBackground
            : "#D7E3BC";

          e.currentTarget.style.border = "1px solid #9BBB59";
        };

        const handleMouseLeave = (e) => {
          e.currentTarget.style.backgroundColor = getBackgroundColor();

          e.currentTarget.style.border = "1px solid #ffffff";
        };

        return (
          <StyledDiv
            role="option"
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
              // height: "22px",
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
              backgroundColor: backgroundColor,
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
                      checked={isSelected}
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
                    checked={isSelected}
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

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const selectedDisplay =
    multiselect && Array.isArray(value) && value.length > 0
      ? value
          .map(
            (val) => options?.find((item) => item[valueKey] === val)?.[labelKey]
          )
          .join(", ")
      : !multiselect &&
        (value === 0 ? true : value) &&
        options?.find((item) => valueIncludes([item[valueKey]], value))?.[
          labelKey
        ];

  return (
    // <WithTooltip
    //   type={isValid ? "default" : "error"}
    //   message={tooltipMessage}
    //   open={props.open}
    //   arrow={props.arrow}
    // >
    <div
      role="comboBox"
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
          className="styledInput"
          onClick={handleClose}
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
            // caretColor: "transparent",
            // alignItems: "center",
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
          value={selectedDisplay === false ? [] : selectedDisplay}
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
            role="button"
            // style={{
            //   height: props.iconHeight ? props.iconHeight : styling.iconHeight,
            //   width: props.iconWidth ? props.iconWidth : styling.iconWidth,
            //   backgroundColor: props.iconBackgroundColor
            //     ? props.iconBackgroundColor
            //     : styling.iconBackgroundColor,
            //   border: `1px solid ${styling.iconborderColor}`,
            //   display: "flex",
            //   alignItems: "center",
            //   boxSizing: props.boxSizing
            //     ? props.boxSizing
            //     : styling.boxSizingStyle,
            //   justifyContent: "center",
            //   cursor: "pointer",
            //   transform: props.translateY
            //     ? props.translateY
            //     : styling.translateY,
            //   pointerEvents: props.pointerevent
            //     ? props.pointerevent
            //     : styling.pointerevent,
            //   borderLeftWidth: props.iconborderLeftWidth
            //     ? props.iconborderLeftWidth
            //     : styling.iconborderLeftWidth,
            //   borderLeftStyle: props.iconborderLeftStyle
            //     ? props.iconborderLeftStyle
            //     : styling.iconborderLeftStyle,
            //   borderLeftColor: props.iconborderLeftColor
            //     ? props.iconborderLeftColor
            //     : styling.iconborderLeftColor,
            // }}
          >
            arr
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          style={{
            backgroundColor: "white",
            width: props.width ? props.width : "100%",
            position: "absolute",
            zIndex: 9999,
            color: "black",
          }}
          className="comboBoxToggle"
        >
          <div
            role="header"
            // style={{
            //   backgroundColor: props.headerBackground
            //     ? props.headerBackground
            //     : styling.headerBackground,
            //   color: props.headerFontColor
            //     ? props.headerFontColor
            //     : styling.headerFontColor,
            //   fontSize: props.headerFontSize
            //     ? props.headerFontSize
            //     : styling.headerFontSize,
            //   fontFamily: props.headerFontFamily
            //     ? props.headerFontFamily
            //     : styling.headerFontFamily,
            //   paddingLeft: multiLabelKeys ? "0px" : "8px",
            //   height: headerName ? "24px" : "0px",
            //   position: pin ? "sticky" : "",
            //   top: 0,
            //   zIndex: 1,
            // }}
          >
            <div
              style={{
                width: "100%",
                display: "grid",
                fontSize: "11px",
                alignItems: "center",
                height: "24px",
                gridTemplateColumns: multiLabelGridRatio
                  ? `30px ${multiLabelGridRatio
                      ?.map((ratio) => ratio)
                      .join(" ")} auto`
                  : `30px repeat(${multiLabelKeys?.length}, 1fr) auto`,
              }}
            >
              {headerName && multiLabelKeys ? (
                <>
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
                      onChange={handleSelectAll}
                      checked={selectAll}
                    ></input>
                  </div>

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
                      push
                      {/* <PushPinIcon
                        style={{
                          transform:
                            x === true ? "rotate(1deg)" : "rotate(180deg)",
                          fill: props.pinColor
                            ? props.pinColor
                            : styling.pinColor,
                          cursor: "pointer",
                          fontSize: "15px",
                          display: "flex",
                          justifyContent: "end",
                        }}
                        data-testid={
                          dataTestid === undefined
                            ? null
                            : `${dataTestid}-pinicon`
                        }
                      /> */}
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
                          transform:
                            x === true ? "rotate(1deg)" : "rotate(180deg)",
                          fill: props.pinColor
                            ? props.pinColor
                            : styling.pinColor,
                          cursor: "pointer",
                          fontSize: "15px",
                        }}
                        onClick={handlePin}
                        data-testid={
                          dataTestid === undefined
                            ? null
                            : `${dataTestid}-pinicon`
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div style={comboBoxListStyles}>
            <HandleScroll></HandleScroll>
          </div>
        </div>
      )}
    </div>
    // </WithTooltip>
  );
}

export default ComboBox2;

/*                               ComboBox
------------------------------------------------------------------------------------------------------------------------------
As per new defination we have theme, screen, state.
we have 2 themes i.e. midblue and darkblue. By default midblue.
we have 2 screens i.e. normal and mandatory. By default normal.
we have 3 states i.e. normal/active, disabled/inactive and readonly. By default normal/active.


When the user gives multilable he will get pin option by clicking of which user can make screen as static and normal 

All styling are pre-defined as per new defination.

Properties:
1. placeholder: helps to show helper text when no options is selected.
2. options: accepts array of JS object to render options in combo box.
3. labelKey: allows to select label key from JS object which needs to bind label of options.
4. valueKey: allows to select value key from JS object which needs to bind value of options.
5. value: allows to pre select the options and can be change the value when needed with help of onChange or with some other logic. 
6. onChange: accepts event handling function.
7. className: override or extend the styles applied to the component
8. multiselect: allows select multiple options.
	a. checkmarks: allows checkbox brfore each options. Works together with multiselect.
	b. multiLabel: allows to show multiple data columns in the options.
		i. multiLabelKeys: accepts array of strings which are keys which refer to options(pt. 2) object to fill the option list. e.g. multilabelKeys={["GameTitle", "Rating", "Like", "DisLike"]}
		ii. multiLabelGridRatio: provides ratio to the grid where data is displayed by default is equal space for all columns. e.g. multiLabelGridRatio="70% 10% 10% 10%" for 4 column data
9. headerName - headerName prop is use to show header in comboBox

Sample declaration to access single value from combobox -
const cdata = [
    { value: "oliver hansen", listname: "OLIVER HANSEN", displayValue: "Oliver Hansen", status: "offline" },
    { value: "van henry", listname: "VAN HENRY", displayValue: "Van Henry", status: "online" },
    { value: "april tucker", listname: "APRIL TUCKER", displayValue: "April Tucker", status: "offline" },
    { value: "ralph hubbard", listname: "RALPH HUBBARD", displayValue: "Ralph Hubbard", status: "online" },
    { value: "carlos abbott", listname: "CARLOS ABBOTT", displayValue: "Carlos Abbott", status: "offline" },
  ];

  const[sname,setSname]=React.useState()
  function handleChange1(e) {
    console.log("value in app.js", e.target.value);
    setSname(e.target.value);
  }

Theme: midblue
Screen: normal
1. Normal/Active(Dafault)- 
	<ComboBox theme="midblue" screen="normal" active options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="normal" normal options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="midblue" screen="normal" inactive options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="normal" disabled options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="midblue" screen="normal" readonly options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

Screen: mandatory
1. Normal/Active(Dafault)- 
	<ComboBox theme="midblue" screen="mandatory" active options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="mandatory" normal options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="midblue" screen="mandatory" inactive options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="mandatory" disabled options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="midblue" screen="mandatory" readonly options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />


Theme: darkblue
Screen: normal
1. Normal/Active(Dafault)- 
	<ComboBox theme="darkblue" screen="normal" active options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="normal" normal options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="darkblue" screen="normal" inactive options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="normal" disabled options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="darkblue" screen="normal" readonly options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

Screen: mandatory
1. Normal/Active(Dafault)- 
	<ComboBox theme="darkblue" screen="mandatory" active options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="mandatory" normal options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="darkblue" screen="mandatory" inactive options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="mandatory" disabled options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="darkblue" screen="mandatory" readonly options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />


ComboBox defination without any considaration will provide theme=midblue, screen=normal and state=active.
<ComboBox multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

Theme: midblue
Screen: normal
1. Normal/Active(Dafault)- 
	<ComboBox theme="midblue" screen="normal" active multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="normal" normal multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="midblue" screen="normal" inactive multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="normal" disabled multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="midblue" screen="normal" readonly multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

Screen: mandatory
1. Normal/Active(Dafault)- 
	<ComboBox theme="midblue" screen="mandatory" active multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="mandatory" normal multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="midblue" screen="mandatory" inactive multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="midblue" screen="mandatory" disabled multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="midblue" screen="mandatory" readonly multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />


Theme: darkblue
Screen: normal
1. Normal/Active(Dafault)- 
	<ComboBox theme="darkblue" screen="normal" active multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="normal" normal multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="darkblue" screen="normal" inactive multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="normal" disabled multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="darkblue" screen="normal" readonly multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

Screen: mandatory
1. Normal/Active(Dafault)- 
	<ComboBox theme="darkblue" screen="mandatory" active multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="mandatory" normal multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

2. Disabled- 
	<ComboBox theme="darkblue" screen="mandatory" inactive multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />
	or
	<ComboBox theme="darkblue" screen="mandatory" disabled multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

3. Readonly- 
	<ComboBox theme="darkblue" screen="mandatory" readonly multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />


Customization:
#### Component can be customized by external CSS by providing className
<ComboBox className="custom-combo" multiselect checkmarks options={cdata} value={sname} onChange={(e) => handleChange1(e)} placeholder="select one" />

Sample Declaration for Multi Column 
<ComboBox multiselect multiLabel checkmarks options={<data from DB>} value={<state for selected values>} labelKey="<labelKey from JS OBJ>" valueKey="<valueKey from JS OBJ>" onChange={<lambda functions>} textAlign="left" 	width="250px" mandatory placeholder="select one" multiLabelKeys={["GameTitle", "Rating", "Like", "DisLike"]} multiLabelGridRatio="70% 10% 10% 10%" />

#### example for multilable/ multicolumn - 

For single select - 
           <ComboBox
            multiLabel
            options={LargeData}
            value={sname}
            labelKey="PartyName"
            valueKey="PartyID"
            onChange={(e) => handleChange1(e)}
            placeholder="select one"
            multiLabelKeys={["PartyID", "PartyName", "UserName", "ApplicationUserID"]}
            headerName={["PartyID", "PartyName", "UserName", "ApplicationUserID"]}
            multiLabelGridRatio={["5%", "50%", "25%", "5%"]}
          />


For multiselect - 
           <ComboBox
            multiselect
            multiLabel
            checkmarks
            options={LargeData}
            value={sname}
            labelKey="PartyName"
            valueKey="PartyID"
            onChange={(e) => handleChange1(e)}
            placeholder="select one"
            multiLabelKeys={["PartyID", "PartyName", "UserName", "ApplicationUserID"]}
            headerName={["PartyID", "PartyName", "UserName", "ApplicationUserID"]}
            multiLabelGridRatio={["5%", "50%", "25%", "5%"]}
          />

#### To get headername in combobox -
        <ComboBox options={cdata} value={singleSelectedValue} valueKey="value" labelKey="listname" headerName="Lai_Webui" onChange={(e) => handleChangeSingle(e)} />
          */
