import { useUnit } from "effector-react";
import { ReactNode, useEffect } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import {
  $filters,
  changeFilter,
  PageSizeSelector,
  useFilters,
} from "~/features/filters";
import { $activityTypes, getActivityTypesFx } from "~/entities/ActivityType";
import { $disciplines, getDisciplinesFx } from "~/entities/Discipline";
import { $groups, getGroupsFx } from "~/entities/Group";
import {
  $activities,
  getActivitiesFx,
  getActivityColumns,
  TActivity,
} from "~/entities/Activity";
import { MainTable, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const getFilters = (): ReactNode[] => {
  const filters = useUnit($filters);
  const activityTypes = useUnit($activityTypes);
  const disciplines = useUnit($disciplines);
  const groups = useUnit($groups);

  return [
    <PageSizeSelector />,
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
  ];
};

export function ActivitiesPage() {
  const activities = useUnit($activities);
  const data = useFilters<TActivity>(activities);
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
        <FilterBar getFilters={getFilters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getActivitiesFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
