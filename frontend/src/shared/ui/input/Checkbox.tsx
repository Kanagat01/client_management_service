import { CSSProperties, FC, InputHTMLAttributes, ReactNode } from "react";
import styles from "./styles.module.scss";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  labelStyle?: CSSProperties;
};

export const Checkbox: FC<CheckboxProps> = ({ labelStyle, ...props }) => {
  return props.label ? (
    <label className="d-flex align-items-center" style={labelStyle}>
      <input
        {...props}
        className={`${styles.checkbox} ${props.className}`}
        type="checkbox"
      />
      {props.label}
    </label>
  ) : (
    <input
      {...props}
      className={`${styles.checkbox} ${props.className}`}
      type="checkbox"
    />
  );
};
