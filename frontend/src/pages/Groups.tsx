import { CiExport } from "react-icons/ci";
import { Sidebar } from "~/widgets";
import { Header, MainTable } from "~/shared/ui";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "axios";
import "./../app/styles/groupsTable.scss";

// move to entities Group
type TGroup = {
  id: number;
  label: string;
  description: string;
};

const groupKeys = ["id", "label", "description"] as (keyof TGroup)[];
const groupHeaders: Record<keyof TGroup, string> = {
  id: "ID",
  label: "Группа",
  description: "Факультет",
};

export default function StudentsPage() {
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
        "https://ruz.fa.ru/api/search?term=%D0%A222-&type=group"
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
        <Header title="Данные студентов">
          <div className="export-add-wrapper">
            <button>
              <CiExport fontSize={18} />
              <p>Экспорт</p>
            </button>
          </div>
        </Header>
        <MainTable table={table} />
      </div>
    </div>
  );
}
