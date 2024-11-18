import { FC, HTMLAttributes, PropsWithChildren } from "react";

export const TitleSm: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  ...props
}) => (
  <div {...props} className={`title-sm ${props.className ?? ""}`}>
    {children}
  </div>
);
