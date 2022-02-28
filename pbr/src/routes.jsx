import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./services/useAuth";

import MainLayout from "./layouts/MainLayout";
import LoginBackdrop from "./layouts/LoginLayout";
import Error404 from "./layouts/404Error";
import DataView from "./components/DataView";
import LoginCard from "./components/login/LoginCard";
import RegisterCard from "./components/login/RegisterCard";
import RecoveryCard from "./components/login/RecoveryCard";
import ManageUsers from "./components/ManageUsers";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}
function NonAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

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
      <MainLayout>
        <DataView />
      </MainLayout>
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
        <MainLayout />
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
