import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { BsStar } from "react-icons/bs";
import {
  DefaultHeader,
  DefaultCell,
  useActionsColumn,
  BanBtn,
  EditBtn,
  DeleteBtn,
  VerificationBtn,
} from "~/shared/ui";
import { dateTimeToString } from "~/shared/lib";
import { TStudent } from "./types";

type TStudentColumn = keyof TStudent | "actions";

export const studentColumns: Partial<Record<TStudentColumn, string>> = {
  full_name: "Студент",
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
          <EditBtn
            title="Редактировать студента"
            inputs={<h1>тут будет форма</h1>}
            onReset={() => {}}
            onSubmit={() => {}}
          />,
          <DeleteBtn
            content="Вы уверены, что хотите очистить данные этого студента?"
            onConfirm={() => {}}
          />,
          <VerificationBtn content="" onConfirm={() => {}} />,
          <BanBtn
            content={""}
            onConfirm={function (): void {
              throw new Error("Function not implemented.");
            }}
          />,
        ])
      : columnHelper.accessor(fieldName, {
          id: `column_${index}`,
          cell: (info) => {
            let value: ReactNode = info.row.original[fieldName];
            if (fieldName === "full_name") {
              if (info.row.original.is_verified)
                value = (
                  <div className="d-flex align-items-center">
                    <BsStar className="me-1" /> {value}
                  </div>
                );
            } else if (fieldName === "registration_date") {
              value = dateTimeToString(value as string);
            }
            return <DefaultCell>{value}</DefaultCell>;
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
