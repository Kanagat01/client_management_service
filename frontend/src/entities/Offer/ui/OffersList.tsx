import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { Checkbox, RoundedTable, TextCenter, TitleMd } from "~/shared/ui";
import { $selectedOffer, OrderOffer, selectOffer } from "..";

export function OffersList({ offers }: { offers: OrderOffer[] }) {
  const { t } = useTranslation();
  const selectedOffer = useUnit($selectedOffer);
  const docsData = offers.map((offer) => [
    <TextCenter>
      <Checkbox
        label={
          offer.transporter_manager.company.company_name +
          "\n" +
          offer.transporter_manager.user.full_name
        }
        className="me-2"
        checked={selectedOffer?.id === offer.id}
        onChange={() =>
          selectOffer(selectedOffer?.id !== offer.id ? offer : null)
        }
      />
    </TextCenter>,
    <TextCenter>{offer.price}</TextCenter>,
  ]);
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between mb-3"
        style={{ height: "3rem" }}
      >
        <TitleMd>{t("offers.plural")}</TitleMd>
      </div>
      <RoundedTable
        columns={[
          <TextCenter>{t("common.transporter")}</TextCenter>,
          <TextCenter>{t("common.bid")}</TextCenter>,
        ]}
        data={docsData}
      />
    </>
  );
}
