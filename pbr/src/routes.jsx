import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import LoginBackdrop from "./layouts/LoginLayout";
import Error404 from "./layouts/404Error";
import DataView from "./components/ManageData/ViewData/DataView";
import ManageOrganization from "./components/ManageOrganization/ManageOrganization";
import LoggingView from "./components/ManageLog/LoggingView";
import LoginCard from "./components/HandleLogin/LoginCard";
import RegisterCard from "./components/HandleLogin/RegisterCard";
import RecoveryCard from "./components/HandleLogin/RecoveryCard";
import ManageUsers from "./components/ManageUser/ManageUsers";
import useAuth from "./services/useAuth";
import HealthyRanges from "./components/HealthyRanges/HealthyRanges";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import HealthyRangesIcon from "@mui/icons-material/Assessment";
import UsersIcon from "@mui/icons-material/Group";
import OrganizationIcon from "@mui/icons-material/Apartment";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SettingsIcon from "@mui/icons-material/Settings";

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
        <MainLayout title="Data View" icon={<FontAwesomeIcon icon={faDatabase} style={{ height: "24px", width: "24px", padding: "3px" }}/>}>
          <DataView />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/healthy-ranges",
    element: (
      <RequireAuth>
        <MainLayout  title="Healthy Ranges" icon={<HealthyRangesIcon />}>
          <HealthyRanges/>
        </MainLayout>
      </RequireAuth>
    )
  },
  {
    path: "/manage-users",
    element: (
      <RequireAuth>
        <MainLayout title="Manage Users" icon={<UsersIcon />}>
          <ManageUsers />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/manage-organization",
    element: (
      <RequireAuth>
        <MainLayout title="Manage Organization" icon={<OrganizationIcon />}>
          <ManageOrganization />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/logging-view",
    element: (
      <RequireAuth>
        <MainLayout title="System Logs" icon={<PendingActionsIcon />}>
          <LoggingView />
        </MainLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/settings",
    element: (
      <RequireAuth>
        <MainLayout title="Settings" icon={<SettingsIcon />}/>
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
