import { FC, HTMLAttributes, PropsWithChildren } from "react";

export const TitleLg: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  ...props
}) => (
  <div {...props} className={`title-lg ${props.className ?? ""}`}>
    {children}
  </div>
);
