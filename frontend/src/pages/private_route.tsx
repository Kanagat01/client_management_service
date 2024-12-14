import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUnit } from "effector-react";
import { Sidebar } from "~/widgets";
import { $isAuthenticated } from "~/features/authorization";
import Routes from "~/shared/routes";

export default function PrivateRoute() {
  const isAuthenticated = useUnit($isAuthenticated);
  const location = useLocation();
  // const mainData = useUnit($mainData);

  if (!isAuthenticated)
    return <Navigate to={Routes.LOGIN} state={{ from: location }} replace />;

  // return mainData ? (
  return (
    <div className="container-fluid">
      <div className="row justify-content-center d-md-flex h-100">
        <Sidebar />

        <div className="col-xxl col-xl-9 col-12">
          <div className="container-xl p-0 h-100">
            <div className="workspace workspace-limit pt-3 pt-md-4 mb-4 mb-md-0 d-flex flex-column h-100">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // ) : (
  //   <Preloader full_screen_mode />
  // );
}
