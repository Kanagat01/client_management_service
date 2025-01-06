import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TGroup } from "./types";

export const getGroupsFx: Effect<void, TGroup[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/groups/",
  }),
});

export const setGroups = createEvent<TGroup[]>();
export const $groups = createStore<TGroup[]>([])
  .on(getGroupsFx.doneData, (_, state) => state)
  .on(setGroups, (_, state) => state);

const createGroupFx: Effect<{ code: string }, { message: TGroup }> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/api/groups/",
    data,
  }),
});

export const createGroup = createEvent<{
  code: string;
  changeShow: () => void;
}>();
createGroup.watch(({ changeShow, ...data }) => {
  toast.promise(createGroupFx(data), {
    loading: "Добавляем группу...",
    success: (response) => {
      setGroups([...$groups.getState(), response.message]);
      changeShow();
      return "Группа успешно добавлена";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
