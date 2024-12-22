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

export const dateToString = (date: string | Date) => {
  date = new Date(date);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const dateTimeToString = (datetime: string | Date) => {
  const date = new Date(datetime);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export function dateTimeWithWeekday(datetime: string | Date) {
  const months = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];
  const weekdays = ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Сбт"];

  const date = new Date(datetime);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const weekday = weekdays[date.getDay()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return (
    <time className="mb-0 text-capitalize">
      {month} {day}, {year}
      <span className="text-muted d-block">
        {weekday}, {hours}:{minutes}
      </span>
    </time>
  );
}
