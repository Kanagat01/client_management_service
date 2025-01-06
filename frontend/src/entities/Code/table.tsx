import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  DeleteBtn,
  useActionsColumn,
} from "~/shared/ui";
import { dateTimeToString } from "~/shared/lib";
import { deleteCode } from "./model";
import { TCode } from "./types";

type TColumn = keyof TCode | "actions";

const columnsRecord: Record<TColumn, string> = {
  id: "ID",
  value: "Значение",
  status: "Статус",
  telegram_link: "Телеграмм",
  student: "Кем использован",
  created_at: "Дата получения",
  actions: "Действия",
};

export const getCodeColumns = () => {
  const columnHelper = createColumnHelper<TCode>();
  const columns = (Object.entries(columnsRecord) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn(columnHelper, header, ({ id, value }: TCode) => [
            <DeleteBtn
              content={`Вы уверены, что хотите удалить код "${value}"?`}
              onConfirm={() => deleteCode({ id, value })}
            />,
          ])
        : columnHelper.accessor(fieldName, {
            id: `column_${index}`,
            cell: (info) => {
              let fieldValue = info.row.original[fieldName];
              if (fieldName === "created_at") {
                fieldValue = dateTimeToString(fieldValue as string);
              }
              return <DefaultCell>{fieldValue}</DefaultCell>;
            },
            header: () => <DefaultHeader>{header}</DefaultHeader>,
            meta: { label: header },
          })
  );
  return columns as ColumnDef<TCode>[];
};
