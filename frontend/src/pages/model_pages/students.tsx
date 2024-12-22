import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { CommandBar, FilterBar } from "~/widgets";
import { $students, getStudentsFx, useStudentTable } from "~/entities/Student";
import { MainTable, DeleteAllBtn } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const menuList = [
  <DeleteAllBtn />,
  <NavLink className="btn btn-link icon-link" to="#">
    <BsPlusCircle />
    <span>Добавить</span>
  </NavLink>,
];

const filters: [string, ReactNode][] = [
  [
    "Записи на странице",
    <div
      data-controller="select"
      data-select-message-notfound="Результаты не найдены"
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
  [
    "TG ID",
    <div data-controller="input" data-input-mask="">
      <input
        className="form-control"
        name="telegram_id"
        type="text"
        title="TG ID"
      />
    </div>,
  ],
  [
    "Группа",
    <div
      data-controller="select"
      data-select-message-notfound="Результаты не найдены"
    >
      <select className="form-control" name="group_id" title="Группа">
        <option value="">Не выбрано</option>
        {["ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>,
  ],
  ["Логин", <input className="form-control" type="text" />],
  ["Телефон", <input className="form-control" type="text" />],
  [
    "Верифицирован",
    <div className="form-check">
      <input
        value="1"
        type="checkbox"
        className="form-check-input"
        name="is_verified"
      />
    </div>,
  ],
];

export function StudentsPage() {
  const data = useUnit($students);
  const table = useStudentTable(data);

  return (
    <>
      <CommandBar title="Данные студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getStudentsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
