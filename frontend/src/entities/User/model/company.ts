import { t } from "i18next";
import toast from "react-hot-toast";
import { attach, createEvent, Effect } from "effector";
import { apiRequestFx, RequestParams } from "~/shared/api";
import { isValidEmail } from "~/shared/lib";
import {
  CustomerCompany,
  CustomerManager,
  getRole,
  TransporterCompany,
  TransporterManager,
} from "..";
import { $mainData, editUserFx, setMainData, TMainData } from ".";

export const editDetails = createEvent<{ details: string }>();
editDetails.watch(({ details }) => {
  const state = $mainData.getState();
  if (!(state && "company_name" in state)) return;
  const data = {
    email: state?.user.email,
    full_name: state?.user.full_name,
    company_name: state?.company_name,
    details,
  };
  toast.promise(editUserFx(data), {
    loading: t("editDetails.loading"),
    success: () => {
      setMainData({ ...state, details } as TMainData);
      return t("editDetails.success");
    },
    error: (err) => t("common.errorMessage", { err }),
  });
});

const changeSubscriptionFx: Effect<
  { subscription_id: number },
  CustomerCompany | TransporterCompany
> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/user/common/change_subscription/",
    data,
  }),
});

export const changeSubscription = createEvent<{ subscription_id: number }>();
changeSubscription.watch((data) => {
  toast.promise(changeSubscriptionFx(data), {
    loading: t("changeSubscription.loading"),
    success: (newMainData) => {
      setMainData(newMainData);
      return t("changeSubscription.success");
    },
    error: (err) => {
      if (typeof err === "string") {
        if (err === "subscription does not exist")
          return t("changeSubscription.subscriptionNotExists");
        else if (err === "Only company accounts can change subscription")
          return t("changeSubscription.onlyCompanyCanChange");
        else if (err.startsWith("insufficient_funds")) {
          let summa = err.split(":")[1];
          summa = summa.includes(".")
            ? summa.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "")
            : summa;
          return t("changeSubscription.insufficient_funds", { summa });
        }
      }
      return t("common.errorMessage", { err });
    },
  });
});

type EditManagerRequest = {
  manager_id: number;
  email: string;
  full_name: string;
};

const editManagerFx: Effect<
  EditManagerRequest,
  TransporterManager | CustomerManager
> = attach({
  effect: apiRequestFx,
  mapParams: (data): RequestParams => ({
    method: "post",
    url: "/user/common/edit_manager/",
    data,
  }),
});

export const editManager = createEvent<EditManagerRequest>();
editManager.watch((data) => {
  if (!isValidEmail(data.email)) {
    toast.error(t("common.notValidEmail"));
    return;
  }
  const state = $mainData.getState();
  let manager;
  if (getRole(state?.user.user_type ?? "") === "customer")
    manager = (state as CustomerCompany).managers.find(
      (m) => m.customer_manager_id === data.manager_id
    );
  else
    manager = (state as TransporterCompany).managers.find(
      (m) => m.transporter_manager_id === data.manager_id
    );
  if (!manager) {
    toast.error(t("editManager.managerNotFound"));
    return;
  }
  if (
    data.email === manager.user.email &&
    data.full_name === manager.user.full_name
  ) {
    toast.error(t("common.youDidNotChangeAnyField"));
    return;
  }
  toast.promise(editManagerFx(data), {
    loading: t("editManager.loading"),
    success: (newManager) => {
      const prevState = $mainData.getState() as
        | CustomerCompany
        | TransporterCompany;
      if (prevState) {
        const managers = prevState.managers.map((m) => {
          if ("customer_manager_id" in m)
            return m.customer_manager_id === data.manager_id ? newManager : m;
          else
            return m.transporter_manager_id === data.manager_id
              ? newManager
              : m;
        });
        const newState = { ...prevState, managers } as TMainData;
        setMainData(newState);
      }
      return t("editManager.success");
    },
    error: (err) => {
      if (err?.email) return t("common.wrongEmail");
      if (
        err?.manager_id &&
        err.manager_id ===
          "Manager with this id does not exist or does not belong to you"
      )
        return t("editManager.notExistOrNotBelongError");
      return t("common.errorMessage", { err });
    },
  });
});
