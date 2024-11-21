import { Outlet } from "react-router-dom";
import { Sidebar } from "~/widgets";

export function PrivateRoute() {
  // const isAuthenticated = useUnit($isAuthenticated);
  // const location = useLocation();
  // const mainData = useUnit($mainData);

  // if (!isAuthenticated)
  //   return <Navigate to={Routes.LOGIN} state={{ from: location }} replace />;

  // return mainData ? (
  return (
    <div className="main-bg">
      <div className="app-wrapper">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
  // ) : (
  //   <Preloader full_screen_mode />
  // );
}
