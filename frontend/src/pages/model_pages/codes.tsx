import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { SlActionUndo } from "react-icons/sl";
import { CommandBar, FilterBar } from "~/widgets";
import { $codes, getCodesFx, useCodeTable } from "~/entities/Code";
import { ExportBtn, MainTable } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";
import { API_URL } from "~/shared/config";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsPlusCircle />
    <span>Добавить</span>
  </NavLink>,
  <NavLink className="btn btn-link icon-link" to="#">
    <SlActionUndo />
    <span>Импорт из Excel</span>
  </NavLink>,
  <ExportBtn
    link={`${API_URL}/api/export_codes/?token=${localStorage.getItem("token")}`}
  />,
];

const filters: [string, ReactNode][] = [
  [
    "Записи на странице",
    <div
      data-controller="select"
      data-select-message-notfound="Результаты не найдены"
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
    "Код",
    <div
      data-controller="select"
      data-select-message-notfound="Результаты не найдены"
    >
      <select className="form-control">
        <option value="">Не выбрано</option>
      </select>
    </div>,
  ],
  [
    "Получатель",
    <div
      data-controller="select"
      data-select-message-notfound="Результаты не найдены"
    >
      <select className="form-control">
        <option value="">Не выбрано</option>
      </select>
    </div>,
  ],
];

export function CodesPage() {
  const data = useUnit($codes);
  const table = useCodeTable(data);

  return (
    <>
      <CommandBar title="Редактор кодов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getCodesFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
