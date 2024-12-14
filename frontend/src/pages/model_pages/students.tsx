import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { SlActionRedo } from "react-icons/sl";
import { BsTrash, BsPlusCircle } from "react-icons/bs";
import { ReactNode, useEffect, useState } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import { TStudent, useStudentTable } from "~/entities/Student";
import { apiInstance } from "~/shared/api";
import { MainTable } from "~/shared/ui";

const menuList = [
  <Button variant="danger" style={{ height: "fit-content" }}>
    <BsTrash />
    Очистить данные студентов
  </Button>,
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
  const [data, setData] = useState<TStudent[]>([]);
  const table = useStudentTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get("api/students/");
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Данные студентов" menuList={menuList} />
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
      </form>
    </>
  );
}
