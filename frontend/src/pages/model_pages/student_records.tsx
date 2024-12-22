import { ReactNode } from "react";
import Flatpickr from "react-flatpickr";
import { useUnit } from "effector-react";
import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { Russian } from "flatpickr/dist/l10n/ru.js";

import { CommandBar, FilterBar } from "~/widgets";
import {
  $studentRecords,
  getStudentRecordsFx,
  useStudentRecordTable,
} from "~/entities/StudentRecord";
import { ExportBtn, MainTable } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";
import { API_URL } from "~/shared/config";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsPlusCircle />
    <span>Добавить</span>
  </NavLink>,
  <ExportBtn
    link={`${API_URL}/api/export_student_records/?token=${localStorage.getItem(
      "token"
    )}`}
  />,
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
    "Студент",
    <div
      data-controller="select"
      data-select-message-notfound="Результаты не найдены"
    >
      <select className="form-control" name="group_id" title="Группа">
        <option value="">Не выбрано</option>
        {["Иван Иванов", "Алексей Сергеевич"].map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </select>
    </div>,
  ],
  [
    "Тип активности",
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
  [
    "Дисциплина",
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
  [
    "Выберите диапазон дат",
    <div className="row">
      {[
        ["start_field-date-range", "date_range[start]"],
        ["end_field-date-range", "date_range[end]"],
      ].map(([id, name], key) => (
        <div
          key={key}
          className={`col-md-6 ${key === 0 ? "pe" : "ps"}-auto ${
            key === 0 ? "pe" : "ps"
          }-md-1`}
        >
          <div className="form-group">
            <Flatpickr
              id={id}
              name={name}
              className="form-control"
              options={{
                locale: Russian,
                mode: "single",
                dateFormat: "Y-m-d",
              }}
            />
          </div>
        </div>
      ))}
    </div>,
  ],
];

export function StudentRecordsPage() {
  const data = useUnit($studentRecords);
  const table = useStudentRecordTable(data);

  return (
    <>
      <CommandBar title="Записи студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getStudentRecordsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
