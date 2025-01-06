import toast from "react-hot-toast";
import { FormEvent } from "react";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { dateToString } from "~/shared/lib";
import { TActivity } from "./types";

export const getActivityText = (activity: TActivity) =>
  `${activity.group} ${activity.discipline} ${dateToString(
    activity.date
  )} ${activity.start_time.slice(0, 5)} ${activity.end_time.slice(0, 5)}`;

export const getActivitiesFx: Effect<void, TActivity[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/activities/",
  }),
});

export const $activities = createStore<TActivity[]>([]).on(
  getActivitiesFx.doneData,
  (_, state) => state
);

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
