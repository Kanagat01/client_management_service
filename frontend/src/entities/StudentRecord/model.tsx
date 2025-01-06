import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import {
  TCreateStudentRecord,
  TStudentRecord,
  TUpdateStudentRecord,
} from "./types";

export const getStudentRecordsFx: Effect<void, TStudentRecord[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/student-records/",
  }),
});

export const setStudentRecords = createEvent<TStudentRecord[]>();
export const $studentRecords = createStore<TStudentRecord[]>([])
  .on(getStudentRecordsFx.doneData, (_, state) => state)
  .on(setStudentRecords, (_, state) => state);

// --------------------- CREATE STUDENT RECORD --------------------------
const createStudentRecordFx: Effect<TCreateStudentRecord, TStudentRecord> =
  attach({
    effect: apiRequestFx,
    mapParams: (data): RequestParams => ({
      method: "post",
      url: "/api/student-records/",
      data,
    }),
  });

export const createStudentRecord = createEvent<
  TCreateStudentRecord & { changeShow: () => void }
>();
createStudentRecord.watch(({ changeShow, ...data }) => {
  toast.promise(createStudentRecordFx(data), {
    loading: "Создаем запись студента...",
    success: (record) => {
      setStudentRecords([...$studentRecords.getState(), record]);
      changeShow();
      return "Запись студента успешно создана";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- UPDATE STUDENT RECORD --------------------------
const updateStudentRecordFx: Effect<TUpdateStudentRecord, TStudentRecord> =
  attach({
    effect: apiRequestFx,
    mapParams: (data): RequestParams => ({
      method: "put",
      url: `/api/student-records/${data.id}/`,
      data,
    }),
  });

export const updateStudentRecord = createEvent<
  TUpdateStudentRecord & { changeShow: () => void }
>();
updateStudentRecord.watch(({ changeShow, ...data }) => {
  toast.promise(updateStudentRecordFx(data), {
    loading: `Обновляем запись студента #${data.id}...`,
    success: (record) => {
      const state = $studentRecords.getState();
      setStudentRecords(state.map((r) => (r.id === record.id ? record : r)));
      changeShow();
      return `Запись студента #${record.id} обновлена`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- DELETE STUDENT RECORD --------------------------
const deleteStudentRecordFx: Effect<number, void> = attach({
  effect: apiRequestFx,
  mapParams: (id: number): RequestParams => ({
    method: "delete",
    url: `/api/student-records/${id}/`,
  }),
});

export const deleteStudentRecord = createEvent<number>();
deleteStudentRecord.watch((id) => {
  toast.promise(deleteStudentRecordFx(id), {
    loading: `Удаляем запись #${id}...`,
    success: () => {
      setStudentRecords(
        $studentRecords.getState().filter((record) => record.id !== id)
      );
      return `Запись #${id} удалена`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
