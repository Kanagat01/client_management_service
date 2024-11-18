import { OrderDocument } from "~/entities/Document";
import { TStages } from "~/entities/OrderStage";
import { OrderOffer } from "~/entities/Offer";
import {
  CustomerManager,
  DriverProfile,
  TransporterManager,
} from "~/entities/User";
import { OrderTracking } from "./order_tracking";

export enum OrderStatus {
  unpublished = "unpublished",
  cancelled = "cancelled",
  in_auction = "in_auction",
  in_bidding = "in_bidding",
  in_direct = "in_direct",
  being_executed = "being_executed",
  completed = "completed",
}

export type OrderModel = {
  id: number;
  customer_manager: CustomerManager;
  transporter_manager?: TransporterManager;
  driver?: DriverProfile;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  transportation_number: number;
  start_price: number;
  price_step: number;
  comments_for_transporter?: string;
  additional_requirements?: string;
  transport_body_type: number;
  transport_load_type: number;
  transport_unload_type: number;
  transport_volume: number;
  temp_mode?: string;
  adr?: number;
  transport_body_width?: number;
  transport_body_length?: number;
  transport_body_height?: number;
};

export type TPriceData =
  | { offer_id: number; price: number }
  | { current_price: number }
  | {
      offer_id: number;
      price: number;
      current_price: number;
      is_best_offer: boolean;
    };

export type TGetOrder = OrderModel & {
  offers?: OrderOffer[];
  tracking?: OrderTracking | null;
  documents: OrderDocument[];
  stages: TStages[];
  price_data?: TPriceData;
  application_type?: "in_auction" | "in_bidding" | "in_direct";

  // параметр существует, если заказ добавлен через сокет
  isNewOrder?: boolean;
};

export type TColumn = TGetOrder & {
  stages_cnt: number;
  loading_time: string;
  loading_date: string;
  unloading_date: string;
  city_from: string;
  city_to: string;
  postal_code: string;
  weight: number;
  volume: number;

  offer_price: number;
  final_price: number;

  best_offer_price: number;
  best_offer_company: string;
  transporter: string;
};
