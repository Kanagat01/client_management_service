import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";

export const PrimaryButton: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, ...props }) => (
  <button {...props} className={`primary-btn ${props.className ?? ""}`}>
    {children}
  </button>
);
