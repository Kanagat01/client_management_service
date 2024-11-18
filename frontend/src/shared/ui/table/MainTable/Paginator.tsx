import { MouseEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import styles from "./styles.module.scss";
import { TPaginator } from ".";

export const Paginator = (paginator: TPaginator) => {
  const pages = [];
  const { pages_total, current_page } = paginator;
  if (pages_total <= 10) {
    for (let i = 1; i <= pages_total; i++) pages.push(i);
  } else if (current_page - 5 <= 0) {
    for (let i = 1; i <= 10; i++) pages.push(i);
  } else if (pages_total - current_page <= 5) {
    for (let i = pages_total - 10; i <= pages_total; i++) pages.push(i);
  } else {
    for (let i = current_page - 5; i <= current_page + 5; i++) pages.push(i);
  }

  const navigate = useNavigate();
  const location = useLocation();
  const handlePageClick = (e: MouseEvent<HTMLAnchorElement>, page: number) => {
    if (page === current_page) return;

    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  return (
    pages.length > 1 && (
      <div className={styles.pagination}>
        {current_page > 1 && (
          <NavLink
            to="#"
            onClick={(e) => handlePageClick(e, current_page - 1)}
            style={{
              marginTop: "-5px",
              marginRight: !pages.includes(1) ? "-1rem" : "",
            }}
          >
            <FaAngleLeft />
          </NavLink>
        )}
        {!pages.includes(1) && <span>...</span>}
        {pages.map((page) => (
          <NavLink
            to="#"
            key={page}
            className={current_page === page ? styles.activePage : ""}
            onClick={(e) => handlePageClick(e, page)}
          >
            {page}
          </NavLink>
        ))}
        {!pages.includes(pages_total) && <span>...</span>}
        {current_page < pages_total && (
          <NavLink
            to="#"
            onClick={(e) => handlePageClick(e, current_page + 1)}
            style={{
              marginTop: "-5px",
              marginLeft: !pages.includes(pages_total) ? "-1rem" : "",
            }}
          >
            <FaAngleRight />
          </NavLink>
        )}
      </div>
    )
  );
};
