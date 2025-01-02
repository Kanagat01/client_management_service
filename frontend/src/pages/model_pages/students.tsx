import { ReactNode, useEffect } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $students,
  CreateOrEditStudent,
  deleteAllStudents,
  getStudentsFx,
  useStudentTable,
} from "~/entities/Student";
import { $groups, getGroupsFx } from "~/entities/Group";
import { MainTable, DeleteAllBtn, BsInput, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const menuList = [
  <DeleteAllBtn
    title="Очистить данные студентов"
    content="Вы уверены, что хотите очистить все данные студентов?"
    onConfirm={deleteAllStudents}
  />,
  <CreateOrEditStudent />,
];

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <BsInput variant="input" label="TG ID" name="tg_id" />,
  <SelectInput
    name="group_id"
    label="Группа"
    options={[
      ...["Не выбрано", "ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map(
        (el) => ({
          value: el,
          label: el,
        })
      ),
    ]}
  />,
  <BsInput variant="input" label="Логин" name="login" />,
  <BsInput variant="input" label="Телефон" name="phone" />,
  <BsInput variant="checkbox" label="Верифицирован" name="is_verified" />,
];

export function StudentsPage() {
  const data = useUnit($students);
  const table = useStudentTable(data);

  useEffect(() => {
    if ($groups.getState().length === 0) getGroupsFx();
  }, []);

  return (
    <>
      <CommandBar title="Данные студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getStudentsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
