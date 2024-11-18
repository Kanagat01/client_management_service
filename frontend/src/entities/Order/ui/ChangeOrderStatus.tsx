import toast from "react-hot-toast";
import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { FaRegTrashCan } from "react-icons/fa6";
import { Modal, ModalTitle } from "react-bootstrap";
import { ButtonHTMLAttributes, ChangeEvent, useState } from "react";
import { $mainData, CustomerManager } from "~/entities/User";
import { useModalState } from "~/shared/lib";
import {
  OutlineButton,
  PrimaryButton,
  TextCenter,
  BlueText,
  RoundedTable,
  Checkbox,
  ConfirmationModal,
  InputContainer,
  modalInputProps,
} from "~/shared/ui";
import {
  $selectedOrder,
  cancelOrder,
  cancelOrderCompletion,
  completeOrder,
  isOrderSelected,
  OrderStatus,
  publishOrder,
  unpublishOrder,
} from "..";

export const CancelOrder = ({
  variant,
  ...props
}: { variant: "icon" | "text" } & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const [show, changeShow] = useModalState(false);
  return (
    order?.status !== OrderStatus.completed && (
      <>
        {variant === "icon" ? (
          <OutlineButton {...props} onClick={changeShow}>
            <FaRegTrashCan />
          </OutlineButton>
        ) : (
          <PrimaryButton {...props} onClick={changeShow}>
            {t("cancelOrder.buttonText")}
          </PrimaryButton>
        )}
        <ConfirmationModal
          show={show}
          onHide={changeShow}
          onConfirm={() => {
            cancelOrder();
            changeShow();
          }}
          title={
            <>
              {t("cancelOrder.areYouSure")}{" "}
              {<BlueText>№{order?.transportation_number}</BlueText>}
            </>
          }
        />
      </>
    )
  );
};

export const UnpublishOrder = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const [show, changeShow] = useModalState(false);
  const onClick = () => {
    if (order?.status === OrderStatus.completed)
      toast.error(t("unpublishOrder.orderCompletedError"));
    else isOrderSelected(changeShow);
  };
  return (
    <>
      <PrimaryButton {...props} onClick={onClick}>
        {t("unpublishOrder.buttonText")}
      </PrimaryButton>
      <ConfirmationModal
        show={show}
        onHide={changeShow}
        onConfirm={() => {
          unpublishOrder();
          changeShow();
        }}
        title={
          <>
            {t("unpublishOrder.areYouSure")}{" "}
            {<BlueText>№{order?.transportation_number}</BlueText>}?
          </>
        }
      />
    </>
  );
};

export const PublishOrder = ({
  publishTo,
  ...props
}: {
  publishTo: "in_auction" | "in_bidding";
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const [show, changeShow] = useModalState(false);
  const publishText =
    publishTo === "in_auction"
      ? t("publishOrder.inAuction")
      : t("publishOrder.inBidding");
  return (
    <>
      <PrimaryButton {...props} onClick={() => isOrderSelected(changeShow)}>
        {publishText[0].toUpperCase() + publishText.slice(1)}
      </PrimaryButton>
      <ConfirmationModal
        show={show}
        onHide={changeShow}
        onConfirm={() => {
          publishOrder({ publish_to: publishTo });
          changeShow();
        }}
        title={
          <>
            {t("publishOrder.areYouSure")}{" "}
            {<BlueText>№{order?.transportation_number}</BlueText>} {publishText}
            ?
          </>
        }
      />
    </>
  );
};

export function PublishOrderInDirect() {
  const fontSize = { fontSize: "1.4rem" };
  const btnStyle = {
    width: "100%",
    padding: "0.5rem 2rem",
    fontSize: "1.6rem",
  };

  const { t } = useTranslation();
  const mainData = useUnit($mainData);
  const [show, changeShow] = useModalState(false);
  const [companyId, setCompanyId] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  const onReset = () => {
    setCompanyId(0);
    setPrice(0);
    changeShow();
  };
  const onSubmit = () => {
    if (companyId === 0) {
      toast.error(t("publishOrder.selectTransporter"));
    } else if (price === 0) {
      toast.error(t("publishOrder.priceMustBeGreaterThan0"));
    } else {
      publishOrder({
        publish_to: "in_direct",
        transporter_company_id: companyId,
        price,
      });
      onReset();
    }
  };
  return (
    <>
      <PrimaryButton
        className="me-2 px-3 py-2"
        onClick={() => isOrderSelected(changeShow)}
      >
        {t("publishOrder.assign")}
      </PrimaryButton>
      <Modal show={show} onHide={changeShow} className="gradient-modal">
        <Modal.Body>
          <ModalTitle>{t("publishOrder.assign")}</ModalTitle>
          <InputContainer
            name="price"
            label={t("publishOrder.offeringPrice_rub")}
            value={price}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPrice(Number(e.target.value))
            }
            variant="input"
            type="number"
            {...modalInputProps}
          />
          <RoundedTable
            lightBorderMode={true}
            columns={[
              <TextCenter style={fontSize}>
                {t("common.transporter")}
              </TextCenter>,
              <TextCenter style={fontSize}>{t("common.selection")}</TextCenter>,
            ]}
            data={(
              mainData as CustomerManager
            ).allowed_transporter_companies.map(
              ({ transporter_company_id, company_name }) => [
                <TextCenter className="p-1" style={fontSize}>
                  №{transporter_company_id} {company_name}
                </TextCenter>,
                <TextCenter className="p-1">
                  <Checkbox
                    checked={transporter_company_id === companyId}
                    onChange={() =>
                      setCompanyId(
                        transporter_company_id !== companyId
                          ? transporter_company_id
                          : 0
                      )
                    }
                  />
                </TextCenter>,
              ]
            )}
          />
          <div className="buttons">
            <OutlineButton onClick={onSubmit} style={btnStyle}>
              {t("publishOrder.assign")}
            </OutlineButton>
            <OutlineButton onClick={onReset} style={btnStyle}>
              {t("common.cancel")}
            </OutlineButton>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export const CompleteOrder = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const [show, changeShow] = useModalState(false);
  return (
    <>
      <PrimaryButton {...props} onClick={() => isOrderSelected(changeShow)}>
        {t("completeOrder.buttonText")}
      </PrimaryButton>
      <ConfirmationModal
        show={show}
        onHide={changeShow}
        onConfirm={() => {
          if (order?.status == OrderStatus.completed) cancelOrderCompletion();
          else completeOrder();
          changeShow();
        }}
        title={
          <>
            {t("completeOrder.areYouSure")}{" "}
            {order?.status == OrderStatus.completed
              ? t("cancelOrderCompletion.areYouSure_status")
              : t("completeOrder.areYouSure_status")}{" "}
            {<BlueText>№{order?.transportation_number}</BlueText>}?
          </>
        }
      />
    </>
  );
};
