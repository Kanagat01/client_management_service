import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import urls from "~/shared/routes";
import { PrivateRoute } from "./auth-routes";
import FindCargo from "./find-cargo";
import OrderPage from "./order-page";
import Cabinet from "./cabinet";
import {
  UnpublishedOrders,
  CancelledOrders,
  OrdersInBidding,
  OrdersInAuction,
  OrdersBeingExecuted,
  OrdersInDirect,
} from "./orders";
import {
  Login,
  ForgotPassword,
  Register,
  ResetPasswordConfirm,
} from "./auth-pages";

export const Routing = () => {
  const private_routes: Array<[string, ReactNode]> = [
    [urls.ORDERS_BEING_EXECUTED, <OrdersBeingExecuted />],
    [urls.ORDERS_IN_AUCTION, <OrdersInAuction />],
    [urls.ORDERS_IN_BIDDING, <OrdersInBidding />],
    [urls.ORDERS_IN_DIRECT, <OrdersInDirect />],
    [urls.CANCELLED_ORDERS, <CancelledOrders />],
    [urls.UNPUBLISHED_ORDERS, <UnpublishedOrders />],
    [urls.NEW_ORDER, <OrderPage />],
    [urls.EDIT_ORDER, <OrderPage />],
    [urls.PROFILE, <Cabinet />],
    // [urls.CARGO_PLAN, <CargoPlan />],
  ];

  return (
    <Routes>
      <Route path={urls.LOGIN} element={<Login />} />
      <Route path={urls.REGISTER} element={<Register />} />
      <Route path={urls.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={urls.FIND_CARGO} element={<FindCargo />} />
      <Route
        path={urls.RESET_PASSWORD_CONFIRM}
        element={<ResetPasswordConfirm />}
      />
      <Route element={<PrivateRoute />}>
        {private_routes.map(([path, element]) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
      <Route
        path="*"
        element={<Navigate to={urls.ORDERS_BEING_EXECUTED} replace />}
      />
    </Routes>
  );
};
