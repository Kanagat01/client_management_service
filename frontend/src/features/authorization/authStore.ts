import { createEvent, createStore } from "effector";

export const setAuth = createEvent<boolean>();

export const $isAuthenticated = createStore<boolean>(
  Boolean(localStorage.getItem("token"))
).on(setAuth, (_, payload) => payload);
