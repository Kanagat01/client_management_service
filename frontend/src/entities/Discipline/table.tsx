import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DefaultCell,
  DefaultHeader,
  EditBtn,
  useActionsColumn,
} from "~/shared/ui";
import { TDiscipline } from "./types";

type TColumn = keyof TDiscipline | "actions";

const disciplineColumns: Record<TColumn, string> = {
  id: "ID",
  name: "Название дисциплины",
  fa_id: "FA ID",
  actions: "Действия",
};

export const useDisciplineTable = (data: TDiscipline[]) => {
  const columnHelper = createColumnHelper<TDiscipline>();
  const columns = (
    Object.entries(disciplineColumns) as [TColumn, string][]
  ).map(([fieldName, header], index) =>
    fieldName === "actions"
      ? useActionsColumn(columnHelper, header, [<EditBtn />])
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
