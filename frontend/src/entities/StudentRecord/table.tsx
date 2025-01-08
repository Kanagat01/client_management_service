import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TActivity } from "~/entities/Activity";
import {
  DefaultCell,
  DefaultHeader,
  DeleteBtn,
  useActionsColumn,
} from "~/shared/ui";
import { dateToString } from "~/shared/lib";
import { CreateOrEditStudentRecord } from "./ui";
import { deleteStudentRecord } from "./model";
import { TStudentRecord } from "./types";

type TColumn = keyof TStudentRecord | keyof TActivity | "actions";

export const studentRecordColumns: Partial<Record<TColumn, string>> = {
  id: "ID",
  student: "Студент",
  telegram_link: "Ссылка",
  group: "Группа",
  activity_type: "Тип активности",
  discipline: "Дисциплина",
  teacher: "Лектор",
  note: "Заметка",
  date: "Дата",
  start_time: "Время начала",
  end_time: "Время конца",
  marked_as_proctoring: "Установлено как прокторинг",
  actions: "Действия",
};
export const getStudentRecordColumns = () => {
  const columnHelper = createColumnHelper<TStudentRecord>();
  const columns = Object.entries(studentRecordColumns).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn<TStudentRecord>(columnHelper, header, (row) => [
            <CreateOrEditStudentRecord
              data={{
                id: row.id,
                activity: row.activity.id,
                student: row.student_id,
                marked_as_proctoring: row.marked_as_proctoring,
              }}
            />,
            <DeleteBtn
              content={`Вы уверены, что хотите очистить запись #${row.id}?`}
              onConfirm={() => deleteStudentRecord(row.id)}
            />,
          ])
        : columnHelper.accessor(fieldName as keyof TStudentRecord, {
            id: `column_${index}`,
            cell: (info) => {
              let fieldValue;
              if (!Object.keys(info.row.original).includes(fieldName)) {
                fieldValue =
                  info.row.original.activity[fieldName as keyof TActivity];
                if (fieldName === "date") {
                  fieldValue = dateToString(fieldValue as string);
                }
              } else {
                fieldValue =
                  info.row.original[fieldName as keyof TStudentRecord];
              }
              return <DefaultCell>{fieldValue as string}</DefaultCell>;
            },
            header: () => <DefaultHeader>{header}</DefaultHeader>,
            meta: { label: header },
          })
  );
  return columns as ColumnDef<TStudentRecord>[];
};
