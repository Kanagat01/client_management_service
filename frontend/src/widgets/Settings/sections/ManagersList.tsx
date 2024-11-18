import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import {
  $mainData,
  CustomerCompany,
  TransporterCompany,
} from "~/entities/User";
import { Checkbox, RoundedTable, TextCenter } from "~/shared/ui";
import { $selectedManager, fontSize, setSelectedManager } from "./helpers";

export function ManagersList() {
  const { t } = useTranslation();
  const mainData = useUnit($mainData) as CustomerCompany | TransporterCompany;
  const selectedManager = useUnit($selectedManager);
  return (
    <RoundedTable
      columns={[
        <TextCenter style={fontSize}>{t("common.id")}</TextCenter>,
        <TextCenter style={fontSize}>{t("common.manager")}</TextCenter>,
        <TextCenter style={fontSize}>{t("editUser.email")}</TextCenter>,
      ]}
      data={mainData.managers.map(({ user: { email, full_name }, ...data }) => {
        const id =
          "customer_manager_id" in data
            ? data.customer_manager_id
            : data.transporter_manager_id;
        return [
          <Checkbox
            id={id.toString()}
            label={`№${id}`}
            checked={selectedManager?.manager_id === id}
            onChange={() =>
              setSelectedManager(
                selectedManager?.manager_id !== id
                  ? { manager_id: id, full_name, email }
                  : null
              )
            }
            className="me-2"
            labelStyle={fontSize}
          />,
          <TextCenter className="p-1" style={fontSize}>
            {full_name}
          </TextCenter>,
          <TextCenter
            className="p-1"
            style={{ ...fontSize, wordBreak: "break-word" }}
          >
            {email}
          </TextCenter>,
        ];
      })}
      layoutFixed={false}
    />
  );
}
