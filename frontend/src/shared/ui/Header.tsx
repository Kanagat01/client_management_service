import { ReactNode } from "react";

type HeaderProps = {
  title: string;
  children: ReactNode;
};

export function Header(props: HeaderProps) {
  return (
    <>
      <div className="header-content">
        <h3>{props.title}</h3>
        <div className="button-container">{props.children}</div>
      </div>
    </>
  );
}
