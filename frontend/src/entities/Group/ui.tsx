import { useState } from "react";
import { CreateOrEditBtn, BsInput } from "~/shared/ui";
import { createGroup } from "./model";

export function CreateGroup() {
  const [code, setCode] = useState("");

  const onReset = () => setCode("");
  const onSubmit = (changeShow: () => void) =>
    createGroup({
      code,
      changeShow: () => {
        changeShow();
        onReset();
      },
    });
  return (
    <CreateOrEditBtn
      variant="add"
      title="Добавить группу"
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <BsInput
            variant="input"
            label="Код"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
      }
      onSubmit={onSubmit}
      onReset={onReset}
    />
  );
}
