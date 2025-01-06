import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TDiscipline } from "./types";

export const getDisciplinesFx: Effect<void, TDiscipline[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/disciplines/",
  }),
});

export const setDisciplines = createEvent<TDiscipline[]>();
export const $disciplines = createStore<TDiscipline[]>([])
  .on(getDisciplinesFx.doneData, (_, state) => state)
  .on(setDisciplines, (_, state) => state);

const createDisciplineFx: Effect<Omit<TDiscipline, "id">, TDiscipline> = attach(
  {
    effect: apiRequestFx,
    mapParams: (data): RequestParams => ({
      method: "post",
      url: "/api/disciplines/",
      data,
    }),
  }
);

export const createDiscipline = createEvent<
  Omit<TDiscipline, "id"> & { changeShow: () => void }
>();
createDiscipline.watch(({ changeShow, ...data }) => {
  toast.promise(createDisciplineFx(data), {
    loading: "Добавляем дисциплину...",
    success: (discipline) => {
      setDisciplines([...$disciplines.getState(), discipline]);
      changeShow();
      return "Дисциплина успешно добавлена";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
