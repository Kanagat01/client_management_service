import { ReactNode, HTMLAttributes } from "react";

type TextCenterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export const TextCenter = ({ children, ...props }: TextCenterProps) => (
  <div {...props} className={`text-center ${props.className ?? ""}`}>
    {children}
  </div>
);
