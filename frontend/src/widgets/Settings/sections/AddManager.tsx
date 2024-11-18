import { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  registerManager,
  RegisterManagerRequest,
} from "~/features/registration";
import { InputContainer, PrimaryButton } from "~/shared/ui";
import { btnStyle, inputProps } from "./helpers";

export function AddManager() {
  const { t } = useTranslation();

  const initialState = {
    email: "",
    full_name: "",
    password: "",
    repeat_password: "",
  };
  const [data, setData] = useState<
    RegisterManagerRequest & { repeat_password: string }
  >(initialState);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    registerManager({ ...data, onSuccess: () => setData(initialState) });
  };
  return (
    <form onSubmit={onSubmit}>
      <InputContainer
        variant="input"
        label={t("registration.managerFullName")}
        {...{ name: "full_name", value: data.full_name, onChange }}
        {...inputProps}
        autoComplete="manager-full_name"
      />
      <InputContainer
        variant="input"
        label={t("registration.managerEmail")}
        {...{ name: "email", value: data.email, onChange }}
        {...inputProps}
        autoComplete="manager-email"
      />
      <InputContainer
        variant="password-input"
        label={t("login.inputPlaceholders.password")}
        {...{ name: "password", value: data.password, onChange }}
        {...inputProps}
        autoComplete="manager-password"
      />
      <InputContainer
        variant="password-input"
        label={t("resetPassword.inputPlaceholders.confirmPassword")}
        {...{ name: "repeat_password", value: data.repeat_password, onChange }}
        {...inputProps}
        autoComplete="manager-repeat_password"
      />
      <div className="d-flex justify-content-evenly w-100 mt-5">
        <PrimaryButton type="submit" style={btnStyle}>
          {t("common.add")}
        </PrimaryButton>
      </div>
    </form>
  );
}
