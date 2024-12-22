import { attach, createStore, Effect } from "effector";
import { TActivity } from "./types";
import { apiRequestFx, RequestParams } from "~/shared/api";

export const $activities = createStore<TActivity[]>([]);

export const getActivitiesFx: Effect<void, TActivity[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/activities/",
  }),
});
$activities.on(getActivitiesFx.doneData, (_, state) => state);
