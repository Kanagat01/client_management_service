import Flatpickr from "react-flatpickr";
import { Russian } from "flatpickr/dist/l10n/ru.js";
import { NavLink } from "react-router-dom";
import { SlActionRedo } from "react-icons/sl";
import { BsPlusCircle } from "react-icons/bs";
import { ReactNode, useEffect, useState } from "react";

import { CommandBar, FilterBar } from "~/widgets";
import {
  TStudentRecord,
  useStudentRecordTable,
} from "~/entities/StudentRecord";
import { MainTable, Modal } from "~/shared/ui";
import { apiInstance } from "~/shared/api";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsPlusCircle />
    <span>Добавить</span>
  </NavLink>,
  <NavLink className="btn btn-link icon-link" to="#">
    <SlActionRedo />
    <span>Экспорт</span>
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
          <option value={cnt} selected={cnt === 15}>
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
      data-select-placeholder=""
      data-select-allow-empty="1"
      data-select-message-notfound="Результаты не найдены"
      data-select-allow-add="false"
      data-select-message-add="Добавить"
    >
      <select className="form-control" name="group_id" title="Группа">
        <option value="">Не выбрано</option>
        {["Иван Иванов", "Алексей Сергеевич"].map((group, key) => (
          <option value={key}>{group}</option>
        ))}
      </select>
    </div>,
  ],
  [
    "Тип активности",
    <div
      data-controller="select"
      data-select-placeholder=""
      data-select-allow-empty="1"
      data-select-message-notfound="Результаты не найдены"
      data-select-allow-add="false"
      data-select-message-add="Добавить"
    >
      <select className="form-control" name="group_id" title="Группа">
        <option value="">Не выбрано</option>
        {["ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map((group, key) => (
          <option value={key}>{group}</option>
        ))}
      </select>
    </div>,
  ],
  [
    "Группа",
    <div
      data-controller="select"
      data-select-placeholder=""
      data-select-allow-empty="1"
      data-select-message-notfound="Результаты не найдены"
      data-select-allow-add="false"
      data-select-message-add="Добавить"
    >
      <select className="form-control" name="group_id" title="Группа">
        <option value="">Не выбрано</option>
        {["ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map((group, key) => (
          <option value={key}>{group}</option>
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
        {["ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map((group, key) => (
          <option value={key}>{group}</option>
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
  const [data, setData] = useState<TStudentRecord[]>([]);
  const table = useStudentRecordTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get("api/student-records/");
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Записи студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          <MainTable table={table} />
        </div>
        <Modal />
      </div>
    </>
  );
}
