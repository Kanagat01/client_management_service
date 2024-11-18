import { t } from "i18next";
import toast from "react-hot-toast";
import { createEvent } from "effector";
import {
  $orders,
  removeOrder,
  TPriceData,
  updateOrder,
} from "~/entities/Order";
import {
  AcceptOfferRequest,
  CreateOfferRequest,
  RejectOfferRequest,
} from "./api_types";
import {
  acceptOfferFx,
  acceptOfferTransporterFx,
  createOfferFx,
  getOffersFx,
  rejectOfferFx,
  rejectOfferTransporterFx,
} from "./api";

// get offers
export const getOffers = createEvent();
getOffers.watch(() => getOffersFx());

// create offer
export const createOffer = createEvent<
  CreateOfferRequest & { inAuction: boolean; onReset: () => void }
>();
createOffer.watch(({ inAuction, onReset, ...data }) =>
  toast.promise(createOfferFx(data), {
    loading: t("createOffer.loading"),
    success: () => {
      let price_data: TPriceData;
      if (inAuction)
        price_data = {
          offer_id: 0,
          current_price: data.price,
          price: data.price,
          is_best_offer: true,
        };
      else
        price_data = {
          offer_id: 0,
          price: data.price,
        };
      updateOrder({ orderId: data.order_id, newData: { price_data } });
      onReset();
      return t("createOffer.success");
    },
    error: (err) => {
      if (typeof err === "object") {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;
        const priceError = err?.response?.data?.price?.[0];

        if (status > 499) return t("common.serverError", { code: status });
        if (priceError === "Price must be greater than 0")
          return t("createOffer.priceError");
        return t("common.errorMessage", { err: message });
      } else if (typeof err === "string") {
        if (err.startsWith("not_valid_price. Price must be less than")) {
          const current_price = Number(err.split(" ")[6]);
          if (current_price)
            updateOrder({
              orderId: data.order_id,
              newData: { price_data: { current_price } },
            });
          return t("createOffer.priceChangedError");
        }
      }
      return t("common.errorMessage", { err });
    },
  })
);

type TransportationNumber = { transportation_number: number };

// accept offer
export const acceptOffer = createEvent<
  AcceptOfferRequest & TransportationNumber & { isBestOffer: boolean }
>();
acceptOffer.watch(({ isBestOffer, transportation_number, ...data }) =>
  toast.promise(acceptOfferFx(data), {
    loading: isBestOffer
      ? t("acceptOffer.loading_bestOffer")
      : t("acceptOffer.loading", { id: data.order_offer_id }),
    success: () => {
      const order = $orders
        .getState()
        .find((order) => order.transportation_number === transportation_number);
      if (order) removeOrder(order.id);
      return t("acceptOffer.success", {
        offerId: data.order_offer_id,
        transportationNumber: transportation_number,
      });
    },
    error: (err) => t("common.errorMessage", { err }),
  })
);

// reject offer
export const rejectOffer = createEvent<
  RejectOfferRequest & { orderId: number }
>();
rejectOffer.watch(({ orderId, order_offer_id, ...data }) =>
  toast.promise(rejectOfferFx({ order_offer_id, ...data }), {
    loading: t("rejectOffer.loading"),
    success: () => {
      const order = $orders.getState().find((order) => order.id === orderId);
      if (order) {
        const newData = {
          offers: order.offers?.filter((offer) => offer.id !== order_offer_id),
        };
        updateOrder({ orderId, newData });
      }
      return t("rejectOffer.success", { id: order_offer_id });
    },
    error: (err) => t("common.errorMessage", { err }),
  })
);

// accept offer
export const acceptOfferTransporter = createEvent<
  AcceptOfferRequest & TransportationNumber
>();
acceptOfferTransporter.watch(({ transportation_number, ...data }) =>
  toast.promise(acceptOfferTransporterFx(data), {
    loading: t("acceptOfferTransporter.loading"),
    success: () => {
      const order = $orders
        .getState()
        .find((order) => order.transportation_number === transportation_number);
      if (order) removeOrder(order.id);
      return t("acceptOfferTransporter.success", {
        transportationNumber: transportation_number,
      });
    },
    error: (err) => t("common.errorMessage", { err }),
  })
);

// reject offer
export const rejectOfferTransporter = createEvent<
  RejectOfferRequest & TransportationNumber
>();
rejectOfferTransporter.watch(({ transportation_number, ...data }) =>
  toast.promise(rejectOfferTransporterFx(data), {
    loading: t("rejectOfferTransporter.loading"),
    success: () => {
      const order = $orders
        .getState()
        .find((order) => order.transportation_number === transportation_number);
      if (order) removeOrder(order.id);
      return t("rejectOfferTransporter.success", {
        transportationNumber: transportation_number,
      });
    },
    error: (err) => t("common.errorMessage", { err }),
  })
);
