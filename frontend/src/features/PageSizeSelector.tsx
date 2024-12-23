import { TomSelectInput } from "~/shared/ui";

export function PageSizeSelector() {
  return (
    <TomSelectInput
      label="Записи на странице"
      options={[
        ...["15", "30", "100", "Все"].map((el) => ({ value: el, label: el })),
      ]}
    />
  );
}
