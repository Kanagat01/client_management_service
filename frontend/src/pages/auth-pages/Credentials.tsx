import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { $settings } from "~/entities/User";

export function Credentials() {
  const { t } = useTranslation();
  const settings = useUnit($settings);
  return (
    <div className="login-page-bottom">
      <div className="d-flex align-items-center justify-content-between">
        <a href={`mailto:${settings?.email}`}>{settings?.email}</a>
        <a href={`tel:${settings?.phone_number}`}>{settings?.phone_number}</a>
      </div>
      <p className="copyright">&copy; {t("common.credentials")}</p>
    </div>
  );
}
