import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $activityTypes,
  getActivityTypesFx,
  useActivityTypeTable,
} from "~/entities/ActivityType";
import { MainTable } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const filters: [string, ReactNode][] = [
  [
    "Записи на странице",
    <div data-select-message-notfound="Результаты не найдены">
      <select className="form-control" title="Записи на странице">
        <option value="">Не выбрано</option>
        {[15, 30, 100, "Все"].map((cnt) => (
          <option key={cnt} value={cnt} selected={cnt === 15}>
            {cnt}
          </option>
        ))}
      </select>
    </div>,
  ],
];

export function ActivityTypesPage() {
  const data = useUnit($activityTypes);
  const table = useActivityTypeTable(data);
  return (
    <>
      <CommandBar title="Типы активностей" menuList={[]} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getActivityTypesFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
