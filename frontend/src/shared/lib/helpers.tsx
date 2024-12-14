import { ChangeEvent } from "react";

export const formatPhoneInput = (event: ChangeEvent<HTMLInputElement>) => {
  const input = event.target;
  const value = input.value.replace(/\D/g, "");
  let formattedValue = "+7 ";

  if (value.length > 1) formattedValue += "(" + value.slice(1, 4);
  if (value.length > 4) formattedValue += ") " + value.slice(4, 7);
  if (value.length > 7) formattedValue += "-" + value.slice(7, 9);
  if (value.length > 9) formattedValue += "-" + value.slice(9, 11);

  input.value = formattedValue;
};

export const validatePassword = (password: string): string => {
  if (password.length < 8) return "Пароль должен быть не менее 8 символов";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    return "Пароль должен состоять из больших и маленьких букв";
  }
  if (!/\d/.test(password)) return "Пароль должен содержать хотя бы одну цифру";
  return "";
};

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const dateTimeToString = (datetime: string | Date) => {
  return new Date(datetime).toLocaleDateString("ru", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
