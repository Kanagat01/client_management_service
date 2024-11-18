import { ReactSVG } from "react-svg";
import { useUnit } from "effector-react";
import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";

import { RiDeleteBin5Line } from "react-icons/ri";
// import { TbBoxMultiple } from "react-icons/tb";
import { FaTruckMoving } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";
import { MdDownload } from "react-icons/md";

import {
  $notifications,
  NotificationType,
  removeNotification,
} from "~/entities/Notification";
import { $userType, getRole } from "~/entities/User";
import { TooltipOnHover } from "~/shared/ui";
import Routes from "~/shared/routes";
import styles from "./styles.module.scss";

export function Sidebar() {
  const { t } = useTranslation();
  const userType = useUnit($userType);
  const notifications = useUnit($notifications);

  const notificationsDict: Record<string, NotificationType> = {
    [Routes.ORDERS_BEING_EXECUTED]: NotificationType.NEW_ORDER_BEING_EXECUTED,
    [Routes.ORDERS_IN_AUCTION]: NotificationType.NEW_ORDER_IN_AUCTION,
    [Routes.ORDERS_IN_BIDDING]: NotificationType.NEW_ORDER_IN_BIDDING,
    [Routes.ORDERS_IN_DIRECT]: NotificationType.NEW_ORDER_IN_DIRECT,
    [Routes.CANCELLED_ORDERS]: NotificationType.ORDER_CANCELLED,
  };
  const currentRoute = useLocation().pathname;

  useEffect(() => {
    if (currentRoute in notificationsDict) {
      notifications
        .filter(
          (notification) =>
            notification.type === notificationsDict[currentRoute]
        )
        .map(({ id }) => removeNotification(id));
    }
  }, [currentRoute, notifications, notificationsDict]);

  const NotificationDot = (route: string) => {
    const notification = notifications.find(
      (el) => el.type === notificationsDict[route]
    );
    return (
      route !== currentRoute && notification && <span className="blue-circle" />
    );
  };
  const sections: Array<[ReactNode, string, string]> = [
    [
      <>
        {NotificationDot(Routes.ORDERS_BEING_EXECUTED)}
        <FaTruckMoving className={styles.icon} />
      </>,
      t("orders.pages.beingExecuted"),
      Routes.ORDERS_BEING_EXECUTED,
    ],
    [
      <>
        {NotificationDot(Routes.ORDERS_IN_AUCTION)}
        <ReactSVG src="assets/svg/hammer.svg" className={styles.icon} />
      </>,
      t("orders.pages.inAuction"),
      Routes.ORDERS_IN_AUCTION,
    ],
    [
      <>
        {NotificationDot(Routes.ORDERS_IN_BIDDING)}
        <ReactSVG
          src="assets/svg/3_houses.svg"
          className={styles.icon}
          style={{ fontSize: "3.5rem", lineHeight: "3rem" }}
        />
      </>,
      t("orders.pages.inBidding"),
      Routes.ORDERS_IN_BIDDING,
    ],
    [
      <>
        {NotificationDot(Routes.ORDERS_IN_DIRECT)}
        <MdDownload className={styles.icon} />
      </>,
      t("orders.pages.inDirect"),
      Routes.ORDERS_IN_DIRECT,
    ],
    // [
    //   <TbBoxMultiple className={styles.icon} />,
    //   t("orders.pages.cargoPlan"),
    //   Routes.CARGO_PLAN,
    // ],
    [
      <>
        {NotificationDot(Routes.CANCELLED_ORDERS)}
        <RiDeleteBin5Line className={styles.icon} />
      </>,
      t("orders.pages.cancelled"),
      Routes.CANCELLED_ORDERS,
    ],
  ];

  if (getRole(userType) === "customer") {
    sections.splice(1, 0, [
      <ImNewspaper className={styles.icon} />,
      t("orders.pages.unpublished"),
      Routes.UNPUBLISHED_ORDERS,
    ]);
  }
  return (
    <aside className={styles.aside}>
      {sections.map(([icon, title, route], index) => (
        <TooltipOnHover
          key={index}
          id={`t-${index}`}
          title={title}
          placement="right-end"
        >
          <NavLink
            to={route}
            className={route === currentRoute ? styles.active : ""}
            style={
              title === t("orders.pages.inBidding") ? { padding: "0.5rem" } : {}
            }
          >
            {icon}
          </NavLink>
        </TooltipOnHover>
      ))}
    </aside>
  );
}
