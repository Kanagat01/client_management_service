import { Button, Modal } from "react-bootstrap";

type ConfirmModalProps = {
  show: boolean;
  changeShow: () => void;
  content: string;
  onConfirm: () => void;
};

export const ConfirmModal = ({
  show,
  changeShow,
  content,
  onConfirm,
}: ConfirmModalProps) => (
  <Modal show={show} onHide={changeShow}>
    <Modal.Header closeButton>
      <h4 className="modal-title text-black fw-light">Вы уверены?</h4>
    </Modal.Header>
    <Modal.Body>
      <div className="p-4">{content}</div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="link" onClick={changeShow}>
        Отмена
      </Button>
      <div data-confirm-target="button">
        <Button
          variant="danger"
          onClick={() => {
            onConfirm();
            changeShow();
          }}
        >
          Подтвердить
        </Button>
      </div>
    </Modal.Footer>
  </Modal>
);
