export const validateWhatsappNumber = (value: string): string => {
  const pattern = /^\+\d{10,15}$/;
  if (!pattern.test(value)) {
    return "Введите корректный номер WhatsApp (формат: +1234567890)";
  }
  return "";
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

export const getLocalISOTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const dateStringToIso = (input: string) => {
  // const input = "09-01-2025 18:00";
  const [day, month, yearAndTime] = input.split("-");
  const [year, time] = yearAndTime.split(" ");
  const [hour, minute] = time.split(":");
  const isoDate = new Date(
    `${year}-${month}-${day}T${hour}:${minute}`
  ).toISOString();
  return isoDate.slice(0, 16);
};
