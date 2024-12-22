import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TStudent } from "./types";

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
const createStudentFx: Effect<TStudent, TStudent> = attach({
  effect: apiRequestFx,
  mapParams: (data: TStudent): RequestParams => ({
    method: "post",
    url: "/api/students/",
    data,
  }),
});

export const createStudent = createEvent<TStudent>();
createStudent.watch((data) => {
  toast.promise(createStudentFx(data), {
    loading: "Создаем студента...",
    success: (student) => {
      setStudents([...$students.getState(), student]);
      return "Студент создан успешно";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- EDIT STUDENT --------------------------
const editStudentFx: Effect<TStudent, void> = attach({
  effect: apiRequestFx,
  mapParams: (data: TStudent): RequestParams => ({
    method: "get",
    url: "/api/delete_all_students/",
    data,
  }),
});

export const editStudent = createEvent<TStudent>();
editStudent.watch((data) => {
  toast.promise(editStudentFx(data), {
    loading: "Очищаем все данные о студентах...",
    success: () => {
      setStudents([]);
      return "Все данные очищены";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- DELETE STUDENT --------------------------
const deleteStudentFx: Effect<void, string> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/delete_all_students/",
  }),
});

export const deleteStudent = createEvent();
deleteStudent.watch(() => {
  toast.promise(deleteStudentFx(), {
    loading: "Удаляем данные о студенте...",
    success: () => {
      setStudents([]);
      return "Все данные очищены";
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
    loading: "Очищаем все данные о студентах...",
    success: () => {
      setStudents([]);
      return "Все данные очищены";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
