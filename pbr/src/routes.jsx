import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DataViewProvider } from "./services/useDataView";

import MainLayout from "./layouts/MainLayout";
import LoginBackdrop from "./layouts/LoginLayout";
import Error404 from "./layouts/404Error";
import DataView from "./components/DataView";
import OrganizationView from "./components/DataViewOrganization/OrganizationView";
import LoggingView from "./components/LoggingView";
import LoginCard from "./components/login/LoginCard";
import RegisterCard from "./components/login/RegisterCard";
import RecoveryCard from "./components/login/RecoveryCard";
import ManageUsers from "./components/ManageUsers";
import useAuth from "./services/useAuth";

function RequireAuth({ children }) {
  const { user, recredentialize } = useAuth();
  const location = useLocation();
  console.log("requireauth");
  return user || recredentialize ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
function NonAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  console.log("nonauth");
  return user ? (
    <Navigate to="/data-view" replace state={{ path: location.pathname }} />
  ) : (
    children
  );
}

const routes = [
  {
    path: "/login",
    element: (
      <NonAuth>
        <LoginBackdrop>
          <LoginCard />
        </LoginBackdrop>
      </NonAuth>
    ),
  },
  {
    path: "/register",
    element: (
      <NonAuth>
        <LoginBackdrop>
          <RegisterCard />
        </LoginBackdrop>
      </NonAuth>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <NonAuth>
        <LoginBackdrop>
          <RecoveryCard />
        </LoginBackdrop>
      </NonAuth>
    ),
  },
  {
    path: "/data-view",
    element: (
      <RequireAuth>
        <MainLayout>
          <DataView />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/generate-reports",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
  },
  {
    path: "/manage-users",
    element: (
      <RequireAuth>
        <MainLayout>
          <ManageUsers />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/manage-organization",
    element: (
      <RequireAuth>
        <MainLayout>
          <OrganizationView />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/logging-view",
    element: (
      <RequireAuth>
        <MainLayout>
          <LoggingView />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/settings",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <MainLayout />
      </RequireAuth>
    ),
  },
  {
    path: "/*",
    element: <Error404 />,
  },
];

export default routes;
