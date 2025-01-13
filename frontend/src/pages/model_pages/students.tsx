import { useUnit } from "effector-react";
import { ReactNode, useEffect } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $filters,
  changeFilter,
  handleFilterChange,
  PageSizeSelector,
} from "~/features/filters";
import {
  $students,
  CreateOrEditStudent,
  deleteAllStudents,
  getStudentColumns,
  getStudentsFx,
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

const getFilters = (): ReactNode[] => {
  const filters = useUnit($filters);
  const groups = useUnit($groups);

  return [
    <PageSizeSelector />,
    <BsInput
      variant="input"
      label="TG ID"
      name="telegram_id"
      value={filters.telegram_id}
      onChange={handleFilterChange}
    />,
    <SelectInput
      label="Группа"
      name="group"
      value={filters.group}
      onChange={(value: string | number) =>
        changeFilter({ key: "group", value })
      }
      options={[
        { label: "Не выбрано", value: "" },
        ...groups.map(({ id, code }) => ({
          value: id.toString(),
          label: code,
        })),
      ]}
    />,
    <BsInput
      variant="input"
      label="Логин"
      name="fa_login"
      value={filters.fa_login}
      onChange={handleFilterChange}
    />,
    <BsInput
      variant="input"
      label="Телефон"
      name="phone"
      value={filters.phone}
      onChange={handleFilterChange}
    />,
    <BsInput
      variant="checkbox"
      label="Верифицирован"
      name="is_verified"
      value={filters.is_verified}
      onChange={handleFilterChange}
    />,
  ];
};

export function StudentsPage() {
  const data = useUnit($students);
  const columns = getStudentColumns();

  useEffect(() => {
    if ($groups.getState().length === 0) getGroupsFx();
  }, []);

  return (
    <>
      <CommandBar title="Данные студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar getFilters={getFilters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getStudentsFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
