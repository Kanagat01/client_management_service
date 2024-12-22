import { attach, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TGroup } from "./types";

export const $groups = createStore<TGroup[]>([]);

export const getGroupsFx: Effect<void, TGroup[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/groups/",
  }),
});
$groups.on(getGroupsFx.doneData, (_, state) => state);
