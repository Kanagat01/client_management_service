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
  ).map(([fieldName, headerText], index) =>
    columnHelper.accessor(fieldName, {
      id: `column_${index}`,
      cell: (info) => <DefaultCell>{info.row.original[fieldName]}</DefaultCell>,
      header: ({ header }) => (
        <DefaultHeader header={header} text={headerText} />
      ),
      meta: { label: headerText },
      enableSorting: true,
    })
  );
  return columns as ColumnDef<TActivityType>[];
};
