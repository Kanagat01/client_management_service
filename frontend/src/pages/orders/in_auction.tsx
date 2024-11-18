import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { $userType, getRole } from "~/entities/User";
import { AcceptBestOffer, MakeOffer } from "~/entities/Offer";
import { CancelOrder, OrderStatus, UnpublishOrder } from "~/entities/Order";
import { OrdersPage, textActionProps } from "./helpers";

export function OrdersInAuction() {
  const { t } = useTranslation();
  const userType = useUnit($userType);
  const customerPageData = {
    textActions:
      userType === "customer_manager" ? (
        <>
          <AcceptBestOffer {...textActionProps} />
          <UnpublishOrder {...textActionProps} />
          <CancelOrder variant="text" {...textActionProps} />
        </>
      ) : (
        ""
      ),
  };
  const transporterPageData = {
    priceInputs: userType === "transporter_manager",
    textActions:
      userType === "transporter_manager" ? (
        <>
          <MakeOffer inAuction={true} {...textActionProps} />
        </>
      ) : (
        ""
      ),
  };
  return (
    <OrdersPage
      title={t("orders.pages.inAuction")}
      pageData={
        getRole(userType) === "customer"
          ? customerPageData
          : transporterPageData
      }
      status={OrderStatus.in_auction}
    />
  );
}
