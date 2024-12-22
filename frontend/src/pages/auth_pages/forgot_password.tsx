import { FormEvent, useState } from "react";
import { NavLink } from "react-router-dom";

import { forgotPassword } from "~/features/forgot-password";
import { InputContainer, PrimaryButton } from "~/shared/ui";
import { useTextInputState } from "~/shared/lib";
import Routes from "~/shared/routes";
import styles from "./styles.module.scss";

export function ForgotPassword() {
  const [success, setSuccess] = useState<boolean>(false);
  const [email, emailOnChange] = useTextInputState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    forgotPassword({ email, setSuccess });
  };
  return (
    <div className={styles.limiter}>
      <div className={styles.containerLogin}>
        <div className={styles.wrapLogin}>
          <form className="w-100" onSubmit={handleSubmit}>
            <span className={styles.title}>Campus</span>
            {success ? (
              <span className={styles.subtitle}>
                На введенный вами email было отправлено сообщение со ссылкой для
                сброса пароля. Если письмо не пришло проверьте папку "Спам"
              </span>
            ) : (
              <>
                <div className="d-flex flex-column">
                  <InputContainer
                    label="Email"
                    name="email"
                    value={email}
                    onChange={emailOnChange}
                    variant="input"
                    containerStyle={{ width: "100%", marginBottom: "2rem" }}
                  />
                </div>

                <PrimaryButton className={styles.button}>
                  Восстановить
                </PrimaryButton>
              </>
            )}
            <div className="text-center" style={{ marginTop: "7rem" }}>
              Уже есть аккаунт?{" "}
              <NavLink className={styles.link} to={Routes.LOGIN}>
                Войти
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
