import { useUnit } from "effector-react";
import { ReactNode, useEffect } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $filters,
  changeFilter,
  handleFilterChange,
  PageSizeSelector,
  useFilters,
} from "~/features/filters";
import { $logs, getLogsFx, getLogColumns, TLog } from "~/entities/LogModel";
import { $students, getStudentsFx } from "~/entities/Student";
import { MainTable, BsInput, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const getFilters = (): ReactNode[] => {
  const filters = useUnit($filters);
  const students = useUnit($students);

  return [
    <PageSizeSelector />,
    <SelectInput
      label="Никнейм"
      value={filters.telegram_id || ""}
      onChange={(value) => changeFilter({ key: "telegram_id", value })}
      options={[
        { label: "Не выбрано", value: "" },
        ...students.map(({ telegram_id, telegram_link }) => ({
          value: telegram_id,
          label: telegram_link?.split("/").pop() ?? "",
        })),
      ]}
    />,
    <BsInput
      variant="input"
      label="Старое значение"
      name="old_value"
      value={filters.old_value}
      onChange={handleFilterChange}
    />,
    <BsInput
      variant="input"
      label="Новое значение"
      name="new_value"
      value={filters.new_value}
      onChange={handleFilterChange}
    />,
  ];
};

export function LogsPage() {
  const logs = useUnit($logs);
  const data = useFilters<TLog>(logs, (key, el, filters) => {
    if (["old_value", "new_value"].includes(key))
      return el[key as "old_value" | "new_value"]
        .toLowerCase()
        .includes((filters[key] as string).toLowerCase());
    return false;
  });
  const columns = getLogColumns();

  useEffect(() => {
    if ($students.getState().length === 0) getStudentsFx();
  }, []);
  return (
    <>
      <CommandBar title="Логи" menuList={[]} />
      <div className="mb-md-4 h-100">
        <FilterBar getFilters={getFilters} />

        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getLogsFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
