import moment from "moment";
export default function alignmentUtilsHeader(column, row, childStyle) {
  let styles = childStyle;
  let symbol = ["£", "$", "₹", "€", "¥", "₣", "¢"];
  if (
    column.alignment.type?.toLowerCase() === "date" ||
    (column.alignment.type?.toLowerCase() !== "datetime" &&
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
        moment(row[column.field], "YYYY/DD/MMM", true).isValid())) ||
    (row[column.field] &&
      column.alignment.type?.toLowerCase() !== "datetime" &&
      (JSON.stringify(row[column.field]).split("/").length === 3 ||
        JSON.stringify(row[column.field]).split("-").length === 3))
  ) {
    const alignmentStyle = column.alignment.align
      ? { justifyContent: column.alignment.align }
      : {
          justifyContent: "center",
        };
    styles = {
      ...styles,
      ...alignmentStyle,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "time" ||
    (column.alignment.type?.toLowerCase() !== "datetime" &&
      (moment(row[column.field], "hh:mm", true).isValid() ||
        moment(row[column.field], "hh:mm:ss", true).isValid() ||
        moment(row[column.field], "hh:mm:ss a", true).isValid() ||
        moment(row[column.field], "hh:mm a", true).isValid())) ||
    (row[column.field] &&
      column.alignment.type?.toLowerCase() !== "datetime" &&
      JSON.stringify(row[column.field]).split(":").length > 1)
  ) {
    const alignment = column.alignment.align
      ? { justifyContent: column.alignment.align }
      : { justifyContent: "center" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "datetime" ||
    (row[column.field] &&
      JSON.stringify(row[column.field]).split(":").length > 1 &&
      (JSON.stringify(row[column.field]).split("/").length === 3 ||
        JSON.stringify(row[column.field]).split("-").length === 3))
  ) {
    const alignment = column.alignment.align
      ? {
          justifyContent: column.alignment.align,
        }
      : { justifyContent: "center" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "number" ||
    (typeof row[column.field] === "number" &&
      column.alignment.type !== "currency")
  ) {
    let alignment = column.alignment.align
      ? { justifyContent: column.alignment.align }
      : { justifyContent: "end" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "currency" ||
    (row[column.field] &&
      (symbol.includes(JSON.stringify(row[column.field])[1]) ||
        symbol.includes(
          JSON.stringify(row[column.field])[row[column.field].length]
        )))
  ) {
    var alignment = column.alignment.align
      ? { justifyContent: column.alignment.align }
      : { justifyContent: "center" };
    styles = {
      ...styles,
      ...alignment,
    };

    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "string" ||
    column.alignment.type?.toLowerCase() === "text" ||
    typeof row[column.field] === "string"
  ) {
    const alignment = column.alignment.align
      ? { justifyContent: column.alignment.align }
      : { justifyContent: "start" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  }
}

export function alignmentUtilsCell(column, row, childStyle) {
  let styles = childStyle;
  let symbol = ["£", "$", "₹", "€", "¥", "₣", "¢"];
  if (
    column.alignment.type?.toLowerCase() === "date" ||
    (column.alignment.type?.toLowerCase() !== "datetime" &&
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
        moment(row[column.field], "YYYY/DD/MMM", true).isValid())) ||
    (row[column.field] &&
      column.alignment.type?.toLowerCase() !== "datetime" &&
      (JSON.stringify(row[column.field]).split("/").length === 3 ||
        JSON.stringify(row[column.field]).split("-").length === 3))
  ) {
    const alignmentStyle = column.alignment.align
      ? { textAlign: column.alignment.align }
      : {
          textAlign: "center",
          paddingRight: "6px",
          paddingLeft: "6px",
        };
    styles = {
      ...styles,
      ...alignmentStyle,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "time" ||
    (column.alignment.type?.toLowerCase() !== "datetime" &&
      (moment(row[column.field], "hh:mm", true).isValid() ||
        moment(row[column.field], "hh:mm:ss", true).isValid() ||
        moment(row[column.field], "hh:mm:ss a", true).isValid() ||
        moment(row[column.field], "hh:mm a", true).isValid())) ||
    (row[column.field] &&
      column.alignment.type?.toLowerCase() !== "datetime" &&
      JSON.stringify(row[column.field]).split(":").length > 1)
  ) {
    const alignment = column.alignment.align
      ? { textAlign: column.alignment.align }
      : { textAlign: "center", paddingRight: "6px", paddingLeft: "6px" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "datetime" ||
    (JSON.stringify(row[column.field])?.split(":").length > 1 &&
      (JSON.stringify(row[column.field])?.split("/").length === 3 ||
        JSON.stringify(row[column.field])?.split("-").length === 3))
  ) {
    const alignment = column.alignment.align
      ? {
          textAlign: column.alignment.align,
          paddingRight: "6px",
          paddingLeft: "6px",
        }
      : { textAlign: "center", paddingRight: "6px", paddingLeft: "6px" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "number" ||
    (typeof row[column.field] === "number" &&
      column.alignment.type !== "currency")
  ) {
    const alignment = column.alignment.align
      ? { textAlign: column.alignment.align }
      : { textAlign: "end" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "currency" ||
    (JSON.stringify(row[column.field]) &&
      (symbol.includes(JSON.stringify(row[column.field])[1]) ||
        symbol.includes(
          JSON.stringify(row[column.field])[row[column.field].length]
        )))
  ) {
    var alignment = column.alignment.align
      ? { textAlign: column.alignment.align }
      : { textAlign: "center" };

    styles = {
      ...styles,

      ...alignment,
    };

    return styles;
  } else if (
    column.alignment.type?.toLowerCase() === "string" ||
    column.alignment.type?.toLowerCase() === "text" ||
    typeof row[column.field] === "string"
  ) {
    const alignment = column.alignment.align
      ? { textAlign: column.alignment.align }
      : { textAlign: "start" };
    styles = {
      ...styles,
      ...alignment,
    };
    return styles;
  }
}
