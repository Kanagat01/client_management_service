import { InputHTMLAttributes, ReactNode } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useModalState } from "~/shared/lib";

type TextAreaProps = {
  variant: "textarea";
  label: ReactNode;
} & InputHTMLAttributes<HTMLTextAreaElement>;

type InputProps = {
  variant: "checkbox" | "input" | "password-input";
  label?: ReactNode;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function BsInput({
  variant,
  label,
  ...props
}: InputProps | TextAreaProps) {
  let input;
  props = props as InputHTMLAttributes<HTMLInputElement>;
  switch (variant) {
    case "checkbox":
      input = (
        <div className="form-check">
          <input {...props} type="checkbox" className="form-check-input" />
        </div>
      );
      break;
    case "input":
      input = (
        <div>
          <input {...props} className="form-control" />
        </div>
      );
      break;
    case "textarea":
      input = (
        <textarea
          {...(props as InputHTMLAttributes<HTMLTextAreaElement>)}
          className={`form-control ${props.className}`}
        ></textarea>
      );
      break;
    case "password-input":
      const [show, changeShow] = useModalState(false);
      input = (
        <>
          <div className="input-icon">
            <input
              {...props}
              className={`form-control ${props.className}`}
              type={show ? "text" : "password"}
              autoComplete="off"
            />
            <div className="input-icon-addon cursor" onClick={changeShow}>
              <span className={show ? "none" : ""}>
                <BsEye />
              </span>

              <span className={!show ? "none" : ""}>
                <BsEyeSlash />
              </span>
            </div>
          </div>

          {props.hint && (
            <small className="form-text text-muted">{props.hint}</small>
          )}
        </>
      );
      break;
  }
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      {input}
    </div>
  );
}
