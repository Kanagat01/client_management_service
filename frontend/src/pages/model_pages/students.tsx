import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { CommandBar, FilterBar } from "~/widgets";
import { PageSizeSelector } from "~/features/PageSizeSelector";
import {
  $students,
  deleteAllStudents,
  getStudentsFx,
  useStudentTable,
} from "~/entities/Student";
import {
  MainTable,
  DeleteAllBtn,
  CreateBtn,
  TextInput,
  TomSelectInput,
  CheckBox,
} from "~/shared/ui";
import { RenderPromise } from "~/shared/api";

const menuList = [
  <DeleteAllBtn
    title="Очистить данные студентов"
    content="Вы уверены, что хотите очистить все данные студентов?"
    onConfirm={deleteAllStudents}
  />,
  <CreateBtn
    title="Создать студента"
    inputs={
      <div className="d-flex flex-column" style={{ gap: "1rem" }}>
        <TextInput label="TG ID" name="tg_id" />
        <TextInput label="Логин" name="fa_login" />
        <TextInput label="Пароль" name="fa_password" />
        <TextInput label="Телефон" name="phone" />
        <TomSelectInput
          label="Группа"
          name="group"
          options={[
            ...[
              "Не выбрано",
              "ДЭФР22-1",
              "ДЦПУП23-1",
              "ДММ20-1",
              "ДМФ22-1",
            ].map((el) => ({
              value: el,
              label: el,
            })),
          ]}
        />
        <CheckBox label="Верифицирован" id="is_verified" />
      </div>
    }
    onOpen={() => {}}
    onReset={() => {}}
    onSubmit={() => {}}
  />,
];

const filters: ReactNode[] = [
  <PageSizeSelector />,
  <TextInput label="TG ID" name="tg_id" />,
  <TomSelectInput
    name="group_id"
    label="Группа"
    placeholder="Не выбрано"
    options={[
      ...["Не выбрано", "ДЭФР22-1", "ДЦПУП23-1", "ДММ20-1", "ДМФ22-1"].map(
        (el) => ({
          value: el,
          label: el,
        })
      ),
    ]}
  />,
  <TextInput label="Логин" name="login" />,
  <TextInput label="Телефон" name="phone" />,
  <CheckBox label="Верифицирован" name="is_verified" />,
];

export function StudentsPage() {
  const data = useUnit($students);
  const table = useStudentTable(data);

  return (
    <>
      <CommandBar title="Данные студентов" menuList={menuList} />
      <div className="mb-md-4 h-100">
        <FilterBar filters={filters} />
        <div className="bg-white rounded shadow-sm mb-3">
          {RenderPromise(getStudentsFx, {
            success: <MainTable table={table} />,
          })}
        </div>
      </div>
    </>
  );
}
