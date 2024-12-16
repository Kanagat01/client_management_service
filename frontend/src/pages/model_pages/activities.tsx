import { ReactNode, useEffect, useState } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import { TActivity, useActivityTable } from "~/entities/Activity";
import { MainTable, Modal } from "~/shared/ui";
import { apiInstance } from "~/shared/api";

const filters: [string, ReactNode][] = [
  [
    "Записи на странице",
    <div data-select-message-notfound="Результаты не найдены">
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
    "Тип активности",
    <div data-select-message-notfound="Результаты не найдены">
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
    <div data-select-message-notfound="Результаты не найдены">
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
    <div data-select-message-notfound="Результаты не найдены">
      <select className="form-control" name="group_id" title="Группа">
        <option value="">Не выбрано</option>
        {["ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map((group, key) => (
          <option value={key}>{group}</option>
        ))}
      </select>
    </div>,
  ],
  [
    "Прокторинг",
    <div data-select-message-notfound="Результаты не найдены">
      <select className="form-control" name="group_id" title="Группа">
        <option value=""></option>
        {["Да", "Нет"].map((group, key) => (
          <option value={key}>{group}</option>
        ))}
      </select>
    </div>,
  ],
  [
    "Возможно прокторинг",
    <div data-select-message-notfound="Результаты не найдены">
      <select className="form-control" name="group_id" title="Группа">
        <option value=""></option>
        {["Да", "Нет"].map((group, key) => (
          <option value={key}>{group}</option>
        ))}
      </select>
    </div>,
  ],
];

export function ActivitiesPage() {
  const [data, setData] = useState<TActivity[]>([]);
  const table = useActivityTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get("api/activities/");
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Активности" menuList={[]} />
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
