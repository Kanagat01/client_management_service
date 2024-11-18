import { t } from "i18next";
import { TGetOrder, TColumn, OrderStatus } from "~/entities/Order";
import { OrderStages } from "~/entities/OrderStage";
import { OrderOfferStatus } from "~/entities/Offer";
import {
  dateTimeToString,
  dateToLongMonthString,
  dateToTimeString,
} from "~/shared/lib";

export const getOrderColumnValue = (
  key: keyof TColumn,
  role: "transporter" | "customer",
  order: TGetOrder,
  earliestLoadStage?: OrderStages,
  latestUnloadStage?: OrderStages
) => {
  switch (key) {
    case "volume":
    case "weight":
      let result = 0;
      order.stages.map((stage) => {
        result += stage[key];
        return;
      });
      return result;
    case "updated_at":
    case "created_at":
      const value = order[key as "updated_at" | "created_at"];
      if (!value) return "-";
      return dateTimeToString(value);
    case "status":
      return t(`orderStatus.${order.status}`);
    case "transporter_manager":
    case "customer_manager":
    case "driver":
      return order[key]?.user.full_name ?? "-";
    case "final_price":
      if (role === "transporter") {
        const priceData = order.price_data;
        return priceData && "current_price" in priceData
          ? priceData.current_price
          : "-";
      }
      return [OrderStatus.completed, OrderStatus.being_executed].includes(
        order.status
      )
        ? order?.offers?.find((el) => el.status === OrderOfferStatus.accepted)
            ?.price ?? "-"
        : order?.offers![0]?.price ?? "-";
    case "best_offer_price":
      if (role === "transporter") {
        const priceData = order.price_data;
        return priceData && "current_price" in priceData
          ? priceData.current_price
          : "-";
      }
      return order?.offers?.[0]?.price ?? "-";
    case "best_offer_company":
      return (
        order?.offers?.[0]?.transporter_manager.company.company_name ?? "-"
      );
    case "transporter":
      if (role === "transporter")
        return order?.transporter_manager?.company.company_name ?? "-";
      return (
        order?.offers?.[0]?.transporter_manager?.company.company_name ?? "-"
      );
    case "offer_price":
      const priceData = order.price_data;
      return priceData && "price" in priceData ? priceData.price : "-";
    case "stages_cnt":
      return order.stages.length;
    case "city_from":
      return earliestLoadStage?.city ?? "-";
    case "postal_code":
      return earliestLoadStage?.postal_code ?? "-";
    case "loading_date":
      return earliestLoadStage
        ? dateToLongMonthString(earliestLoadStage.date)
        : "-";
    case "loading_time":
      return earliestLoadStage
        ? dateToTimeString(
            `${earliestLoadStage?.date}T${earliestLoadStage?.time_start}`
          )
        : "-";
    case "city_to":
      return latestUnloadStage?.city ?? "-";
    case "unloading_date":
      return latestUnloadStage
        ? dateToLongMonthString(latestUnloadStage.date)
        : "-";
    case "application_type":
      switch (order.application_type) {
        case "in_auction":
          return t("applicationType.auction");
        case "in_bidding":
          return t("applicationType.bidding");
        case "in_direct":
          return t("applicationType.direct");
        default:
          return "-";
      }
    default:
      return order[key]?.toString() ?? "-";
  }
};
