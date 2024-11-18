import { useState } from "react";
import { useUnit } from "effector-react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DataSection, MapSection } from "~/widgets";
import { AcceptOffer, OffersList } from "~/entities/Offer";
import { $selectedOrder, OrderStatus } from "~/entities/Order";
import { $userType, getRole } from "~/entities/User";
import {
  AddDocument,
  DeleteDocument,
  DocumentsList,
} from "~/entities/Document";
import { documentButtonProps, OutlineButton, TitleLg } from "~/shared/ui";
import { useMediaQuery } from "~/shared/lib";
import Routes from "~/shared/routes";

type TSection = "documents" | "map" | "data" | "offers";

export function OrderSections() {
  const { t } = useTranslation();
  const sections: [string, TSection][] = [
    [t("common.data"), "data"],
    [t("orderTranslations.tracking"), "map"],
    [t("orderTranslations.documents"), "documents"],
  ];

  const userType = useUnit($userType);
  const order = useUnit($selectedOrder);
  const mediaQuery = useMediaQuery("(max-width: 375px)");

  const currentRoute = useLocation().pathname;
  const showOffers =
    getRole(userType) === "customer" &&
    ([Routes.ORDERS_IN_BIDDING, Routes.ORDERS_IN_AUCTION] as string[]).includes(
      currentRoute
    );

  const [currentSection, setCurrentSection] = useState<TSection>("data");
  const Section = () => {
    if (order) {
      switch (currentSection) {
        case "documents":
          return <DocumentsList documents={order.documents ?? []} />;
        case "map":
          return (
            <MapSection
              tracking={order!.tracking ?? undefined}
              stages={
                [OrderStatus.completed, OrderStatus.being_executed].includes(
                  order.status as OrderStatus
                )
                  ? order.stages
                  : undefined
              }
            />
          );
        case "data":
          return <DataSection order={order} />;
        case "offers":
          return <OffersList offers={order.offers ?? []} />;
      }
    } else
      return (
        <div style={{ display: "grid", placeItems: "center", height: "5rem" }}>
          <TitleLg>{t("orders.selectOrder")}</TitleLg>
        </div>
      );
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-between my-4">
        {sections.map(([text, section], key) => (
          <OutlineButton
            key={key}
            style={{
              padding: "0.5rem 2rem",
              fontSize: "1.4rem",
              ...(mediaQuery && {
                padding: "0.5rem 1rem",
              }),
            }}
            onClick={() => setCurrentSection(section)}
            className={currentSection === section ? "active" : ""}
          >
            {text}
          </OutlineButton>
        ))}
      </div>

      {showOffers ? (
        <div className="d-flex align-items-center justify-content-between my-4">
          <OutlineButton
            style={{
              padding: "0.5rem 2rem",
              fontSize: "1.4rem",
            }}
            onClick={() => setCurrentSection("offers")}
            className={currentSection === "offers" ? "active" : ""}
          >
            {t("orderTranslations.offers")}
          </OutlineButton>
          <AcceptOffer
            style={{
              padding: "0.5rem 2rem",
              fontSize: "1.4rem",
              color: "#fff",
              background: "#8BC34A",
              border: "none",
            }}
            className={currentSection !== "offers" ? "d-none" : ""}
          />
          <div
            style={
              currentSection === "documents"
                ? { height: "3.5rem" }
                : { display: "none" }
            }
          >
            <AddDocument {...documentButtonProps} />
            <DeleteDocument
              documents={(order && order.documents) ?? []}
              {...documentButtonProps}
            />
          </div>
        </div>
      ) : (
        ""
      )}

      <Section />
    </>
  );
}
