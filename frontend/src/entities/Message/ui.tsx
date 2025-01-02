import { useState } from "react";
import { BsInput, SelectInput, CreateOrEditBtn } from "~/shared/ui";
import { createMessage } from "./model";
import { TMessage } from "./types";

export function CreateMessage() {
  const initialData = { receiver: 0, text: "", schedule_datetime: "" };
  const [data, setData] =
    useState<Omit<TMessage, "id" | "is_sent">>(initialData);

  const onReset = () => setData(initialData);
  const onSubmit = () => createMessage({ ...data, onReset });

  return (
    <CreateOrEditBtn
      variant="create"
      title="Создать рассылку"
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <SelectInput
            label="Получатель"
            value={data.receiver !== 0 ? "" : data.receiver.toString()} // TODO
            onChange={(newValue) => setData({ ...data, receiver: newValue })}
            options={[]}
            required
          />
          <BsInput
            variant="textarea"
            label="Содержание"
            className="no-resize"
            value={data.text}
            onChange={(e) => setData({ ...data, text: e.target.value })}
          />
          <BsInput
            variant="input"
            label="Выберите дату и время отправки"
            type="datetime-local"
          />
        </div>
      }
      onReset={onReset}
      onSubmit={onSubmit}
    />
  );
}
