import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TDiscount } from "./types";

export const getDiscountsFx: Effect<void, TDiscount[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/discounts/",
  }),
});

export const setDiscounts = createEvent<TDiscount[]>();
export const $discounts = createStore<TDiscount[]>([]).on(
  setDiscounts,
  (_, state) => state
);

// --------------------- CREATE DISCOUNT --------------------------
const createDiscountFx: Effect<Omit<TDiscount, "id">, TDiscount> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/api/discounts/",
    data,
  }),
});

export const createDiscount = createEvent<
  Omit<TDiscount, "id"> & { changeShow: () => void }
>();
createDiscount.watch(({ changeShow, ...data }) => {
  toast.promise(createDiscountFx(data), {
    loading: "Создаем акцию...",
    success: (discount) => {
      setDiscounts([...$discounts.getState(), discount]);
      changeShow();
      return "Акция успешно создана";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- UPDATE DISCOUNT --------------------------
const updateDiscountFx: Effect<TDiscount, TDiscount> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "put",
    url: `/api/discounts/${data.id}/`,
    data,
  }),
});

export const updateDiscount = createEvent<
  TDiscount & { changeShow: () => void }
>();
updateDiscount.watch(({ changeShow, ...data }) => {
  toast.promise(updateDiscountFx(data), {
    loading: `Обновляем акцию #${data.id}...`,
    success: (discount) => {
      setDiscounts(
        $discounts.getState().map((d) => (d.id === discount.id ? discount : d))
      );
      changeShow();
      return `Акция #${data.id} обновлена`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- DELETE DISCOUNT --------------------------
const deleteDiscountFx: Effect<number, void> = attach({
  effect: apiRequestFx,
  mapParams: (id: number): RequestParams => ({
    method: "delete",
    url: `/api/discounts/${id}/`,
  }),
});

export const deleteDiscount = createEvent<number>();
deleteDiscount.watch((id) => {
  toast.promise(deleteDiscountFx(id), {
    loading: `Удаляем акцию #${id}...`,
    success: () => {
      setDiscounts(
        $discounts.getState().filter((discount) => discount.id !== id)
      );
      return `Акция #${id} удалена`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
