import { ReactNode } from "react";
import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { $selectedOrder } from "~/entities/Order";
import { InputContainer, InputProps } from "~/shared/ui";

export type ControlPanelProps = {
  inputs?: Omit<InputProps, "variant">[];
  iconActions?: ReactNode;
  textActions?: ReactNode;
  priceInputs?: boolean;
};

export function ControlPanel({
  inputs,
  iconActions,
  textActions,
  priceInputs = false,
}: ControlPanelProps) {
  const { t } = useTranslation();
  const order = useUnit($selectedOrder);
  const priceData = order?.price_data;
  if (priceInputs) {
    const auctionInputs: Omit<InputProps, "variant">[] = [
      {
        name: "price",
        label: t("orderTranslations.currentPrice"),
        defaultValue:
          priceData && "current_price" in priceData
            ? priceData.current_price
            : order?.start_price,
        readOnly: true,
      },
      {
        name: "price_step",
        label: t("orderTranslations.price_step"),
        defaultValue: order?.price_step,
        readOnly: true,
      },
    ];
    if (inputs) inputs = [...inputs, ...auctionInputs];
    else inputs = auctionInputs;
  }
  return (
    <div className="control-panel">
      {inputs?.map((props, idx) => (
        <InputContainer
          key={idx}
          {...props}
          variant="input"
          style={{ width: "100%", height: "-webkit-fill-available" }}
          labelStyle={{ textWrap: "nowrap", width: "fit-content" }}
          autoComplete="off"
        />
      ))}
      <div className="actions">
        {iconActions && (
          <span className="actions-title">{t("common.actions")}</span>
        )}
        <div
          className="d-flex"
          style={{ gap: "1rem", height: "-webkit-fill-available" }}
        >
          <div className="d-inline-flex">{iconActions}</div>
          <div className="d-inline-flex">{textActions}</div>
        </div>
      </div>
    </div>
  );
}
