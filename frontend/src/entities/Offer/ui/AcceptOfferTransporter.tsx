import { useUnit } from "effector-react";
import { ButtonHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { $selectedOrder, isOrderSelected } from "~/entities/Order";
import { BlueText, ConfirmationModal, PrimaryButton } from "~/shared/ui";
import { useModalState } from "~/shared/lib";
import { acceptOfferTransporter } from "..";

export const AcceptOfferTransporter = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const priceData = order?.price_data;
  const offer = priceData && "offer_id" in priceData ? priceData : null;
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <PrimaryButton {...props} onClick={() => isOrderSelected(changeShow)}>
        {t("common.accept")}
      </PrimaryButton>
      {order && offer && (
        <ConfirmationModal
          show={show}
          onHide={changeShow}
          onConfirm={() => {
            acceptOfferTransporter({
              transportation_number: order.transportation_number,
              order_offer_id: offer.offer_id,
            });
            changeShow();
          }}
          title={
            <>
              {t("acceptOfferTransporter.areYouSure")}{" "}
              {<BlueText>№{order.transportation_number}</BlueText>}{" "}
              {t("acceptOfferTransporter.forPrice")}{" "}
              {<BlueText>{offer.price}</BlueText>}?
            </>
          }
        />
      )}
    </>
  );
};
