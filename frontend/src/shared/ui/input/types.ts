import { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

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
  };
