import toast from "react-hot-toast";
import { useUnit } from "effector-react";
import { ButtonHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { createEvent, createStore } from "effector";
import { $selectedOrder } from "~/entities/Order";
import { BlueText, ConfirmationModal, OutlineButton } from "~/shared/ui";
import { useModalState } from "~/shared/lib";
import { OrderOffer, acceptOffer } from "..";

export const selectOffer = createEvent<OrderOffer | null>();
export const $selectedOffer = createStore<OrderOffer | null>(null).on(
  selectOffer,
  (_, newState) => newState
);

export const AcceptOffer = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const offer = useUnit($selectedOffer);
  const [show, changeShow] = useModalState(false);

  const onClick = () =>
    offer ? changeShow() : toast.error(t("offers.selectOffer"));
  return (
    <>
      <OutlineButton {...props} onClick={onClick}>
        {t("common.accept")}
      </OutlineButton>
      {offer && (
        <ConfirmationModal
          show={show}
          onHide={changeShow}
          onConfirm={() => {
            acceptOffer({
              isBestOffer: false,
              transportation_number: order!.transportation_number,
              order_offer_id: offer.id,
            });
            changeShow();
          }}
          title={
            <>
              {t("acceptOffer.areYouSure")} <BlueText>#{offer.id}</BlueText>{" "}
              {t("acceptOffer.from")}{" "}
              <BlueText>
                {offer.transporter_manager.company.company_name}{" "}
                {offer.transporter_manager.user.full_name}
              </BlueText>{" "}
              ?
            </>
          }
        />
      )}
    </>
  );
};
