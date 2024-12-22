import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { CommandBar, FilterBar } from "~/widgets";
import { $groups, getGroupsFx, useGroupTable } from "~/entities/Group";
import { RenderPromise } from "~/shared/api";
import { MainTable } from "~/shared/ui";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsPlusCircle />
    <span>Добавить</span>
  </NavLink>,
];

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

export function GroupsPage() {
  const data = useUnit($groups);
  const table = useGroupTable(data);

  return (
    <>
      <CommandBar title="Группы" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getGroupsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
