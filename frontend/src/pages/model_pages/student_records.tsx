import { ReactNode } from "react";
import Flatpickr from "react-flatpickr";
import { useUnit } from "effector-react";
import { Russian } from "flatpickr/dist/l10n/ru.js";

import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $studentRecords,
  getStudentRecordsFx,
  useStudentRecordTable,
} from "~/entities/StudentRecord";
import { CreateBtn, ExportBtn, MainTable, TomSelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";
import { API_URL } from "~/shared/config";

const menuList = [
  <CreateBtn
    title={""}
    inputs={undefined}
    onOpen={() => {}}
    onSubmit={() => {}}
    onReset={() => {}}
  />,
  <ExportBtn
    link={`${API_URL}/api/export-student-records/?token=${localStorage.getItem(
      "token"
    )}`}
  />,
];

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <TomSelectInput
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
  <TomSelectInput
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
  <TomSelectInput
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
  <TomSelectInput
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
  <div className="form-group">
    <label className="form-label">Выберите диапазон дат</label>
    <div className="row">
      {["date_range[start]", "date_range[end]"].map((name, key) => (
        <div
          key={key}
          className={`col-md-6 ${key === 0 ? "pe" : "ps"}-auto ${
            key === 0 ? "pe" : "ps"
          }-md-1`}
        >
          <div className="form-group">
            <Flatpickr
              name={name}
              className="form-control"
              options={{
                locale: Russian,
                mode: "single",
                dateFormat: "Y-m-d",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>,
];

export function StudentRecordsPage() {
  const data = useUnit($studentRecords);
  const table = useStudentRecordTable(data);

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
