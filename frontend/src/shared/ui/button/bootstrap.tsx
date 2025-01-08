import { ChangeEvent } from "react";
import { Button, Modal } from "react-bootstrap";
import { createEvent, createStore } from "effector";
import { SlActionRedo, SlActionUndo } from "react-icons/sl";
import { IoBanOutline } from "react-icons/io5";
import {
  BsArrowCounterclockwise,
  BsArrowDown,
  BsArrowUp,
  BsCheckCircle,
  BsPencil,
  BsPlusCircle,
  BsTrash,
  BsTrash3,
} from "react-icons/bs";
import { ConfirmModal } from "~/shared/ui";
import { useModalState } from "~/shared/lib";
import { BtnWithConfirmation, CreateOrEditBtnProps } from "./types";

export function CreateOrEditBtn({ variant, ...props }: CreateOrEditBtnProps) {
  const variantData = {
    create: { icon: <BsCheckCircle />, text: "Создать" },
    add: { icon: <BsPlusCircle />, text: "Добавить" },
    edit: { icon: <BsPencil />, text: "Редактировать" },
    reuse: { icon: <BsArrowCounterclockwise />, text: "Переиспользовать" },
  };

  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        {variantData[variant].icon}
        <span>{props.variantText ?? variantData[variant].text}</span>
      </Button>
      <Modal show={show} onHide={changeShow}>
        <Modal.Header closeButton>
          <h4 className="modal-title text-black fw-light">{props.title}</h4>
        </Modal.Header>
        <Modal.Body>
          <form
            id="create-or-edit-form"
            className="p-4"
            onReset={() => {
              props.onReset();
              changeShow();
            }}
            onSubmit={(e) => {
              e.preventDefault();
              props.onSubmit(changeShow);
            }}
          >
            {props.inputs}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="create-or-edit-form" variant="link" type="reset">
            Отмена
          </Button>
          <div>
            <Button form="create-or-edit-form" variant="danger" type="submit">
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

export function VerificationBtn(
  props: Omit<BtnWithConfirmation, "title"> & { is_verified: boolean }
) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        {props.is_verified ? (
          <>
            <BsArrowDown />
            Отменить верификацию
          </>
        ) : (
          <>
            <BsArrowUp />
            Верифицировать
          </>
        )}
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

export function BanBtn(
  props: Omit<BtnWithConfirmation, "title"> & { is_blocked: boolean }
) {
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        {props.is_blocked ? (
          <>
            <BsCheckCircle />
            Разблокировать
          </>
        ) : (
          <>
            <IoBanOutline />
            Заблокировать
          </>
        )}
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

export const setFileForImport = createEvent<File | null>();
export const $fileForImport = createStore<File | null>(null).on(
  setFileForImport,
  (_, state) => state
);

export function ImportBtn({ onSubmit }: { onSubmit: () => void }) {
  const [show, changeShow] = useModalState(false);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileForImport(file);
  };
  return (
    <>
      <Button variant="link" className="icon-link" onClick={changeShow}>
        <SlActionUndo />
        <span>Импорт из Excel</span>
      </Button>
      <Modal show={show} onHide={changeShow}>
        <Modal.Header closeButton>
          <h4 className="modal-title text-black fw-light">
            Импортировать данные
          </h4>
        </Modal.Header>
        <Modal.Body>
          <form className="p-4">
            <div className="form-group">
              <div data-controller="input" data-input-mask="">
                <input
                  className="form-control"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="link"
            onClick={() => {
              setFileForImport(null);
              changeShow();
            }}
          >
            Отмена
          </Button>
          <div>
            <Button
              variant="danger"
              onClick={() => {
                onSubmit();
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
