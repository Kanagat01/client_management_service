import { useEffect, useState } from "react";
import { MainTable, TPaginator } from "~/shared/ui";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export function DataList({
  initialData,
  columns,
  paginator,
}: {
  initialData: any[];
  columns: ColumnDef<unknown, any>[];
  paginator?: TPaginator;
}) {
  const [data, setData] = useState(initialData);
  useEffect(() => setData(initialData), [initialData]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    isMultiSortEvent: (_e) => true,
  });
  return <MainTable {...{ table, paginator }} />;
}
