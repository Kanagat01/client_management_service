import { Effect, attach } from "effector";
import { OrderModel } from "~/entities/Order";
import { RequestParams, apiRequestFx } from "~/shared/api";
import {
  AcceptOfferRequest,
  CreateOfferRequest,
  RejectOfferRequest,
} from "./api_types";

export const getOffersFx: Effect<void, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/auction/transporter/get_offers/",
    data,
  }),
});

export const createOfferFx: Effect<CreateOfferRequest, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/auction/transporter/add_order_offer/",
    data,
  }),
});

export const acceptOfferFx: Effect<AcceptOfferRequest, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/auction/customer/accept_offer/",
    data,
  }),
});

export const rejectOfferFx: Effect<RejectOfferRequest, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/auction/customer/reject_offer/",
    data,
  }),
});

export const acceptOfferTransporterFx: Effect<AcceptOfferRequest, OrderModel> =
  attach({
    effect: apiRequestFx,
    mapParams: (data): RequestParams => ({
      method: "post",
      url: "/auction/transporter/accept_offer/",
      data,
    }),
  });

export const rejectOfferTransporterFx: Effect<RejectOfferRequest, OrderModel> =
  attach({
    effect: apiRequestFx,
    mapParams: (data): RequestParams => ({
      method: "post",
      url: "/auction/transporter/reject_offer/",
      data,
    }),
  });
