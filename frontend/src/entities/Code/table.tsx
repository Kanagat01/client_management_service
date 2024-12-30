import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DefaultHeader,
  DefaultCell,
  CreateOrEditBtn,
  DeleteBtn,
  useActionsColumn,
} from "~/shared/ui";
import { TCode } from "./types";

type TColumn = keyof TCode | "actions";

const columnsRecord: Record<TColumn, string> = {
  id: "ID",
  code: "Код",
  recipient: "Получатель",
  activity: "Активность",
  actions: "Действия",
};

export const useCodeTable = (data: TCode[]) => {
  const columnHelper = createColumnHelper<TCode>();
  const columns = (Object.entries(columnsRecord) as [TColumn, string][]).map(
    ([fieldName, header], index) =>
      fieldName === "actions"
        ? useActionsColumn(columnHelper, header, (row: TCode) => [
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
            cell: (info) => (
              <DefaultCell>{info.row.original[fieldName]}</DefaultCell>
            ),
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
