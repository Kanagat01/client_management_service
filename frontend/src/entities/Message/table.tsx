import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  useActionsColumn,
  DeleteBtn,
} from "~/shared/ui";
import { dateStringToIso } from "~/shared/lib";
import { TCreateMessage, TMessage } from "./types";
import { deleteMessage } from "./model";
import { CreateMessage } from "./ui";

type TColumn = keyof TMessage | "receiver" | "actions";

const columnsRecord: Partial<Record<TColumn, string>> = {
  id: "Номер рассылки",
  receiver: "Получатель",
  text: "Содержание",
  schedule_datetime: "Запланированное время рассылки",
  is_sent: "Отправлено",
  actions: "Действия",
};

export const getMessageColumns = () => {
  const columnHelper = createColumnHelper<TMessage>();
  const columns = (Object.entries(columnsRecord) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn<TMessage>(columnHelper, header, (row) => [
            <CreateMessage
              data={
                {
                  ...row,
                  student: row.student_id,
                  group: row.group_id,
                  schedule_datetime: dateStringToIso(row.schedule_datetime),
                } as TCreateMessage
              }
            />,
            <DeleteBtn
              content={`Вы уверены, что хотите удалить сообщение #${row.id}`}
              onConfirm={() => deleteMessage(row.id)}
            />,
          ])
        : fieldName === "receiver"
        ? columnHelper.display({
            id: `column_${index}`,
            cell: (info) => {
              const value =
                info.row.original.student ?? info.row.original.group;
              return <DefaultCell>{value}</DefaultCell>;
            },
            header: () => <DefaultHeader>{header}</DefaultHeader>,
            meta: { label: header },
          })
        : columnHelper.accessor(fieldName as keyof TMessage, {
            id: `column_${index}`,
            cell: (info) => {
              const value = info.row.original[fieldName];
              return <DefaultCell>{value}</DefaultCell>;
            },
            header: () => <DefaultHeader>{header}</DefaultHeader>,
            meta: { label: header },
          })
  );
  return columns as ColumnDef<TMessage>[];
};
