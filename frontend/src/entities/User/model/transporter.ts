import { t } from "i18next";
import toast from "react-hot-toast";
import { createEvent, attach, Effect } from "effector";
import { RequestParams, apiRequestFx } from "~/shared/api";
import { CustomerCompany, TransporterCompany } from "../types";
import { $mainData, setMainData } from "./state";

export const getTransportersFx: Effect<
  void,
  Omit<TransporterCompany, "user" | "managers">[]
> = attach({
  effect: apiRequestFx,
  mapParams: (): RequestParams => ({
    method: "get",
    url: "/user/customer/get_transporter_companies/",
  }),
});

const addToAllowedFx: Effect<
  { transporter_company_id: number },
  Omit<TransporterCompany, "managers" | "user">
> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/user/customer/add_transporter_to_allowed_companies/",
    data,
  }),
});

export const addTransportToAllowed = createEvent<{
  transporter_company_id: number;
  onReset: () => void;
}>();
addTransportToAllowed.watch(({ transporter_company_id, onReset }) => {
  toast.promise(addToAllowedFx({ transporter_company_id }), {
    loading: t("addTransportToAllowed.loading"),
    success: (transporter) => {
      const prevState = $mainData.getState() as CustomerCompany;
      setMainData({
        ...prevState,
        allowed_transporter_companies: [
          ...prevState.allowed_transporter_companies,
          transporter,
        ],
      });
      onReset();
      return t("addTransportToAllowed.success", {
        id: transporter.transporter_company_id,
      });
    },
    error: (err) => t("common.errorMessage", { err }),
  });
});

const deleteFromAllowedFx: Effect<{ transporter_company_id: number }, string> =
  attach({
    effect: apiRequestFx,
    mapParams: (data): RequestParams => ({
      method: "post",
      url: "/user/customer/delete_transporter_from_allowed_companies/",
      data,
    }),
  });

export const deleteTransportFromAllowed = createEvent<number>();
deleteTransportFromAllowed.watch((transporter_company_id) => {
  deleteFromAllowedFx({ transporter_company_id });
});
