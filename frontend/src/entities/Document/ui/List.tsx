import { useUnit } from "effector-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { $userType, getRole } from "~/entities/User";
import {
  AddDocument,
  DeleteDocument,
  OrderDocument,
} from "~/entities/Document";
import {
  documentButtonProps,
  RoundedTable,
  TextCenter,
  TitleMd,
} from "~/shared/ui";
import { API_URL } from "~/shared/config";
import { dateTimeToString } from "~/shared/lib";
import Routes from "~/shared/routes";

export function DocumentsList({ documents }: { documents: OrderDocument[] }) {
  const { t } = useTranslation();
  const userType = useUnit($userType);
  const role = getRole(userType);
  const currentRoute = useLocation().pathname;

  const showButtons =
    !(
      role === "customer" &&
      (
        [Routes.ORDERS_IN_BIDDING, Routes.ORDERS_IN_AUCTION] as string[]
      ).includes(currentRoute)
    ) &&
    currentRoute !== Routes.CANCELLED_ORDERS &&
    currentRoute !== Routes.FIND_CARGO;

  const docsData = documents.map((doc) => [
    <TextCenter>
      <a className="link" target="_blank" href={API_URL + doc.file}>
        {t("documents.document")} №{doc.id} <br />
        {decodeURIComponent(doc.file).replace("/media/documents/", "")}
      </a>
      {dateTimeToString(doc.created_at)}
    </TextCenter>,
    <TextCenter>{doc.user ?? t("documents.noData")}</TextCenter>,
  ]);
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between mb-3"
        style={{ height: "3rem" }}
      >
        <TitleMd>{t("documents.myDocuments")}</TitleMd>

        <div className={`${showButtons ? "d-inline-flex" : "d-none"} h-100`}>
          <AddDocument {...documentButtonProps} />
          {role === "customer" ? (
            <DeleteDocument documents={documents} {...documentButtonProps} />
          ) : (
            ""
          )}
        </div>
      </div>
      <RoundedTable
        columns={[
          <TextCenter>{t("documents.documentName")}</TextCenter>,
          <TextCenter>{t("documents.user")}</TextCenter>,
        ]}
        data={docsData}
      />
    </>
  );
}
