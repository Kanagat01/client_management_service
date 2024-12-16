import { flexRender, Table } from "@tanstack/react-table";
import { Pagination, TPagination } from "./Pagination";
import { BsJournalX } from "react-icons/bs";
import { ColumnSelector } from "./helpers";

type MainTableProps = {
  table: Table<any>;
  pagination?: TPagination;
};
export function MainTable({ table, pagination }: MainTableProps) {
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  return rows.length !== 0 ? (
    <>
      <div className="table-responsive">
        <table className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="position-relative">
                {row
                  .getVisibleCells()
                  .map((cell) =>
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="pb-3 w-100 v-md-center px-4 d-flex flex-wrap">
        <div className="col-auto me-auto">
          <ColumnSelector />

          <small className="text-muted d-block">
            Отображено записей: 1-15 из 97
          </small>
        </div>
        <div className="col-auto overflow-auto flex-shrink-1 mt-3 mt-sm-0">
          {pagination && <Pagination {...pagination} />}
        </div>
      </footer>
    </>
  ) : (
    <div className="d-md-flex align-items-center px-md-0 px-2 pt-4 pb-5 w-100 text-md-start text-center">
      <div className="col-auto mx-md-4 mb-3 mb-md-0">
        <BsJournalX className="block h1" />
      </div>

      <div>
        <h3 className="fw-light">
          В настоящее время нет отображаемых объектов
        </h3>
        Импортируйте или создайте объекты, или проверьте обновления позже
      </div>
    </div>
  );
}
