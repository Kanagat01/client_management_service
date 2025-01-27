import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useUnit } from "effector-react";
import { BsJournalX } from "react-icons/bs";
import { Fragment, useEffect, useState } from "react";
import { $pagination, getPages, setPagination } from "./pagination_model";

export function MainTable({
  data,
  columns,
}: {
  data: any[];
  columns: ColumnDef<any>[];
}) {
  const pagination = useUnit($pagination);
  const [filteredData, setFilteredData] = useState<any[]>(data);

  const { itemsPerPage, currentPage } = pagination;
  const pagesTotal =
    itemsPerPage !== "all" ? Math.ceil(data.length / itemsPerPage) : 1;
  const pages = getPages(pagesTotal, currentPage);

  useEffect(() => {
    if (itemsPerPage !== "all") {
      const start = (currentPage - 1) * itemsPerPage;
      setFilteredData(data.slice(start, start + itemsPerPage));
    } else setFilteredData(data);
  }, [pagination, data]);

  const setCurrentPage = (page: number) => {
    setPagination({
      ...pagination,
      currentPage: page,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return rows.length !== 0 ? (
    <>
      <div className="table-responsive">
        <table className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Fragment key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Fragment>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="position-relative">
                {row.getVisibleCells().map((cell) => (
                  <Fragment key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="pb-3 w-100 v-md-center px-4 d-flex flex-wrap mt-3">
        <div className="col-auto me-auto">
          {/* <ColumnSelector table={table} /> */}

          <small className="text-muted d-block">
            Отображено записей: {filteredData.length}
          </small>
        </div>
        {pagesTotal !== 1 && (
          <div className="col-auto overflow-auto flex-shrink-1">
            <ul className="pagination">
              {currentPage !== 1 && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    «
                  </button>
                </li>
              )}
              {pages.map((page) => (
                <li
                  key={page}
                  className={`page-item ${page === currentPage && "active"}`}
                >
                  {page === currentPage ? (
                    <span className="page-link">{page}</span>
                  ) : (
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}
              {currentPage !== pagesTotal && (
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    »
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
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
