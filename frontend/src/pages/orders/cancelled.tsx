import { useTranslation } from "react-i18next";
import { useUnit } from "effector-react";
import { $userType } from "~/entities/User";
import { OrderStatus, UnpublishOrder } from "~/entities/Order";
import { OrdersPage, textActionProps } from "./helpers";

export function CancelledOrders() {
  const { t } = useTranslation();
  const userType = useUnit($userType);
  return (
    <OrdersPage
      title={t("orders.pages.cancelled")}
      pageData={
        userType === "customer_manager"
          ? { textActions: <UnpublishOrder {...textActionProps} /> }
          : {}
      }
      status={OrderStatus.cancelled}
    />
  );
}
