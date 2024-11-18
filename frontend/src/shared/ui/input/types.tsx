import {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { FormSelectProps } from "react-bootstrap";

export type BaseProp = {
  name: string;
  label?: ReactNode;
  labelStyle?: CSSProperties;
  containerStyle?: CSSProperties;
};

export type InputProps = BaseProp &
  InputHTMLAttributes<HTMLInputElement> & {
    variant: "input" | "password-input";
    error?: string;
    ref?: RefObject<HTMLInputElement>;
  };

export type TextAreaProps = BaseProp &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    variant: "textarea";
  };

export type SelectProps = BaseProp &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: Array<[string | number, string | number]>;
    variant: "select";
  };

export type BootstrapSelectProps = BaseProp &
  FormSelectProps & {
    options: Array<[string | number, string | number]>;
    variant: "bootstrap-select";
  };
