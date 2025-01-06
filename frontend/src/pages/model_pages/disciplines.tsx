import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import { importData } from "~/features/import-data";
import {
  $disciplines,
  getDisciplinesFx,
  getDisciplineColumns,
  CreateOrEditDiscipline,
  setDisciplines,
  TDiscipline,
} from "~/entities/Discipline";
import { RenderPromise } from "~/shared/api";
import { ImportBtn, MainTable } from "~/shared/ui";

const menuList = [
  <CreateOrEditDiscipline />,
  <ImportBtn
    onSubmit={() =>
      importData({
        url: "/api/import-disciplines/",
        success: (response) => {
          const data = response.message as TDiscipline[];
          setDisciplines([...$disciplines.getState(), ...data]);
          return `Успешно импортировано ${data.length} дисциплин`;
        },
      })
    }
  />,
];

const filters: ReactNode[] = [<PageSizeSelector />];

export function DisciplinesPage() {
  const data = useUnit($disciplines);
  const columns = getDisciplineColumns();

  return (
    <>
      <CommandBar title="Дисциплины" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />

        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getDisciplinesFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
