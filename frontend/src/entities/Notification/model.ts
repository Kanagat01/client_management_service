import { t } from "i18next";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { NotificationType, TNotification } from "./types";
import { $mainData } from "../User";

export const getNotificationsFx: Effect<void, TNotification[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "notifications/get_notifications/",
  }),
});

const removeNotificationFx: Effect<{ notification_id: number }, string> =
  attach({
    effect: apiRequestFx,
    mapParams: (data): RequestParams => ({
      method: "post",
      url: "notifications/delete_notification/",
      data,
    }),
  });

export const addNotification = createEvent<TNotification>();
export const removeNotification = createEvent<number>();
removeNotification.watch(
  (notification_id) =>
    notification_id !== 0 ? removeNotificationFx({ notification_id }) : {} // если 0, значит уведомление добавлено во фронте
);

export const $notifications = createStore<TNotification[]>([])
  .on(getNotificationsFx.doneData, (_, data) => {
    const mainData = $mainData.getState();
    if (!mainData) return data;

    const defaultNotificationProp = {
      id: 0,
      created_at: "",
      type: NotificationType.POPUP_NOTIFICATION,
    };

    if ("subscription" in mainData && !mainData.subscription) {
      data.push({
        ...defaultNotificationProp,
        title: t("notifications.chooseSubscription.title"),
        description: t("notifications.chooseSubscription.description"),
      });
    } else if ("balance" in mainData) {
      if (mainData.balance <= 0) {
        data.push({
          ...defaultNotificationProp,
          title: t("notifications.topUpBalance.title"),
          description: t("notifications.topUpBalance.description"),
        });
      }
      if (mainData.managers.length === 0) {
        data.push({
          ...defaultNotificationProp,
          title: t("notifications.addManager.title"),
          description: t("notifications.addManager.description"),
        });
      }
    }
    return data;
  })
  .on(addNotification, (state, notification) => [...state, notification])
  .on(removeNotification, (state, notification_id) => {
    if (notification_id === 0) {
      // Все уведомления добавленные во фронте, имеют id = 0, чтобы не удалить их всех, удаляем лишь самый первый
      const index = state.findIndex((el) => el.id === 0);
      if (index !== -1) {
        state.splice(index, 1);
      }
      return state;
    }
    return state.filter((el) => el.id !== notification_id);
  });
