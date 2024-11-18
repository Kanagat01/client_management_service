import { createEffect, createStore } from "effector";
import { addNotification } from "~/entities/Notification";
import { updateBalance } from "~/entities/User";
import {
  $orders,
  addOrder,
  removeOrder,
  TGetOrder,
  updateOrder,
} from "~/entities/Order";
import { API_URL } from "~/shared/config";
import { $isAuthenticated } from "./authorization";

export const connectToSocketFx = createEffect(async () => {
  const token = localStorage.getItem("token");
  const WS_URL = API_URL.replace("http", "ws");

  const socket = new WebSocket(`${WS_URL}/api/ws/general/?token=${token}`);
  socket.onclose = () => {
    if ($isAuthenticated.getState()) {
      setTimeout(() => {
        connectToSocketFx();
      }, 10_000);
    }
  };
  socket.onmessage = (ev) => {
    const data = JSON.parse(ev.data);
    if ("add_or_update_order" in data) {
      const order: TGetOrder = data.add_or_update_order;
      const idx = $orders.getState().findIndex((o) => o.id === order.id);
      if (idx === -1) addOrder(order);
      else updateOrder({ orderId: order.id, newData: order });
    } else if ("remove_order" in data) {
      removeOrder(data.remove_order);
    } else if ("new_notification" in data) {
      addNotification(data.new_notification);
    } else if ("update_balance" in data) {
      updateBalance(data.update_balance);
    }
  };
  return socket;
});

$isAuthenticated.watch((state) => {
  if (state) connectToSocketFx();
});

export const $websocket = createStore<WebSocket | null>(null).on(
  connectToSocketFx.doneData,
  (_, state) => state
);
