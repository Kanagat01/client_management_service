import { Effect, attach } from "effector";
import { OrderModel } from "~/entities/Order";
import { $userType, getRole } from "~/entities/User";
import { RequestParams, apiRequestFx } from "~/shared/api";
import { DeleteDocumentRequest } from "./api_types";

// add document
export const addDocumentFx: Effect<FormData, OrderModel> = attach({
  effect: apiRequestFx,
  mapParams: (data: FormData): RequestParams => ({
    method: "post",
    url: `/auction/${getRole($userType.getState())}/add_document/`,
    data,
  }),
});

// delete document
export const deleteDocumentFx: Effect<DeleteDocumentRequest, string> = attach({
  effect: apiRequestFx,
  mapParams: (data: DeleteDocumentRequest): RequestParams => ({
    method: "post",
    url: "/auction/customer/delete_document/",
    data,
  }),
});
