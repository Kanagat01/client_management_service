import { ReactNode } from "react";

type CommandBarProps = {
  title: string;
  subtitle?: string;
  menuList: ReactNode[];
};

export function CommandBar(props: CommandBarProps) {
  return (
    <div className="order-last order-md-0 command-bar-wrapper">
      <div
        className={`${
          props.menuList.length === 0 ? "d-none" : ""
        } layout d-md-flex align-items-center`}
      >
        <header className="d-none d-md-block col-xs-12 col-md p-0 me-3">
          <h1 className="m-0 fw-light h3 text-black">{props.title}</h1>
          {props.subtitle && (
            <small className="text-muted">{props.subtitle}</small>
          )}
        </header>
        <nav className="col-xs-12 col-md-auto ms-md-auto p-0">
          <ul className="nav command-bar justify-content-sm-end justify-content-start d-flex align-items-center gap-2 flex-wrap-reverse flex-sm-nowrap">
            {props.menuList.map((el, key) => (
              <li key={key}>
                <div className="form-group mb-0">{el}</div>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
