import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  DeleteBtn,
  useActionsColumn,
} from "~/shared/ui";
import { deleteCode } from "./model";
import { TCode } from "./types";

type TColumn = keyof TCode | "actions";

const columnsRecord: Partial<Record<TColumn, string>> = {
  id: "ID",
  value: "Значение",
  status: "Статус",
  telegram_link: "Телеграмм",
  student: "Кем использован",
  created_at: "Дата создания",
  actions: "Действия",
};

export const getCodeColumns = () => {
  const columnHelper = createColumnHelper<TCode>();
  const columns = (Object.entries(columnsRecord) as [TColumn, string][]).map(
    ([fieldName, headerText], index) =>
      fieldName === "actions"
        ? useActionsColumn<TCode>(columnHelper, headerText, ({ id, value }) => [
            <DeleteBtn
              content={`Вы уверены, что хотите удалить код "${value}"?`}
              onConfirm={() => deleteCode({ id, value })}
            />,
          ])
        : columnHelper.accessor(fieldName, {
            id: `column_${index}`,
            cell: (info) => {
              const fieldValue = info.row.original[fieldName];
              return <DefaultCell>{fieldValue}</DefaultCell>;
            },
            header: ({ header }) => (
              <DefaultHeader header={header} text={headerText} />
            ),
            meta: { label: headerText },
            enableSorting: true,
          })
  );
  return columns as ColumnDef<TCode>[];
};
