import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  useActionsColumn,
  DeleteBtn,
} from "~/shared/ui";
import { dateStringToIso, defaultSortingFn } from "~/shared/lib";
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
    ([fieldName, headerText]) =>
      fieldName === "actions"
        ? useActionsColumn<TMessage>(columnHelper, headerText, (row) => [
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
        : columnHelper.accessor(fieldName as keyof TMessage, {
            id: fieldName,
            cell: (info) => {
              let value;
              if (fieldName === "receiver") {
                value = info.row.original.student ?? info.row.original.group;
              } else {
                value = info.row.original[fieldName as keyof TMessage];
              }
              return <DefaultCell>{value}</DefaultCell>;
            },
            header: ({ header }) => (
              <DefaultHeader header={header} text={headerText} />
            ),
            meta: { label: headerText },
            enableSorting: true,
            sortingFn: (rowA, rowB, columnId) => {
              const valueA =
                columnId === "receiver"
                  ? rowA.original.student ?? rowA.original.group
                  : rowA.getValue(columnId);
              const valueB =
                columnId === "receiver"
                  ? rowB.original.student ?? rowB.original.group
                  : rowB.getValue(columnId);
              return defaultSortingFn(valueA, valueB);
            },
          })
  );
  return columns as ColumnDef<TMessage>[];
};
