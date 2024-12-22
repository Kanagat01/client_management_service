// import { MouseEvent } from "react";
import { NavLink } from "react-router-dom";

export type TPagination = { pagesTotal: number; currentPage: number };

export const Pagination = (paginator: TPagination) => {
  const pages: number[] = [];
  const { pagesTotal, currentPage } = paginator;
  if (pagesTotal <= 10) {
    for (let i = 1; i <= pagesTotal; i++) pages.push(i);
  } else if (currentPage - 5 <= 0) {
    for (let i = 1; i <= 10; i++) pages.push(i);
  } else if (pagesTotal - currentPage <= 5) {
    for (let i = pagesTotal - 10; i <= pagesTotal; i++) pages.push(i);
  } else {
    for (let i = currentPage - 5; i <= currentPage + 5; i++) pages.push(i);
  }

  // const navigate = useNavigate();
  // const location = useLocation();
  // const handlePageClick = (e: MouseEvent<HTMLAnchorElement>, page: number) => {
  //   if (page === currentPage) return;

  //   e.preventDefault();
  //   const searchParams = new URLSearchParams(location.search);
  //   searchParams.set("page", page.toString());
  //   navigate(`${location.pathname}?${searchParams.toString()}`);
  // };
  return (
    <div className="col-auto overflow-auto flex-shrink-1 mt-3 mt-sm-0">
      <ul className="pagination">
        <li className="page-item">
          <NavLink className="page-link" to="#" rel="prev">
            «
          </NavLink>
        </li>
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage && "active"}`}
          >
            {page === currentPage ? (
              <span className="page-link">{page}</span>
            ) : (
              <NavLink className="page-link" to="#">
                {page}
              </NavLink>
            )}
          </li>
        ))}
        <li className="page-item">
          <NavLink className="page-link" to="#" rel="next">
            »
          </NavLink>
        </li>
      </ul>
    </div>
  );
};
