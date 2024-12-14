import { FormEvent } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";

import { login } from "~/features/authorization";
import { InputContainer, PrimaryButton } from "~/shared/ui";
import { useTextInputState } from "~/shared/lib";
import Routes from "~/shared/routes";
import styles from "./styles.module.scss";

export function Login() {
  const [username, onChangeUsername] = useTextInputState("");
  const [password, onChangePassword] = useTextInputState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || Routes.PROFILE;
  const navigateFunc = () => navigate(from);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    login({ username, password, navigateFunc });
  }

  return (
    <div className={styles.limiter}>
      <div className={styles.containerLogin}>
        <div className={styles.wrapLogin}>
          <form className="w-100" onSubmit={handleSubmit}>
            <span className={styles.title}>Campus</span>

            <div className="d-flex flex-column">
              <InputContainer
                label="Логин"
                name="username"
                value={username}
                onChange={onChangeUsername}
                variant="input"
                containerStyle={{ width: "100%", marginBottom: "1rem" }}
              />
              <InputContainer
                label="Пароль"
                name="password"
                value={password}
                onChange={onChangePassword}
                variant="password-input"
                containerStyle={{ width: "100%", marginBottom: "3rem" }}
              />
            </div>

            <PrimaryButton className={styles.button}>Войти</PrimaryButton>
            <div className="text-center" style={{ marginTop: "7rem" }}>
              <NavLink className={styles.link} to={Routes.FORGOT_PASSWORD}>
                Забыли пароль?
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
