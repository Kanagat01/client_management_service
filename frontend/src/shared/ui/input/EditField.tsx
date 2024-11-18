import { FC } from "react";
import { RenderInput } from "./RenderInput";
import { InputProps, TextAreaProps } from "./types";
import styles from "./styles.module.scss";

export const EditField: FC<InputProps | TextAreaProps> = (props) => {
  return (
    <div className={styles["edit-field"]}>
      <label htmlFor={props.name} style={props.labelStyle}>
        {props.label}
      </label>
      <RenderInput {...props} />
    </div>
  );
};
