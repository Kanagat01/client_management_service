import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $activities,
  getActivitiesFx,
  useActivityTable,
} from "~/entities/Activity";
import { MainTable, TomSelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <TomSelectInput
    name="activity_type"
    label="Тип активности"
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
  <TomSelectInput
    name="group_id"
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
    name="proctoring"
    label="Прокторинг"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "Да", "Нет"].map((el) => ({
        value: el,
        label: el,
      })),
    ]}
  />,
  <TomSelectInput
    name="proctoring_possible" // ???
    label="Возможно прокторинг"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "Да", "Нет"].map((el) => ({
        value: el,
        label: el,
      })),
    ]}
  />,
];

export function ActivitiesPage() {
  const data = useUnit($activities);
  const table = useActivityTable(data);
  return (
    <>
      <CommandBar title="Активности" menuList={[]} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getActivitiesFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
