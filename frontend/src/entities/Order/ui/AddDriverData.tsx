import {
  useState,
  ChangeEvent,
  CSSProperties,
  ButtonHTMLAttributes,
} from "react";
import { t } from "i18next";
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useModalState } from "~/shared/lib";
import {
  InputContainer,
  modalInputProps,
  ModalTitle,
  OutlineButton,
  PrimaryButton,
} from "~/shared/ui";
import {
  AddDriverDataRequest,
  addDriverData,
  $selectedOrder,
  OrderStatus,
} from "..";

const btnStyle: CSSProperties = {
  width: "100%",
  padding: "0.5rem 2rem",
  fontSize: "1.6rem",
  textWrap: "nowrap",
};
const inputs: [keyof Omit<AddDriverDataRequest, "order_id">, string][] = [
  ["full_name", t("addDriverData.inputPlaceholders.fullName")],
  ["phone_number", t("addDriverData.inputPlaceholders.phoneNumber")],
  ["passport_number", "000000"],
  ["machine_data", t("addDriverData.inputPlaceholders.machineData")],
  ["machine_number", "000000"],
];

const initialState = {
  full_name: "",
  machine_data: "",
  machine_number: "",
  passport_number: "",
  phone_number: "",
};

export const AddDriverData = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  const { t } = useTranslation();
  const [show, changeShow] = useModalState(false);
  const [driverData, setDriverData] =
    useState<Omit<AddDriverDataRequest, "order_id">>(initialState);

  const onClick = () => {
    const order = $selectedOrder.getState();
    if (!order) {
      toast.error(t("orders.selectOrder"));
      return;
    } else if (order.status !== OrderStatus.being_executed) {
      toast.error(
        t("addDriverData.canNotAddData", {
          status: t(`orderStatus.${order.status}`),
        })
      );
      return;
    }
    if (order.driver)
      setDriverData({
        ...order.driver,
        full_name: order.driver.user.full_name,
      });
    changeShow();
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDriverData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const onReset = () => {
    setDriverData(initialState);
    changeShow();
  };
  const onSubmit = () => addDriverData({ ...driverData, onReset });
  return (
    <>
      <PrimaryButton {...props} onClick={onClick}>
        {t("addDriverData.title")}
      </PrimaryButton>
      <Modal show={show} onHide={changeShow} className="gradient-modal">
        <Modal.Body>
          <ModalTitle className="mb-4">{t("addDriverData.title")}</ModalTitle>
          {inputs.map(([name, placeholder], key) => (
            <InputContainer
              {...{ key, name, placeholder, onChange }}
              label={t(`driverProfileTranslations.${name}`)}
              value={driverData[name]}
              variant="input"
              type={
                name !== "phone_number"
                  ? name !== "passport_number"
                    ? "text"
                    : "number"
                  : "tel"
              }
              {...modalInputProps}
              className={modalInputProps.className.replace("mb-4", "mb-3")}
            />
          ))}
          <div className="buttons">
            <OutlineButton onClick={onSubmit} style={btnStyle}>
              {t("addDriverData.title")}
            </OutlineButton>
            <OutlineButton onClick={onReset} style={btnStyle}>
              {t("common.cancel")}
            </OutlineButton>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
