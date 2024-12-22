import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
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
