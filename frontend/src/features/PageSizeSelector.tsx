import { SelectInput } from "~/shared/ui";

export function PageSizeSelector() {
  return (
    <SelectInput
      label="Записи на странице"
      options={[
        ...["15", "30", "100", "Все"].map((el) => ({ value: el, label: el })),
      ]}
    />
  );
}
