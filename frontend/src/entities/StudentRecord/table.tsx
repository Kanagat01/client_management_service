import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DeleteButton, EditButton, VerificationButton } from "~/shared/ui";
import { TStudent } from "./types";

type TStudentColumn = keyof TStudent | "actions";

export const studentColumns: Record<TStudentColumn, string> = {
  id: "ID",
  full_name: "Полное имя",
  telegram_id: "TG ID",
  telegram_link: "Ссылка телеграмм",
  username: "Логин",
  password: "Пароль",
  group: "Группа",
  phone: "Номер телефона",
  is_verified: "Верифицирован",
  registration_date: "Дата регистрации",
  actions: "Действия",
};

export const useStudentTable = (data: TStudent[]) => {
  const columnHelper = createColumnHelper<TStudent>();
  let columns = (
    Object.entries(studentColumns) as [TStudentColumn, string][]
  ).map(([fieldName, header], index) =>
    fieldName === "actions"
      ? columnHelper.display({
          id: `column_${index}`,
          header: () => (
            <th className="text-center" style={{ width: "100px" }}>
              <div className="d-inline-flex align-items-center">{header}</div>
            </th>
          ),
          cell: () => (
            <td
              className="text-center"
              colSpan={1}
              style={{ minWidth: "100px" }}
            >
              <div>
                <div className="form-group mb-0">
                  <button
                    className="btn btn-link icon-link"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-popper-config='{"strategy": "fixed"}'
                  >
                    <BsThreeDotsVertical />
                  </button>

                  <div
                    className="dropdown-menu dropdown-menu-end dropdown-menu-arrow bg-white"
                    x-placement="bottom-end"
                  >
                    {[
                      <EditButton />,
                      <DeleteButton />,
                      <VerificationButton />,
                    ].map((btn) => (
                      <div className="form-group mb-0">{btn}</div>
                    ))}
                  </div>
                </div>
              </div>
            </td>
          ),
        })
      : columnHelper.accessor(fieldName, {
          id: `column_${index}`,
          cell: (info) => {
            let value: ReactNode = info.row.original[fieldName];
            if (fieldName === "is_verified") {
              value = (
                <span className={`me-1 text-${value ? "success" : "danger"}`}>
                  ●
                </span>
              );
            } else if (fieldName === "telegram_link" && value) {
              value = (
                <div className="form-group mb-0">
                  <a
                    className="btn btn-link icon-link"
                    href={value as string}
                    target="blank"
                  >
                    <span>{value}</span>
                  </a>
                </div>
              );
            }
            return (
              <td className="text-start text-truncate" colSpan={1}>
                <div>{value}</div>
              </td>
            );
          },
          header: () => (
            <th className="text-start">
              <div className="d-inline-flex align-items-center">{header}</div>
            </th>
          ),
        })
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return table;
};
