import { TGetOrder } from "~/entities/Order";
import {
  TStages,
  OrderTransportBodyType,
  OrderTransportLoadType,
  OrderTransportUnloadType,
} from "../types";

export type AddOrderStageRequest = { order_id: number } & Partial<TStages>;
export type EditOrderStageRequest = {
  order_stage_id: number;
} & Partial<TStages>;

export type PreCreateOrderResponse = {
  transport_body_types: OrderTransportBodyType[];
  transport_load_types: OrderTransportLoadType[];
  transport_unload_types: OrderTransportUnloadType[];
  max_order_stage_number: number;
  max_transportation_number?: number;
  order?: TGetOrder;
};
