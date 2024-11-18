import { OrderModel } from "~/entities/Order";

export type OrderDocument = {
  id: number;
  order: OrderModel;
  file: string;
  user?: string;
  created_at: Date;
};
