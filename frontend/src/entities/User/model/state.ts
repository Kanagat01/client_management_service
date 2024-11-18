import { createStore, createEffect, createEvent } from "effector";
import { apiInstance } from "~/shared/api";
import {
  TSettings,
  TUserType,
  CustomerCompany,
  CustomerManager,
  TransporterCompany,
  TransporterManager,
} from "../types";

export type TMainData =
  | CustomerCompany
  | CustomerManager
  | TransporterCompany
  | TransporterManager;

export const getMainDataFx = createEffect<void, TMainData>(async () => {
  try {
    const response = await apiInstance.get("/user/common/get_user/");
    return response.data.message;
  } catch (error) {
    console.error(error);
  }
});

export const updateBalance = createEvent<number>();
export const setMainData = createEvent<TMainData | null>();
export const $mainData = createStore<TMainData | null>(null)
  .on(getMainDataFx.doneData, (_, payload) => payload)
  .on(setMainData, (_, newState) => newState)
  .on(updateBalance, (state, newBalance) => {
    if (!state) return null;

    let newState = state;
    if ("balance" in state) newState = { ...state, balance: newBalance };
    else
      newState = {
        ...state,
        company: { ...state.company, balance: newBalance },
      } as TMainData;
    return newState;
  });

export const $userType = createStore<TUserType | "">("").on(
  $mainData,
  (_, state) => state?.user.user_type ?? ""
);

const getSettingsFx = createEffect<void, TSettings>(async () => {
  try {
    const response = await apiInstance.get("user/common/get_settings/");
    return response.data.message;
  } catch (err) {
    console.error(err);
  }
});
getSettingsFx();

export const $settings = createStore<TSettings | null>(null).on(
  getSettingsFx.doneData,
  (_, _payload) => _payload
);
