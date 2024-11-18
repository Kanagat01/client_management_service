import { FC, InputHTMLAttributes, ReactNode, useState } from "react";
import { Form, FormSelectProps } from "react-bootstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const RoundedInput: FC<InputProps> = (props) => {
  return (
    <div className={styles["rounded-input"]}>
      <input type="text" {...props} />
    </div>
  );
};

const RoundedSelect: FC<
  FormSelectProps & {
    options: Array<[string | number, string | number]>;
  }
> = (props) => {
  return (
    <div className={styles["rounded-input"]}>
      <Form.Select {...props}>
        {props.options.map(([value, option]) => (
          <option key={value} value={value}>
            {option}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

const PasswordInput: FC<InputProps> = (props) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={styles["password-input-container"]}>
      <RoundedInput
        placeholder={t("login.inputPlaceholders.password")}
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <span
        className={styles.hidePasswordBtn}
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        {showPassword ? <BsEyeSlash /> : <BsEye />}
      </span>
    </div>
  );
};

export const RoundedInputGroup: FC<{ children: ReactNode }> & {
  Input: typeof RoundedInput;
  Select: typeof RoundedSelect;
  PasswordInput: typeof PasswordInput;
} = ({ children }) => {
  return <div className={styles["input-group"]}>{children}</div>;
};

RoundedInputGroup.Input = RoundedInput;
RoundedInputGroup.Select = RoundedSelect;
RoundedInputGroup.PasswordInput = PasswordInput;
