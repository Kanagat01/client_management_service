import Routes from "~/shared/routes";
import { TColumn } from "~/entities/Order";

const defaultKeys = [
  "transportation_number",
  "customer_manager",
  "stages_cnt",
  "city_from",
  "postal_code",
  "loading_date",
  "loading_time",
  "city_to",
  "unloading_date",
  "volume",
  "weight",
] as (keyof TColumn)[];

export const keysCustomer: Partial<Record<Routes, (keyof TColumn)[]>> = {
  [Routes.ORDERS_BEING_EXECUTED]: [
    ...defaultKeys,
    "final_price",
    "transporter",
    "driver",
    "application_type",
    "comments_for_transporter",
  ],
  [Routes.UNPUBLISHED_ORDERS]: [...defaultKeys, "comments_for_transporter"],
  [Routes.ORDERS_IN_AUCTION]: [
    ...defaultKeys,
    "start_price",
    "best_offer_price",
    "best_offer_company",
    "comments_for_transporter",
  ],
  [Routes.ORDERS_IN_BIDDING]: [
    ...defaultKeys,
    "start_price",
    "best_offer_price",
    "best_offer_company",
    "comments_for_transporter",
  ],
  [Routes.ORDERS_IN_DIRECT]: [
    ...defaultKeys,
    "final_price",
    "comments_for_transporter",
    "transporter",
  ],
  [Routes.CANCELLED_ORDERS]: [
    ...defaultKeys,
    "start_price",
    "best_offer_price",
    "transporter",
    "driver",
    "application_type",
    "comments_for_transporter",
  ],
};

export const keysTransporter: Partial<Record<Routes, (keyof TColumn)[]>> = {
  [Routes.ORDERS_BEING_EXECUTED]: [
    ...defaultKeys,
    "final_price",
    "transporter",
    "driver",
    "application_type",
  ],
  [Routes.ORDERS_IN_AUCTION]: [...defaultKeys, "offer_price"],
  [Routes.ORDERS_IN_BIDDING]: [...defaultKeys, "offer_price"],
  [Routes.ORDERS_IN_DIRECT]: [
    ...defaultKeys,
    "final_price",
    "comments_for_transporter",
  ],
  [Routes.CANCELLED_ORDERS]: [
    ...defaultKeys,
    "start_price",
    "best_offer_price",
    "transporter",
    "driver",
    "application_type",
  ],
};
