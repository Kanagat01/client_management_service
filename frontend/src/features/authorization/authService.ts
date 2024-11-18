import axios from "axios";
import { t } from "i18next";
import toast from "react-hot-toast";
import { createEffect, createEvent } from "effector";
import { getMainDataFx, setMainData } from "~/entities/User";
import { API_URL } from "~/shared/config";
import { setAuth } from "./authStore";

type LoginRequest = {
  username: string;
  password: string;
};
type LoginResponse = { token: string };

const loginFx = createEffect<LoginRequest, LoginResponse>(async (data) => {
  try {
    const response = await axios.post(`${API_URL}/user/auth/login/`, data);
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          throw t("login.401");
        case 403:
          throw t("login.403");
        case 404:
          throw t("login.404");
        case 500:
          throw t("common.serverError", { code: 500 });
      }
      switch (error.response?.data.message) {
        case "invalid_credentials":
          throw t("login.invalidCredentials");
      }
    }
    throw t("common.unknownError", { error });
  }
});

export const login = createEvent<LoginRequest & { navigateFunc: () => void }>();
login.watch(({ navigateFunc, ...data }) => {
  toast.promise(loginFx(data), {
    loading: t("login.loading"),
    success: ({ token }) => {
      localStorage.setItem("token", token);
      setAuth(true);
      getMainDataFx();
      navigateFunc();
      return t("login.success");
    },
    error: (err) => t("common.errorMessage", { err }),
  });
});

export const logout = () => {
  localStorage.removeItem("token");
  setMainData(null);
  setAuth(false);
};
