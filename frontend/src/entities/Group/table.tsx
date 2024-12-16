import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { DefaultHeader, DefaultCell } from "~/shared/ui";
import { dateTimeWithWeekday } from "~/shared/lib";
import { TGroup } from "./types";

const groupColumns: Record<keyof TGroup, string> = {
  id: "ID",
  code: "Код",
  fa_id: "ID группы",
  description: "Описание",
  created_at: "Дата создания",
  updated_at: "Последнее изменение",
};

export const useGroupTable = (data: TGroup[]) => {
  const columnHelper = createColumnHelper<TGroup>();
  const columns = (
    Object.entries(groupColumns) as [keyof TGroup, string][]
  ).map(([fieldName, header], index) =>
    columnHelper.accessor(fieldName, {
      id: `column_${index}`,
      cell: (info) => {
        let value: ReactNode = info.row.original[fieldName];
        if (["created_at", "updated_at"].includes(fieldName)) {
          value = dateTimeWithWeekday(info.row.original[fieldName] as string);
        }
        return <DefaultCell>{value}</DefaultCell>;
      },
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
