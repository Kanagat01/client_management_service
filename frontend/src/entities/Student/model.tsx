import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TCreateStudent, TStudent } from "./types";
import { $groups } from "../Group";
import { validateWhatsappNumber } from "~/shared/lib";

export const getStudentsFx: Effect<void, TStudent[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/students/",
  }),
});

export const setStudents = createEvent<TStudent[]>();
export const $students = createStore<TStudent[]>([])
  .on(setStudents, (_, state) => state)
  .on(getStudentsFx.doneData, (_, state) => state);

// --------------------- CREATE STUDENT --------------------------
const createStudentFx: Effect<TCreateStudent, TStudent> = attach({
  effect: apiRequestFx,
  mapParams: (data: TCreateStudent): RequestParams => ({
    method: "post",
    url: "/api/students/",
    data,
  }),
});

export const createStudent = createEvent<
  TCreateStudent & { changeShow?: () => void }
>();
createStudent.watch(({ changeShow, ...data }) => {
  if (data.phone) {
    const validation = validateWhatsappNumber(data.phone);
    if (validation !== "") {
      toast.error(validation);
      return;
    }
  }
  toast.promise(createStudentFx(data), {
    loading: "Создаем студента...",
    success: (student) => {
      setStudents([...$students.getState(), student]);
      if (changeShow) changeShow();
      return "Студент создан успешно";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- EDIT STUDENT --------------------------
const editStudentFx: Effect<TStudent, TStudent> = attach({
  effect: apiRequestFx,
  mapParams: (data: TStudent): RequestParams => ({
    method: "put",
    url: `/api/students/${data.id}/`,
    data,
  }),
});

export const editStudent = createEvent<
  TStudent & {
    loading?: string;
    success?: string;
    changeShow?: () => void;
  }
>();
editStudent.watch(({ loading, success, changeShow, ...data }) => {
  if (data.phone) {
    const validation = validateWhatsappNumber(data.phone);
    if (validation !== "") {
      toast.error(validation);
      return;
    }
  }
  if (typeof data.group === "string") {
    const matchedGroup = $groups
      .getState()
      .find((group) => group.code === data.group);
    data.group = matchedGroup?.id || null;
  }
  toast.promise(editStudentFx(data), {
    loading: loading
      ? loading
      : `Обновляем данные о студенте "${data.full_name}"...`,
    success: (student) => {
      const state = $students.getState();
      setStudents(state.map((s) => (s.id === student.id ? student : s)));
      if (changeShow) changeShow();
      return success ? success : "Данные о студенте обновлены";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- DELETE STUDENT --------------------------
const deleteStudentFx: Effect<number, void> = attach({
  effect: apiRequestFx,
  mapParams: (id: number): RequestParams => ({
    method: "delete",
    url: `/api/students/${id}/`,
  }),
});

export const deleteStudent = createEvent<{ id: number; full_name: string }>();
deleteStudent.watch(({ id, full_name }) => {
  toast.promise(deleteStudentFx(id), {
    loading: `Удаляем данные о студенте "${full_name}"...`,
    success: () => {
      setStudents($students.getState().filter((student) => student.id !== id));
      return `Данные о студенте "${full_name}" удалены`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- DELETE ALL STUDENTS --------------------------
const deleteAllStudentsFx: Effect<void, string> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/delete_all_students/",
  }),
});

export const deleteAllStudents = createEvent();
deleteAllStudents.watch(() => {
  toast.promise(deleteAllStudentsFx(), {
    loading: "Очищаем данные о студентах...",
    success: () => {
      setStudents([]);
      return "Данные о студентах очищены";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
