import toast from "react-hot-toast";
import { createStore, createEvent, Effect, attach } from "effector";
import { getCodesAndInstructionFx } from "~/entities/Code";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TInstructionForProctoring } from "./types";

export const setInstruction = createEvent<TInstructionForProctoring | null>();
export const $instructionForProctoring =
  createStore<TInstructionForProctoring | null>(null)
    .on(
      getCodesAndInstructionFx.doneData,
      (_, payload) => payload.instruction_for_proctoring
    )
    .on(setInstruction, (_, state) => state);

// --------------------- CREATE OR UPDATE INSTRUCTION --------------------------
const createOrUpdateInstructionFx: Effect<FormData, TInstructionForProctoring> =
  attach({
    effect: apiRequestFx,
    mapParams: (data: FormData): RequestParams => ({
      method: "post",
      url: "/api/instruction-for-proctoring/",
      data,
    }),
  });

export const createOrUpdateInstruction = createEvent<
  TInstructionForProctoring & { changeShow: () => void }
>();
createOrUpdateInstruction.watch(({ changeShow, ...data }) => {
  const formData = new FormData();
  formData.append("text", data.text || "");
  if (data.file) formData.append("file", data.file);
  if (data.video) formData.append("video", data.video);

  toast.promise(createOrUpdateInstructionFx(formData), {
    loading: `${
      data.id ? "Обновляем" : "Создаем"
    } инструкцию для прокторинга...`,
    success: (instruction) => {
      setInstruction(instruction);
      changeShow();
      return `Инструкция для прокторинга успешно ${
        data.id ? "обновлена" : "создана"
      }`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
