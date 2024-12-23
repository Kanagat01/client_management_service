import toast from "react-hot-toast";
import { FormEvent } from "react";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TActivity } from "./types";

export const $activities = createStore<TActivity[]>([]);

export const getActivitiesFx: Effect<void, TActivity[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/activities/",
  }),
});
$activities.on(getActivitiesFx.doneData, (_, state) => state);

export const setEditActivity = createEvent<TActivity | null>();
export const $editActivity = createStore<TActivity | null>(null).on(
  setEditActivity,
  (_, state) => state
);

const editActivityFx: Effect<TActivity, TActivity> = attach({
  effect: apiRequestFx,
  mapParams: (data: TActivity): RequestParams => ({
    method: "post",
    url: "/api/activities/",
    data,
  }),
});

export const editActivitySubmitted = createEvent<FormEvent>();
editActivitySubmitted.watch((e) => {
  e.preventDefault();
  const data = $editActivity.getState();
  if (!data) {
    return;
  }
  toast.promise(editActivityFx(data), {
    loading: `Обновляем активность #${data.id}...`,
    success: `Активность #${data.id} обновлена`,
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
