import toast from "react-hot-toast";
import { createStore, createEvent, Effect, attach } from "effector";
import { getCodesAndInstructionFx } from "~/entities/Code";
import { apiRequestFx } from "~/shared/api";
import { TInstructionForProctoring } from "./types";

export const setInstruction = createEvent<TInstructionForProctoring>();
export const $instructionForProctoring = createStore<TInstructionForProctoring>(
  {}
)
  .on(
    getCodesAndInstructionFx.doneData,
    (_, payload) => payload.instruction_for_proctoring ?? {}
  )
  .on(setInstruction, (_, state) => state);

const validateInstruction = (data: TInstructionForProctoring) => {
  const formData = new FormData();
  if (data.text !== undefined) formData.append("text", data.text || "");
  if (data.video !== undefined) formData.append("video", data.video || "");
  if (data.file !== undefined) formData.append("file", data.file || "");
  return formData;
};

// --------------------- CREATE INSTRUCTION --------------------------
const createInstructionFx: Effect<FormData, TInstructionForProctoring> = attach(
  {
    effect: apiRequestFx,
    mapParams: (data: FormData) => ({
      method: "post",
      url: "/api/instruction-for-proctoring/",
      data,
    }),
  }
);

export const createInstruction = ({
  changeShow,
  ...data
}: TInstructionForProctoring & { changeShow: () => void }) => {
  const formData = validateInstruction(data);

  toast.promise(createInstructionFx(formData), {
    loading: "Создаем инструкцию для прокторинга...",
    success: (instruction) => {
      setInstruction(instruction);
      changeShow();
      return "Инструкция для прокторинга успешно создана";
    },
    error: (error) => {
      if (error.video || error.file) {
        let message = "";
        if (error.video) message = error.video[0];
        if (error.file)
          message = message === "" ? error.file[0] : `\n${error.file[0]}`;
        return message;
      }
      return `Произошла ошибка: ${error}`;
    },
  });
};

// --------------------- PARTIAL UPDATE INSTRUCTION --------------------------
const partialUpdateInstructionFx: Effect<
  { id: number; formData: FormData },
  TInstructionForProctoring
> = attach({
  effect: apiRequestFx,
  mapParams: ({ id, formData }) => ({
    method: "patch",
    url: `/api/instruction-for-proctoring/${id}/`,
    data: formData,
  }),
});

export const partialUpdateInstruction = ({
  changeShow,
  ...data
}: TInstructionForProctoring & { id: number; changeShow: () => void }) => {
  const formData = validateInstruction(data);

  toast.promise(partialUpdateInstructionFx({ id: data.id, formData }), {
    loading: "Обновляем инструкцию для прокторинга...",
    success: (instruction) => {
      setInstruction(instruction);
      changeShow();
      return "Инструкция для прокторинга успешно обновлена";
    },
    error: (error) => {
      if (error.video || error.file) {
        let message = "";
        if (error.video) message = error.video[0];
        if (error.file)
          message = message === "" ? error.file[0] : `\n${error.file[0]}`;
        return message;
      }
      return `Произошла ошибка: ${error}`;
    },
  });
};
