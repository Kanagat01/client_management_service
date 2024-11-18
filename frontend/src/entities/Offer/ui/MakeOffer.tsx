import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { ButtonHTMLAttributes, ChangeEvent, useEffect, useState } from "react";
import { $selectedOrder, isOrderSelected } from "~/entities/Order";
import { createOffer } from "~/entities/Offer";
import { useModalState } from "~/shared/lib";
import {
  InputContainer,
  modalInputProps,
  ModalTitle,
  OutlineButton,
  PrimaryButton,
} from "~/shared/ui";

const btnStyle = {
  width: "100%",
  padding: "0.5rem 2rem",
  fontSize: "1.6rem",
};

export const MakeOffer = ({
  inAuction = false,
  ...props
}: { inAuction?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const [price, setPrice] = useState<number>(0);
  const [show, changeShow] = useModalState(false);

  const changePrice = (num: number) => {
    if (inAuction) return;
    if (num > 0) setPrice(num);
  };
  const onReset = () => {
    changePrice(0); // модальное окно закрывается, поэтому в режиме аукциона эффекта не имеет
    changeShow();
  };

  useEffect(() => {
    let newPrice;
    const priceData = order?.price_data;

    if (inAuction && order) {
      if (priceData && "current_price" in priceData)
        newPrice = priceData.current_price - order.price_step;
      else newPrice = order?.start_price - order.price_step;
    } else if (order && priceData && "price" in priceData)
      newPrice = priceData.price;
    else newPrice = 0;

    setPrice(newPrice);
  }, [order, inAuction]);
  return (
    <>
      <PrimaryButton {...props} onClick={() => isOrderSelected(changeShow)}>
        {t("createOffer.title")}
      </PrimaryButton>
      <Modal show={show} onHide={changeShow} className="gradient-modal">
        <Modal.Body>
          <ModalTitle>{t("offers.singular")}</ModalTitle>
          <InputContainer
            name="price"
            label={t("common.priceRub")}
            value={price}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              changePrice(Number(e.target.value))
            }
            variant="input"
            type="number"
            min={0}
            {...modalInputProps}
          />
          <div className="buttons">
            <OutlineButton
              style={btnStyle}
              onClick={() =>
                order && price > 0
                  ? createOffer({
                      order_id: order.id,
                      price,
                      inAuction,
                      onReset,
                    })
                  : toast.error(t("offers.priceMoreThan0Error"))
              }
            >
              {t("common.confirm")}
            </OutlineButton>
            <OutlineButton style={btnStyle} onClick={onReset}>
              {t("common.cancel")}
            </OutlineButton>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
