import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { dateTimeWithWeekday, dateToString } from "~/shared/lib";
import {
  DefaultCell,
  DefaultHeader,
  CreateOrEditBtn,
  useActionsColumn,
} from "~/shared/ui";
import { TActivity } from "./types";
import { editActivitySubmitted, setEditActivity } from "./model";

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

export const useActivityTable = (data: TActivity[]) => {
  const columnHelper = createColumnHelper<TActivity>();
  let columns = (Object.entries(activityColumns) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn(columnHelper, header, (row: TActivity) => [
            <CreateOrEditBtn
              variant="edit"
              title={"Редактировать активность"}
              inputs={undefined}
              onSubmit={editActivitySubmitted}
              onReset={() => setEditActivity(null)}
            />,
          ])
        : columnHelper.accessor(fieldName, {
            id: `column_${index}`,
            cell: (info) => {
              let fieldValue: ReactNode = info.row.original[fieldName];
              if (fieldName === "updated_at") {
                fieldValue = dateTimeWithWeekday(fieldValue as string);
              } else if (fieldName === "date") {
                fieldValue = dateToString(fieldValue as string);
              }
              return <DefaultCell>{fieldValue}</DefaultCell>;
            },
            header: () => <DefaultHeader>{header}</DefaultHeader>,
            meta: { label: header },
          })
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return table;
};
