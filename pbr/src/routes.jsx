import React from "react";

import MainLayout from "./layouts/MainLayout";
import Login from "./components/Login";
import DataView from "./components/Login";

const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/data-view",
    element: <MainLayout />,
    children: [{ element: <DataView /> }],
  },
  {
    path: "/generate-reports",
    element: <MainLayout />,
  },
  {
    path: "/manage-users",
    element: <MainLayout />,
  },
  {
    path: "/manage-organiztion",
    element: <MainLayout />,
  },
  {
    path: "/settings",
    element: <MainLayout />,
  },
];

export default routes;
