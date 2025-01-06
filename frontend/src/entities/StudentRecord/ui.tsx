import { useUnit } from "effector-react";
import { ChangeEvent, useState } from "react";
import { $students } from "~/entities/Student";
import { $activities, getActivityText } from "~/entities/Activity";
import { BsInput, CreateOrEditBtn, SelectInput } from "~/shared/ui";
import { createStudentRecord, updateStudentRecord } from "./model";
import { TCreateStudentRecord, TUpdateStudentRecord } from "./types";

const initialData: TCreateStudentRecord = {
  student: 0,
  activity: 0,
  marked_as_proctoring: false,
};

export function CreateOrEditStudentRecord(props: {
  data?: TCreateStudentRecord | TUpdateStudentRecord;
}) {
  const students = useUnit($students);
  const activities = useUnit($activities);

  const data = props.data || initialData;
  const [record, setRecord] = useState(data);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRecord((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () => setRecord(data);
  const handleSubmit = (changeShow: () => void) => {
    if (props.data) {
      updateStudentRecord({ ...(record as TUpdateStudentRecord), changeShow });
    } else {
      createStudentRecord({ ...(record as TCreateStudentRecord), changeShow });
    }
  };

  return (
    <CreateOrEditBtn
      variant={props.data ? "edit" : "add"}
      title={`${props.data ? "Редактировать" : "Создать"} запись студента`}
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <SelectInput
            label="Студент"
            name="student"
            options={[
              { value: "", label: "Не выбрано" },
              ...students.map(({ id, full_name }) => ({
                value: id.toString(),
                label: full_name,
              })),
            ]}
            value={record.student?.toString()}
            onChange={(value) =>
              setRecord((prevState) => ({
                ...prevState,
                student: Number(value),
              }))
            }
            required
          />
          <SelectInput
            label="Активность"
            name="activity"
            options={[
              { value: "", label: "Не выбрано" },
              ...activities.map((el) => ({
                value: el.id.toString(),
                label: getActivityText(el),
              })),
            ]}
            value={record.activity?.toString()}
            onChange={(value) =>
              setRecord((prevState) => ({
                ...prevState,
                activity: Number(value),
              }))
            }
            required
          />
          <BsInput
            variant="checkbox"
            label="Установлено как прокторинг"
            name="marked_as_proctoring"
            checked={record.marked_as_proctoring}
            onChange={handleChange}
          />
        </div>
      }
      onReset={handleReset}
      onSubmit={handleSubmit}
    />
  );
}
