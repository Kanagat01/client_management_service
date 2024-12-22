import { attach, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TMessage } from "./types";

export const $messages = createStore<TMessage[]>([]);

export const getMessagesFx: Effect<void, TMessage[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/messages/",
  }),
});
$messages.on(getMessagesFx.doneData, (_, state) => state);
