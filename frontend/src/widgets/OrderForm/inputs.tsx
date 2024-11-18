import { ChangeEvent } from "react";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FieldProps,
  fieldUpdate,
  FieldUpdatePayload,
  initialOrder,
  SelectFieldProps,
} from "~/features/create-order";
import { InputContainer } from "~/shared/ui";
import styles from "./styles.module.scss";

const handleChange = fieldUpdate.prepend(
  (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newValue = event.target.value;
    if (event.target.type === "number") newValue = newValue.replace(",", ".");
    return {
      key: event.target.name,
      value: newValue,
    } as FieldUpdatePayload;
  }
);

export const SelectField = ({ name, value, options }: SelectFieldProps) => {
  const { t } = useTranslation();
  const label = t(`orderTranslations.${name}`);
  return (
    <Col md={4} className="p-0">
      <InputContainer
        {...{ name, label, options, onChange: handleChange }}
        value={value !== 0 ? value : undefined}
        variant="select"
        labelStyle={{
          color: "var(--default-font-color)",
        }}
        className={styles.select}
        size={5}
      />
    </Col>
  );
};

export const Field = ({ name, value, colNum }: FieldProps) => {
  const { t } = useTranslation();
  const label = t(`orderTranslations.${name}`);
  const type = typeof initialOrder[name] === "number" ? "number" : "string";
  switch (colNum) {
    case 1:
      return (
        <InputContainer
          {...{ name, label, value, onChange: handleChange, type }}
          variant="input"
          className={`${styles.input} w-100 mb-3`}
          labelStyle={{ color: "var(--default-font-color)" }}
          disabled={name === "customer_manager"}
        />
      );
    case 2:
      return (
        <InputContainer
          {...{ name, label, value, onChange: handleChange }}
          variant="textarea"
          className={`${styles.textarea} w-100 mb-0`}
        />
      );
    case 3:
      return (
        <Col md={4} className="p-0 mt-4">
          <InputContainer
            {...{ name, label, value, onChange: handleChange, type }}
            variant="input"
            labelStyle={{
              color: "var(--default-font-color)",
            }}
            className={`${styles.input} mb-0`}
          />
        </Col>
      );
  }
};
