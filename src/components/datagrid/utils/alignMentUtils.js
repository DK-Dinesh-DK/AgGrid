import moment from "moment";
export default function alignmentUtils(column, row, childStyle, alignType) {
  let styles = childStyle;
  let symbol = ["£", "$", "₹", "€", "¥", "₣", "¢"];
  let alignment;
  if (
    !(
      column.alignment.type?.toLowerCase() === "string" ||
      column.alignment.type?.toLowerCase() === "number" ||
      column.alignment.type?.toLowerCase() === "money"
    ) &&
    (column.alignment.type?.toLowerCase() === "date" ||
      (column.alignment.type?.toLowerCase() !== "datetime" &&
        typeof row === "object" &&
        (moment(row[column.field], "YYYY-MM-DD", true).isValid() ||
          moment(row[column.field], "YYYY/MM/DD", true).isValid() ||
          moment(row[column.field], "YYYY-DD-MM", true).isValid() ||
          moment(row[column.field], "YYYY/DD/MM", true).isValid() ||
          moment(row[column.field], "MM-DD-YYYY", true).isValid() ||
          moment(row[column.field], "MM/DD/YYYY", true).isValid() ||
          moment(row[column.field], "MM-YYYY-DD", true).isValid() ||
          moment(row[column.field], "MM/YYYY/DD", true).isValid() ||
          moment(row[column.field], "DD-MM-YYYY", true).isValid() ||
          moment(row[column.field], "DD/MM/YYYY", true).isValid() ||
          moment(row[column.field], "DD-YYYY-MM", true).isValid() ||
          moment(row[column.field], "DD/YYYY/MM", true).isValid() ||
          moment(row[column.field], "DD-MMM-YYYY", true).isValid() ||
          moment(row[column.field], "DD/MMM/YYYY", true).isValid() ||
          moment(row[column.field], "DD-YYYY-MMM", true).isValid() ||
          moment(row[column.field], "DD/YYYY/MMM", true).isValid() ||
          moment(row[column.field], "MMM-DD-YYYY", true).isValid() ||
          moment(row[column.field], "MMM/DD/YYYY", true).isValid() ||
          moment(row[column.field], "MMM-YYYY-DD", true).isValid() ||
          moment(row[column.field], "MMM/YYYY/DD", true).isValid() ||
          moment(row[column.field], "YYYY-MMM-DD", true).isValid() ||
          moment(row[column.field], "YYYY/MMM/DD", true).isValid() ||
          moment(row[column.field], "YYYY-DD-MMM", true).isValid() ||
          moment(row[column.field], "YYYY/DD/MMM", true).isValid())))
  ) {
    if (alignType === "Header") {
      alignment = column.alignment.align
        ? { justifyContent: column.alignment.align }
        : {
            justifyContent: "center",
          };
    } else if (alignType === "Row") {
      alignment = column.alignment.align
        ? { textAlign: column.alignment.align }
        : {
            textAlign: "center",
            paddingRight: "6px",
            paddingLeft: "6px",
          };
    }
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    !(
      column.alignment.type?.toLowerCase() === "string" ||
      column.alignment.type?.toLowerCase() === "number" ||
      column.alignment.type?.toLowerCase() === "money"
    ) &&
    (column.alignment.type?.toLowerCase() === "time" ||
      (typeof row === "object" &&
        column.alignment.type?.toLowerCase() !== "datetime" &&
        (moment(row[column.field], "hh:mm", true).isValid() ||
          moment(row[column.field], "hh:mm:ss", true).isValid() ||
          moment(row[column.field], "hh:mm:ss a", true).isValid() ||
          moment(row[column.field], "hh:mm a", true).isValid())))
  ) {
    if (alignType === "Header") {
      alignment = column.alignment.align
        ? { justifyContent: column.alignment.align }
        : { justifyContent: "center" };
    } else if (alignType === "Row") {
      alignment = column.alignment.align
        ? { textAlign: column.alignment.align }
        : { textAlign: "center", paddingRight: "6px", paddingLeft: "6px" };
    }
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    !(
      column.alignment.type?.toLowerCase() === "string" ||
      column.alignment.type?.toLowerCase() === "number" ||
      column.alignment.type?.toLowerCase() === "money"
    ) &&
    (column.alignment.type?.toLowerCase() === "datetime" ||
      (typeof row === "object" &&
        row[column.field] &&
        JSON.stringify(row[column.field]).split(":").length > 1 &&
        (JSON.stringify(row[column.field]).split("/").length === 3 ||
          JSON.stringify(row[column.field]).split("-").length === 3)))
  ) {
    if (alignType === "Header") {
      alignment = column.alignment.align
        ? {
            justifyContent: column.alignment.align,
          }
        : { justifyContent: "center" };
    } else if (alignType === "Row") {
      alignment = column.alignment.align
        ? {
            textAlign: column.alignment.align,
            paddingRight: "6px",
            paddingLeft: "6px",
          }
        : { textAlign: "center", paddingRight: "6px", paddingLeft: "6px" };
    }
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "number" ||
    (typeof row === "object" &&
      typeof row[column.field] === "number" &&
      column.alignment.type !== "currency")
  ) {
    if (alignType === "Header") {
      alignment = column.alignment.align
        ? { justifyContent: column.alignment.align }
        : { justifyContent: "end" };
    } else if (alignType === "Row") {
      alignment = column.alignment.align
        ? { textAlign: column.alignment.align }
        : { textAlign: "end" };
    }
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "currency" ||
    (typeof row === "object" &&
      row[column.field] &&
      (symbol.includes(JSON.stringify(row[column.field])[1]) ||
        symbol.includes(
          JSON.stringify(row[column.field])[row[column.field].length]
        )))
  ) {
    if (alignType === "Header") {
      alignment = column.alignment.align
        ? { justifyContent: column.alignment.align }
        : { justifyContent: "center" };
    } else if (alignType === "Row") {
      alignment = column.alignment.align
        ? { textAlign: column.alignment.align }
        : { textAlign: "center" };
    }
    styles = {
      ...styles,
      ...alignment,
    };

    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "string" ||
    column.alignment.type?.toLowerCase() === "text" ||
    (typeof row === "object" && typeof row[column.field] === "string")
  ) {
    if (alignType === "Header") {
      alignment = column.alignment.align
        ? { justifyContent: column.alignment.align }
        : { justifyContent: "start" };
    } else if (alignType === "Row") {
      alignment = column.alignment.align
        ? { textAlign: column.alignment.align }
        : { textAlign: "start" };
    }
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  }
}
