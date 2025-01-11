import { InputHTMLAttributes, MutableRefObject, ReactNode } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useModalState } from "~/shared/lib";

type TextAreaProps = {
  variant: "textarea";
  label: ReactNode;
  place_horisontal?: boolean;
  textAreaRef?: MutableRefObject<HTMLTextAreaElement | null>;
} & InputHTMLAttributes<HTMLTextAreaElement>;

type InputProps = {
  variant: "checkbox" | "input" | "password-input";
  label?: ReactNode;
  hint?: string;
  place_horisontal?: boolean;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
} & InputHTMLAttributes<HTMLInputElement>;

export function BsInput({
  variant,
  label,
  place_horisontal,
  ...props
}: InputProps | TextAreaProps) {
  let input;
  props = props as InputProps;
  const { inputRef } = props;
  delete props.inputRef;

  switch (variant) {
    case "checkbox":
      input = (
        <input
          {...props}
          ref={inputRef}
          type="checkbox"
          className={`form-check-input mt-0 ms-2 ${props.className}`}
        />
      );
      if (!place_horisontal) input = <div className="form-check">{input}</div>;
      break;
    case "input":
      input = (
        <div>
          <input
            {...props}
            ref={inputRef}
            className={`form-control ${props.className}`}
          />
        </div>
      );
      break;
    case "textarea":
      props = props as InputHTMLAttributes<HTMLTextAreaElement>;
      const { textAreaRef } = props;
      delete props.textAreaRef;

      input = (
        <textarea
          {...props}
          ref={textAreaRef}
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
    <div
      className={`form-group ${
        place_horisontal && "d-flex align-items-center"
      }`}
    >
      {label && (
        <label
          htmlFor={props.id}
          className={`form-label ${place_horisontal && "d-inline mb-0"}`}
        >
          {label}
        </label>
      )}
      {input}
    </div>
  );
}
