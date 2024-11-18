import { ReactNode } from "react";
import { MainTitle, TextCenter } from ".";

export function PageError({ children }: { children: ReactNode }) {
  return (
    <TextCenter className="p-5 mt-5">
      <MainTitle style={{ fontSize: "2.5rem", fontWeight: 500 }}>
        {children}
      </MainTitle>
    </TextCenter>
  );
}
