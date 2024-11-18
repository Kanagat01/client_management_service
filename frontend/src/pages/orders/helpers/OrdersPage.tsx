import { useUnit } from "effector-react";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ControlPanel, ControlPanelProps, OrderSections } from "~/widgets";
import { ExportToExcelButton } from "~/features/ExportToExcel";
import { $websocket } from "~/features/websocket";
import {
  $orders,
  $ordersPagination,
  getExportData,
  getOrdersFx,
  OrdersList,
  OrderStatus,
} from "~/entities/Order";
import { $userType, getRole, useIsActive } from "~/entities/User";
import {
  MainTitle,
  PageError,
  CollapsableSidebar,
  RoundedWhiteBox,
} from "~/shared/ui";
import Routes from "~/shared/routes";
import { RenderPromise } from "~/shared/api";
import { iconActionProps } from "./consts";
import {
  useCollapsed,
  useDefaultInputs,
  usePageFromSearchParams,
} from "./hooks";

type TOrdersPage = {
  title: string;
  pageData: ControlPanelProps;
  status: OrderStatus;
};

export function OrdersPage({
  title,
  pageData: { iconActions, textActions, ...pageData },
  status,
}: TOrdersPage) {
  const { t } = useTranslation();
  const userType = useUnit($userType);
  const isActive = useIsActive();
  const currentRoute = useLocation().pathname as Routes;

  const orders = useUnit($orders);
  const websocket = useUnit($websocket);

  useEffect(() => {
    if (websocket) {
      if (websocket.readyState === WebSocket.CONNECTING) {
        websocket.onopen = () => {
          websocket.send(JSON.stringify({ action: "set_status", status }));
        };
      } else {
        websocket.send(JSON.stringify({ action: "set_status", status }));
      }
    } else {
      if (new Date().getMinutes() % 5 == 0) {
        window.location.reload();
      }
    }
  }, [websocket, status]);

  const paginator = useUnit($ordersPagination);
  const { cityFrom, cityTo, transportationNumber, defaultInputs } =
    useDefaultInputs();

  const page = usePageFromSearchParams();
  const fetchOrders = useCallback(
    () => getOrdersFx({ status, page, cityFrom, cityTo, transportationNumber }),
    [status, page, cityFrom, cityTo, transportationNumber]
  );

  const [collapsed, toggleExpand] = useCollapsed();
  return (
    <>
      <RoundedWhiteBox style={{ width: "90%" }}>
        {title === "forbidden" ? (
          <PageError>{t("common.pageForbidden")}</PageError>
        ) : (
          <>
            <div className="p-5">
              <MainTitle>{title}</MainTitle>
              <ControlPanel
                {...pageData}
                inputs={defaultInputs}
                iconActions={
                  <>
                    <ExportToExcelButton
                      filename={`${t("orders.plural")} - ${t(
                        `orderStatus.${status}`
                      )}`}
                      data={getExportData(
                        orders,
                        currentRoute,
                        getRole(userType)
                      )}
                      {...iconActionProps}
                    />
                    {isActive ? iconActions : ""}
                  </>
                }
                textActions={isActive ? textActions : ""}
              />
            </div>
            {RenderPromise(fetchOrders, {
              success: (
                <OrdersList
                  orders={orders}
                  paginator={paginator ?? undefined}
                />
              ),
              error: (err) => (
                <PageError>
                  {t("common.errorMessage", { err: err?.message })}
                </PageError>
              ),
            })}
          </>
        )}
      </RoundedWhiteBox>
      <CollapsableSidebar collapsed={collapsed} toggleExpand={toggleExpand}>
        <OrderSections />
      </CollapsableSidebar>
    </>
  );
}
