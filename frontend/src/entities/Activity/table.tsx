import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";
import { dateTimeWithWeekday, dateToString } from "~/shared/lib";
import { DefaultCell, DefaultHeader, useActionsColumn } from "~/shared/ui";
import { EditActivity } from "./ui";
import { TActivity } from "./types";

type TColumn = keyof TActivity | "actions";

export const activityColumns: Partial<Record<TColumn, string>> = {
  id: "ID",
  activity_type: "Тип активности",
  discipline: "Дисциплина",
  group: "Группа",
  note: "Заметка",
  teacher: "Лектор",
  date: "Дата",
  start_time: "Время начала",
  end_time: "Время окончания",
  updated_at: "Дата изменения",
  actions: "Действия",
};

export const getActivityColumns = () => {
  const columnHelper = createColumnHelper<TActivity>();
  let columns = (Object.entries(activityColumns) as [TColumn, string][]).map(
    ([fieldName, header], index) => {
      if (fieldName === "actions") {
        return useActionsColumn(columnHelper, header, (row: TActivity) => [
          <EditActivity
            initialState={{
              ...row,
              activity_type: row.activity_type_id,
              discipline: row.discipline_id,
              group: row.group_id,
            }}
          />,
        ]);
      } else {
        return columnHelper.accessor(fieldName, {
          id: `column_${index}`,
          cell: (info) => {
            let fieldValue: ReactNode;
            switch (fieldName) {
              case "updated_at":
                fieldValue = dateTimeWithWeekday(
                  info.row.original[fieldName] as string
                );
                break;
              case "date":
                fieldValue = dateToString(
                  info.row.original[fieldName] as string
                );
                break;
              default:
                fieldValue = info.row.original[fieldName];
            }
            return <DefaultCell>{fieldValue}</DefaultCell>;
          },
          header: () => <DefaultHeader>{header}</DefaultHeader>,
          meta: { label: header },
        });
      }
    }
  );
  return columns as ColumnDef<TActivity>[];
};
