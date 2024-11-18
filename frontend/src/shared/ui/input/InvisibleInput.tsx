import { InputHTMLAttributes } from "react";
import styles from "./styles.module.scss";

export function InvisibleInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles["invisible-input"]} type="text" {...props} />;
}
