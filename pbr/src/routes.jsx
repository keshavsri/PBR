import React from "react";
import { useLocation } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DataView from "./layouts/LoginLayout";
import LoginBackdrop from "./layouts/LoginLayout";
import Error404 from "./layouts/404Error";

import LoginCard from "./components/login/LoginCard";
import RegisterCard from "./components/login/RegisterCard";
import RecoveryCard from "./components/login/RecoveryCard";

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
    element: <MainLayout card={<DataView />} />,
  },
  {
    path: "/generate-reports",
    element: <MainLayout view={<DataView />} />,
  },
  {
    path: "/manage-users",
    element: <MainLayout />,
  },
  {
    path: "/manage-organization",
    element: <MainLayout />,
  },
  {
    path: "/settings",
    element: <MainLayout />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export default routes;
