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

type TColumn = keyof TStudent | "actions";

export const studentColumns: Partial<Record<TColumn, string>> = {
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
  let columns = (Object.entries(studentColumns) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn(columnHelper, header, (row: TStudent) => [
            <EditBtn
              title="Редактировать студента"
              inputs={<h1>тут будет форма</h1>}
              onOpen={() => {}}
              onReset={() => {}}
              onSubmit={() => {}}
            />,
            <DeleteBtn
              content="Вы уверены, что хотите очистить данные этого студента?"
              onConfirm={() => {}}
            />,
            <VerificationBtn content="" onConfirm={() => {}} />,
            <BanBtn content={""} onConfirm={() => {}} />,
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
