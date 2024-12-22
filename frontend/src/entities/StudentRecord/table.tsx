import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TActivity } from "~/entities/Activity";
import {
  DefaultCell,
  DefaultHeader,
  DeleteButton,
  EditButton,
  useActionsColumn,
  VerificationButton,
} from "~/shared/ui";
import { dateToString } from "~/shared/lib";
import { TStudentRecord } from "./types";

type TColumn = keyof TStudentRecord | keyof TActivity | "actions";

export const studentRecordColumns: Partial<Record<TColumn, string>> = {
  student: "Студент",
  telegram_link: "Ссылка",
  group: "Группа",
  activity_type: "Тип активности",
  discipline: "Дисциплина",
  teacher: "Лектор",
  note: "Заметка",
  date: "Дата",
  time_start: "Время начала",
  time_end: "Время конца",
  actions: "Действия",
};

export const useStudentRecordTable = (data: TStudentRecord[]) => {
  const columnHelper = createColumnHelper<TStudentRecord>();
  const columns = Object.entries(studentRecordColumns).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn(columnHelper, header, [
            <EditButton key="edit" />,
            <DeleteButton key="delete" />,
            <VerificationButton key="verify" />,
          ])
        : columnHelper.accessor(fieldName as keyof TStudentRecord, {
            id: `column_${index}`,
            cell: (info) => {
              if (!Object.keys(info.row.original).includes(fieldName)) {
                return (
                  <DefaultCell>
                    {info.row.original.activity[fieldName as keyof TActivity]}
                  </DefaultCell>
                );
              }
              let fieldValue =
                info.row.original[fieldName as keyof TStudentRecord];
              if (fieldName === "date") {
                fieldValue = dateToString(fieldValue as string);
              }
              return <DefaultCell>{fieldValue as string}</DefaultCell>;
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
