import React, { useEffect, useState } from "react";
// import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import { CiExport } from "react-icons/ci";
import { Sidebar, AddStudents } from "~/widgets";
import { Header, MainTable } from "~/shared/ui";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";

type TGroup = {
  id: number;
  full_name: string;
  phone: string;
};
const groupKeys = ["id", "full_name", "phone"] as (keyof TGroup)[];
const groupHeaders: Record<keyof TGroup, string> = {
  id: "ID",
  full_name: "Name",
  phone: "Phone",
};

const StudentsPage: React.FC = () => {
  const [data, setData] = useState<TGroup[]>([]);
  const columnHelper = createColumnHelper<TGroup>();
  const columns = groupKeys.map((key, index) =>
    columnHelper.accessor(key, {
      id: `column_${index}`,
      cell: (info) => {
        const row = info.row;
        return row.original[key];
      },
      header: () => groupHeaders[key],
    })
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "http://localhost:8000/api_students/students/"
      );
      console.log(response.data);
      console.log(323);

      setData(response.data);
    };
    getData();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        {/* Здесь будет основной контент */}
        <Header title="Данные студентов">
          <button>
            <IoTrashOutline />
            Очистить данные студентов
          </button>
          <div className="export-add-wrapper">
            <button>
              <IoAddCircleOutline fontSize={18} />
              <p>Добавить</p>
            </button>
            <button>
              <CiExport fontSize={18} />
              <p>Экспорт</p>
            </button>
          </div>
        </Header>
        <AddStudents
          inputs1={[
            {
              label: "TG ID",
              key: "tg_id",
            },
            {
              label: "Телефон",
              key: "phone",
            },
            {
              label: "Группа",
              key: "group",
            },
            {
              label: "Логин",
              key: "login",
            },
          ]}
          checkboxInputs={["Верифицирован"]}
        />
        <MainTable table={table} />
      </div>
    </div>
  );
};

export default StudentsPage;
