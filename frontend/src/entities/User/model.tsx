import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx } from "~/shared/api";
import { TChangePassword, TUser } from "./types";

export const getUserProfileFx: Effect<void, { message: TUser }> = attach({
  effect: apiRequestFx,
  mapParams: () => ({
    method: "get",
    url: "/api/user_profile/",
  }),
});

export const setUserProfile = createEvent<TUser | null>();
export const $userProfile = createStore<TUser | null>(null)
  .on(getUserProfileFx.doneData, (_, response) => response.message)
  .on(setUserProfile, (_, state) => state);

// --------------------- UPDATE USER PROFILE --------------------------
const updateUserProfileFx: Effect<TUser, { message: TUser }> = attach({
  effect: apiRequestFx,
  mapParams: (data: TUser) => ({
    method: "put",
    url: "/api/user_profile/",
    data,
  }),
});

export const updateUserProfile = createEvent<TUser>();
updateUserProfile.watch((data) => {
  toast.promise(updateUserProfileFx(data), {
    loading: "Обновляем данные пользователя...",
    success: ({ message: user }) => {
      setUserProfile(user);
      return "Данные пользователя обновлены";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- CHANGE PASSWORD --------------------------
const changePasswordFx: Effect<
  TChangePassword,
  { message: { token: string } }
> = attach({
  effect: apiRequestFx,
  mapParams: (data: TChangePassword) => ({
    method: "post",
    url: "/api/change_password/",
    data,
  }),
});

export const changePassword = createEvent<TChangePassword>();
changePassword.watch((data) => {
  toast.promise(changePasswordFx(data), {
    loading: "Обновляем пароль...",
    success: ({ message: { token } }) => {
      localStorage.setItem("token", token);
      return "Пароль обновлен";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
