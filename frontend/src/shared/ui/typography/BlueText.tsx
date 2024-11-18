import { ReactNode } from "react";

export const BlueText = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "var(--primary)" }}>{children}</span>
);
