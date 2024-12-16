import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { CommandBar } from "~/widgets";
import { TMessage, useMessageTable } from "~/entities/Message";
import { MainTable, Modal } from "~/shared/ui";
import { apiInstance } from "~/shared/api";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsCheckCircle />
    <span>Создать</span>
  </NavLink>,
];

export function MessagesPage() {
  const [data, setData] = useState<TMessage[]>([]);
  const table = useMessageTable(data);

  useEffect(() => {
    const getData = async () => {
      const response = await apiInstance.get("api/messages/");
      setData(response.data);
    };
    getData();
  }, []);
  return (
    <>
      <CommandBar title="Список отправленных сообщений" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <div className="bg-white rounded shadow-sm mb-3">
          <MainTable table={table} />
        </div>
        <Modal />
      </div>
    </>
  );
}
