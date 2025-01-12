import { useUnit } from "effector-react";
import { ReactNode, useEffect } from "react";
import { CommandBar, FilterBar } from "~/widgets";
import { $filters, changeFilter, PageSizeSelector } from "~/features/filters";
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

const getFilters = (): ReactNode[] => {
  const filters = useUnit($filters);
  const activityTypes = useUnit($activityTypes);
  const disciplines = useUnit($disciplines);
  const groups = useUnit($groups);

  return [
    <PageSizeSelector />,
    <SelectInput
      label="Тип активности"
      name="activity_type"
      value={filters.activity_type || ""}
      onChange={(value) => changeFilter({ key: "activity_type", value })}
      options={[
        { label: "Не выбрано", value: "" },
        ...activityTypes.map(({ id, name }) => ({
          value: id.toString(),
          label: name,
        })),
      ]}
    />,
    <SelectInput
      label="Дисциплина"
      name="discipline"
      value={filters.discipline || ""}
      onChange={(value) => changeFilter({ key: "discipline", value })}
      options={[
        { label: "Не выбрано", value: "" },
        ...disciplines.map(({ id, name }) => ({
          value: id.toString(),
          label: name,
        })),
      ]}
    />,
    <SelectInput
      label="Группа"
      name="group"
      value={filters.group || ""}
      onChange={(value) => changeFilter({ key: "group", value })}
      options={[
        { label: "Не выбрано", value: "" },
        ...groups.map(({ id, code }) => ({
          value: id.toString(),
          label: code,
        })),
      ]}
    />,
  ];
};

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
