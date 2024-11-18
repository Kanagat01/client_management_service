import { t } from "i18next";
import toast from "react-hot-toast";
import { attach, createEvent, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { validatePassword } from "~/shared/lib";
import { ChangePasswordRequest, ChangePasswordResponse } from "./types";

const changePasswordFx: Effect<ChangePasswordRequest, ChangePasswordResponse> =
  attach({
    effect: apiRequestFx,
    mapParams: (data: ChangePasswordRequest): RequestParams => ({
      method: "post",
      url: "/user/common/change_password/",
      data,
    }),
  });

export const changePassword = createEvent<
  ChangePasswordRequest & { onSuccess: () => void }
>();
changePassword.watch(({ onSuccess, ...data }) => {
  const passwordValidation = validatePassword(data.new_password);
  if (passwordValidation !== "") {
    toast.error(passwordValidation);
    return;
  } else if (data.new_password !== data.repeat_password) {
    toast.error(t("changePassword.passwordsDoNotMatch"));
    return;
  }
  toast.promise(changePasswordFx(data), {
    loading: t("changePassword.loading"),
    success: ({ token }) => {
      localStorage.setItem("token", token);
      onSuccess();
      return t("changePassword.success");
    },
    error: (err) => {
      if (err === "wrong_password") return t("changePassword.wrongPassword");
      else if (err === "passwords_do_not_match")
        return t("changePassword.passwordsDoNotMatch");
      return t("common.errorMessage", { err });
    },
  });
});
