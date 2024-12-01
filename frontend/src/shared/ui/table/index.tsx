import { Table, flexRender } from "@tanstack/react-table";
import { RxTriangleDown, RxTriangleUp } from "react-icons/rx";
import { Paginator, TPaginator } from "./Paginator";
import styles from "./styles.module.scss";

type MainTableProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
  paginator?: TPaginator;
};

export function MainTable({ table, paginator }: MainTableProps) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={
                      header.column.getCanSort() ? styles.cursorPointer : ""
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length !== 0 ? (
              rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headerGroups[0].headers.length}>
                  <div style={{ padding: "1rem" }}>
                    Нет данных для отображения
                  </div>
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

export * from "./Paginator";
