import { useTranslation } from "react-i18next";
import { ChangeEvent, FormEvent, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  registerCompany,
  RegisterCompanyRequest,
} from "~/features/registration";
import Routes from "~/shared/routes";
import { PrimaryButton, RoundedInputGroup } from "~/shared/ui";
import { Credentials } from "./Credentials";

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || Routes.HOME;
  const navigateFunc = () => navigate(from);

  const [data, setData] = useState<RegisterCompanyRequest>({
    company_name: "",
    email: "",
    full_name: "",
    password: "",
    user_type: "customer",
  });
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    registerCompany({ ...data, navigateFunc });
  };
  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <span className="login-title">Cargonika</span>
        <RoundedInputGroup>
          <RoundedInputGroup.Select
            options={[
              ["customer", t("common.customer")],
              ["transporter", t("common.transporter")],
            ]}
            value={data.user_type}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setData({
                ...data,
                user_type: e.target.value as "customer" | "transporter",
              })
            }
            required
          />
          <RoundedInputGroup.Input
            name="full_name"
            value={data.full_name}
            onChange={onChange}
            placeholder={t("registration.inputPlaceholders.fullName")}
            required
          />
          <RoundedInputGroup.Input
            name="company_name"
            value={data.company_name}
            onChange={onChange}
            placeholder={t("registration.inputPlaceholders.companyName")}
            required
          />
          <RoundedInputGroup.Input
            name="email"
            placeholder={t("registration.inputPlaceholders.email")}
            value={data.email}
            onChange={onChange}
            required
          />
          <RoundedInputGroup.PasswordInput
            name="password"
            placeholder={t("registration.inputPlaceholders.password")}
            value={data.password}
            onChange={onChange}
            required
          />
        </RoundedInputGroup>
        <PrimaryButton type="submit">
          {t("registration.buttonText")}
        </PrimaryButton>
        <span className="link-text">
          {t("login.alreadyHaveAnAccount")}{" "}
          <NavLink to={Routes.LOGIN}>{t("login.buttonText")}</NavLink>
        </span>
      </form>
      <Credentials />
    </div>
  );
}
