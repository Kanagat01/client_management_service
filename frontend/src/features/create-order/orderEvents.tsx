import { t } from "i18next";
import toast from "react-hot-toast";
import { FormEvent, MouseEvent } from "react";
import { createEvent, sample } from "effector";
import {
  createOrderFx,
  editOrderFx,
  updateOrder,
  $selectedOrder,
  setSelectedOrder,
} from "~/entities/Order";
import { $mainData } from "~/entities/User";
import {
  $orderForm,
  initialOrder,
  setMaxOrderStageNumber,
  setNotValidStageNumber,
  setOrderForm,
  TNewOrder,
} from ".";

export const clearForm = createEvent<number | void>();
clearForm.watch((transportationNumber) => {
  setOrderForm({
    ...initialOrder,
    customer_manager: $orderForm.getState().customer_manager,
    transportation_number: transportationNumber
      ? transportationNumber
      : $orderForm.getState().transportation_number,
  } as TNewOrder);
});

export const CopyOrder = createEvent<MouseEvent<HTMLAnchorElement>>();
CopyOrder.watch((event) => {
  const order = $selectedOrder.getState();
  if (!order) {
    event.preventDefault();
    toast.error(t("orders.selectOrder"));
    return;
  }
  const newState: Partial<TNewOrder> = {
    customer_manager: $mainData.getState()?.user.full_name ?? "",
  };
  Object.keys(initialOrder).map((key) => {
    if (key === "stages") {
      newState.stages = order.stages.map((stage, idx) => ({
        ...stage,
        order_stage_number: idx,
      }));
    } else if (["transportation_number", "customer_manager"].includes(key)) {
    } else {
      // @ts-ignore
      newState[key] = order[key];
    }
  });
  sample({
    clock: $orderForm,
    fn: () => null,
    target: setSelectedOrder,
  });
  setOrderForm(newState as TNewOrder);
});

const handleError = (error: string | Record<string, string[]>) => {
  if (typeof error === "string") {
    if (error === "transportation_number_must_be_unique")
      return t("orders.transportationNumberMustBeUnique");
    else if (error === "add_at_least_one_stage")
      return t("orders.addAtLeastOneStage");
    else if (error.startsWith("order_stage_number_must_be_unique")) {
      const stageNum = Number(error.split(":")[1]);
      setNotValidStageNumber(stageNum);
      return t("orders.orderStageNumber_MustBeUnique", { stageNum });
    } else if (error === "You can edit only unpublished orders.")
      return t("orders.canEditOnlyUnpublished");
    return t("common.errorMessage", { error });
  }
  return t("common.unknownError", { error });
};

export const orderFormSubmitted = createEvent<FormEvent>();
orderFormSubmitted.watch((e: FormEvent) => {
  e.preventDefault();
  const orderForm = $orderForm.getState();
  const notRequired = [
    "comments_for_transporter",
    "additional_requirements",
    "adr",
    "temp_mode",
    "transport_body_width",
    "transport_body_height",
    "transport_body_length",
  ];
  const notFilledIn = [];
  for (const key in orderForm) {
    //@ts-ignore
    if (!orderForm[key] && notRequired.includes(key)) {
      //@ts-ignore
      orderForm[key] = null;
    } else if (
      !orderForm[key as keyof typeof orderForm] ||
      (key === "stages" && orderForm.stages.length === 0)
    ) {
      notFilledIn.push(t(`orderTranslations.${key}`));
    }
  }
  if (notFilledIn.length > 0) {
    toast(
      <span>
        {t("common.fillOutRequired", { fields: notFilledIn.join(", ") })}
      </span>,
      {
        position: "top-right",
        duration: 3000,
        icon: <button onClick={() => toast.dismiss()}>❌</button>,
        style: { fontSize: "1.4rem" },
      }
    );
  } else {
    if (orderForm.id) {
      const { id, ...data } = orderForm;
      toast.promise(editOrderFx({ order_id: id, ...data }), {
        loading: t("editOrder.loading", {
          transportationNumber: data.transportation_number,
        }),
        success: ({ order, max_order_stage_number }) => {
          updateOrder({ orderId: id, newData: order });
          setMaxOrderStageNumber(max_order_stage_number);
          return t("editOrder.success", {
            transportationNumber: data.transportation_number,
          });
        },
        error: handleError,
      });
    } else {
      toast.promise(createOrderFx(orderForm), {
        loading: t("createOrder.loading"),
        success: ({ max_order_stage_number, max_transportation_number }) => {
          clearForm(max_transportation_number + 1);
          setMaxOrderStageNumber(max_order_stage_number);
          return t("createOrder.success");
        },
        error: handleError,
      });
    }
  }
});
