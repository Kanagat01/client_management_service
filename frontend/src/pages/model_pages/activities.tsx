import { ReactNode, useEffect } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import { $activityTypes, getActivityTypesFx } from "~/entities/ActivityType";
import { $disciplines, getDisciplinesFx } from "~/entities/Discipline";
import { $groups, getGroupsFx } from "~/entities/Group";
import {
  $activities,
  getActivitiesFx,
  getActivityColumns,
} from "~/entities/Activity";
import { MainTable, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <SelectInput
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
  <SelectInput
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
  <SelectInput
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
  <SelectInput
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
  const columns = getActivityColumns();

  useEffect(() => {
    if ($activityTypes.getState().length === 0) getActivityTypesFx();
    if ($disciplines.getState().length === 0) getDisciplinesFx();
    if ($groups.getState().length === 0) getGroupsFx();
  }, []);
  return (
    <>
      <CommandBar title="Активности" menuList={[]} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getActivitiesFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
