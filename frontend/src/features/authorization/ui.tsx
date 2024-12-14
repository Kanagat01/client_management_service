import { Button, Modal } from "react-bootstrap";
import { BsBoxArrowLeft } from "react-icons/bs";
import { useModalState } from "~/shared/lib";
import { logout } from ".";

export function LogoutBtn() {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        <BsBoxArrowLeft />
        Выход
      </Button>
      <Modal show={show} onHide={changeShow}>
        <Modal.Header closeButton>
          <h4 className="modal-title text-black fw-light">Вы уверены?</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="p-4">
            Вы уверены, что хотите очистить данные всех студентов?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="link" onClick={changeShow}>
            Отмена
          </Button>
          <div data-confirm-target="button">
            <Button variant="danger" onClick={logout}>
              Выйти
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
