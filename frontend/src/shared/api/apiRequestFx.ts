import { AxiosError, Method } from "axios";
import { createEffect } from "effector";
import { apiInstance } from ".";

export type RequestParams = {
  method: Method;
  url: string;
  data?: object;
  headers?: object;
};

export const apiRequestFx = createEffect<RequestParams, any, Error>(
  async (apiConfig) => {
    try {
      const response = await apiInstance(apiConfig);
      return response?.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status! > 499)
          throw `Серверная ошибка. Код ${error.response?.status}`;
        const data = error.response?.data;
        if (data && "detail" in data && !("message" in data)) {
          if (
            data.detail ===
            "У вас недостаточно прав для выполнения данного действия." // Джанго ошибка, не переводим
          ) {
            setTimeout(() => {
              window.location.reload();
            }, 5000);
            throw "У вас недостаточно прав для выполнения данного действия";
          }
          throw data.detail;
        }
        throw data?.message;
      } else {
        throw error;
      }
    }
  }
);
