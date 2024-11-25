import { FC, InputHTMLAttributes } from "react";
import styles from "./style.module.scss";

export const Checkbox: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <label className="checkbox">
    <input {...props} className={styles.input} type="checkbox" />
    <span className="checkbox__box"></span>
  </label>
);
