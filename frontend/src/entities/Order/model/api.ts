import { Effect, attach } from "effector";
import { DriverProfile } from "~/entities/User";
import { OrderModel, TGetOrder } from "~/entities/Order";
import { RequestParams, apiRequestFx } from "~/shared/api";
import {
  OrderIDRequest,
  AddDriverDataRequest,
  CreateOrderRequest,
  EditOrderRequest,
  GetOrdersRequest,
  GetOrdersResponse,
  PublishOrderRequest,
  FindCargoRequest,
  CreateOrderResponse,
  EditOrderResponse,
} from "./api_types";

// get order
export const findCargoFx: Effect<FindCargoRequest, TGetOrder> = attach({
  effect: apiRequestFx,
  mapParams: ({
    transportation_number,
    machine_number,
  }: FindCargoRequest): RequestParams => ({
    method: "get",
    url: `/auction/find_cargo/${transportation_number}/${machine_number}/`,
  }),
});

// get orders
export const getOrdersFx: Effect<GetOrdersRequest, GetOrdersResponse> = attach({
  effect: apiRequestFx,
  mapParams: ({
    status,
    page,
    cityFrom,
    cityTo,
    transportationNumber,
  }: GetOrdersRequest): RequestParams => {
    let queryParams = `status=${status}`;
    if (page) queryParams += "&page=" + page;
    if (cityFrom) queryParams += "&city_from=" + cityFrom;
    if (cityTo) queryParams += "&city_to=" + cityTo;
    if (transportationNumber)
      queryParams += "&transportation_number=" + transportationNumber;
    return {
      method: "get",
      url: `/auction/get_orders/?${queryParams}`,
    };
  },
});

// create order
export const createOrderFx: Effect<CreateOrderRequest, CreateOrderResponse> =
  attach({
    effect: apiRequestFx,
    mapParams: (data: CreateOrderRequest): RequestParams => ({
      method: "post",
      url: "/auction/customer/create_order/",
      data,
    }),
  });

// edit order
export const editOrderFx: Effect<EditOrderRequest, EditOrderResponse> = attach({
  effect: apiRequestFx,
  mapParams: (data: EditOrderRequest): RequestParams => ({
    method: "post",
    url: "/auction/customer/edit_order/",
    data,
  }),
});

// cancel order
export const cancelOrderFx: Effect<OrderIDRequest, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data: OrderIDRequest): RequestParams => ({
    method: "post",
    url: `/auction/customer/cancel_order/`,
    data,
  }),
});

// unpublish order
export const unpublishOrderFx: Effect<OrderIDRequest, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data: OrderIDRequest): RequestParams => ({
    method: "post",
    url: "/auction/customer/unpublish_order/",
    data,
  }),
});

// publish order
export const publishOrderFx: Effect<PublishOrderRequest, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data: PublishOrderRequest): RequestParams => ({
    method: "post",
    url: `/auction/customer/publish_order/`,
    data,
  }),
});

// complete order
export const completeOrderFx: Effect<OrderIDRequest, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data: OrderIDRequest): RequestParams => ({
    method: "post",
    url: `/auction/customer/complete_order/`,
    data,
  }),
});

// cancel order completion
export const cancelOrderCompletionFx: Effect<OrderIDRequest, OrderModel> =
  attach({
    effect: apiRequestFx,
    mapParams: (data: OrderIDRequest): RequestParams => ({
      method: "post",
      url: `/auction/customer/cancel_order_completion/`,
      data,
    }),
  });

// add driver data to order
export const addDriverDataFx: Effect<AddDriverDataRequest, DriverProfile> =
  attach({
    effect: apiRequestFx,
    mapParams: (data: AddDriverDataRequest): RequestParams => ({
      method: "post",
      url: `/auction/transporter/add_driver_data/`,
      data,
    }),
  });
