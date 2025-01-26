import { useUnit } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { $groups } from "~/entities/Group";
import { BsInput, CreateOrEditBtn, SelectInput } from "~/shared/ui";
import { createStudent, updateStudent } from "./model";
import { TCreateStudent, TStudent } from "./types";

const initialData: TCreateStudent = {
  telegram_id: 0,
  fa_login: "",
  fa_password: "",
  phone: "",
  group: "",
  is_verified: false,
};

export function CreateOrEditStudent(props: {
  data?: TCreateStudent | TStudent;
}) {
  const groups = useUnit($groups);

  const data = props.data || initialData;
  const [student, setStudent] = useState(data);

  useEffect(() => {
    if (typeof student.group === "string") {
      const matchedGroup = groups.find((group) => group.code === student.group);
      setStudent((prevStudent) => ({
        ...prevStudent,
        group: matchedGroup?.id || null,
      }));
    }
  }, [student.group, groups]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () => setStudent(data);
  const handleSubmit = (changeShow: () => void) => {
    if (props.data) {
      updateStudent({ ...(student as TStudent), changeShow });
    } else {
      createStudent({
        ...(student as TCreateStudent),
        changeShow: () => {
          changeShow();
          handleReset();
        },
      });
    }
  };

  return (
    <CreateOrEditBtn
      variant={props.data ? "edit" : "add"}
      title={`${props.data ? "Редактировать" : "Создать"} студента`}
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <BsInput
            variant="input"
            label="TG ID"
            name="telegram_id"
            value={student.telegram_id !== 0 ? student.telegram_id : ""}
            onChange={handleChange}
            type="number"
            required
          />
          <BsInput
            variant="input"
            label="Логин"
            name="fa_login"
            value={student.fa_login}
            onChange={handleChange}
            required
          />
          <BsInput
            variant="input"
            label="Пароль"
            name="fa_password"
            value={student.fa_password}
            onChange={handleChange}
            required
          />
          <BsInput
            variant="input"
            label="Телефон"
            name="phone"
            value={student.phone}
            onChange={handleChange}
            type="tel"
          />
          <SelectInput
            label="Группа"
            name="group"
            options={[
              { value: "", label: "Не выбрано" },
              ...groups.map(({ id, code }) => ({
                value: id.toString(),
                label: code,
              })),
            ]}
            value={student.group?.toString()}
            onChange={(value) =>
              setStudent((prevStudent) => ({
                ...prevStudent,
                group: Number(value),
              }))
            }
            required
          />
          <BsInput
            variant="checkbox"
            label="Верифицирован"
            name="is_verified"
            checked={student.is_verified}
            onChange={handleChange}
          />
        </div>
      }
      onReset={handleReset}
      onSubmit={handleSubmit}
    />
  );
}
