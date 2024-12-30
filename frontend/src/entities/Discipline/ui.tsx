import { useState } from "react";
import { CreateOrEditBtn, BsInput } from "~/shared/ui";
import { createDiscipline } from "./model";
import { TDiscipline } from "./types";

export function CreateDiscipline() {
  const initialData = {
    fa_id: 0,
    name: "",
  };
  const [data, setData] = useState<Omit<TDiscipline, "id">>(initialData);

  const onReset = () => setData(initialData);
  const onSubmit = () => createDiscipline({ ...data, onReset });
  return (
    <CreateOrEditBtn
      variant="add"
      title="Добавить дисциплину"
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <BsInput
            variant="input"
            label="Название дисциплины"
            value={data.name}
            onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
            required
          />
          <BsInput
            variant="input"
            label="FA ID"
            value={data.fa_id !== 0 ? data.fa_id : ""}
            onChange={(e) =>
              setData((d) => ({ ...d, fa_id: Number(e.target.value) }))
            }
            required
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}

export function EditDiscipline(initialData: TDiscipline) {
  const [data, setData] = useState<Omit<TDiscipline, "id">>(initialData);

  const onReset = () => setData(initialData);
  const onSubmit = () => editDiscipline({ ...data, onReset });
  return (
    <CreateOrEditBtn
      variant="edit"
      title={""}
      inputs={undefined}
      onSubmit={() => {}}
      onReset={() => {}}
    />
  );
}
