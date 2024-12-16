import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import {
  DefaultHeader,
  DefaultCell,
  DeleteButton,
  EditButton,
  useActionsColumn,
  VerificationButton,
} from "~/shared/ui";
import { dateTimeToString } from "~/shared/lib";
import { TStudent } from "./types";

type TStudentColumn = keyof TStudent | "actions";

export const studentColumns: Partial<Record<TStudentColumn, string>> = {
  // id: "ID",
  full_name: "Студент",
  // telegram_id: "TG ID",
  telegram_link: "Ссылка",
  username: "Логин",
  password: "Пароль",
  group: "Группа",
  phone: "Телефон",
  is_verified: "Верифицирован",
  registration_date: "Дата/время регистрации",
  actions: "Действия",
};

export const useStudentTable = (data: TStudent[]) => {
  const columnHelper = createColumnHelper<TStudent>();
  let columns = (
    Object.entries(studentColumns) as [TStudentColumn, string][]
  ).map(([fieldName, header], index) =>
    fieldName === "actions"
      ? useActionsColumn(columnHelper, header, [
          <EditButton />,
          <DeleteButton />,
          <VerificationButton />,
        ])
      : columnHelper.accessor(fieldName, {
          id: `column_${index}`,
          cell: (info) => {
            let value: ReactNode = info.row.original[fieldName];
            if (fieldName === "registration_date") {
              value = dateTimeToString(value as string);
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
