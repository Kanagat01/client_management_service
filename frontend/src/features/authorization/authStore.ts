import { createEvent, createStore } from "effector";
import { getMainDataFx } from "~/entities/User";

export const setAuth = createEvent<boolean>();

export const $isAuthenticated = createStore<boolean>(
  Boolean(localStorage.getItem("token"))
).on(setAuth, (_, payload) => payload);

$isAuthenticated.watch((state) => {
  if (state) getMainDataFx();
});
