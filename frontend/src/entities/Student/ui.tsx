import { BsInput, CreateOrEditBtn, TomSelectInput } from "~/shared/ui";

export function CreateStudent() {
  return (
    <CreateOrEditBtn
      variant="add"
      title="Создать студента"
      inputs={
        <div className="d-flex flex-column" style={{ gap: "1rem" }}>
          <BsInput variant="input" label="TG ID" name="tg_id" />
          <BsInput variant="input" label="Логин" name="fa_login" />
          <BsInput variant="input" label="Пароль" name="fa_password" />
          <BsInput variant="input" label="Телефон" name="phone" />
          <TomSelectInput
            label="Группа"
            name="group"
            options={[
              ...[
                "Не выбрано",
                "ДЭФР22-1",
                "ДЦПУП23-1",
                "ДММ20-1",
                "ДМФ22-1",
              ].map((el) => ({
                value: el,
                label: el,
              })),
            ]}
          />
          <BsInput variant="checkbox" label="Верифицирован" id="is_verified" />
        </div>
      }
      onReset={() => {}}
      onSubmit={() => {}}
    />
  );
}
