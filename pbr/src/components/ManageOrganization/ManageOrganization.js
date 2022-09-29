import * as React from "react";

import EditOrganization from "./EditOrganization";
import OrganizationDetails from "./OrganizationDetails";
import AdminContact from "./AdminContact";
import Toolbar from "./Toolbar";
import OrganizationCode from "./OrganizationCode";

import {
  Box,
  Typography,
  Grid,
  Card
} from '@mui/material';

import useAuth from "../../services/useAuth";

export default function OrganizationView() {
  const {checkResponseAuth, user} =  useAuth();
  const [organization, setOrganization] = React.useState(null);
  const [organizations, setOrganizations] = React.useState([]);
  //const [organizationEdit, setOrganizationEdit] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [adminContact, setAdminContact] = React.useState(null);

  React.useEffect(() => {
    if (user.role == 0) {
      getOrganizations();
    } else {
      getOrganization();
    }
  }, [])

  const getAdminContact = async () => {
    await fetch(`/api/user/admin/${user.organization_id}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setAdminContact(data);
      });
  }

  const getOrganization = async () => {
    await fetch(`/api/organization/${user.organization_id}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setOrganization(data);
      });
  }

  const getOrganizations = async () => {
    await fetch(`/api/organization`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setOrganizations(data);
      });
  }

  const renderToolbar = () => {
    if (user.role === 0) {
      return (
        <Toolbar
          organization={organization}
          setOrganization={setOrganization}
          organizations={organizations}
        />)
    } else {
      return (organization &&
        <Card>
          <Grid container spacing={1} sx={{p: 2, width: '100%'}}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h4">{organization.name}</Typography>
            </Grid>
          </Grid>
        </Card>
      )
    }
  }

  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            {renderToolbar()}
          </Grid>
          {organization ? (
          <>
          <Grid item xs={12} sm={6}>
            {editing ? (
              <EditOrganization
                organization={organization}
                setOrganization={setOrganization}
                setOrganizations={setOrganizations}
                setEditing={setEditing}
              /> ) : (
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
              <AdminContact
                adminContact={adminContact}
              />
            </Grid>          
          </Grid>
          </>
          ) : null}
        </Grid>
      </Box>
    </>
  );
}
