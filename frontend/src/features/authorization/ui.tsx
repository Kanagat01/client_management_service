import { ReactSVG } from "react-svg";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { OutlineButton, PrimaryButton, TextCenter, TitleMd } from "~/shared/ui";
import { useModalState } from "~/shared/lib";
import { logout } from ".";

export function LogoutBtn() {
  const { t } = useTranslation();
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <button onClick={changeShow}>
        <ReactSVG
          src="assets/svg/logout.svg"
          style={{ fontSize: "3rem", lineHeight: "2rem" }}
        />
      </button>
      <Modal
        show={show}
        onHide={changeShow}
        className="rounded-modal d-flex justify-content-center"
      >
        <Modal.Body>
          <TextCenter>
            <TitleMd style={{ fontSize: "1.7rem" }}>
              {t("logout.areYouSure")}
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
            onClick={logout}
          >
            {t("logout.buttonText")}
          </PrimaryButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
