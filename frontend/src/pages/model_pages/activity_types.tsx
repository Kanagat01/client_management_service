import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $activityTypes,
  getActivityTypesFx,
  getActivityTypeColumns,
} from "~/entities/ActivityType";
import { MainTable } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const filters: ReactNode[] = [<PageSizeSelector />];

export function ActivityTypesPage() {
  const data = useUnit($activityTypes);
  const columns = getActivityTypeColumns();
  return (
    <>
      <CommandBar title="Типы активностей" menuList={[]} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getActivityTypesFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
