import toast from "react-hot-toast";
import { useUnit } from "effector-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { $mainData, changeSubscription } from "~/entities/User";
import { Checkbox, PrimaryButton, RoundedTable, TextCenter } from "~/shared/ui";
import { btnStyle, fontSize } from "./helpers";

export function SubscriptionsList() {
  const { t, i18n } = useTranslation();

  const mainData = useUnit($mainData);
  if (!mainData || !("subscriptions_list" in mainData)) return null;

  const [subscriptionId, setSubscriptionId] = useState(
    mainData.subscription?.id
  );
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (subscriptionId === mainData.subscription?.id) return;
    else if (subscriptionId)
      changeSubscription({ subscription_id: subscriptionId });
    else toast.error(t("subscriptions.chooseSubscription"));
  };

  const onReset = (e: FormEvent) => {
    e.preventDefault();
    setSubscriptionId(mainData.subscription?.id);
  };

  const style = {
    ...fontSize,
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
  };
  return (
    <form onSubmit={onSubmit} onReset={onReset}>
      <RoundedTable
        columns={[
          <TextCenter style={style}>{t("subscriptions.singular")}</TextCenter>,
          <TextCenter style={style}>{t("subscriptions.price")}</TextCenter>,
          <TextCenter style={style}>{t("subscriptions.selected")}</TextCenter>,
        ]}
        data={mainData.subscriptions_list.map((subscription) => [
          <TextCenter style={style}>{subscription.name}</TextCenter>,
          <TextCenter style={style}>
            {Number(subscription.price).toLocaleString(
              i18n.language || "ru-RU",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }
            )}
          </TextCenter>,
          <TextCenter style={{ display: "grid", justifyItems: "center" }}>
            <Checkbox
              checked={subscription.id === subscriptionId}
              onChange={() => setSubscriptionId(subscription.id)}
            />
          </TextCenter>,
        ])}
        layoutFixed={false}
      />
      <div className="d-flex justify-content-evenly w-100 mt-5">
        <PrimaryButton type="submit" style={btnStyle}>
          {t("common.save")}
        </PrimaryButton>
        <PrimaryButton type="reset" style={btnStyle}>
          {t("common.cancel")}
        </PrimaryButton>
      </div>
    </form>
  );
}
