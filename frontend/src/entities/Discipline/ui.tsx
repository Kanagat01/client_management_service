import { useState } from "react";
import { CreateOrEditBtn, BsInput } from "~/shared/ui";
import { createDiscipline, updateDiscipline } from "./model";
import { TCreateDiscipline, TDiscipline } from "./types";

const defaultState = {
  fa_id: 0,
  name: "",
};

export function CreateOrEditDiscipline({
  initialState = defaultState,
}: {
  initialState?: TCreateDiscipline | TDiscipline;
}) {
  const isEdit = "id" in initialState;
  const [data, setData] = useState(initialState);

  const onReset = () => setData(initialState);
  const onSubmit = (changeShow: () => void) => {
    if (isEdit) {
      updateDiscipline({ ...(data as TDiscipline), changeShow: onReset });
    } else {
      createDiscipline({
        ...data,
        changeShow: () => {
          changeShow();
          onReset();
        },
      });
    }
  };
  return (
    <CreateOrEditBtn
      variant={isEdit ? "edit" : "add"}
      title={`${isEdit ? "Редактировать" : "Добавить"} дисциплину`}
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
            type="number"
            required
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}
