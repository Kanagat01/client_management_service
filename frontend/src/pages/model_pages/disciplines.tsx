import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import { importCodes } from "~/features/import-data";
import {
  $disciplines,
  CreateDiscipline,
  getDisciplinesFx,
  useDisciplineTable,
} from "~/entities/Discipline";
import { RenderPromise } from "~/shared/api";
import { ImportBtn, MainTable } from "~/shared/ui";

const menuList = [
  <CreateDiscipline />,
  <ImportBtn
    onSubmit={() => importCodes({ url: "/api/import-disciplines/" })}
  />,
];

const filters: ReactNode[] = [<PageSizeSelector />];

export function DisciplinesPage() {
  const data = useUnit($disciplines);
  const table = useDisciplineTable(data);

  return (
    <>
      <CommandBar title="Дисциплины" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />

        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getDisciplinesFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
