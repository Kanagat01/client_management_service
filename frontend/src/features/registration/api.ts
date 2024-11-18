import { t } from "i18next";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { attach, createEffect, createEvent, Effect } from "effector";
import { setAuth } from "~/features/authorization";
import {
  $mainData,
  setMainData,
  CustomerCompany,
  CustomerManager,
} from "~/entities/User";
import { API_URL } from "~/shared/config";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { isValidEmail, validatePassword } from "~/shared/lib";
import {
  RegisterCompanyRequest,
  RegisterManagerRequest,
  RegisterResponse,
} from ".";

// register company
const registerCompanyFx = createEffect<
  RegisterCompanyRequest,
  RegisterResponse
>(async ({ user_type, ...data }) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/auth/register_${user_type}/`,
      data
    );
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status! > 499)
        throw t("common.serverError", { code: error.response?.status });

      const { message } = error.response?.data;
      if (message) {
        if (message.email && message.email[0] === "user_already_exists")
          throw t("registration.userAlreadyExists");
        throw message;
      }
    }
    throw t("common.unknownError", { error });
  }
});

export const registerCompany = createEvent<
  RegisterCompanyRequest & { navigateFunc: () => void }
>();
registerCompany.watch(({ navigateFunc, ...data }) => {
  const errorsList: string[] = [];
  if (!isValidEmail(data.email)) errorsList.push(t("common.notValidEmail"));

  const passwordError = validatePassword(data.password);
  if (passwordError !== "") errorsList.push(passwordError);

  if (errorsList.length > 0) {
    toast.error(errorsList.join("\n"));
    return;
  }
  toast.promise(registerCompanyFx(data), {
    loading: t("registration.loadingCompany"),
    success: (message) => {
      localStorage.setItem("token", message.token);
      setAuth(true);
      navigateFunc();
      return t("registration.successCompany");
    },
    error: (err) => t("common.errorMessage", { err }),
  });
});

// register manager
const registerManagerFx: Effect<
  RegisterManagerRequest,
  Omit<CustomerManager, "company">
> = attach({
  effect: apiRequestFx,
  mapParams: (data: RegisterManagerRequest): RequestParams => ({
    method: "post",
    url: "/user/common/register_manager/",
    data,
  }),
});

export const registerManager = createEvent<
  RegisterManagerRequest & { repeat_password: string; onSuccess: () => void }
>();
registerManager.watch(({ repeat_password, onSuccess, ...data }) => {
  const passwordValidation = validatePassword(data.password);
  if (passwordValidation !== "") {
    toast.error(passwordValidation);
    return;
  } else if (data.password !== repeat_password) {
    toast.error(t("changePassword.passwordsDoNotMatch"));
    return;
  } else if (!isValidEmail(data.email)) {
    toast.error(t("common.notValidEmail"));
    return;
  }
  toast.promise(registerManagerFx(data), {
    loading: t("registration.loadingManager"),
    success: (manager) => {
      const prevState = $mainData.getState() as CustomerCompany;
      setMainData({ ...prevState, managers: [...prevState.managers, manager] });
      onSuccess();
      return t("registration.successManager");
    },
    error: (err) => {
      if (err?.email?.[0] === "user_already_exists")
        return t("registration.userAlreadyExists");
      return t("common.errorMessage", { err });
    },
  });
});
