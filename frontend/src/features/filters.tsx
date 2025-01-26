import { ChangeEvent } from "react";
import { useUnit } from "effector-react";
import { createEvent, createStore } from "effector";
import { $pagination, SelectInput, setPagination } from "~/shared/ui";

export const resetFilters = createEvent();
export const changeFilter = createEvent<{
  key: string;
  value: string | number;
}>();

export const $filters = createStore<Record<string, string | number>>({})
  .on(resetFilters, () => ({}))
  .on(changeFilter, (state, { key, value }) => ({ ...state, [key]: value }));

export const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) =>
  changeFilter({ key: e.target.name, value: e.target.value });

export const useFilters = <T,>(
  data: T[],
  extraCheck?: (key: string, el: T, filters: Record<string, any>) => boolean
) => {
  const filters = useUnit($filters);
  return data.filter((el) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;

      const baseCheck = el[key as keyof T] === filters[key];
      if (baseCheck) return baseCheck;
      return extraCheck ? extraCheck(key, el, filters) : false;
    });
  });
};

export function PageSizeSelector() {
  const pagination = useUnit($pagination);

  return (
    <SelectInput
      label="Записи на странице"
      value={pagination.itemsPerPage}
      onChange={(value) =>
        setPagination({
          currentPage: 1,
          itemsPerPage: value !== "all" ? Number(value) : "all",
        })
      }
      options={[
        ...[15, 30, 100].map((el) => ({ value: el, label: el.toString() })),
        { value: "all", label: "Все" },
      ]}
    />
  );
}
