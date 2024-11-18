import { TransporterManager } from "~/entities/User";
import { OrderModel } from "~/entities/Order";

export enum OrderOfferStatus {
  none = "none",
  accepted = "accepted",
  rejected = "rejected",
}

export type OrderOffer = {
  id: number;
  order: OrderModel;
  transporter_manager: TransporterManager;
  price: number;
  created_at: string;
  status: OrderOfferStatus;
};
