import { attach, createEvent, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TMessage } from "./types";
import toast from "react-hot-toast";

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

const createMessageFx: Effect<
  Omit<TMessage, "id" | "is_sent">,
  TMessage
> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/api/messages/",
    data,
  }),
});

export const createMessage = createEvent<
  Omit<TMessage, "id" | "is_sent"> & { onReset: () => void }
>();
createMessage.watch(({ onReset, ...data }) => {
  toast.promise(createMessageFx(data), {
    loading: "Добавляем рассылку...",
    success: (message) => {
      setMessages([...$messages.getState(), message]);
      onReset();
      return "Рассылка успешно создана";
    },
    error: (err) => `Произошла ошибка: ${err}`,
  });
});
