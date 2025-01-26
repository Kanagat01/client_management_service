import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import urls from "~/shared/routes";

import {
  ActivitiesPage,
  ActivityTypesPage,
  CodesPage,
  DisciplinesPage,
  GroupsPage,
  LogsPage,
  MessagesPage,
  DiscountsPage,
  StudentRecordsPage,
  StudentsPage,
} from "./model_pages";
import { Login, ForgotPassword, ForgotPasswordConfirm } from "./auth_pages";
import { ProfilePage } from "./profile";
import PrivateRoute from "./private_route";

export const Routing = () => {
  const private_routes: Array<[string, ReactNode]> = [
    [urls.STUDENTS, <StudentsPage />],
    [urls.STUDENT_RECORDS, <StudentRecordsPage />],
    [urls.ACTIVITY_TYPES, <ActivityTypesPage />],
    [urls.ACTIVITIES, <ActivitiesPage />],
    [urls.DISCIPLINES, <DisciplinesPage />],
    [urls.GROUPS, <GroupsPage />],
    [urls.CODES, <CodesPage />],
    [urls.LOGS, <LogsPage />],
    [urls.MESSAGES, <MessagesPage />],
    [urls.DISCOUNTS, <DiscountsPage />],
    [urls.PROFILE, <ProfilePage />],
  ];

  return (
    <Routes>
      <Route path={urls.LOGIN} element={<Login />} />
      <Route path={urls.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route
        path={urls.FORGOT_PASSWORD_CONFIRM}
        element={<ForgotPasswordConfirm />}
      />
      <Route element={<PrivateRoute />}>
        {private_routes.map(([path, element]) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to={urls.PROFILE} replace />} />
    </Routes>
  );
};
