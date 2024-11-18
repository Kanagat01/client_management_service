import { useTranslation } from "react-i18next";
import { ButtonHTMLAttributes } from "react";
import { LuDownload } from "react-icons/lu";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

type ExportToExcelButtonProps = {
  filename: string;
  data: unknown[][];
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ExportToExcelButton({
  filename,
  data,
  ...props
}: ExportToExcelButtonProps) {
  const { t } = useTranslation();
  const exportData = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = {
      Sheets: { [t("common.data")]: ws },
      SheetNames: [t("common.data")],
    };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: fileType });
    saveAs(dataBlob, filename + fileExtension);
  };
  return (
    <button {...props} onClick={exportData}>
      <LuDownload />
    </button>
  );
}
