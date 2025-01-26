import { createEvent, createStore } from "effector";

type TPagination = {
  currentPage: number;
  itemsPerPage: number | "all";
};

export const setPagination = createEvent<TPagination>();
export const $pagination = createStore<TPagination>({
  currentPage: 1,
  itemsPerPage: 15,
}).on(setPagination, (_, state) => state);

export const getPages = (pagesTotal: number, currentPage: number) => {
  const pages: number[] = [];
  if (pagesTotal <= 10) {
    for (let i = 1; i <= pagesTotal; i++) pages.push(i);
  } else if (currentPage - 5 <= 0) {
    for (let i = 1; i <= 10; i++) pages.push(i);
  } else if (pagesTotal - currentPage <= 5) {
    for (let i = pagesTotal - 10; i <= pagesTotal; i++) pages.push(i);
  } else {
    for (let i = currentPage - 5; i <= currentPage + 5; i++) pages.push(i);
  }
  return pages;
};
