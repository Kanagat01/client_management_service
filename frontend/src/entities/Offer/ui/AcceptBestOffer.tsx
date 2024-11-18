import toast from "react-hot-toast";
import { useUnit } from "effector-react";
import { ButtonHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { $selectedOrder, isOrderSelected } from "~/entities/Order";
import { BlueText, ConfirmationModal, PrimaryButton } from "~/shared/ui";
import { useModalState } from "~/shared/lib";
import { acceptOffer } from "..";

export const AcceptBestOffer = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const bestOffer =
    order?.offers && order?.offers.length !== 0 ? order?.offers[0] : null;

  const [show, changeShow] = useModalState(false);
  const onClick = () => {
    if (order && !bestOffer) return toast.error(t("offers.empty"));
    isOrderSelected(changeShow);
  };
  return (
    <>
      <PrimaryButton {...props} onClick={onClick}>
        {t("common.accept")}
      </PrimaryButton>
      {order && bestOffer && (
        <ConfirmationModal
          show={show}
          onHide={changeShow}
          onConfirm={() => {
            acceptOffer({
              isBestOffer: true,
              transportation_number: order?.transportation_number,
              order_offer_id: bestOffer.id,
            });
            changeShow();
          }}
          title={
            <>
              {t("acceptOffer.areYouSure_bestOffer")}{" "}
              <BlueText>{bestOffer.price}</BlueText> {t("acceptOffer.from")}{" "}
              <BlueText>
                {bestOffer.transporter_manager.user.full_name}
              </BlueText>{" "}
              {t("acceptOffer.forOrder")}{" "}
              {<BlueText>№{order?.transportation_number}</BlueText>}?
            </>
          }
        />
      )}
    </>
  );
};
