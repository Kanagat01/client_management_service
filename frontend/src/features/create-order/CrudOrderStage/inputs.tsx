import { ChangeEvent } from "react";
import { useStoreMap } from "effector-react";
import { useTranslation } from "react-i18next";
import { CargoParams, OrderStageKey, TStage } from "~/entities/OrderStage";
import { InputContainer, OutlineButton } from "~/shared/ui";
import { $orderStages, initialOrderStage } from "../state";
import { StageFieldUpdatePayload } from "../types";
import { stageFieldUpdate } from "../stageEvents";
import styles from "./styles.module.scss";

type FieldProps = { name: OrderStageKey; stageType: TStage };

type StageProps = {
  stageType: TStage;
  text1: string;
  text2: string;
  onClick1: () => void;
  onClick2: () => void;
};

const handleChange = stageFieldUpdate.prepend(
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
    } as StageFieldUpdatePayload;
  }
);

const StageTypeInput = ({ value }: { value: TStage }) => {
  const { t } = useTranslation();
  return (
    <InputContainer
      name="stage"
      label={t("orderStage.stageType")}
      value={value}
      className="w-100 h-auto mb-3"
      variant="bootstrap-select"
      options={[
        ["load_stage", t("orderStage.loadingStage")],
        ["unload_stage", t("orderStage.unloadingStage")],
      ]}
      labelStyle={{
        color: "var(--default-font-color)",
      }}
      disabled
    />
  );
};

const Field = ({ name, stageType }: FieldProps) => {
  const { t } = useTranslation();
  const value = useStoreMap({
    store: $orderStages,
    keys: [name, stageType],
    fn: (values, [name, stageType]) => values[stageType][name] || "",
  });
  return (
    <InputContainer
      {...{ name, value, onChange: handleChange }}
      label={t(`orderStageTranslations.${name}`)}
      variant={name === "comments" ? "textarea" : "input"}
      type={
        name === "date"
          ? "date"
          : typeof initialOrderStage[name] === "number"
          ? "number"
          : "text"
      }
      labelStyle={{ color: "var(--default-font-color)" }}
      className="w-100 mb-2"
    />
  );
};

const StageCoupleField = ({ name }: { name: keyof CargoParams }) => {
  const { t } = useTranslation();
  const value = useStoreMap({
    store: $orderStages,
    keys: [name],
    fn: (values, [name]) => values[name] || "",
  });
  return (
    <InputContainer
      {...{ name, value, onChange: handleChange }}
      label={t(`orderStageTranslations.${name}`)}
      variant="input"
      type={name === "cargo" ? "text" : "number"}
      labelStyle={{ color: "var(--default-font-color)" }}
      className="w-100 mb-2"
    />
  );
};

const TimeInput = ({ name, stageType }: FieldProps) => {
  const { t } = useTranslation();
  const value = useStoreMap({
    store: $orderStages,
    keys: [name, stageType],
    fn: (values, [name, stageType]) => values[stageType][name] || "",
  });
  return (
    <InputContainer
      {...{ name, value, onChange: handleChange }}
      label={t(`orderStageTranslations.${name}`)}
      variant="input"
      type="time"
      className="mb-0"
      labelStyle={{ color: "var(--default-font-color)" }}
      containerStyle={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 0,
        width: "100%",
        marginBlock: "1rem",
      }}
    />
  );
};

export const Stage = ({ stageType, ...props }: StageProps) => {
  return (
    <div style={{ width: "50%" }}>
      <StageTypeInput value={stageType} />
      <Field name="date" stageType={stageType} />
      <div className={styles.timeBlock}>
        <TimeInput name="time_start" stageType={stageType} />
        <TimeInput name="time_end" stageType={stageType} />
      </div>
      {(
        [
          "company",
          "postal_code",
          "city",
          "address",
          "contact_person",
        ] as OrderStageKey[]
      ).map((name, idx) => (
        <Field key={idx} name={name} stageType={stageType} />
      ))}
      <StageCoupleField name="cargo" />
      <StageCoupleField name="weight" />
      <StageCoupleField name="volume" />
      <Field name="comments" stageType={stageType} />
      <div className={styles.buttonsBlock}>
        <OutlineButton
          className={styles.modalBtn}
          type="button"
          onClick={props.onClick1}
        >
          {props.text1}
        </OutlineButton>
        <OutlineButton
          className={styles.modalBtn}
          type="button"
          onClick={props.onClick2}
        >
          {props.text2}
        </OutlineButton>
      </div>
    </div>
  );
};
