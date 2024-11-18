import { FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";

import { login } from "~/features/authorization";
import { PrimaryButton, RoundedInputGroup } from "~/shared/ui";
import { useTextInputState } from "~/shared/lib";
import Routes from "~/shared/routes";
import { Credentials } from "./Credentials";

export function Login() {
  const { t } = useTranslation();
  const [email, onChangeEmail] = useTextInputState("");
  const [password, onChangePassword] = useTextInputState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || Routes.HOME;
  const navigateFunc = () => navigate(from);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ username: email, password, navigateFunc });
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <span className="login-title">Cargonika</span>
        <RoundedInputGroup>
          <RoundedInputGroup.Input
            value={email}
            onChange={onChangeEmail}
            placeholder={t("login.inputPlaceholders.email")}
            required
          />
          <RoundedInputGroup.PasswordInput
            value={password}
            onChange={onChangePassword}
            placeholder={t("login.inputPlaceholders.password")}
            required
          />
        </RoundedInputGroup>
        <PrimaryButton type="submit">{t("login.buttonText")}</PrimaryButton>
        <NavLink to={Routes.REGISTER}>{t("registration.buttonText")}</NavLink>
        <NavLink to={Routes.FORGOT_PASSWORD} className="mt-2">
          {t("login.forgotPassword")}
        </NavLink>
      </form>
      <Credentials />
    </div>
  );
}
