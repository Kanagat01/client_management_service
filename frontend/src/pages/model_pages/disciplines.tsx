import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { SlActionUndo } from "react-icons/sl";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $disciplines,
  getDisciplinesFx,
  useDisciplineTable,
} from "~/entities/Discipline";
import { RenderPromise } from "~/shared/api";
import { MainTable } from "~/shared/ui";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsPlusCircle />
    <span>Добавить</span>
  </NavLink>,
  <NavLink className="btn btn-link icon-link" to="#">
    <SlActionUndo />
    <span>Импорт из Excel</span>
  </NavLink>,
];

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

export function DisciplinesPage() {
  const data = useUnit($disciplines);
  const table = useDisciplineTable(data);

  return (
    <>
      <CommandBar title="Дисциплины" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />

        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getDisciplinesFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
