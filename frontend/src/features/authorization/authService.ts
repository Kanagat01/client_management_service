import axios from "axios";
import toast from "react-hot-toast";
import { createEffect, createEvent } from "effector";
import { API_URL } from "~/shared/config";
import { setAuth } from "./authStore";

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = { token: string };

const loginFx = createEffect<LoginRequest, LoginResponse>(async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/login/`, data);
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          throw "Неверные учетные данные";
        case 403:
          throw "Доступ запрещен";
        case 404:
          throw "Пользователь не найден";
        case 500:
          throw "Серверная ошибка. Код 500";
      }
      switch (error.response?.data.message) {
        case "invalid_credentials":
          throw "Неверный логин или пароль";
      }
    }
    throw `Неизвестная ошибка: ${error}`;
  }
});

export const login = createEvent<LoginRequest & { navigateFunc: () => void }>();
login.watch(({ navigateFunc, ...data }) => {
  toast.promise(loginFx(data), {
    loading: "Авторизуемся...",
    success: ({ token }) => {
      localStorage.setItem("token", token);
      setAuth(true);
      navigateFunc();
      return "Вы успешно авторизованы";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

export const logout = () => {
  localStorage.removeItem("token");
  setAuth(false);
};
