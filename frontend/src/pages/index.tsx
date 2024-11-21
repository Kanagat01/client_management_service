import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import urls from "~/shared/routes";
import { PrivateRoute } from "./PrivateRoute";

export const Routing = () => {
  const private_routes: Array<[string, ReactNode]> = [];

  return (
    <Routes>
      <Route path={urls.LOGIN} element={<h1>Страница входа</h1>} />
      <Route element={<PrivateRoute />}>
        {private_routes.map(([path, element]) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={urls.LOGIN} replace />} />
    </Routes>
  );
};
