import { useUnit } from "effector-react";
import { ReactNode, useEffect } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $filters,
  changeFilter,
  handleFilterChange,
  PageSizeSelector,
  useFilters,
} from "~/features/filters";
import {
  $students,
  CreateOrEditStudent,
  deleteAllStudents,
  getStudentColumns,
  getStudentsFx,
  TStudent,
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
      value={filters.telegram_id || ""}
      onChange={handleFilterChange}
    />,
    <SelectInput
      label="Группа"
      name="group"
      value={filters.group || ""}
      onChange={(value: string | number) =>
        changeFilter({ key: "group", value })
      }
      options={[
        { label: "Не выбрано", value: "" },
        ...groups.map(({ code }) => ({
          value: code,
          label: code,
        })),
      ]}
    />,
    <BsInput
      variant="input"
      label="Логин"
      name="fa_login"
      value={filters.fa_login || ""}
      onChange={handleFilterChange}
    />,
    <BsInput
      variant="input"
      label="Телефон"
      name="phone"
      value={filters.phone || ""}
      onChange={handleFilterChange}
    />,
    <BsInput
      variant="checkbox"
      label="Верифицирован"
      value={filters.is_verified || ""}
      onChange={(e) =>
        changeFilter({ key: "is_verified", value: String(e.target.checked) })
      }
    />,
  ];
};

export function StudentsPage() {
  const students = useUnit($students);
  const data = useFilters<TStudent>(students, (key, el, filters) => {
    if (key === "telegram_id") {
      return el.telegram_id.toString().includes(filters[key]);
    } else if (["fa_login", "phone"].includes(key)) {
      return (el[key as keyof TStudent] as string)
        .toLowerCase()
        .includes((filters[key] as string).toLowerCase());
    } else if (key === "is_verified") {
      const is_verified = filters[key] === "true" ? true : false;
      return el.is_verified === is_verified;
    }
    return false;
  });
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
