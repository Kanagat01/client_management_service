import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  useActionsColumn,
  CreateOrEditBtn,
  DeleteBtn,
} from "~/shared/ui";
import { dateTimeToString } from "~/shared/lib";
import { TMessage } from "./types";

type TColumn = keyof TMessage | "actions";

const columnsRecord: Record<TColumn, string> = {
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
        ? useActionsColumn(columnHelper, header, () => [
            <CreateOrEditBtn
              variant="edit"
              title={""}
              inputs={undefined}
              onSubmit={() => {}}
              onReset={() => {}}
            />,
            <DeleteBtn content={""} onConfirm={() => {}} />,
          ])
        : columnHelper.accessor(fieldName, {
            id: `column_${index}`,
            cell: (info) => {
              let value = info.row.original[fieldName];
              if (fieldName === "schedule_datetime") {
                value = dateTimeToString(value as string);
              }
              return <DefaultCell>{value}</DefaultCell>;
            },
            header: () => <DefaultHeader>{header}</DefaultHeader>,
            meta: { label: header },
          })
  );
  return columns as ColumnDef<TMessage>[];
};
