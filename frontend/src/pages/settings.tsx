import axios from "axios";
import { useEffect, useState } from "react";
import { CommandBar } from "~/widgets";
import { TStudent, useStudentTable } from "~/entities/Student";
import { MainTable, Modal } from "~/shared/ui";

export function SettingsPage() {
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
      <CommandBar title="Настройки" menuList={[]} />
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
