import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TGroup } from "./types";

const groupColumns: Record<keyof TGroup, string> = {
  id: "ID",
  label: "Группа",
  description: "Факультет",
};

export const useGroupTable = (data: TGroup[]) => {
  const columnHelper = createColumnHelper<TGroup>();
  const columns = (
    Object.entries(groupColumns) as [keyof TGroup, string][]
  ).map(([key, value], index) =>
    columnHelper.accessor(key, {
      id: `column_${index}`,
      cell: (info) => {
        const row = info.row;
        return row.original[key];
      },
      header: () => value,
    })
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return table;
};
