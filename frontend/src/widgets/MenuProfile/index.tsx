import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import {
  $mainData,
  $settings,
  CompaniesList,
  CustomerCompany,
  TransporterCompany,
} from "~/entities/User";
import { formatPhoneNumber } from "~/shared/lib";
import styles from "./styles.module.scss";

export function MenuProfile() {
  const { i18n } = useTranslation();

  const mainData = useUnit($mainData);
  const settings = useUnit($settings);
  let orgName;
  if (mainData) {
    const company = "company" in mainData ? mainData?.company : mainData;
    const companyId =
      (company as CustomerCompany)?.customer_company_id ||
      (company as TransporterCompany)?.transporter_company_id;

    const companyName = company?.company_name || "";
    orgName = `${companyName} (${companyId})`;
  }

  return (
    <div className={styles["menu-profile-info"]}>
      <div className={`${styles["profile-main"]} align-items-end`}>
        <span className={styles["full-name"]}>
          {mainData
            ? `${Number(
                ("balance" in mainData ? mainData : mainData.company).balance
              ).toLocaleString(i18n.language || "ru-RU", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })} ₽`
            : ""}
        </span>
        <span className={styles["org-name"]}>
          {settings?.phone_number
            ? formatPhoneNumber(settings.phone_number)
            : ""}
        </span>
      </div>
      <div className="rounded-block company-logo">
        {mainData?.user.full_name[0]}
      </div>
      <div className={styles["profile-main"]}>
        <span className={styles["full-name"]}>{mainData?.user.full_name}</span>
        <span className={styles["org-name"]}>{orgName}</span>
      </div>
      {mainData?.user.user_type === "customer_company" ? (
        <CompaniesList
          companies={
            (mainData as CustomerCompany).allowed_transporter_companies
          }
        />
      ) : (
        ""
      )}
    </div>
  );
}
