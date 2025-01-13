import { attach, createStore, Effect } from "effector";
import { apiRequestFx } from "~/shared/api";
import { TActivityType } from "./types";

export const $activityTypes = createStore<TActivityType[]>([]);

export const getActivityTypesFx: Effect<void, TActivityType[]> = attach({
  effect: apiRequestFx,
  mapParams: () => ({
    method: "get",
    url: "/api/activity-types/",
  }),
});
$activityTypes.on(getActivityTypesFx.doneData, (_, state) => state);
