import { ru } from "date-fns/locale";
import { useUnit } from "effector-react";
import DatePicker from "react-datepicker";
import { ReactNode, useEffect } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $filters,
  changeFilter,
  PageSizeSelector,
  useFilters,
} from "~/features/filters";
import {
  $studentRecords,
  CreateOrEditStudentRecord,
  getStudentRecordsFx,
  getStudentRecordColumns,
  TStudentRecord,
} from "~/entities/StudentRecord";
import { $activities, getActivitiesFx } from "~/entities/Activity";
import { $students, getStudentsFx } from "~/entities/Student";
import { $activityTypes, getActivityTypesFx } from "~/entities/ActivityType";
import { $disciplines, getDisciplinesFx } from "~/entities/Discipline";
import { $groups, getGroupsFx } from "~/entities/Group";
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

  return [
    <PageSizeSelector />,
    <SelectInput
      label="Студент"
      value={filters.student_id || ""}
      onChange={(value) => changeFilter({ key: "student_id", value })}
      options={[
        { label: "Не выбрано", value: "" },
        { label: "Не выбрано 2", value: 45623 },
        ...students.map(({ id, full_name }) => ({
          value: id,
          label: full_name,
        })),
      ]}
    />,
    <SelectInput
      label="Тип активности"
      value={filters.activity_type_id || ""}
      onChange={(value) => changeFilter({ key: "activity_type_id", value })}
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
      value={filters.group_id || ""}
      onChange={(value) => changeFilter({ key: "group_id", value })}
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
      value={filters.discipline_id || ""}
      onChange={(value) => changeFilter({ key: "discipline_id", value })}
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
        onChange={(date: Date | null) => {
          if (date) {
            const localDate = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              date.getTimezoneOffset() / -60
            );

            changeFilter({
              key: "date",
              value: localDate.toISOString().split("T")[0],
            });
          }
        }}
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
  const studentRecords = useUnit($studentRecords);
  const data = useFilters<TStudentRecord>(
    studentRecords,
    (key, el, filters) => {
      let checkValue;

      if (key === "activity_type_id") {
        checkValue = el.activity.activity_type_id;
      } else if (key === "group_id") {
        checkValue = el.activity.group_id;
      } else if (key === "discipline_id") {
        checkValue = el.activity.discipline_id;
      } else if (key === "date") {
        checkValue = el.activity.date;
      }

      return checkValue ? checkValue === filters[key] : false;
    }
  );
  const columns = getStudentRecordColumns();

  useEffect(() => {
    if ($students.getState().length === 0) getStudentsFx();
    if ($activities.getState().length === 0) getActivitiesFx();
    if ($activityTypes.getState().length === 0) getActivityTypesFx();
    if ($groups.getState().length === 0) getGroupsFx();
    if ($disciplines.getState().length === 0) getDisciplinesFx();
    if ($studentRecords.getState().length === 0) getStudentRecordsFx();
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
