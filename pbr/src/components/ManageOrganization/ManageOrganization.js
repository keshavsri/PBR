import * as React from "react";

import EditOrganization from "./EditOrganization";
import OrganizationDetails from "./OrganizationDetails";
import {
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Grid,
  Select,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Refresh,
  Person,
  Email,
  Phone
} from '@mui/icons-material';

import { makeStyles } from "@mui/styles";
import useAuth from "../../services/useAuth";

export default function OrganizationView() {
  const {checkResponseAuth, user} =  useAuth();
  const [organization, setOrganization] = React.useState(null);
  const [organizations, setOrganizations] = React.useState([]);
  const [organizationEdit, setOrganizationEdit] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [adminContact, setAdminContact] = React.useState(null);

  React.useEffect(() => {
    getOrganizations();
  }, [])

  const getOrganizations = async () => {
    await fetch(`/api/organization`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        console.log(data);
        setOrganizations(data);
      });
  }

  const onDelete = () => {
    console.log("DELETE TEST")

    // API CALL TO PASS THE "SELECTED" STATE VARIABLE TO DELETE
    // SHOULD BE A LIST OF DELETABLE OBJECTS W/ ID'S
    // NEED TO IMPLEMENT THIS FUNCTION FOR EVERY TABLE
  }
  // Data manipulation is contained in the getData and getHeadCells calls - is this ok?

  const organizationSelected = event => {
    console.log("org")
    console.log(organization)
    setOrganization(event.target.value)
    setOrganizationEdit(event.target.value)
  }

  function OrganizationDropdown(props) {
    return (
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="label-select-organization">Organization</InputLabel>
        <Select
          labelId="label-select-organization"
          id="select-organizations"
          value={organization}
          label="Organization"
          onChange={organizationSelected}
        >
          {organizations.map((org) => {
            return (
              <MenuItem value={org}>{org.name}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    )
  }

  function TopBar(props) {
    return (
      user.role == 0 ?
      (<Card>
        <Grid container spacing={1} sx={{p: 2, width: '100%'}}>
          <Grid item xs={12} sm={6}>
            <OrganizationDropdown/>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained">Delete Organization</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained">Create New Organization</Button>
          </Grid>
          {organization ? null : (
          <Grid item>
            <Typography>Select an organization to manage.</Typography>
          </Grid>
          )}
        </Grid>
      </Card>) :
      (<Card>
        <Grid container spacing={1} sx={{p: 2, width: '100%'}}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5">{organization.name}</Typography>
          </Grid>
        </Grid>
      </Card>)
    )
  }

  function JoinCode(props) {
    let expirationDate = new Date(2022, 8, 30, 5, 0, 0, 0);
    let dateString = expirationDate.toDateString();
    return (
      <Card>
        <Grid container rowSpacing={1} columnSpacing={1} sx={{padding: '15px'}}>
          <Grid item sm={12}>
            <Typography variant="h4">Organization Join Code</Typography>
          </Grid>
          <Grid container item columnSpacing={3}>
            <Grid item>
              <Typography variant="h4">{organization.organization_code}</Typography>
            </Grid>
            <Grid item sx={{mt: '10px'}}>
              <Refresh/>
            </Grid>
            <Grid item sx={{mt: '10px'}}>
              <Typography>{`Valid till: ${expirationDate.toDateString()}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    )
  }



  function AdminContact(props) {
    let adminContact = {
      first_name: "Rocio",
      last_name: "Crespo",
      email: "rcrespo@gmail.com",
      phone_number: "9199999999"
    }
    return (
      <Card>
        <Grid container spacing={1} sx={{padding: '15px'}}>
          <Grid item sm={12}>
            <Typography variant="h4">Admin Contact</Typography>
          </Grid>
          <Grid item>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Person/>
                </ListItemIcon>
                <ListItemText primary={`${adminContact.first_name} ${adminContact.last_name}`}/>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Email/>
                </ListItemIcon>
                <ListItemText primary={adminContact.email}/>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone/>
                </ListItemIcon>
                <ListItemText primary={adminContact.phone_number}/>
              </ListItem>
            </List>
          </Grid>
        </Grid>

      </Card>
    )
  }


  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TopBar/>
          </Grid>
          {organization ? (
          <>
          <Grid item xs={12} sm={6}>
            {editing ? (
              <EditOrganization
                organization={organizationEdit}
                setOrganization={setOrganizationEdit}
                setEditing={setEditing}
              /> ) : (
              <OrganizationDetails
                organization={organization}
                setEditing={setEditing}
              />
            )}
          </Grid>
          <Grid container item xs={12} sm={6} spacing={2}>
            <Grid item xs={12} sm={12}>
              <JoinCode/>
            </Grid>
            <Grid item xs={12} sm={12}>
              <AdminContact/>
            </Grid>          
          </Grid>
          </>
          ) : null}
        </Grid>
        
      </Box>
    </>
  );
}
