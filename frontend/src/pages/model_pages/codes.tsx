import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { ReactNode, useEffect, useState } from "react";
import { SlActionRedo, SlActionUndo } from "react-icons/sl";
import { CommandBar, FilterBar } from "~/widgets";
import { TCode, useCodeTable } from "~/entities/Code";
import { MainTable, Modal } from "~/shared/ui";
import { apiInstance } from "~/shared/api";

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
      data-select-message-notfound="Результаты не найдены"
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
  const [data, setData] = useState<TCode[]>([]);
  const table = useCodeTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get(
        "http://localhost:8000/api/codes/"
      );
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Редактор кодов" menuList={menuList} />
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
