import { FC } from "react";
import { RenderInput } from "./RenderInput";
import {
  BootstrapSelectProps,
  InputProps,
  SelectProps,
  TextAreaProps,
} from ".";
import styles from "./styles.module.scss";

export const InputContainer: FC<
  InputProps | TextAreaProps | SelectProps | BootstrapSelectProps
> = ({ label, labelStyle, containerStyle, ...props }) => {
  return (
    <div
      className={`${styles["input-container"]} position-relative`}
      style={containerStyle}
    >
      {label && (
        <label htmlFor={props.id ? props.id : props.name} style={labelStyle}>
          {label}
        </label>
      )}
      <RenderInput {...props} />
    </div>
  );
};
