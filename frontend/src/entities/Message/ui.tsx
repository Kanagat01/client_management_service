import { useUnit } from "effector-react";
import { ChangeEvent, useEffect, useState } from "react";
import { $students } from "~/entities/Student";
import { $groups } from "~/entities/Group";
import { BsInput, SelectInput, CreateOrEditBtn } from "~/shared/ui";
import { getLocalISOTime } from "~/shared/lib";
import { createMessage } from "./model";
import { TCreateMessage } from "./types";

const initialData = { text: "", schedule_datetime: "", student: 0 };

export function CreateMessage(props: { data?: TCreateMessage }) {
  const students = useUnit($students);
  const groups = useUnit($groups);
  const [receiverType, setReceiverType] = useState<"group" | "student" | "">(
    props.data ? (props.data.group ? "group" : "student") : ""
  );

  const [data, setData] = useState<TCreateMessage>(props.data || initialData);

  const [minDatetime, setMinDatetime] = useState(getLocalISOTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setMinDatetime(getLocalISOTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (
      name === "schedule_datetime" &&
      new Date(value) < new Date(minDatetime)
    ) {
      return;
    }
    setData({ ...data, [name]: value });
  };
  const onReset = () => setData(initialData);
  const onSubmit = (changeShow: () => void) =>
    createMessage({
      ...data,
      changeShow: () => {
        changeShow();
        onReset();
      },
    });

  return (
    <CreateOrEditBtn
      variant={props.data ? "reuse" : "create"}
      variantText={props.data ? "Отправить заново" : undefined}
      title="Создать рассылку"
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <SelectInput
            label="Тип получателя"
            value={receiverType || ""}
            onChange={(value) => setReceiverType(value as "group" | "student")}
            options={[
              { value: "", label: "Не выбрано" },
              { value: "student", label: "Студент" },
              { value: "group", label: "Группа" },
            ]}
            required
          />
          {receiverType === "group" && (
            <SelectInput
              label="Группа"
              value={data.group !== 0 ? data.group?.toString() : ""}
              onChange={(value) =>
                setData({
                  ...data,
                  group: Number(value),
                  student: undefined,
                })
              }
              options={groups.map((group) => ({
                value: group.id.toString(),
                label: group.code,
              }))}
              required
            />
          )}
          {receiverType === "student" && (
            <SelectInput
              label="Студент"
              value={data.student !== 0 ? data.student?.toString() : ""}
              onChange={(value) =>
                setData((prevState) => ({
                  ...prevState,
                  student: Number(value),
                  group: undefined,
                }))
              }
              options={students.map((student) => ({
                value: student.id.toString(),
                label: student.full_name,
              }))}
              required
            />
          )}
          <BsInput
            variant="textarea"
            className="no-resize"
            label="Содержание"
            name="text"
            value={data.text}
            onChange={handleChange}
          />
          <BsInput
            variant="input"
            label="Выберите дату и время отправки"
            name="schedule_datetime"
            value={data.schedule_datetime}
            onChange={handleChange}
            type="datetime-local"
            min={minDatetime}
            required
          />
        </div>
      }
      onReset={onReset}
      onSubmit={onSubmit}
    />
  );
}
