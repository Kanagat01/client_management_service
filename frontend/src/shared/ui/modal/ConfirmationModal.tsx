import { ReactNode } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { OutlineButton, PrimaryButton, TextCenter, TitleMd } from "..";

const btnProps = { className: "py-2 px-4", style: { fontSize: "1.4rem" } };

type ConfirmationModalProps = {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: ReactNode;
};

export const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title,
}: ConfirmationModalProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      show={show}
      onHide={onHide}
      className="rounded-modal d-flex justify-content-center"
    >
      <Modal.Body>
        <TextCenter>
          <TitleMd style={{ fontSize: "1.7rem" }}>{title}</TitleMd>
        </TextCenter>
      </Modal.Body>
      <Modal.Footer className="justify-content-evenly">
        <OutlineButton {...btnProps} onClick={onHide}>
          {t("common.cancel")}
        </OutlineButton>
        <PrimaryButton {...btnProps} onClick={onConfirm}>
          {t("common.confirm")}
        </PrimaryButton>
      </Modal.Footer>
    </Modal>
  );
};
