import { CSSProperties, Dispatch, SetStateAction } from "react";
import { Cell, flexRender, Header } from "@tanstack/react-table";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import { arrayMove, useSortable } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styles from "./styles.module.scss";

export const DraggableTableHeader = ({
  header,
}: {
  header: Header<unknown, unknown>;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: header.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <th
      key={header.id}
      className={header.column.getCanSort() ? styles.cursorPointer : ""}
      onClick={header.column.getToggleSortingHandler()}
      ref={setNodeRef}
      style={style}
    >
      <span {...attributes} {...listeners}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      {{
        asc: <RxTriangleUp className={styles.sortingIcon} />,
        desc: <RxTriangleDown className={styles.sortingIcon} />,
      }[header.column.getIsSorted() as string] ??
        (header.column.getCanSort() ? (
          <div className={styles.columnCanSort}>
            <RxTriangleUp />
            <RxTriangleDown />
          </div>
        ) : null)}
      <div
        {...{
          onDoubleClick: () => header.column.resetSize(),
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `${styles.resizer} ${
            header.column.getIsResizing() ? styles.isResizing : ""
          }`,
        }}
      />
    </th>
  );
};

export const DragAlongCell = ({ cell }: { cell: Cell<unknown, unknown> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td key={cell.id} style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

export function handleDragEnd(
  event: DragEndEvent,
  setColumnOrder: Dispatch<SetStateAction<string[]>>
) {
  const { active, over } = event;
  if (active && over && active.id !== over.id) {
    setColumnOrder((columnOrder: string[]) => {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      return active.id !== "column_0"
        ? arrayMove(columnOrder, oldIndex, newIndex)
        : columnOrder;
    });
  }
}
