import { NavLink } from "react-router-dom";
import { BsPlusCircle } from "react-icons/bs";
import { SlActionUndo } from "react-icons/sl";
import { ReactNode, useEffect, useState } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import { TDiscipline, useDisciplineTable } from "~/entities/Discipline";
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
];

export function DisciplinesPage() {
  const [data, setData] = useState<TDiscipline[]>([]);
  const table = useDisciplineTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get("api/disciplines/");
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Дисциплины" menuList={menuList} />
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
