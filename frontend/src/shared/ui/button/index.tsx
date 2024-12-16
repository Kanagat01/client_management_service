import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import { BsArrowUp, BsPencil, BsTrash3 } from "react-icons/bs";
import styles from "./styles.module.scss";

export const PrimaryButton: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, className, ...props }) => (
  <button className={`${styles.primaryBtn} ${className}`} {...props}>
    {children}
  </button>
);

export const OutlineButton: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
    rounded?: boolean;
  }
> = ({ rounded, children, className, ...props }) => (
  <button
    className={`${styles.outlineBtn} ${
      rounded ? styles.rounded : ""
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const EditButton = () => (
  <a className="btn btn-link icon-link">
    <BsPencil />
    <span>Редактировать</span>
  </a>
);

export const DeleteButton = () => (
  <button
    data-button-confirm="Вы уверены, что хотите очистить данные этого студента?"
    className="btn btn-link icon-link"
  >
    <BsTrash3 />
    Очистить данные
  </button>
);

export const VerificationButton = () => (
  <button className="btn btn-link icon-link">
    <BsArrowUp />
    Верифицировать
  </button>
);
