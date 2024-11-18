import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaRegTrashCan } from "react-icons/fa6";
import { ButtonHTMLAttributes, ChangeEvent, useState } from "react";
import { OrderDocument, deleteDocument } from "~/entities/Document";
import { useModalState } from "~/shared/lib";
import {
  Checkbox,
  ModalTitle,
  OutlineButton,
  PrimaryButton,
  RoundedTable,
  TextCenter,
} from "~/shared/ui";
import styles from "./style.module.scss";

export function DeleteDocument({
  documents,
  ...props
}: {
  documents: OrderDocument[];
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { t } = useTranslation();
  const fontSize = { fontSize: "1.4rem" };
  const [show, changeShow] = useModalState(false);
  const [documentId, setDocumentId] = useState<number | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDocumentId((value) =>
      value !== Number(e.target.value) ? Number(e.target.value) : null
    );

  const onReset = () => {
    setDocumentId(null);
    changeShow();
  };
  const onSubmit = () => {
    if (documentId) deleteDocument({ document_id: documentId, reset: onReset });
    else toast.error(t("deleteDocument.selectDocument"));
  };
  return (
    <>
      <OutlineButton
        {...props}
        onClick={
          documents.length === 0
            ? () => toast.error(t("deleteDocument.noDocs"))
            : changeShow
        }
      >
        <FaRegTrashCan />
      </OutlineButton>
      <Modal show={show} onHide={changeShow} className="gradient-modal">
        <Modal.Body>
          <ModalTitle>{t("deleteDocument.title")}</ModalTitle>
          <RoundedTable
            columns={[
              <TextCenter style={fontSize}>
                {t("documents.document")}
              </TextCenter>,
              <TextCenter style={fontSize}>{t("common.selection")}</TextCenter>,
            ]}
            data={documents.map((doc) => [
              <TextCenter className="p-1" style={fontSize}>
                {t("documents.document")} №{doc.id} <br />
                {decodeURIComponent(doc.file).replace("/media/documents/", "")}
              </TextCenter>,
              <TextCenter className="p-1">
                <Checkbox
                  value={doc.id}
                  onChange={onChange}
                  checked={doc.id === documentId}
                />
              </TextCenter>,
            ])}
            lightBorderMode
          />
          <div className={styles["dropzone-actions"]}>
            <OutlineButton onClick={onReset}>
              {t("common.cancel")}
            </OutlineButton>
            <PrimaryButton onClick={onSubmit}>
              {t("common.delete")}
            </PrimaryButton>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
