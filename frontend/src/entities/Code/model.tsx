import { attach, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TCode } from "./types";

export const $codes = createStore<TCode[]>([]);

export const getCodesFx: Effect<void, TCode[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/codes/",
  }),
});
$codes.on(getCodesFx.doneData, (_, state) => state);
