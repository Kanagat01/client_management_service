import { useUnit } from "effector-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { Header, Sidebar } from "~/widgets";
import { $isAuthenticated } from "~/features/authorization";
import { $mainData } from "~/entities/User";
import { Preloader } from "~/shared/ui";
import Routes from "~/shared/routes";

export function PrivateRoute() {
  const isAuthenticated = useUnit($isAuthenticated);
  const location = useLocation();
  const mainData = useUnit($mainData);

  if (!isAuthenticated)
    return <Navigate to={Routes.LOGIN} state={{ from: location }} replace />;

  return mainData ? (
    <div className="main-bg">
      <Header />
      <div className="app-wrapper">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  ) : (
    <Preloader full_screen_mode />
  );
}
