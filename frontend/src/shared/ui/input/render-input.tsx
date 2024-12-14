import { ReactNode, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { InputProps } from "./types";
import styles from "./styles.module.scss";

export const RenderInput = (props: InputProps): ReactNode => {
  switch (props.variant) {
    case "password-input":
      const [showPassword, setShowPassword] = useState<boolean>(false);
      return (
        <div className={styles.passwordInput}>
          <input
            id={props.name}
            {...props}
            type={showPassword ? "text" : "password"}
          />
          <span
            className={styles.hidePasswordBtn}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
          </span>
        </div>
      );
    case "input":
      return props.error ? (
        <div className="d-flex flex-column">
          <input
            id={props.name}
            {...props}
            style={{ borderColor: "var(--danger)" }}
          />
          <span className={styles.errorText}>{props.error}</span>
        </div>
      ) : (
        <input id={props.name} {...props} />
      );
  }
};
