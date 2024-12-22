import { InputProps } from "./types";
import { RenderInput } from "./render-input";
import styles from "./styles.module.scss";

export function InputContainer({
  label,
  labelStyle,
  containerStyle,
  ...props
}: InputProps) {
  return (
    <div
      className={`${styles.inputContainer} position-relative`}
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
}
