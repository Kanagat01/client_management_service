import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import { $logs, getLogsFx, getLogColumns } from "~/entities/LogModel";
import { MainTable, BsInput, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <SelectInput
    name="nickname"
    label="Никнейм"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "nick1"].map((el) => ({
        value: el,
        label: el,
      })),
    ]}
  />,
  <BsInput variant="input" label="Старое значение" />,
  <BsInput variant="input" label="Новое значение" />,
];

export function LogsPage() {
  const data = useUnit($logs);
  const columns = getLogColumns();
  return (
    <>
      <CommandBar title="Логи" menuList={[]} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />

        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getLogsFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
