import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { importData } from "~/features/import-data";
import { $filters, changeFilter, PageSizeSelector } from "~/features/filters";
import { CreateOrEditInstructionForProctoring } from "~/entities/InstructionForProctoring";
import {
  $codes,
  CreateCode,
  getCodesAndInstructionFx,
  getCodeColumns,
  TCode,
  setCodes,
} from "~/entities/Code";
import { ExportBtn, ImportBtn, MainTable, SelectInput } from "~/shared/ui";
import { RenderPromise } from "~/shared/api";
import { API_URL } from "~/shared/config";
import { $students } from "~/entities/Student";

const menuList = [
  <CreateCode />,
  <ImportBtn
    onSubmit={() =>
      importData({
        url: "/api/import-codes/",
        success: (response) => {
          const data = response.message as TCode[];
          setCodes([...$codes.getState(), ...data]);
          return `Успешно импортировано ${data.length} кодов для системы прокторинга`;
        },
      })
    }
  />,
  <ExportBtn
    link={`${API_URL}/api/export-codes/?token=${localStorage.getItem("token")}`}
  />,
  <CreateOrEditInstructionForProctoring />,
];

const getFilters = (): ReactNode[] => {
  const filters = useUnit($filters);
  const codes = useUnit($codes);
  const students = useUnit($students);

  return [
    <PageSizeSelector />,
    <SelectInput
      label="Код"
      name="value"
      value={filters.code_value || ""}
      onChange={(value) => changeFilter({ key: "code_value", value })}
      options={[
        { label: "Не выбрано", value: "" },
        ...codes.map(({ id, value }) => ({
          value: id.toString(),
          label: value,
        })),
      ]}
    />,
    <SelectInput
      label="Студент"
      name="student"
      value={filters.student || ""}
      onChange={(value) => changeFilter({ key: "student", value })}
      options={[
        { label: "Не выбрано", value: "" },
        ...students.map(({ id, full_name }) => ({
          value: id.toString(),
          label: full_name,
        })),
      ]}
    />,
  ];
};

export function CodesPage() {
  const data = useUnit($codes);
  const columns = getCodeColumns();
  return (
    <>
      <CommandBar title="Редактор кодов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar getFilters={getFilters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getCodesAndInstructionFx, {
            success: <MainTable data={data} columns={columns} />,
          })}
        </div>
      </div>
    </>
  );
}
