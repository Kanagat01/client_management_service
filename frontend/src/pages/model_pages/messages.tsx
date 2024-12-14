import axios from "axios";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { CommandBar } from "~/widgets";
import { TStudent, useStudentTable } from "~/entities/Student";
import { MainTable, Modal } from "~/shared/ui";

const menuList = [
  <NavLink className="btn btn-link icon-link" to="#">
    <BsCheckCircle />
    <span>Создать</span>
  </NavLink>,
];

export function MessagesPage() {
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
      <CommandBar title="Список отправленных сообщений" menuList={menuList} />
      <form
        id="post-form"
        className="mb-md-4 h-100"
        method="post"
        encType="multipart/form-data"
      >
        <div className="bg-white rounded shadow-sm mb-3">
          <MainTable table={table} />
        </div>
        <Modal />
      </form>
    </>
  );
}
