import toast from "react-hot-toast";
import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TCreateMessage, TMessage } from "./types";

export const getMessagesFx: Effect<void, TMessage[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/messages/",
  }),
});

export const setMessages = createEvent<TMessage[]>();
export const $messages = createStore<TMessage[]>([])
  .on(getMessagesFx.doneData, (_, state) => state)
  .on(setMessages, (_, state) => state);

// --------------------- CREATE MESSAGE --------------------------
const createMessageFx: Effect<TCreateMessage, TMessage> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/api/messages/",
    data,
  }),
});

export const createMessage = createEvent<
  TCreateMessage & { changeShow: () => void }
>();
createMessage.watch(({ changeShow, ...data }) => {
  toast.promise(createMessageFx(data), {
    loading: "Добавляем рассылку...",
    success: (message) => {
      setMessages([...$messages.getState(), message]);
      changeShow();
      return "Рассылка успешно создана";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});

// --------------------- DELETE MESSAGE --------------------------
const deleteMessageFx: Effect<number, void> = attach({
  effect: apiRequestFx,
  mapParams: (id): RequestParams => ({
    method: "delete",
    url: `/api/messages/${id}/`,
  }),
});

export const deleteMessage = createEvent<number>();
deleteMessage.watch((id) => {
  toast.promise(deleteMessageFx(id), {
    loading: `Удаляем рассылку #${id}...`,
    success: () => {
      setMessages($messages.getState().filter((el) => el.id !== id));
      return `Рассылка #${id} успешно удалена`;
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
