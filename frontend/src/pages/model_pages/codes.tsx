import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { importCodes } from "~/features/import-data";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $codes,
  CreateCode,
  getCodesFx,
  getCodeColumns,
} from "~/entities/Code";
import { ExportBtn, ImportBtn, MainTable, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";
import { API_URL } from "~/shared/config";

const menuList = [
  <CreateCode />,
  <ImportBtn onSubmit={() => importCodes({ url: "/api/import-codes/" })} />,
  <ExportBtn
    link={`${API_URL}/api/export-codes/?token=${localStorage.getItem("token")}`}
  />,
];

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <SelectInput
    name="code"
    label="Код"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "code1"].map((el) => ({
        value: el,
        label: el,
      })),
    ]}
  />,
  <SelectInput
    name="receiver"
    label="Получатель"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "Kanagat"].map((el) => ({
        value: el,
        label: el,
      })),
    ]}
  />,
];

export function CodesPage() {
  const data = useUnit($codes);
  const columns = getCodeColumns();
  return (
    <>
      <CommandBar title="Редактор кодов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getCodesFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
