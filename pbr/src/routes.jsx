import React from "react";
import { useLocation, Redirect, Navigate } from "react-router-dom";
import useAuth from "./useAuth";

import MainLayout from "./layouts/MainLayout";
import DataView from "./layouts/LoginLayout";
import LoginBackdrop from "./layouts/LoginLayout";
import Error404 from "./layouts/404Error";

import LoginCard from "./components/login/LoginCard";
import RegisterCard from "./components/login/RegisterCard";
import RecoveryCard from "./components/login/RecoveryCard";
import ManageUsers from "./components/ManageUsers";


function RequireAuth({ children }) {
  const { authenticated } = useAuth();
  console.log("Authed?", authenticated);

  return authenticated === true ? children : <Navigate to="/login" replace />;
}

const routes = [

  {
    path: "/login",
    element: (
      <LoginBackdrop>
        <LoginCard />
      </LoginBackdrop>
    ),
  },
  {
    path: "/register",
    element: (
      <LoginBackdrop>
        <RegisterCard />
      </LoginBackdrop>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <LoginBackdrop>
        <RecoveryCard />
      </LoginBackdrop>
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
