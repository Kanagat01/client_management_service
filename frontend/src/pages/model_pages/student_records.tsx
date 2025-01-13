import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import DatePicker from "react-datepicker";
import { ReactNode, useEffect } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import { $filters, changeFilter, PageSizeSelector } from "~/features/filters";
import {
  $studentRecords,
  CreateOrEditStudentRecord,
  getStudentRecordsFx,
  getStudentRecordColumns,
} from "~/entities/StudentRecord";
import { $activities, getActivitiesFx } from "~/entities/Activity";
import { $students, getStudentsFx } from "~/entities/Student";
import { $activityTypes } from "~/entities/ActivityType";
import { $disciplines } from "~/entities/Discipline";
import { $groups } from "~/entities/Group";
import { API_URL } from "~/shared/config";
import { RenderPromise } from "~/shared/api";
import { ExportBtn, MainTable, SelectInput } from "~/shared/ui";

const menuList = [
  <CreateOrEditStudentRecord />,
  <ExportBtn
    link={`${API_URL}/api/export-student-records/?token=${localStorage.getItem(
      "token"
    )}`}
  />,
];

const getFilters = (): ReactNode[] => {
  const filters = useUnit($filters);
  const students = useUnit($students);
  const activityTypes = useUnit($activityTypes);
  const groups = useUnit($groups);
  const disciplines = useUnit($disciplines);
  const studentRecords = useUnit($studentRecords);
  const allowedDates = [
    ...studentRecords.map((el) => new Date(el.activity.date)),
  ];
  console.log("aaa", filters.date, new Date(filters.date));
  return [
    <PageSizeSelector />,
    <SelectInput
      label="Студент"
      name="student"
      value={filters.student || ""}
      onChange={(value: string | number) =>
        changeFilter({ key: "student", value })
      }
      options={[
        { label: "Не выбрано", value: "" },
        ...students.map(({ id, full_name }) => ({
          value: id,
          label: full_name,
        })),
      ]}
    />,
    <SelectInput
      label="Тип активности"
      name="activity_type"
      value={filters.activity_type || ""}
      onChange={(value: string | number) =>
        changeFilter({ key: "activity_type", value })
      }
      options={[
        { label: "Не выбрано", value: "" },
        ...activityTypes.map(({ id, name }) => ({
          value: id,
          label: name,
        })),
      ]}
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
        ...groups.map(({ id, code }) => ({
          value: id,
          label: code,
        })),
      ]}
    />,
    <SelectInput
      label="Дисциплина"
      name="discipline"
      value={filters.discipline || ""}
      onChange={(value: string | number) =>
        changeFilter({ key: "discipline", value })
      }
      options={[
        { label: "Не выбрано", value: "" },
        ...disciplines.map(({ id, name }) => ({
          value: id,
          label: name,
        })),
      ]}
    />,
    <div className="form-group">
      <div className="form-label">Дата записи</div>
      <DatePicker
        selected={filters.date ? new Date(filters.date) : null}
        onChange={(date: Date | null) =>
          date
            ? changeFilter({
                key: "date",
                value: date.toISOString().split("T")[0],
              })
            : {}
        }
        filterDate={(date: Date) =>
          allowedDates.some(
            (allowedDate) =>
              date.getFullYear() === allowedDate.getFullYear() &&
              date.getMonth() === allowedDate.getMonth() &&
              date.getDate() === allowedDate.getDate()
          )
        }
        placeholderText="Выберите дату"
        className="form-control"
        locale={ru}
      />
    </div>,
  ];
};

export function StudentRecordsPage() {
  const data = useUnit($studentRecords);
  const columns = getStudentRecordColumns();

  useEffect(() => {
    if ($students.getState().length === 0) getStudentsFx();
    if ($activities.getState().length === 0) getActivitiesFx();
  }, []);
  return (
    <>
      <CommandBar title="Записи студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar getFilters={getFilters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getStudentRecordsFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
