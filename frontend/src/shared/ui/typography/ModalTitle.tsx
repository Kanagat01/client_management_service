import { HTMLAttributes, ReactNode } from "react";

type ModalTitleProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const ModalTitle = ({ children, ...props }: ModalTitleProps) => (
  <div {...props} className={`modal-title ${props.className ?? ""}`}>
    {children}
  </div>
);
