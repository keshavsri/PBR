import * as React from "react";

import EditOrganization from "./EditOrganization";
import OrganizationDetails from "./OrganizationDetails";
import AdminContact from "./OrganizationDetails/AdminContact";
import Toolbar from "./Toolbar";
import OrganizationCode from "./OrganizationDetails/OrganizationCode";
import AddOrganization from "./AddOrganization";
import ManageOrganizationSources from "./OrganizationAssets/OrganizationSources/ManageOrganizationSources";
import ManageOrganizationFlocks from "./OrganizationAssets/OrganizationFlocks/ManageOrganizationFlocks";
import ManageOrganizationMachines from "./OrganizationAssets/OrganizationMachines/ManageOrganizationMachines";


import { Box, Typography, Grid, Card, Chip } from "@mui/material";

import useAuth from "../../services/useAuth";

export default function OrganizationView() {
  const { checkResponseAuth, user } = useAuth();
  const [organization, setOrganization] = React.useState({ id: null });
  const [organizations, setOrganizations] = React.useState([]);
  const [adminContact, setAdminContact] = React.useState(null);
  const [openAddOrganizationModal, setOpenAddOrganizationModal] =
    React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [sources, setSources] = React.useState([]);
  const [flocks, setFlocks] = React.useState([]);
  const [machines, setMachines] = React.useState([]);
  const [roles, setRoles] = React.useState([]);


  React.useEffect(async () => {
    await getRoles();

    // Doing roles["Super_Admin"] doesn't work here -> Needs to be fixed
    if (user.role == 0) {
      getOrganizations();
    } else {
      getOrganization();
      getAdminContact(user.organization_id);
    }
  }, []);

  const getRoles = async () => {
    const response = await fetch(`/api/enum/roles`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    setRoles(data);
  };

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

  const isDeletable = () => {
    if (user.role == roles["Super_Admin"] || user.role == roles["Admin"]) {
      return true;
    } else {
      return false;
    }
  };

  const assignRowHtml = (rows) => {
    rows.map((row) => {
      row.deletable = isDeletable();
      row.status = (
        <>
          <Chip label={row.status} color="primary" size="small" />
        </>
      );
    });
  };

  const assignRowHtmlFlock = (rows) => {
    rows.map((row) => {
      row.deletable = isDeletable();
      row.status = (
        <>
          <Chip label={row.status} color="primary" size="small" />
        </>
      );
      row.birthday = new Date(row.birthday).toLocaleString(
        "en-US",
        {
          timeZone: "America/New_York",
        }
      );
    });
  };


  const getSources = async (organization) => {
    await fetch(`/api/source/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSources(data)
        assignRowHtml(data);
      });
  };

  const getFlocks = async (organization) => {
    await fetch(`/api/flock/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setFlocks(data);
        assignRowHtmlFlock(data);
      });
  };

  const getMachines = async (organization) => {
    await fetch(`/api/machine/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMachines(data)
        assignRowHtml(data);
      });
  };

  const renderToolbar = () => {
    if (user.role === roles["Super_Admin"]) {
      return (
        <Toolbar
          organization={organization}
          setOrganization={setOrganization}
          organizations={organizations}
          getAdminContact={getAdminContact}
          getSources={getSources}
          getFlocks={getFlocks}
          getMachines={getMachines}
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
                      sources={sources}
                      getSources={getSources}
                      setSources={setSources}
                      roles={roles}
                    />
                  </Grid>
              </Grid>

              <Grid container item xs={12} sm={12} spacing={2}>
                <Grid item xs={12} sm={12}>
                    <ManageOrganizationFlocks
                      organization={organization}
                      flocks={flocks}
                      getFlocks={getFlocks}
                      setFlocks={setFlocks}
                      sources={sources}
                      roles={roles}
                    />
                  </Grid>
              </Grid>

              <Grid container item xs={12} sm={12} spacing={2}>
                <Grid item xs={12} sm={12}>
                    <ManageOrganizationMachines
                      organization={organization}
                      machines={machines}
                      getMachines={getMachines}
                      roles={roles}
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
              getSources={getSources}
              getFlocks={getFlocks}
              getMachines={getMachines}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
