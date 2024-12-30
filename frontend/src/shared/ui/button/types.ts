import { ButtonHTMLAttributes, ReactNode } from "react";

export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type BtnWithConfirmation = {
  title?: string;
  content: string;
  onConfirm: () => void;
};

export type CreateOrEditBtnProps = {
  title: string;
  inputs: ReactNode;
  variant: "add" | "create" | "edit";
  onSubmit: () => void;
  onReset: () => void;
};
