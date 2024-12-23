import toast from "react-hot-toast";
import { attach, createEvent, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { $fileForImport } from "~/shared/ui";

type TImportData = { url: string; data: FormData };

const importDataFx: Effect<TImportData, { message: string }> = attach({
  effect: apiRequestFx,
  mapParams: ({ url, data }: TImportData): RequestParams => ({
    method: "post",
    url,
    data,
    headers: { "Content-Type": "multipart/form-data" },
  }),
});

export const importCodes = createEvent<{ url: string }>();
importCodes.watch(({ url }) => {
  const file = $fileForImport.getState();
  if (!file) {
    toast.error("Выберите файл");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  toast.promise(importDataFx({ url, data: formData }), {
    loading: "Импортируем данные",
    success: (response) => response.message,
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
