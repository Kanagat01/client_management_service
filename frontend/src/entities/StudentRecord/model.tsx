import { attach, createStore, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { TStudentRecord } from "./types";

export const $studentRecords = createStore<TStudentRecord[]>([]);

export const getStudentRecordsFx: Effect<void, TStudentRecord[]> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/api/student-records/",
  }),
});
$studentRecords.on(getStudentRecordsFx.doneData, (_, state) => state);
