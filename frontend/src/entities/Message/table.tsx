import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  useActionsColumn,
  EditBtn,
  DeleteBtn,
} from "~/shared/ui";
import { TMessage } from "./types";
import { dateTimeToString } from "~/shared/lib";

type TColumn = keyof TMessage | "actions";

const columnsRecord: Record<TColumn, string> = {
  id: "Номер рассылки",
  group: "Группа",
  text: "Содержание",
  schedule_datetime: "Запланированное время рассылки",
  is_sent: "Отправлено",
  actions: "Действия",
};

export const useMessageTable = (data: TMessage[]) => {
  const columnHelper = createColumnHelper<TMessage>();
  const columns = (Object.entries(columnsRecord) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn(columnHelper, header, () => [
            <EditBtn
              title={""}
              inputs={undefined}
              onOpen={() => {}}
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return table;
};
