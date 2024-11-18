import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { resetPasswordConfirm } from "~/features/reset-password";
import { PrimaryButton, RoundedInputGroup } from "~/shared/ui";
import { useTextInputState } from "~/shared/lib";
import Routes from "~/shared/routes";
import { Credentials } from "./Credentials";

export function ResetPasswordConfirm() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean>(Boolean(token));

  const [new_password, changeNewPassword] = useTextInputState("");
  const [confirm_password, changeConfirmPassword] = useTextInputState("");

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (token)
      resetPasswordConfirm({
        token,
        new_password,
        confirm_password,
        setIsValidToken,
        navigate,
      });
  };
  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <span className="login-title">Cargonika</span>
        {isValidToken ? (
          <>
            <span className="login-subtitle">
              {t("resetPassword.loginSubtitle")}
            </span>
            <RoundedInputGroup>
              <RoundedInputGroup.PasswordInput
                value={new_password}
                onChange={changeNewPassword}
                placeholder={t("resetPassword.inputPlaceholders.newPassword")}
                required
              />
              <RoundedInputGroup.PasswordInput
                value={confirm_password}
                onChange={changeConfirmPassword}
                placeholder={t(
                  "resetPassword.inputPlaceholders.confirmPassword"
                )}
                required
              />
            </RoundedInputGroup>
            <PrimaryButton type="submit">
              {t("resetPassword.buttonText")}
            </PrimaryButton>
            <span className="link-text">
              {t("login.alreadyHaveAnAccount")}{" "}
              <NavLink to={Routes.LOGIN}>{t("login.buttonText")}</NavLink>
            </span>
          </>
        ) : (
          <>
            <span className="login-subtitle">
              {t("resetPassword.loginSubtitleInvalidToken")}
            </span>
            <NavLink to={Routes.FORGOT_PASSWORD}>
              {t("login.forgotPassword")}
            </NavLink>
          </>
        )}
      </form>
      <Credentials />
    </div>
  );
}
