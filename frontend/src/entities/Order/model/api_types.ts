import { OrderModel, TGetOrder, OrderStatus } from "~/entities/Order";
import { PreCreateOrderResponse, TStages } from "~/entities/OrderStage";
import { DriverProfile } from "~/entities/User";
import { TPaginator } from "~/shared/ui";

export type FindCargoRequest = {
  transportation_number: number;
  machine_number: string;
};

export type GetOrdersRequest = {
  status: OrderStatus;
  page?: number;
  cityFrom?: string;
  cityTo?: string;
  transportationNumber?: number;
};

export type GetOrdersResponse = {
  orders: TGetOrder[];
  pre_create_order: PreCreateOrderResponse;
  pagination: TPaginator;
};

export type CreateOrderRequest = Omit<
  OrderModel,
  | "id"
  | "customer_manager"
  | "transporter_manager"
  | "created_at"
  | "updated_at"
  | "status"
  | "adr"
> & { stages: TStages[] };

export type CreateOrderResponse = {
  max_transportation_number: number;
  max_order_stage_number: number;
};

export type EditOrderRequest = { order_id: number } & Partial<
  Omit<
    OrderModel,
    | "customer_manager"
    | "id"
    | "created_at"
    | "updated_at"
    | "transporter_manager"
    | "order_type"
  >
>;

export type EditOrderResponse = {
  order: OrderModel;
  max_order_stage_number: number;
};

export type OrderIDRequest = { order_id: number };
export type PublishOrderRequest =
  | {
      order_id: number;
      publish_to: "in_bidding" | "in_direct";
    }
  | {
      order_id: number;
      publish_to: "in_auction";
      transporter_company_id: number;
      price: number;
    };

export type AddDriverDataRequest = {
  order_id: number;
  full_name: string;
} & Omit<DriverProfile, "driver_id" | "user">;
