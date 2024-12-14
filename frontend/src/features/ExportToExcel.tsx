import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const exportData = (filename: string, data: unknown[][]) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = {
    Sheets: { ["Данные"]: ws },
    SheetNames: ["Данные"],
  };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: fileType });
  saveAs(dataBlob, filename + fileExtension);
};
