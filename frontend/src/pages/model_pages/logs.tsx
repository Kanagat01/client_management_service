import { ReactNode, useEffect, useState } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import { TLog, useLogTable } from "~/entities/LogModel";
import { MainTable, Modal } from "~/shared/ui";
import { apiInstance } from "~/shared/api";

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
    "Никнейм",
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
    "Старое значение",
    <div>
      <input className="form-control" type="text" />
    </div>,
  ],
  [
    "Новое значение",
    <div>
      <input className="form-control" type="text" />
    </div>,
  ],
];

export function LogsPage() {
  const [data, setData] = useState<TLog[]>([]);
  const table = useLogTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get("http://localhost:8000/api/logs/");
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Логи" menuList={[]} />
      <form
        id="post-form"
        className="mb-md-4 h-100"
        method="post"
        encType="multipart/form-data"
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
