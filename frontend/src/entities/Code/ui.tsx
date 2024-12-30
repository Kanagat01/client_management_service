import { CreateOrEditBtn } from "~/shared/ui";

export function CreateCode() {
  return (
    <CreateOrEditBtn
      variant="add"
      title={"Создать код"}
      inputs={undefined}
      onSubmit={() => {}}
      onReset={() => {}}
    />
  );
}
