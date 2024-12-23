import { InputHTMLAttributes } from "react";

type TextInputProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ label, ...props }: TextInputProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={props.id}>
        {label}
      </label>
      <div>
        <input {...props} className="form-control" type="text" />
      </div>
    </div>
  );
}

type CheckboxProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function CheckBox({ label, ...props }: CheckboxProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={props.id}>
        {label}
      </label>
      <div className="form-check">
        <input {...props} type="checkbox" className="form-check-input" />
      </div>
    </div>
  );
}
