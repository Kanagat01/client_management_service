import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { TInstructionForProctoring } from "~/entities/InstructionForProctoring";
import { apiRequestFx } from "~/shared/api";
import { TCode, TCreateCode } from "./types";

export const getCodesAndInstructionFx: Effect<
  void,
  {
    codes: TCode[];
    instruction_for_proctoring: TInstructionForProctoring | null;
  }
> = attach({
  effect: apiRequestFx,
  mapParams: () => ({
    method: "get",
    url: "/api/codes/",
  }),
});

export const setCodes = createEvent<TCode[]>();
export const $codes = createStore<TCode[]>([])
  .on(getCodesAndInstructionFx.doneData, (_, payload) => payload.codes)
  .on(setCodes, (_, state) => state);

// --------------------- CREATE CODE --------------------------
const createCodeFx: Effect<TCreateCode, TCode> = attach({
  effect: apiRequestFx,
  mapParams: (data) => ({
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
  mapParams: (id: number) => ({
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
