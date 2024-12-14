import { FormEvent, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { forgotPasswordConfirm } from "~/features/forgot-password";
import { InputContainer, PrimaryButton } from "~/shared/ui";
import { useTextInputState } from "~/shared/lib";
import Routes from "~/shared/routes";
import styles from "./styles.module.scss";

export function ForgotPasswordConfirm() {
  const { token } = useParams<{ token: string }>();
  const [isValidToken, setIsValidToken] = useState<boolean>(Boolean(token));

  const [new_password, changeNewPassword] = useTextInputState("");
  const [confirm_password, changeConfirmPassword] = useTextInputState("");

  const navigate = useNavigate();
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (token)
      forgotPasswordConfirm({
        token,
        new_password,
        confirm_password,
        setIsValidToken,
        navigate,
      });
  };
  return (
    <div className={styles.limiter}>
      <div className={styles.containerLogin}>
        <div className={styles.wrapLogin}>
          <form className="w-100" onSubmit={handleSubmit}>
            <span className={styles.title}>Campus</span>

            {isValidToken ? (
              <>
                <span className={styles.subtitle}>
                  Для сброса пароля введите новый пароль и повторите его
                </span>

                <div className="d-flex flex-column">
                  <InputContainer
                    label="Новый пароль"
                    name="new_password"
                    value={new_password}
                    onChange={changeNewPassword}
                    variant="input"
                    containerStyle={{ width: "100%", marginBottom: "1rem" }}
                  />
                  <InputContainer
                    label="Повторите пароль"
                    name="confirm_password"
                    value={confirm_password}
                    onChange={changeConfirmPassword}
                    variant="input"
                    containerStyle={{ width: "100%", marginBottom: "3rem" }}
                  />
                </div>

                <PrimaryButton className={styles.button}>
                  Сбросить
                </PrimaryButton>
                <div className="text-center" style={{ marginTop: "7rem" }}>
                  Уже есть аккаунт?{" "}
                  <NavLink className={styles.link} to={Routes.LOGIN}>
                    Войти
                  </NavLink>
                </div>
              </>
            ) : (
              <>
                <span className={styles.subtitle}>
                  Неправильный адрес. Возможно ссылка для сброса пароля истекла
                </span>
                <div className="text-center" style={{ marginTop: "7rem" }}>
                  <NavLink className={styles.link} to={Routes.FORGOT_PASSWORD}>
                    Забыли пароль?
                  </NavLink>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
