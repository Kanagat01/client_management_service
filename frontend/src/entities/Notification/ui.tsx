import { Fragment, ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUnit } from "effector-react";
import { Modal } from "react-bootstrap";
import { ReactSVG } from "react-svg";

import { PrimaryButton, SectionButton, TitleLg, TitleMd } from "~/shared/ui";
import { dateToLongMonthString, useModalState } from "~/shared/lib";
import { RenderPromise } from "~/shared/api";

import {
  $notifications,
  getNotificationsFx,
  removeNotification,
  TNotification,
  NotificationType,
} from ".";
import styles from "./styles.module.scss";

export function PopupModal(props: {
  show: boolean;
  title: string;
  description: ReactNode;
  handleClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal
      show={props.show}
      className="rounded-modal d-flex align-items-center justify-content-center"
    >
      <Modal.Body>
        <TitleLg
          className="text-center mb-4"
          style={{ wordWrap: "break-word" }}
        >
          {props.title}
        </TitleLg>
        <TitleMd
          className="text-center mb-4"
          style={{
            wordWrap: "break-word",
            fontSize: "1.6rem",
            whiteSpace: "pre-line",
          }}
        >
          {props.description}
        </TitleMd>
        <div className="d-flex justify-content-evenly w-100">
          <PrimaryButton
            onClick={props.handleClose}
            style={{ padding: "0.5rem 3rem", fontSize: "1.6rem" }}
          >
            {t("notifications.understood")}
          </PrimaryButton>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function PopupNotifications() {
  const notifications = useUnit($notifications).filter(
    (n) => n.type === NotificationType.POPUP_NOTIFICATION
  );
  const [show, changeShow] = useModalState(false);

  useEffect(() => {
    if (notifications.length > 0)
      setTimeout(() => (!show ? changeShow() : {}), 500);
  }, [notifications]);

  const handleClose = () => {
    changeShow();
    setTimeout(
      () =>
        notifications.length > 0 ? removeNotification(notifications[0].id) : {},
      500
    );
  };
  return (
    notifications.length > 0 && (
      <PopupModal
        show={show}
        title={notifications[0].title}
        description={notifications[0].description}
        handleClose={handleClose}
      />
    )
  );
}

function groupNotificationsByDate(notifications: TNotification[]) {
  return notifications.reduce((acc, notification) => {
    const date = dateToLongMonthString(notification.created_at);

    if (!acc[date]) acc[date] = [];

    acc[date].push(notification);

    return acc;
  }, {} as Record<string, TNotification[]>);
}

const NotificationCard = (notification: TNotification) => {
  const { t } = useTranslation();
  const datetime = new Date(notification.created_at);
  const time = datetime.toLocaleTimeString("ru", {
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className={styles.notificationCard}>
      {/* <span className={styles.notificationType}>{notification.type}</span> */}
      <span className={styles.notificationTitle}>{notification.title}</span>
      <div className={styles.notificationText}>{notification.description}</div>
      <div className="d-flex w-100">
        <button
          className={styles.readMore}
          onClick={() => removeNotification(notification.id)}
        >
          {t("notifications.remove")}
        </button>
        <span className={styles.notificationTime}>{time}</span>
      </div>
    </div>
  );
};

export function Notifications() {
  const { t } = useTranslation();
  const [show, changeShow] = useModalState(false);
  const notifications = useUnit($notifications).filter(
    (n) => n.type !== NotificationType.POPUP_NOTIFICATION
  );
  const groupedNotifications = groupNotificationsByDate(notifications);
  return (
    <>
      <a href="#" onClick={changeShow} className={styles.notificationBell}>
        <ReactSVG src="assets/svg/bell.svg" />
        {notifications.length > 0 && (
          <span className={styles.notificationCount}>
            {notifications.length}
          </span>
        )}
      </a>

      <Modal show={show} onHide={changeShow} className="rounded-modal">
        <Modal.Body>
          {RenderPromise(getNotificationsFx, {
            success: (
              <>
                <div className="d-flex mb-4" style={{ gap: "1rem" }}>
                  <SectionButton className="active">
                    {t("notifications.info")}
                  </SectionButton>
                </div>
                {notifications.length > 0 ? (
                  Object.entries(groupedNotifications).map(
                    ([date, notifications]) => (
                      <Fragment key={date}>
                        <span className={`${styles.notificationDate} mb-3`}>
                          {date}
                        </span>
                        {notifications.map((el, idx) => (
                          <NotificationCard key={idx} {...el} />
                        ))}
                      </Fragment>
                    )
                  )
                ) : (
                  <div className="ms-2 mt-5" style={{ fontSize: "1.6rem" }}>
                    {t("notifications.empty")}
                  </div>
                )}
              </>
            ),
            error: (err) => (
              <TitleLg>
                {err.name} {err.message}
              </TitleLg>
            ),
          })}
        </Modal.Body>
      </Modal>
      <PopupNotifications />
    </>
  );
}
