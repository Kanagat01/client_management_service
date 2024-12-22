import { Button } from "react-bootstrap";
import { SlActionRedo } from "react-icons/sl";
import { IoBanOutline } from "react-icons/io5";
import { BsArrowUp, BsPencil, BsTrash, BsTrash3 } from "react-icons/bs";

export const EditButton = () => (
  <a className="btn btn-link icon-link">
    <BsPencil />
    <span>Редактировать</span>
  </a>
);

export const DeleteAllBtn = () => (
  <Button variant="danger" style={{ height: "fit-content" }}>
    <BsTrash />
    Очистить данные студентов
  </Button>
);

export const DeleteButton = () => (
  <Button
    data-button-confirm="Вы уверены, что хотите очистить данные этого студента?"
    variant="link"
    className="icon-link"
  >
    <BsTrash3 />
    Очистить данные
  </Button>
);

export const VerificationButton = () => (
  <Button variant="link" className="icon-link">
    <BsArrowUp />
    Верифицировать
  </Button>
);

export const BanBtn = () => (
  <Button variant="link" className="icon-link">
    <IoBanOutline />
    Заблокировать
  </Button>
);

export const ExportBtn = ({ link }: { link: string }) => (
  <a className="btn btn-link icon-link" href={link} target="blank">
    <SlActionRedo />
    <span>Экспорт</span>
  </a>
);
