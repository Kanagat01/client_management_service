import { ReactSVG } from "react-svg";
import { Modal } from "react-bootstrap";
import { ButtonHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuCopyPlus, LuPenSquare } from "react-icons/lu";

import { useModalState } from "~/shared/lib";
import {
  BlueText,
  OutlineButton,
  PrimaryButton,
  TextCenter,
  TitleMd,
} from "~/shared/ui";
import {
  changeShowStageFormModal,
  handleStageNotFound,
  setMode,
} from "./helpers";
import { getMaxOrderStageNumber, removeStage, setOrderStages } from "..";

type CrudButtonProps = {
  orderStageNumber: number | "";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function CreateStage(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <OutlineButton
      onClick={() => {
        setMode("create");
        changeShowStageFormModal();
      }}
      {...props}
    >
      <ReactSVG src="assets/svg/folder_plus.svg" />
    </OutlineButton>
  );
}

export function CopyStage({ orderStageNumber, ...props }: CrudButtonProps) {
  const handleCopy = () => {
    setMode("copy");
    const stage = handleStageNotFound(orderStageNumber);
    if (!stage) return;

    const { id, load_stage, unload_stage, order_stage_number, ...newStage } =
      stage;
    const { id: loadId, ...newLoadStage } = load_stage;
    const { id: unloadId, ...newUnloadStage } = unload_stage;

    setOrderStages({
      load_stage: newLoadStage,
      unload_stage: newUnloadStage,
      order_stage_number: getMaxOrderStageNumber(),
      ...newStage,
    });
    changeShowStageFormModal();
  };
  return (
    <OutlineButton {...props} onClick={handleCopy}>
      <LuCopyPlus />
    </OutlineButton>
  );
}

export function EditStage({ orderStageNumber, ...props }: CrudButtonProps) {
  const handleEdit = () => {
    setMode("edit");
    const stage = handleStageNotFound(orderStageNumber);
    if (!stage) return;

    setOrderStages(stage);
    changeShowStageFormModal();
  };
  return (
    <OutlineButton onClick={handleEdit} {...props}>
      <LuPenSquare />
    </OutlineButton>
  );
}

export function RemoveStageModal({
  orderStageNumber,
  ...props
}: CrudButtonProps) {
  const { t } = useTranslation();
  const [show, changeShow] = useModalState(false);

  const showModal = () => {
    const stage = handleStageNotFound(orderStageNumber);
    if (!stage) return;
    changeShow();
  };
  const handleRemove = () => {
    if (orderStageNumber !== "") removeStage(orderStageNumber);
    changeShow();
  };
  return (
    <>
      <OutlineButton onClick={showModal} {...props}>
        <FaRegTrashCan />
      </OutlineButton>
      <Modal
        show={show}
        onHide={changeShow}
        className="rounded-modal d-flex justify-content-center"
      >
        <Modal.Body>
          <TextCenter>
            <TitleMd style={{ fontSize: "1.7rem" }}>
              {t("removeStage.areYouSure")}{" "}
              <BlueText>№{orderStageNumber}</BlueText>?
            </TitleMd>
          </TextCenter>
        </Modal.Body>
        <Modal.Footer className="justify-content-evenly">
          <OutlineButton
            className="py-2 px-4"
            style={{ fontSize: "1.4rem" }}
            onClick={changeShow}
          >
            {t("common.cancel")}
          </OutlineButton>
          <PrimaryButton
            className="py-2 px-4"
            style={{ fontSize: "1.4rem" }}
            onClick={handleRemove}
          >
            {t("common.delete")}
          </PrimaryButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
