import { useState } from "react";
import { BsInput, CreateOrEditBtn } from "~/shared/ui";
import { createCode } from "./model";

export function CreateCode() {
  const [value, setValue] = useState("");

  const onReset = () => setValue("");
  const onSubmit = (changeShow: () => void) => {
    createCode({
      value,
      changeShow: () => {
        changeShow();
        onReset();
      },
    });
  };

  return (
    <CreateOrEditBtn
      variant="add"
      title={"Создать код"}
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <BsInput
            variant="input"
            label="Значение"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}
