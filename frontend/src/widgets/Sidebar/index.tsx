import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaTruckMoving } from "react-icons/fa";
import Routes from "~/shared/routes";
import styles from "./styles.module.scss";

export function Sidebar() {
  const currentRoute = useLocation().pathname;
  const sections: Array<[ReactNode, string]> = [
    [
      <>
        {Routes.ORDERS_BEING_EXECUTED}
        <FaTruckMoving className={styles.icon} />
      </>,
      Routes.ORDERS_BEING_EXECUTED,
    ],
  ];
  return (
    <aside className={styles.aside}>
      {sections.map(([icon, route], key) => (
        <NavLink
          key={key}
          to={route}
          className={route === currentRoute ? styles.active : ""}
        >
          {icon}
        </NavLink>
      ))}
    </aside>
  );
}
