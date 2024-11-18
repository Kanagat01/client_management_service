import { t } from "i18next";
import { Effect, createEvent, createStore, sample } from "effector";
import toast, { Renderable, ValueOrFunction } from "react-hot-toast";
import { PreCreateOrderResponse } from "~/entities/OrderStage";
import { TPaginator } from "~/shared/ui";
import {
  addDriverDataFx,
  cancelOrderCompletionFx,
  cancelOrderFx,
  completeOrderFx,
  findCargoFx,
  getOrdersFx,
  publishOrderFx,
  unpublishOrderFx,
} from "./api";
import { OrderModel, OrderStatus, TGetOrder } from "../types";
import { AddDriverDataRequest } from ".";

export const $orders = createStore<TGetOrder[]>([]);
$orders.on(getOrdersFx.doneData, (_, payload) => payload.orders);
$orders.on(findCargoFx.doneData, (_, order) => [order]);

export const $ordersPagination = createStore<TPaginator | null>(null);
$ordersPagination.on(getOrdersFx.doneData, (_, payload) => payload.pagination);

export const $preCreateOrder = createStore<PreCreateOrderResponse | null>(null);
$preCreateOrder.on(
  getOrdersFx.doneData,
  (_, payload) => payload.pre_create_order
);

export const addOrder = createEvent<TGetOrder>();
$orders.on(addOrder, (state, order) => {
  order = { ...order, isNewOrder: true };
  const index = state.findIndex(
    (o) => o.transportation_number <= order.transportation_number
  );

  if (index === -1) {
    return [...state, order];
  } else if (index === 0) {
    return [order, ...state];
  } else {
    return [...state.slice(0, index), order, ...state.slice(index)];
  }
});

/**
 * Обновляет состояние заказа в хранилище.
 * Если из сокета пришли данные о водителе, добавить transportation_number в newData
 */
export const updateOrder = createEvent<{
  orderId: number;
  newData: Partial<TGetOrder>;
}>();
$orders.on(updateOrder, (state, { orderId, newData }) => {
  return state.map((order) => {
    if (order.id === orderId) {
      if (!order.driver && newData.driver && newData.transportation_number) {
        toast.success(
          t("orderModel.driverDataAdded", {
            transportationNumber: newData.transportation_number,
          })
        );
      }
      return { ...order, ...newData };
    }
    return order;
  });
});

export const removeOrder = createEvent<number>();
$orders.on(removeOrder, (state, orderId) =>
  state.filter((order) => order.id !== orderId)
);

export const setSelectedOrder = createEvent<TGetOrder | null>();
export const $selectedOrder = createStore<TGetOrder | null>(null).on(
  setSelectedOrder,
  (_, state) => {
    if (state?.isNewOrder) state.isNewOrder = false;
    return state;
  }
);
$selectedOrder.on(updateOrder, (state, { newData }) => {
  return state ? { ...state, ...newData } : null;
});

export const updateSelectedOrder = createEvent();
$selectedOrder.on(updateSelectedOrder, (state) => {
  if (state)
    return $orders.getState().find((order) => order.id === state.id) ?? null;
  return null;
});

export const isOrderSelected = (func: () => void) => {
  const order = $selectedOrder.getState();
  if (!order) toast.error(t("orders.selectOrder"));
  else func();
};

sample({
  clock: $orders,
  target: updateSelectedOrder,
});

function handleOrderAction(
  actionFx: Effect<any, OrderModel>,
  actionMessage: {
    loading: string;
    success: string;
    error?: ValueOrFunction<Renderable, any>;
  },
  actionProps?: Record<string, unknown>,
  onSuccess?: (order_id: number) => void
) {
  const order = $selectedOrder.getState();
  const order_id = order?.id;
  if (order_id) {
    toast.promise(actionFx({ order_id, ...actionProps }), {
      loading: actionMessage.loading,
      success: () => {
        if (onSuccess) onSuccess(order_id);
        else {
          removeOrder(order_id);
          setSelectedOrder(null);
        }
        return actionMessage.success;
      },
      error: actionMessage.error
        ? actionMessage.error
        : (err) => {
            if (err instanceof Array) {
              const statusError = err.find((el) =>
                el.startsWith("order_status_is")
              );
              if (err.includes("order_is_completed"))
                return t("orderModel.orderCompletedError");
              else if (err.includes("order_is_completed_or_unpublished")) {
                removeOrder(order_id);
                return t("orderModel.orderCompletedOrUnpublished");
              } else if (statusError) {
                const orderStatus: OrderStatus = statusError.split(":")[1];
                if (orderStatus !== OrderStatus.completed) {
                  removeOrder(order_id);
                  return t("orders.orderStatusIs", {
                    status: t(`orderStatus.${orderStatus}`),
                  });
                } else {
                  updateOrder({
                    orderId: order_id,
                    newData: { status: orderStatus },
                  });
                  return t("orderModel.orderAlreadyCompleted");
                }
              }
            }
            return t("common.errorMessage", { err });
          },
    });
  } else toast.error(t("orders.selectOrder"));
}

