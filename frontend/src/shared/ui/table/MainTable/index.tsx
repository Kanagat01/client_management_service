import { Dispatch, HTMLAttributes, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import { TextCenter, TitleMd } from "~/shared/ui";
import { Paginator } from "./Paginator";
import {
  DragAlongCell,
  DraggableTableHeader,
  handleDragEnd,
} from "./dragFunctions";
import styles from "./styles.module.scss";

export type TPaginator = { pages_total: number; current_page: number };

type MainTableProps = {
  table: Table<any>;
  paginator?: TPaginator;
  getRowProps?: (id: number) => HTMLAttributes<HTMLTableRowElement>;
  columnOrder?: string[];
  setColumnOrder?: Dispatch<SetStateAction<string[]>>;
};

export function MainTable({
  table,
  paginator,
  getRowProps = (_: number) => ({}),
  columnOrder,
  setColumnOrder,
}: MainTableProps) {
  const { t } = useTranslation();
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const checkRowProps = (obj: unknown) =>
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    typeof obj.id === "number"
      ? getRowProps(obj.id)
      : {};

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );
  return columnOrder && setColumnOrder ? (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={(event: DragEndEvent) => handleDragEnd(event, setColumnOrder)}
      sensors={sensors}
    >
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length !== 0 ? (
              rows.map((row) => (
                <tr key={row.id} {...checkRowProps(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    <SortableContext
                      key={cell.id}
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      <DragAlongCell key={cell.id} cell={cell} />
                    </SortableContext>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headerGroups[0].headers.length}>
                  <TitleMd className="p-4">
                    <TextCenter>{t("common.noData")}</TextCenter>
                  </TitleMd>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {paginator && <Paginator {...paginator} />}
    </DndContext>
  ) : (
    <>
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  // not draggable
                  <DraggableTableHeader key={header.id} header={header} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length !== 0 ? (
              rows.map((row) => (
                <tr key={row.id} {...checkRowProps(row.original)}>
                  {row.getVisibleCells().map((cell) => (
                    // not draggable
                    <DragAlongCell key={cell.id} cell={cell} />
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headerGroups[0].headers.length}>
                  <TitleMd className="p-4">
                    <TextCenter>{t("common.noData")}</TextCenter>
                  </TitleMd>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {paginator && <Paginator {...paginator} />}
    </>
  );
}
