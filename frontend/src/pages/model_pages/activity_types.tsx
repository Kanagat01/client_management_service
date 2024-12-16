import { ReactNode, useEffect, useState } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import { TActivityType, useActivityTypeTable } from "~/entities/ActivityType";
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
];

export function ActivityTypesPage() {
  const [data, setData] = useState<TActivityType[]>([]);
  const table = useActivityTypeTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get("api/activity-types/");
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Типы активностей" menuList={[]} />
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
