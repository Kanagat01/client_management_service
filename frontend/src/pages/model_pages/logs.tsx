import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { $logs, getLogsFx, useLogTable } from "~/entities/LogModel";
import { RenderPromise } from "~/shared/api";
import { MainTable } from "~/shared/ui";

const filters: [string, ReactNode][] = [
  [
    "Записи на странице",
    <div
      data-controller="select"
      data-select-placeholder=""
      data-select-allow-empty="1"
      data-select-message-notfound="Результаты не найдены"
      data-select-allow-add="false"
      data-select-message-add="Добавить"
    >
      <select className="form-control">
        <option value="">Не выбрано</option>
        {[15, 30, 100, "Все"].map((cnt) => (
          <option key={cnt} value={cnt} selected={cnt === 15}>
            {cnt}
          </option>
        ))}
      </select>
    </div>,
  ],
  [
    "Никнейм",
    <div
      data-controller="select"
      data-select-placeholder=""
      data-select-allow-empty="1"
      data-select-message-notfound="Результаты не найдены"
      data-select-allow-add="false"
      data-select-message-add="Добавить"
    >
      <select className="form-control">
        <option value="">Не выбрано</option>
      </select>
    </div>,
  ],
  [
    "Старое значение",
    <div>
      <input className="form-control" type="text" />
    </div>,
  ],
  [
    "Новое значение",
    <div>
      <input className="form-control" type="text" />
    </div>,
  ],
];

export function LogsPage() {
  const data = useUnit($logs);
  const table = useLogTable(data);

  return (
    <>
      <CommandBar title="Логи" menuList={[]} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />

        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getLogsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
