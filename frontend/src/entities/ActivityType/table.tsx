import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DefaultCell, DefaultHeader } from "~/shared/ui";
import { TActivityType } from "./types";

type TColumn = keyof TActivityType;

export const activityTypeColumns: Partial<Record<TColumn, string>> = {
  id: "ID",
  name: "Название типа активности",
  fa_id: "FA ID",
};

export const getActivityTypeColumns = () => {
  const columnHelper = createColumnHelper<TActivityType>();
  let columns = (
    Object.entries(activityTypeColumns) as [TColumn, string][]
  ).map(([fieldName, header], index) =>
    columnHelper.accessor(fieldName, {
      id: `column_${index}`,
      cell: (info) => <DefaultCell>{info.row.original[fieldName]}</DefaultCell>,
      header: () => <DefaultHeader>{header}</DefaultHeader>,
      meta: { label: header },
    })
  );
  return columns as ColumnDef<TActivityType>[];
};
