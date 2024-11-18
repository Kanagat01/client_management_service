import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useUnit } from "effector-react";
import {
  ColumnSizingState,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getColumns,
  OrderStatus,
  TGetOrder,
  $selectedOrder,
  setSelectedOrder,
} from "~/entities/Order";
import { $userType, getRole } from "~/entities/User";
import { MainTable, TPaginator } from "~/shared/ui";
import Routes from "~/shared/routes";
import {
  COLUMN_ORDER_STORAGE_KEY,
  COLUMN_SIZING_STORAGE_KEY,
} from "~/shared/lib";

export function OrdersList({
  orders,
  paginator,
}: {
  orders: TGetOrder[];
  paginator?: TPaginator;
}) {
  const [data, setData] = useState(orders);
  useEffect(() => setData(orders), [orders]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const role = getRole(useUnit($userType));
  const columns = getColumns(useLocation().pathname as Routes, role);

  const savedColumnOrder = localStorage.getItem(COLUMN_ORDER_STORAGE_KEY);
  const initialColumnOrder = savedColumnOrder
    ? JSON.parse(savedColumnOrder)
    : columns.map((c) => c.id!);
  const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder);

  const savedColumnSizing = localStorage.getItem(COLUMN_SIZING_STORAGE_KEY);
  const initialColumnSizing = savedColumnSizing
    ? JSON.parse(savedColumnSizing)
    : columns.map((c) => c.size!);
  const [columnSizing, setColumnSize] =
    useState<ColumnSizingState>(initialColumnSizing);

  useEffect(() => {
    localStorage.setItem(COLUMN_ORDER_STORAGE_KEY, JSON.stringify(columnOrder));
    localStorage.setItem(
      COLUMN_SIZING_STORAGE_KEY,
      JSON.stringify(columnSizing)
    );
  }, [columnOrder, columnSizing]);

  const table = useReactTable({
    data,
    //@ts-ignore TODO
    columns,
    state: { sorting, columnOrder, columnSizing },
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    onColumnSizingChange: setColumnSize,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    isMultiSortEvent: (_e) => true,
  });

  const selectedOrder = useUnit($selectedOrder);
  const getRowProps = (id: number) => {
    let className = "";
    if (id === selectedOrder?.id) className = "selected-row";
    else {
      const order = data.find((el) => el.id === id);
      className =
        order?.status === OrderStatus.completed ? "order-completed" : "";
    }
    return {
      className,
      onClick:
        id === selectedOrder?.id
          ? () => setSelectedOrder(null)
          : () => setSelectedOrder(data.find((o) => o.id === id) ?? null),
    };
  };
  return (
    <MainTable
      {...{ table, paginator, getRowProps, columnOrder, setColumnOrder }}
    />
  );
}
