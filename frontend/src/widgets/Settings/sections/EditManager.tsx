import { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useUnit } from "effector-react";
import {
  $mainData,
  CustomerCompany,
  editManager,
  TransporterCompany,
} from "~/entities/User";
import { InputContainer, PrimaryButton } from "~/shared/ui";
import {
  $selectedManager,
  btnStyle,
  inputProps,
  setSelectedManager,
} from "./helpers";

export function EditManager() {
  const { t } = useTranslation();
  const data = useUnit($selectedManager);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (data) setSelectedManager({ ...data, [e.target.name]: e.target.value });
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (data) editManager(data);
  };
  const onReset = () => {
    const mainData = $mainData.getState() as
      | CustomerCompany
      | TransporterCompany;
    const m_id = data?.manager_id;
    for (const idx in mainData.managers) {
      const m = mainData.managers[idx];
      if (
        ("customer_manager_id" in m && m.customer_manager_id === m_id) ||
        ("transporter_manager_id" in m && m.transporter_manager_id === m_id)
      )
        setSelectedManager({
          manager_id: m_id,
          email: m.user.email,
          full_name: m.user.full_name,
        });
    }
  };
  return (
    <form onSubmit={onSubmit} onReset={onReset}>
      <InputContainer
        variant="input"
        label={t("registration.managerFullName")}
        {...{ name: "full_name", value: data!.full_name, onChange }}
        {...inputProps}
        autoComplete="manager-full_name"
      />
      <InputContainer
        variant="input"
        label={t("registration.managerEmail")}
        {...{ name: "email", value: data!.email, onChange }}
        {...inputProps}
        autoComplete="manager-email"
      />
      <div className="d-flex justify-content-evenly w-100 mt-5">
        <PrimaryButton type="submit" style={btnStyle}>
          {t("common.save")}
        </PrimaryButton>
        <PrimaryButton type="reset" style={btnStyle}>
          {t("common.cancel")}
        </PrimaryButton>
      </div>
    </form>
  );
}
