import { useState } from "react";
import { BsInput, CreateOrEditBtn } from "~/shared/ui";
import { createDiscount, updateDiscount } from "./model";
import { TDiscount } from "./types";

const initialState = {
  content: "",
};

export function CreateOrEditDiscount(props: { initialState?: TDiscount }) {
  const isEdit = props.initialState && "id" in props.initialState;
  const [data, setData] = useState(props.initialState || initialState);

  const onReset = () => setData(initialState);
  const onSubmit = (changeShow: () => void) => {
    if (isEdit) {
      updateDiscount({ ...(data as TDiscount), changeShow });
    } else {
      createDiscount({
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
      title={`${isEdit ? "Редактировать" : "Создать"} акцию`}
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <BsInput
            variant="textarea"
            label="Содержание"
            name="content"
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            required
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}
