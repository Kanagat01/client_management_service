import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx } from "~/shared/api";
import { dateToString } from "~/shared/lib";
import { TActivity, TEditActivity } from "./types";

export const getActivityText = (activity: TActivity) =>
  `${activity.group} ${activity.discipline} ${dateToString(activity.date)} ${
    activity.start_time
  } ${activity.end_time}`;

export const getActivitiesFx: Effect<void, TActivity[]> = attach({
  effect: apiRequestFx,
  mapParams: () => ({
    method: "get",
    url: "/api/activities/",
  }),
});

export const setActivities = createEvent<TActivity[]>();
export const $activities = createStore<TActivity[]>([])
  .on(getActivitiesFx.doneData, (_, state) => state)
  .on(setActivities, (_, state) => state);

// --------------------- UPDATE ACTIVITY --------------------------
const updateActivityFx: Effect<TEditActivity, TActivity> = attach({
  effect: apiRequestFx,
  mapParams: (data: TEditActivity) => ({
    method: "put",
    url: `/api/activities/${data.id}/`,
    data,
  }),
});

export const updateActivity = createEvent<
  TEditActivity & { changeShow: () => void }
>();
updateActivity.watch(({ changeShow, ...data }) => {
  toast.promise(updateActivityFx(data), {
    loading: `Обновляем активность #${data.id}...`,
    success: (activity) => {
      setActivities(
        $activities
          .getState()
          .map((el) => (el.id === activity.id ? activity : el))
      );
      changeShow();
      return `Активность #${data.id} обновлена`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
