import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./services/useAuth";

import MainLayout from "./layouts/MainLayout";
import DataView from "./layouts/LoginLayout";
import LoginBackdrop from "./layouts/LoginLayout";
import Error404 from "./layouts/404Error";

import LoginCard from "./components/login/LoginCard";
import RegisterCard from "./components/login/RegisterCard";
import RecoveryCard from "./components/login/RecoveryCard";

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
      <RequireAuth>
        <MainLayout card={<DataView />} />
      </RequireAuth>
    ),
  },
  {
    path: "/generate-reports",
    element: (
      <RequireAuth>
        <MainLayout view={<DataView />} />
      </RequireAuth>
    ),
  },
  {
    path: "/manage-users",
    element: (
      <RequireAuth>
        <MainLayout />
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
        <MainLayout card={<DataView />} />
      </RequireAuth>
    ),
  },
  {
    path: "/*",
    element: <Error404 />,
  },
];

export default routes;
