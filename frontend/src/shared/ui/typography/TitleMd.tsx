import { FC, HTMLAttributes, PropsWithChildren } from "react";

export const TitleMd: FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({
  children,
  ...props
}) => (
  <div {...props} className={`title-md ${props.className ?? ""}`}>
    {children}
  </div>
);
