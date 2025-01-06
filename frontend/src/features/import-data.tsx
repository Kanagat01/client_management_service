import toast from "react-hot-toast";
import { attach, createEvent, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { $fileForImport } from "~/shared/ui";

type TImportData = { url: string; data: FormData };
type TImportDataResponse = { message: unknown[] };

const importDataFx: Effect<TImportData, TImportDataResponse> = attach({
  effect: apiRequestFx,
  mapParams: ({ url, data }: TImportData): RequestParams => ({
    method: "post",
    url,
    data,
    headers: { "Content-Type": "multipart/form-data" },
  }),
});

export const importData = createEvent<{
  url: string;
  success: (response: TImportDataResponse) => string;
}>();
importData.watch(({ url, success }) => {
  const file = $fileForImport.getState();
  if (!file) {
    toast.error("Выберите файл");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  toast.promise(importDataFx({ url, data: formData }), {
    loading: "Импортируем данные...",
    success: success,
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
