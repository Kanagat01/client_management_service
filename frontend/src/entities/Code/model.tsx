import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TCode, TCreateCode } from "./types";
import toast from "react-hot-toast";

export const getCodesFx: Effect<void, TCode[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/codes/",
  }),
});

export const setCodes = createEvent<TCode[]>();
export const $codes = createStore<TCode[]>([])
  .on(getCodesFx.doneData, (_, state) => state)
  .on(setCodes, (_, state) => state);

// --------------------- CREATE CODE --------------------------
const createCodeFx: Effect<TCreateCode, TCode> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/api/codes/",
    data,
  }),
});

export const createCode = createEvent<
  TCreateCode & { changeShow?: () => void }
>();
createCode.watch(({ changeShow, ...data }) => {
  toast.promise(createCodeFx(data), {
    loading: "Создаем код для системы прокторинга...",
    success: (code) => {
      setCodes([...$codes.getState(), code]);
      if (changeShow) changeShow();
      return "Код для системы прокторинга успешно создан";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- DELETE CODE --------------------------
const deleteCodeFx: Effect<number, void> = attach({
  effect: apiRequestFx,
  mapParams: (id: number): RequestParams => ({
    method: "delete",
    url: `/api/codes/${id}/`,
  }),
});

export const deleteCode = createEvent<{ id: number; value: string }>();
deleteCode.watch(({ id, value }) => {
  toast.promise(deleteCodeFx(id), {
    loading: `Удаляем код "${value}"...`,
    success: () => {
      setCodes($codes.getState().filter((code) => code.id !== id));
      return `Код "${value}" удален`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
