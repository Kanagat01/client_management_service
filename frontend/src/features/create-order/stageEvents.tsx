import { t } from "i18next";
import toast from "react-hot-toast";
import { createEvent } from "effector";
import { OrderStageKey, TStage, TStages } from "~/entities/OrderStage";
import {
  $orderForm,
  $orderStages,
  $stageType,
  getMaxOrderStageNumber,
  initialOrderStage,
  setOrderForm,
} from "./state";
import { StageFieldUpdatePayload } from "./types";

export const stageFieldUpdate = createEvent<StageFieldUpdatePayload>();
$orderStages.on(stageFieldUpdate, (state, { key, value }) => {
  const stageType = $stageType.getState();
  if (["cargo", "weight", "volume"].includes(key))
    return {
      ...state,
      [key]: value,
    };
  return { ...state, [stageType]: { ...state[stageType], [key]: value } };
});

export const clearStages = createEvent();
$orderStages.on(clearStages, (_) => ({
  order_stage_number: getMaxOrderStageNumber(),
  load_stage: initialOrderStage,
  unload_stage: initialOrderStage,
  cargo: "",
  weight: 0,
  volume: 0,
}));

const stageCoupleValidation = (func: (state: TStages) => void) => {
  const state = $orderStages.getState();
  const emptyFields = [];
  const notRequired = ["comments", "completed"];

  for (const key1 in state) {
    const stage = key1 as TStage;
    for (const key2 in state[stage]) {
      const field = key2 as OrderStageKey;
      if (!state[stage][field] && !notRequired.includes(field)) {
        const fieldName =
          (stage === "load_stage"
            ? t("orderStage.loadingStage")
            : t("orderStage.unloadingStage")) +
          "." +
          t("orderStageTranslations.${field}");
        emptyFields.push(fieldName);
      }
    }
  }
  if (!state.cargo) emptyFields.push(t("orderStageTranslations.cargo"));
  if (!state.weight) emptyFields.push(t("orderStageTranslations.weight"));
  if (!state.volume) emptyFields.push(t("orderStageTranslations.volume"));

  if (emptyFields.length > 0) {
    toast(
      <span>
        {t("common.fillOutRequired", { fields: emptyFields.join(", ") })}
      </span>,
      {
        position: "top-right",
        duration: 3000,
        icon: <button onClick={() => toast.dismiss()}>❌</button>,
        style: { fontSize: "1.4rem" },
      }
    );
  } else {
    func(state);
    clearStages();
  }
  return !(emptyFields.length > 0);
};

export const addStage = createEvent<TStages>();
addStage.watch((stage) => {
  const prevState = $orderForm.getState();
  setOrderForm({ ...prevState, stages: [...prevState.stages, stage] });
});
export const addStageCouple = () => stageCoupleValidation(addStage);

const editStage = createEvent<TStages>();
editStage.watch((newStageData) => {
  const prevState = $orderForm.getState();
  setOrderForm({
    ...prevState,
    stages: prevState.stages.map((stage) =>
      stage.order_stage_number === newStageData.order_stage_number
        ? newStageData
        : stage
    ),
  });
});
export const editStageCouple = () => stageCoupleValidation(editStage);

export const removeStage = createEvent<number>();
removeStage.watch((order_stage_number) => {
  const prevState = $orderForm.getState();
  setOrderForm({
    ...prevState,
    stages: prevState.stages.filter(
      (stage) => stage.order_stage_number !== order_stage_number
    ),
  });
});
