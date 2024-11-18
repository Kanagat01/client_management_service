import { OrderModel } from "~/entities/Order";
import { OrderStageKey, TStages } from "~/entities/OrderStage";

export type TNewOrder = Omit<
  OrderModel,
  | "id"
  | "customer_manager"
  | "transporter_manager"
  | "driver"
  | "created_at"
  | "updated_at"
  | "status"
> & { customer_manager: string; stages: TStages[] };

export type TInputs = {
  customer_manager: string;
  start_price: number;
  price_step: number;
  transportation_number: number;
  comments_for_transporter: string;
  additional_requirements: string;
  transport_volume: number;
  temp_mode: string;
  adr: number;
  transport_body_width: number;
  transport_body_length: number;
  transport_body_height: number;

  transport_body_type: number;
  transport_load_type: number;
  transport_unload_type: number;
};

export type FieldUpdatePayload = {
  key: keyof TInputs;
  value: string | number;
};

export type StageFieldUpdatePayload = {
  key: OrderStageKey;
  value: string | number;
};

export type SelectFieldProps = {
  name: keyof TInputs;
  value: string | number;
  options: [string, string][];
};

export type FieldProps = {
  name: keyof TInputs;
  value: number | string;
  colNum: 1 | 2 | 3;
  type?: "number" | "string";
};
