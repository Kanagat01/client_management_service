import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $groups,
  CreateGroup,
  getGroupsFx,
  useGroupTable,
} from "~/entities/Group";
import { MainTable } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const menuList = [<CreateGroup />];
const filters: ReactNode[] = [<PageSizeSelector />];

export function GroupsPage() {
  const data = useUnit($groups);
  const table = useGroupTable(data);

  return (
    <>
      <CommandBar title="Группы" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getGroupsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
