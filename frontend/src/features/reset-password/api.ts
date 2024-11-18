import { t } from "i18next";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { createEffect, createEvent } from "effector";
import { setAuth } from "~/features/authorization";
import { isValidEmail, validatePassword } from "~/shared/lib";
import { API_URL } from "~/shared/config";
import Routes from "~/shared/routes";
import {
  ForgotPasswordRequest,
  ResetPasswordConfirmRequest,
  ResetPasswordConfirmResponse,
} from ".";

const forgotPasswordFx = createEffect<ForgotPasswordRequest, string>(
  async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/user/auth/reset_password/`,
        data
      );
      return response.data.message;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status! > 499)
          throw t("common.serverError", { code: error.response?.status });

        const { message } = error.response?.data;
        if (message) {
          if (typeof message === "object" && message.email)
            throw t("forgotPassword.enterCorrectEmail");
          else if (typeof message === "string" && message === "user_not_found")
            throw t("forgotPassword.userNotFound");
          throw message;
        }
      }
      throw t("common.unknownError", { error });
    }
  }
);

export const forgotPassword = createEvent<
  ForgotPasswordRequest & { setSuccess: (state: boolean) => void }
>();
forgotPassword.watch(({ email, setSuccess }) => {
  if (!isValidEmail(email)) {
    toast.error(t("common.notValidEmail"));
    return;
  }
  toast.promise(forgotPasswordFx({ email }), {
    loading: t("forgotPassword.loading"),
    success: () => {
      setSuccess(true);
      return t("forgotPassword.success");
    },
    error: (err) => t("common.errorMessage", { err }),
  });
});

const resetPasswordConfirmFx = createEffect<
  ResetPasswordConfirmRequest,
  ResetPasswordConfirmResponse
>(async ({ token, setIsValidToken, ...data }) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/auth/reset_password_confirm/${token}/`,
      data
    );
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status! > 499)
        throw t("common.serverError", { code: error.response?.status });

      const { message } = error.response?.data;
      if (message) {
        if (typeof message === "string") {
          switch (message) {
            case "invalid_token":
              setIsValidToken(false);
              throw t("resetPassword.invalidToken");
            case "token_expired":
              setIsValidToken(false);
              throw t("resetPassword.tokenExpired");
            case "user_not_found":
              throw t("login.404");
          }
        } else if (typeof message === "object") {
          if (
            "non_field_errors" in message &&
            (message.non_field_errors as Array<string>).includes(
              "passwords_do_not_match"
            )
          )
            throw t("changePassword.passwordsDoNotMatch");
        }
        throw message;
      }
    }
    throw t("common.unknownError", { error });
  }
});

export const resetPasswordConfirm = createEvent<
  ResetPasswordConfirmRequest & { navigate: (to: string) => void }
>();
resetPasswordConfirm.watch(({ navigate, ...data }) => {
  if (data.new_password !== data.confirm_password) {
    toast.error(t("changePassword.passwordsDoNotMatch"));
    return;
  }

  const passwordError = validatePassword(data.new_password);
  if (passwordError !== "") {
    toast.error(passwordError);
    return;
  }

  toast.promise(resetPasswordConfirmFx(data), {
    loading: t("resetPassword.loading"),
    success: ({ token }) => {
      localStorage.setItem("token", token);
      setAuth(true);
      navigate(Routes.HOME);
      return t("resetPassword.success");
    },
    error: (err) => t("common.errorMessage", { err }),
  });
});
