import { useState } from "react";
import { CreateOrEditBtn, BsInput } from "~/shared/ui";
import { createGroup } from "./model";

export function CreateGroup() {
  const [code, setCode] = useState("");
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
      onSubmit={() => createGroup({ code })}
      onReset={() => setCode("")}
    />
  );
}
