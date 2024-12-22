import { ButtonHTMLAttributes, ReactNode } from "react";

export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type BtnWithConfirmation = {
  title?: string;
  content: string;
  onConfirm: () => void;
};

export type BtnWithFormModal = {
  title: string;
  inputs: ReactNode;
  onSubmit: () => void;
  onReset: () => void;
};
