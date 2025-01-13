import { ChangeEvent } from "react";
import { useUnit } from "effector-react";
import { createEvent, createStore } from "effector";
import { SelectInput } from "~/shared/ui";

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

export function PageSizeSelector() {
  const filters = useUnit($filters);
  return (
    <SelectInput
      label="Записи на странице"
      value={filters.page_size || "15"}
      onChange={(value) => changeFilter({ key: "page_size", value })}
      options={[
        ...["15", "30", "100", "Все"].map((el) => ({ value: el, label: el })),
      ]}
    />
  );
}
