import { attach, createStore, Effect } from "effector";
import { TDiscipline } from "./types";
import { apiRequestFx, RequestParams } from "~/shared/api";

export const $disciplines = createStore<TDiscipline[]>([]);

export const getDisciplinesFx: Effect<void, TDiscipline[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/disciplines/",
  }),
});
$disciplines.on(getDisciplinesFx.doneData, (_, state) => state);
