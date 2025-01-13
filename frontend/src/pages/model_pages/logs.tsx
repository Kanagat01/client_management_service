import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $filters,
  changeFilter,
  handleFilterChange,
  PageSizeSelector,
} from "~/features/filters";
import { $logs, getLogsFx, getLogColumns } from "~/entities/LogModel";
import { $studentNicknames } from "~/entities/Student";
import { RenderPromise } from "~/shared/api";
import { MainTable, BsInput, SelectInput } from "~/shared/ui";

const getFilters = (): ReactNode[] => {
  const filters = useUnit($filters);
  const students = useUnit($studentNicknames);

  return [
    <PageSizeSelector />,
    <SelectInput
      label="Никнейм"
      name="student"
      value={filters.student || ""}
      onChange={(value) => changeFilter({ key: "student", value })}
      options={[
        { label: "Не выбрано", value: "" },
        ...students.map(({ id, telegram_link }) => ({
          value: id.toString(),
          label: telegram_link,
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
  const data = useUnit($logs);
  const columns = getLogColumns();
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
