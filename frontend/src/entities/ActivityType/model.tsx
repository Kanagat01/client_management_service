import { attach, createStore, Effect } from "effector";
import { TActivityType } from "./types";
import { apiRequestFx, RequestParams } from "~/shared/api";

export const $activityTypes = createStore<TActivityType[]>([]);

export const getActivityTypesFx: Effect<void, TActivityType[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/activity-types/",
  }),
});
$activityTypes.on(getActivityTypesFx.doneData, (_, state) => state);
