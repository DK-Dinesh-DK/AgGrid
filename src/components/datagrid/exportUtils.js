import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function CSVContent(fileData, columns) {
  const field = columns?.map((ele) => ele.field);
  const header = columns?.map((ele) => ele.headerName);
  const data = fileData.map((f) => {
    let sample = [];
    field.map((d) => {
      if (d !== undefined) {
        sample.push(f[d]);
      } else {
        sample.push("");
      }
    });
    if (sample.length > 0) {
      return sample;
    }
  });
  const content = [header, ...data]
    .map((cells) => cells.map(serialiseCellValue).join(","))
    .join("\n");
  return content;
}
export async function exportToCsv(fileData, columns, fileName) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const ws = XLSX.utils.json_to_sheet(fileData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "csv", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName);
}
export async function exportToPdf(fileData, columns, fileName) {
  let field = [];
  columns?.map((ele) => {
    if (ele.field) {
      field.push({ dataKey: ele.field, header: ele.headerName });
    }
  });
  let doc = new jsPDF();
  doc.autoTable({
    margin: { top: 10 },
    styles: {
      cellWidth: "wrap",
      overflow: "visible",
      halign: "center",
      lineColor: "white",
      lineWidth: 0.5,
      fontSize: 11,
    },
    alternateRowStyles: { fillColor: "#e5edf8" },
    bodyStyles: { fillColor: "#f3f8fc" },
    headStyles: {
      fillColor: "#16365D",
      textColor: "white",
      halign: "center",
      lineColor: "White",
      lineWidth: 0.5,
      fontSize: 11,
    },
    body: fileData,
    theme: "striped",
    columns: field,
  });
  doc.save(fileName);
}
export function exportToXlsx(fileData, columns, fileName) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const ws = XLSX.utils.json_to_sheet(fileData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName);
}
function serialiseCellValue(value) {
  if (typeof value === "string") {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(",")
      ? `"${formattedValue}"`
      : formattedValue;
  }
  return value;
}
