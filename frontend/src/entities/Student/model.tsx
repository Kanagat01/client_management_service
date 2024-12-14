import toast from "react-hot-toast";
import { attach, createEvent, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TStudent } from "./types";

const createStudentFx: Effect<TStudent, string> = attach({
  effect: apiRequestFx,
  mapParams: (data: TStudent): RequestParams => ({
    method: "post",
    url: "/auction/customer/create_order/",
    data,
  }),
});

export const createStudent = createEvent<TStudent>();
createStudent.watch((data) => {
  toast.promise(createStudentFx(data), {
    loading: "Создаем студента...",
    success: "Студент создан успешно",
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
