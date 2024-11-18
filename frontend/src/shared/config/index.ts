/**
 * Модуль инициализации env-переменных
 * @remark Если не найдено значение хоть одной переменной,
 * Приложение сразу выбросит ошибку, при инициализации модуля
 * @module
 */

/**
 * Получение env-переменной
 * @throwable
 */
const getEnvVar = (key: string) => {
  if (import.meta.env[key] === undefined) {
    throw new Error(`Env variable ${key} is required`);
  }
  return import.meta.env[key] || "";
};

/** API entrypoint */
export let API_URL: string;

/** Режим запуска программы */
export const NODE_ENV = getEnvVar("VITE_NODE_ENV");
export const YANDEX_MAPS_API_KEY = getEnvVar("VITE_YANDEX_MAPS_API_KEY");

if (NODE_ENV === "development") {
  /** Режим разработки */
  API_URL = getEnvVar("VITE_DEVELOPMENT_API_URL");
} else {
  /** Режим продакшена */
  API_URL = getEnvVar("VITE_PRODUCTION_API_URL");
}