export const cancelOrder = createEvent();
cancelOrder.watch(() =>
  handleOrderAction(cancelOrderFx, {
    loading: t("cancelOrder.loading"),
    success: t("cancelOrder.success"),
  })
);

export const publishOrder = createEvent<
  | { publish_to: "in_auction" | "in_bidding" }
  | { publish_to: "in_direct"; transporter_company_id: number; price: number }
>();
publishOrder.watch(({ publish_to, ...data }) =>
  handleOrderAction(
    publishOrderFx,
    {
      loading: t("publishOrder.loading"),
      success: t("publishOrder.success", {
        status: t(`orderStatus.${publish_to}`),
      }),
      error: (err) => {
        if ("transporter_company_id" in err) {
          if (
            err.transporter_company_id instanceof Array &&
            err.transporter_company_id.includes(
              "TransporterCompany has no manager"
            )
          )
            return t("publishOrder.transporterHasNoManager");
        }
        return t("common.errorMessage", { err });
      },
    },
    { publish_to, ...data }
  )
);

export const unpublishOrder = createEvent();
unpublishOrder.watch(() =>
  handleOrderAction(unpublishOrderFx, {
    loading: t("unpublishOrder.loading"),
    success: t("unpublishOrder.success"),
  })
);

export const completeOrder = createEvent();
completeOrder.watch(() =>
  handleOrderAction(
    completeOrderFx,
    {
      loading: t("completeOrder.loading"),
      success: t("completeOrder.success"),
    },
    {},
    (orderId: number) => {
      updateOrder({ orderId, newData: { status: OrderStatus.completed } });
      setSelectedOrder(null);
    }
  )
);

export const cancelOrderCompletion = createEvent();
cancelOrderCompletion.watch(() =>
  handleOrderAction(
    cancelOrderCompletionFx,
    {
      loading: t("cancelOrderCompletion.loading"),
      success: t("cancelOrderCompletion.success"),
    },
    {},
    (orderId: number) => {
      updateOrder({ orderId, newData: { status: OrderStatus.being_executed } });
      setSelectedOrder(null);
    }
  )
);

const isDriverDataValid = (data: Omit<AddDriverDataRequest, "order_id">) => {
  const regex = /^\+?1?\d{9,15}$/;
  const notFilledIn: string[] = [];

  const fields = [
    { value: data.full_name, label: t("driverProfileTranslations.full_name") },
    {
      value: data.machine_data,
      label: t("driverProfileTranslations.machine_data"),
    },
    {
      value: data.machine_number,
      label: t("driverProfileTranslations.machine_number"),
    },
    {
      value: data.passport_number,
      label: t("driverProfileTranslations.passport_number"),
    },
    {
      value: data.phone_number,
      label: t("driverProfileTranslations.phone_number"),
    },
  ];

  fields.forEach(({ value, label }) => {
    if (value === "") notFilledIn.push(label);
  });
  if (notFilledIn.length > 0) {
    toast.error(
      t("common.fillOutRequired", { fields: notFilledIn.join(", ") })
    );
    return false;
  }
  if (!regex.test(data.phone_number)) {
    toast.error(t("addDriverData.wrongPhoneNumber"));
    return false;
  }
  return true;
};

export const addDriverData = createEvent<
  Omit<AddDriverDataRequest, "order_id"> & { onReset: () => void }
>();
addDriverData.watch(({ onReset, ...data }) => {
  const order_id = $selectedOrder.getState()?.id;
  if (!order_id) return;
  if (!isDriverDataValid(data)) return;

  toast.promise(addDriverDataFx({ order_id, ...data }), {
    loading: t("addDriverData.loading"),
    success: (driver) => {
      updateOrder({ orderId: order_id, newData: { driver } });
      setSelectedOrder(null);
      onReset();
      return t("addDriverData.success");
    },
    error: (err) => {
      if (err === "Status should be being_executed") {
        return t("addDriverData.shouldBeBeingExecuted");
      } else if (typeof err === "object") {
        const getErrorValue = (value: unknown) => {
          if (Array.isArray(value) && typeof value[0] === "string") {
            if (value[0].startsWith("max_length is")) {
              const maxLength = value[0].split(" ").at(-2);
              return t("addDriverData.maxLengthIs", { maxLength });
            } else if (value[0] === "required")
              return t("common.requiredField");
            else if (value[0] === "must_be_unique")
              return t("addDriverData.mustBeUnique");
          }
          return value;
        };
        return Object.entries(err)
          .map(
            ([key, value]) =>
              `${t(`driverProfileTranslations.${key}`)}: ${getErrorValue(
                value
              )}`
          )
          .join("\n");
      }
      return t("common.errorMessage", { err });
    },
  });
});
