import { ReactNode, useEffect } from "react";
import { useUnit } from "effector-react";

import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $studentRecords,
  CreateOrEditStudentRecord,
  getStudentRecordsFx,
  useStudentRecordTable,
} from "~/entities/StudentRecord";
import { ExportBtn, MainTable, BsInput, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";
import { API_URL } from "~/shared/config";
import { $students, getStudentsFx } from "~/entities/Student";
import { $activities, getActivitiesFx } from "~/entities/Activity";

const menuList = [
  <CreateOrEditStudentRecord />,
  <ExportBtn
    link={`${API_URL}/api/export-student-records/?token=${localStorage.getItem(
      "token"
    )}`}
  />,
];

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <SelectInput
    name="full_name"
    label="Студент"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "Иван Иванов", "Алексей Сергеевич"].map((el) => ({
        value: el,
        label: el,
      })),
    ]}
  />,
  <SelectInput
    name="activity_type"
    label="Тип активности"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "Активность 1"].map((el) => ({
        value: el,
        label: el,
      })),
    ]}
  />,
  <SelectInput
    name="group"
    label="Группа"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map(
        (el) => ({
          value: el,
          label: el,
        })
      ),
    ]}
  />,
  <SelectInput
    name="discipline"
    label="Дисциплина"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map(
        (el) => ({
          value: el,
          label: el,
        })
      ),
    ]}
  />,
  <div className="row">
    <label className="form-label">Выберите диапазон дат</label>
    <div className="col-md-6">
      <BsInput label="" variant="input" type="date" />
    </div>
    <div className="col-md-6">
      <BsInput label="" variant="input" type="date" />
    </div>
  </div>,
];

export function StudentRecordsPage() {
  const data = useUnit($studentRecords);
  const table = useStudentRecordTable(data);

  useEffect(() => {
    if ($students.getState().length === 0) getStudentsFx();
    if ($activities.getState().length === 0) getActivitiesFx();
  }, []);
  return (
    <>
      <CommandBar title="Записи студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getStudentRecordsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
