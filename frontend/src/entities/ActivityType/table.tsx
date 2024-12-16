import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { DefaultCell, DefaultHeader } from "~/shared/ui";
import { TActivityType } from "./types";

type TColumn = keyof TActivityType;

export const activityTypeColumns: Partial<Record<TColumn, string>> = {
  id: "ID",
  name: "Название типа активности",
  fa_id: "FA ID",
};

export const useActivityTypeTable = (data: TActivityType[]) => {
  const columnHelper = createColumnHelper<TActivityType>();
  let columns = (
    Object.entries(activityTypeColumns) as [TColumn, string][]
  ).map(([fieldName, header], index) =>
    columnHelper.accessor(fieldName, {
      id: `column_${index}`,
      cell: (info) => <DefaultCell>{info.row.original[fieldName]}</DefaultCell>,
      header: () => <DefaultHeader>{header}</DefaultHeader>,
    })
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return table;
};
