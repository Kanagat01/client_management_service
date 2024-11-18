import {
  ButtonHTMLAttributes,
  FC,
  HTMLAttributes,
  PropsWithChildren,
} from "react";

export const RoundedGrayButton: FC<
  PropsWithChildren<HTMLAttributes<HTMLButtonElement>>
> = ({ children, ...props }) => (
  <button
    {...props}
    className={`d-flex align-items-center justify-content-center ${
      props.className ?? ""
    }`}
    style={{
      background: "rgba(5, 10, 4, 0.05)",
      borderRadius: "50%",
      ...props.style,
    }}
  >
    {children}
  </button>
);

export const PrimaryButton: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, ...props }) => (
  <button {...props} className={`primary-btn ${props.className ?? ""}`}>
    {children}
  </button>
);

export const OutlineButton: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, ...props }) => (
  <button {...props} className={`outline-btn ${props.className ?? ""}`}>
    {children}
  </button>
);

export const SectionButton: FC<
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
> = ({ children, ...props }) => (
  <button {...props} className={`section-btn ${props.className ?? ""}`}>
    {children}
  </button>
);

export const documentButtonProps = {
  className: "px-2 py-0 me-3 h-100",
  style: { fontSize: "2rem" },
};
