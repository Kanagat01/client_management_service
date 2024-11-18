import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, ChangeEvent, ButtonHTMLAttributes } from "react";

import { ModalTitle, InputContainer, OutlineButton } from "~/shared/ui";
import {
  clearStages,
  addStageCouple,
  $stageType,
  setStageType,
  editStageCouple,
  $selectedStage,
  setOrderForm,
  $orderForm,
  setSelectedStage,
} from "..";
import {
  $mode,
  $showStageFormModal,
  changeShowStageFormModal,
  resetStageTypeAndCloseModal,
} from "./helpers";
import { CopyStage, CreateStage, EditStage, RemoveStageModal } from "./buttons";
import { Stage } from "./inputs";
import styles from "./styles.module.scss";

const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
  className: "px-2 py-0 me-2",
  type: "button",
  style: { fontSize: "2rem" },
};

export function CrudOrderStage({
  orderStageNumber,
}: {
  orderStageNumber: number | "";
}) {
  const { t } = useTranslation();
  const mode = useUnit($mode);
  const show = useUnit($showStageFormModal);
  const stageType = useUnit($stageType);

  const resetStages = () => {
    setStageType("load_stage");
    clearStages();
    changeShowStageFormModal();
  };
  const saveStages = () => {
    let isSuccessful: boolean;
    if (mode === "create" || mode === "copy") isSuccessful = addStageCouple();
    else isSuccessful = editStageCouple();
    if (isSuccessful) resetStageTypeAndCloseModal(changeShowStageFormModal);
  };

  useEffect(() => {
    if (show) toast.remove();
  }, [show]);
  return (
    <>
      <CreateStage {...buttonProps} />
      <CopyStage orderStageNumber={orderStageNumber} {...buttonProps} />
      <EditStage orderStageNumber={orderStageNumber} {...buttonProps} />
      <RemoveStageModal orderStageNumber={orderStageNumber} {...buttonProps} />
      <Modal
        show={show}
        onHide={changeShowStageFormModal}
        className="gradient-modal"
      >
        <Modal.Body>
          <form className="position-relative overflow-hidden">
            <ModalTitle>{t("orderStage.singular")}</ModalTitle>
            <div
              className={`d-flex ${styles.animation}`}
              style={
                stageType === "load_stage"
                  ? { width: "200%", transform: "translateX(0)" }
                  : { width: "200%", transform: "translateX(-50%)" }
              }
            >
              <Stage
                stageType="load_stage"
                text1={t("common.cancel")}
                onClick1={resetStages}
                text2={t("orderStage.next")}
                onClick2={() => setStageType("unload_stage")}
              />
              <Stage
                stageType="unload_stage"
                text1={t("orderStage.back")}
                onClick1={() => setStageType("load_stage")}
                text2={t("common.save")}
                onClick2={saveStages}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export function OrderStageForm() {
  const { t } = useTranslation();
  const selectedStage = useUnit($selectedStage);
  const [orderStageNumber, setOrderStageNumber] = useState<number | "">(
    selectedStage ? selectedStage.order_stage_number : ""
  );
  useEffect(() => {
    if (selectedStage) setOrderStageNumber(selectedStage.order_stage_number);
  }, [selectedStage]);

  const [errorText, setErrorText] = useState<string>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (selectedStage) {
      const value = Number(e.target.value);
      setOrderStageNumber(value);

      const prevState = $orderForm.getState();
      const alreadyExist = prevState.stages.find(
        (el) => el.order_stage_number === value
      );
      if (alreadyExist) {
        setErrorText(t("orderStage.orderStageWithThisNumberAlreadyExists"));
        return;
      } else {
        setErrorText(undefined);
      }

      const newStage = prevState.stages.find(
        (el) => el.order_stage_number === selectedStage.order_stage_number
      );
      if (newStage) {
        newStage.order_stage_number = value;
        const newStages = prevState.stages.map((stage) =>
          stage.order_stage_number === selectedStage.order_stage_number
            ? newStage
            : stage
        );
        setOrderForm({ ...prevState, stages: newStages });
        setSelectedStage(newStage);
      }
    }
  };
  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex flex-column">
        <InputContainer
          label={t("orderStage.stageNumber")}
          name="order_stage_number"
          value={orderStageNumber}
          onChange={onChange}
          variant="input"
          type="number"
          labelStyle={{ color: "var(--default-font-color)" }}
          className="w-100"
          containerStyle={{
            justifySelf: "start",
            marginBottom: "1.5rem",
          }}
          error={errorText}
        />
        <div
          className={`d-flex justify-content-between`}
          style={{ justifySelf: "start", width: "15rem" }}
        >
          <CrudOrderStage orderStageNumber={orderStageNumber} />
        </div>
      </div>
      <div className="d-flex flex-column">
        <OutlineButton
          className={styles.formButton}
          style={{ marginTop: "2rem", marginBottom: "1.5rem" }}
          type="submit"
        >
          {t("common.save")}
        </OutlineButton>
        <OutlineButton className={styles.formButton} type="reset">
          {t("common.cancel")}
        </OutlineButton>
      </div>
    </div>
  );
}
