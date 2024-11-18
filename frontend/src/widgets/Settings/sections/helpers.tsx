import { createEvent, createStore } from "effector";

export const fontSize = { fontSize: "1.4rem" };
export const iconStyle = { fontSize: "2.4rem", lineHeight: "2.4rem" };
export const btnStyle = { padding: "0.5rem 3rem", fontSize: "1.6rem" };
export const inputProps = {
  className: "w-100 py-3",
  labelStyle: {
    color: "var(--default-font-color)",
    fontSize: "1.4rem",
    marginBottom: "0.5rem",
  },
  containerStyle: { marginRight: 0, marginBottom: "1rem" },
};

export type TSection =
  | "main"
  | "company"
  | "security"
  | "subscriptions"
  | "managers"
  | "addManager"
  | "editManager";

type TManager = { manager_id: number; full_name: string; email: string };

export const setSelectedManager = createEvent<TManager | null>();
export const $selectedManager = createStore<TManager | null>(null).on(
  setSelectedManager,
  (_, state) => state
);
