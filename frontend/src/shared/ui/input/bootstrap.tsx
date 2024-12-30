import { InputHTMLAttributes } from "react";

type BsInputProps = {
  variant: "checkbox" | "input" | "textarea";
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function BsInput({ variant, label, ...props }: BsInputProps) {
  let input;
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
        <textarea className={`form-control ${props.className}`}></textarea>
      );
      break;
  }
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={props.id}>
        {label}
      </label>
      {input}
    </div>
  );
}
