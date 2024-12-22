import { Button, Modal } from "react-bootstrap";
import { SlActionRedo } from "react-icons/sl";
import { IoBanOutline } from "react-icons/io5";
import {
  BsArrowUp,
  BsCheckCircle,
  BsPencil,
  BsPlusCircle,
  BsTrash,
  BsTrash3,
} from "react-icons/bs";
import { ConfirmModal } from "~/shared/ui";
import { useModalState } from "~/shared/lib";
import { BtnWithConfirmation, BtnWithFormModal } from "./types";

export function CreateBtn({
  checkCircleVariant = false,
  ...props
}: BtnWithFormModal & { checkCircleVariant?: boolean }) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        {checkCircleVariant ? (
          <>
            <BsCheckCircle />
            <span>Создать</span>
          </>
        ) : (
          <>
            <BsPlusCircle />
            <span>Добавить</span>
          </>
        )}
      </Button>
      <Modal show={show} onHide={changeShow}>
        <Modal.Header closeButton>
          <h4 className="modal-title text-black fw-light">{props.title}</h4>
        </Modal.Header>
        <Modal.Body>
          <form className="p-4">{props.inputs}</form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            onClick={() => {
              props.onReset();
              changeShow();
            }}
          >
            Отмена
          </Button>
          <div data-confirm-target="button">
            <Button
              variant="danger"
              onClick={() => {
                props.onSubmit();
                changeShow();
              }}
            >
              Подтвердить
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function EditBtn(props: BtnWithFormModal) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        <BsPencil />
        <span>Редактировать</span>
      </Button>
      <Modal show={show} onHide={changeShow}>
        <Modal.Header closeButton>
          <h4 className="modal-title text-black fw-light">{props.title}</h4>
        </Modal.Header>
        <Modal.Body>
          <form className="p-4">{props.inputs}</form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            onClick={() => {
              props.onReset();
              changeShow();
            }}
          >
            Отмена
          </Button>
          <div data-confirm-target="button">
            <Button
              variant="danger"
              onClick={() => {
                props.onSubmit();
                changeShow();
              }}
            >
              Подтвердить
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function DeleteAllBtn({
  title = "Очистить все данные",
  ...props
}: BtnWithConfirmation) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button
        variant="danger"
        style={{ height: "fit-content" }}
        onClick={changeShow}
      >
        <BsTrash />
        {title}
      </Button>
      <ConfirmModal
        show={show}
        changeShow={changeShow}
        content={props.content}
        onConfirm={props.onConfirm}
      />
    </>
  );
}

export function DeleteBtn(props: Omit<BtnWithConfirmation, "title">) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        <BsTrash3 />
        Очистить данные
      </Button>
      <ConfirmModal
        show={show}
        changeShow={changeShow}
        content={props.content}
        onConfirm={props.onConfirm}
      />
    </>
  );
}

export function VerificationBtn(props: Omit<BtnWithConfirmation, "title">) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        <BsArrowUp />
        Верифицировать
      </Button>
      <ConfirmModal
        show={show}
        changeShow={changeShow}
        content={props.content}
        onConfirm={props.onConfirm}
      />
    </>
  );
}

export function BanBtn(props: Omit<BtnWithConfirmation, "title">) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        <IoBanOutline />
        Заблокировать
      </Button>
      <ConfirmModal
        show={show}
        changeShow={changeShow}
        content={props.content}
        onConfirm={props.onConfirm}
      />
    </>
  );
}

export const ExportBtn = ({ link }: { link: string }) => (
  <a className="btn btn-link icon-link" href={link} target="blank">
    <SlActionRedo />
    <span>Экспорт</span>
  </a>
);
