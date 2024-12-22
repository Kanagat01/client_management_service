import { attach, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TLog } from "./types";

export const $logs = createStore<TLog[]>([]);

export const getLogsFx: Effect<void, TLog[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/logs/",
  }),
});
$logs.on(getLogsFx.doneData, (_, state) => state);
