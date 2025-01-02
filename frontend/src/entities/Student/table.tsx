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
  DeleteBtn,
  VerificationBtn,
} from "~/shared/ui";
import { dateTimeToString } from "~/shared/lib";
import { deleteStudent, editStudent } from "./model";
import { CreateOrEditStudent } from "./ui";
import { TStudent } from "./types";

type TColumn = keyof TStudent | "actions";

export const studentColumns: Partial<Record<TColumn, string>> = {
  full_name: "Студент",
  telegram_link: "Ссылка",
  fa_login: "Логин",
  fa_password: "Пароль",
  group: "Группа",
  phone: "Телефон",
  is_verified: "Верифицирован",
  is_blocked: "Заблокирован",
  registration_date: "Дата/время регистрации",
  actions: "Действия",
};

export const useStudentTable = (data: TStudent[]) => {
  const columnHelper = createColumnHelper<TStudent>();
  let columns = (Object.entries(studentColumns) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn(columnHelper, header, (row: TStudent) => [
            <CreateOrEditStudent data={row} />,
            <DeleteBtn
              content="Вы уверены, что хотите очистить данные этого студента?"
              onConfirm={() =>
                deleteStudent({ id: row.id, full_name: row.full_name })
              }
            />,
            <VerificationBtn
              is_verified={row.is_verified}
              content={`Вы уверены, что хотите ${
                row.is_verified ? "отменить верификацию" : "верифицировать"
              } студента "${row.full_name}"?`}
              onConfirm={() =>
                editStudent({
                  ...row,
                  is_verified: !row.is_verified,
                  loading: `${
                    row.is_verified ? "Отменяем верификацию у" : "Верифицируем"
                  } студента "${row.full_name}"...`,
                  success: `Студент "${row.full_name}" ${
                    row.is_verified && "не "
                  }верифицирован`,
                })
              }
            />,
            <BanBtn
              is_blocked={row.is_blocked}
              content={`Вы уверены, что хотите ${
                row.is_blocked ? "разблокировать" : "заблокировать"
              } студента "${row.full_name}"?`}
              onConfirm={() =>
                editStudent({
                  ...row,
                  is_blocked: !row.is_blocked,
                  loading: `Блокируем студента "${row.full_name}"...`,
                  success: `Студент "${row.full_name}" заблокирован`,
                })
              }
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
