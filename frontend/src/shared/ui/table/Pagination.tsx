import { MouseEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const location = useLocation();
  const handlePageClick = (e: MouseEvent<HTMLAnchorElement>, page: number) => {
    if (page === currentPage) return;

    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  return (
    <ul className="pagination">
      <li className="page-item disabled">
        <span className="page-link">&laquo;</span>
      </li>
      {[1, 2, 3, 4, 5, 6, 7].map((page) => (
        <li className={`page-item ${currentPage == page ? "active" : ""}`}>
          <NavLink
            to="#"
            className="page-link"
            onClick={(e) => handlePageClick(e, page)}
          >
            {page}
          </NavLink>
        </li>
      ))}
      <li className="page-item">
        <NavLink
          to="#"
          className="page-link"
          rel="next"
          onClick={(e) => handlePageClick(e, currentPage + 1)}
        >
          &raquo;
        </NavLink>
      </li>
    </ul>
  );
};
