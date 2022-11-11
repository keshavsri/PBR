import * as React from "react";

import EditOrganization from "./EditOrganization";
import OrganizationDetails from "./OrganizationDetails";
import AdminContact from "./OrganizationDetails/AdminContact";
import Toolbar from "./Toolbar";
import OrganizationCode from "./OrganizationDetails/OrganizationCode";
import AddOrganization from "./AddOrganization";
import ManageOrganizationSources from "./OrganizationAssets/ManageOrganizationSources";
import ManageOrganizationFlocks from "./OrganizationAssets/ManageOrganizationFlocks";
import ManageOrganizationMachines from "./OrganizationAssets/ManageOrganizationMachines";


import { Box, Typography, Grid, Card } from "@mui/material";

import useAuth from "../../services/useAuth";

export default function OrganizationView() {
  const { checkResponseAuth, user } = useAuth();
  const [organization, setOrganization] = React.useState({ id: null });
  const [organizations, setOrganizations] = React.useState([]);
  const [adminContact, setAdminContact] = React.useState(null);
  const [openAddOrganizationModal, setOpenAddOrganizationModal] =
    React.useState(false);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    if (user.role == 0) {
      getOrganizations();
    } else {
      getOrganization();
      getAdminContact(user.organization_id);
    }
  }, []);

  const getAdminContact = async (orgId) => {
    await fetch(`/api/user/admin/${orgId}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        if (!data.first_name) {
          setAdminContact(null);
        } else {
          setAdminContact(data);
        }
      });
  };

  const getOrganization = async () => {
    await fetch(`/api/organization/${user.organization_id}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setOrganization(data);
      });
  };

  const getOrganizations = async () => {
    await fetch(`/api/organization`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setOrganizations(data);
      });
  };

  const renderToolbar = () => {
    if (user.role === 0) {
      return (
        <Toolbar
          organization={organization}
          setOrganization={setOrganization}
          organizations={organizations}
          getAdminContact={getAdminContact}
          setOpenAddOrganizationModal={setOpenAddOrganizationModal}
        />
      );
    } else {
      return (
        organization && (
          <Card>
            <Grid container spacing={1} sx={{ p: 2, width: "100%" }}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h4">{organization.name}</Typography>
              </Grid>
            </Grid>
          </Card>
        )
      );
    }
  };

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {renderToolbar()}
          </Grid>
          {organization.id ? (
            <>
              <Grid item xs={12} sm={6}>
                {editing ? (
                  <EditOrganization
                    organization={organization}
                    setOrganization={setOrganization}
                    setOrganizations={setOrganizations}
                    setEditing={setEditing}
                  />
                ) : (
                  <OrganizationDetails
                    organization={organization}
                    setEditing={setEditing}
                    userRole={user.role}
                  />
                )}

              </Grid>

              <Grid container item xs={12} sm={6} spacing={2}>
                <Grid item xs={12} sm={12}>
                  <OrganizationCode
                    organizationCode={organization.organization_code}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <AdminContact adminContact={adminContact} />
                </Grid>
              </Grid>

              <Grid container item xs={12} sm={12} spacing={2}>
                <Grid item xs={12} sm={12}>
                    <ManageOrganizationSources
                      organization={organization}
                    />
                  </Grid>
              </Grid>

              <Grid container item xs={12} sm={12} spacing={2}>
                <Grid item xs={12} sm={12}>
                    <ManageOrganizationFlocks
                      organization={organization}
                    />
                  </Grid>
              </Grid>

              <Grid container item xs={12} sm={12} spacing={2}>
                <Grid item xs={12} sm={12}>
                    <ManageOrganizationMachines
                      organization={organization}
                    />
                  </Grid>
              </Grid>

            </>
          ) : null}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <AddOrganization
              getOrganizations={getOrganizations}
              openAddOrganizationModal={openAddOrganizationModal}
              setOpenAddOrganizationModal={setOpenAddOrganizationModal}
              setOrganization={setOrganization}
              getAdminContact={getAdminContact}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
