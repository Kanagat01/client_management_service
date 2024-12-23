import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import { $codes, getCodesFx, useCodeTable } from "~/entities/Code";
import {
  CreateBtn,
  ExportBtn,
  ImportBtn,
  MainTable,
  TomSelectInput,
} from "~/shared/ui";
import { RenderPromise } from "~/shared/api";
import { API_URL } from "~/shared/config";
import { importCodes } from "~/features/import-data";

const menuList = [
  <CreateBtn
    title={"Создать код"}
    inputs={undefined}
    onOpen={() => {}}
    onSubmit={() => {}}
    onReset={() => {}}
  />,
  <ImportBtn onSubmit={() => importCodes({ url: "/api/import-codes/" })} />,
  <ExportBtn
    link={`${API_URL}/api/export-codes/?token=${localStorage.getItem("token")}`}
  />,
];

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <TomSelectInput
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
  <TomSelectInput
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
  const table = useCodeTable(data);

  return (
    <>
      <CommandBar title="Редактор кодов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getCodesFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
