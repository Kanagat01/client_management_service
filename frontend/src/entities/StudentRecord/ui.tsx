import { useState } from "react";
import { CreateOrEditBtn } from "~/shared/ui";
import { TStudentRecord } from "./types";

export function CreateStudentRecord() {
  const initialData = {
    student: "",
    telegram_link: "",
  };
  const [data, setData] = useState<Omit<TStudentRecord, "id">>(initialData);
  return (
    <CreateOrEditBtn
      variant="add"
      title={""}
      inputs={undefined}
      onSubmit={() => {}}
      onReset={() => {}}
    />
  );
}
