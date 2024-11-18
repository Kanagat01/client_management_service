import { NavLink } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { forgotPassword } from "~/features/reset-password";
import { PrimaryButton, RoundedInputGroup } from "~/shared/ui";
import { useTextInputState } from "~/shared/lib";
import Routes from "~/shared/routes";
import { Credentials } from "./Credentials";

export function ForgotPassword() {
  const { t } = useTranslation();
  const [success, setSuccess] = useState<boolean>(false);
  const [email, emailOnChange] = useTextInputState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    forgotPassword({ email, setSuccess });
  };
  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <span className="login-title">Cargonika</span>
        <span className="login-subtitle">
          {success
            ? t("forgotPassword.loginSubtitleSuccess")
            : t("forgotPassword.loginSubtitle")}
        </span>
        {!success ? (
          <>
            <RoundedInputGroup>
              <RoundedInputGroup.Input
                value={email}
                onChange={emailOnChange}
                placeholder="example@gmail.com"
                required
              />
            </RoundedInputGroup>
            <PrimaryButton type="submit">
              {t("forgotPassword.recover")}
            </PrimaryButton>
            <span className="link-text">
              {t("login.alreadyHaveAnAccount")}{" "}
              <NavLink to={Routes.LOGIN}>{t("login.buttonText")}</NavLink>
            </span>
          </>
        ) : (
          <a href="#" className="mt-1" onClick={() => setSuccess(false)}>
            {t("forgotPassword.changeEmail")}
          </a>
        )}
      </form>
      <Credentials />
    </div>
  );
}
