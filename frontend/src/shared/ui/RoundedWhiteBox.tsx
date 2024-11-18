import { FC, HTMLAttributes, PropsWithChildren } from "react";

export const RoundedWhiteBox: FC<
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => (
  <div
    {...props}
    style={{
      background: "#fff",
      borderRadius: "30px",
      width: "100%",
      overflowX: "auto",
      ...props.style,
    }}
  >
    {children}
  </div>
);
