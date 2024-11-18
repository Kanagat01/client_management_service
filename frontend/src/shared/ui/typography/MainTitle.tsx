import { FC, HTMLAttributes, PropsWithChildren } from "react";

export const MainTitle: FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => (
  <div {...props} className={`main-title ${props.className ?? ""}`}>
    {children}
  </div>
);
