import axios from "axios";
import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { ReactNode, useEffect, useState } from "react";
import { SlActionRedo, SlActionUndo } from "react-icons/sl";
import { CommandBar, FilterBar } from "~/widgets";
import { TStudent, useStudentTable } from "~/entities/Student";
import { MainTable, Modal } from "~/shared/ui";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsPlusCircle />
    <span>Добавить</span>
  </NavLink>,
  <NavLink className="btn btn-link icon-link" to="#">
    <SlActionUndo />
    <span>Импорт из Excel</span>
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
      <select className="form-control">
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
    "Код",
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
    "Получатель",
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
];

export function CodesPage() {
  const [data, setData] = useState<TStudent[]>([]);
  const table = useStudentTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("http://localhost:8000/api/students/");
      console.log("respData", response.data);
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Редактор кодов" menuList={menuList} />
      <form
        id="post-form"
        className="mb-md-4 h-100"
        method="post"
        encType="multipart/form-data"
        data-form-failed-validation-message-value="Пожалуйста, проверьте введенные данные, возможны указания на других языках."
      >
        <FilterBar filters={filters} />

        <div className="bg-white rounded shadow-sm mb-3">
          <MainTable table={table} />
        </div>

        <Modal />
      </form>
    </>
  );
}
