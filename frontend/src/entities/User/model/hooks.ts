import { useUnit } from "effector-react";
import { $mainData } from "./state";

export const useIsActive = () => {
  const mainData = useUnit($mainData);
  if (!mainData) return false;

  if (
    "transporter_company_id" in mainData ||
    "customer_company_id" in mainData
  ) {
    if (mainData.balance <= 0) return false;
  } else {
    if (mainData.company.balance <= 0) return false;
  }

  const company = "company" in mainData ? mainData.company : mainData;

  const today = new Date();
  const isActive =
    company.subscription &&
    (company.subscription_paid ||
      today.getDate() <= company.subscription.days_without_payment);

  return isActive;
};
