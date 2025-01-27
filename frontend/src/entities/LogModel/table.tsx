import { ReactNode } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { dateTimeToString } from "~/shared/lib";
import { DefaultCell, DefaultHeader } from "~/shared/ui";
import { TLog } from "./types";

type TColumn = keyof TLog;

export const logColumns: Partial<Record<TColumn, string>> = {
  telegram_id: "Tg Id Студента",
  student: "Студент",
  field_name: "Измененное поле",
  old_value: "Старое значение",
  new_value: "Новое значение",
  created_at: "Дата изменения",
};

export const getLogColumns = () => {
  const columnHelper = createColumnHelper<TLog>();
  let columns = (Object.entries(logColumns) as [TColumn, string][]).map(
    ([fieldName, headerText], index) =>
      columnHelper.accessor(fieldName, {
        id: `column_${index}`,
        cell: (info) => {
          let value: ReactNode = info.row.original[fieldName];
          if (fieldName === "created_at") {
            value = dateTimeToString(value as string);
          }
          return <DefaultCell>{value}</DefaultCell>;
        },
        header: ({ header }) => (
          <DefaultHeader header={header} text={headerText} />
        ),
        meta: { label: headerText },
        enableSorting: true,
      })
  );
  return columns as ColumnDef<TLog>[];
};
