import React from "react";

import {
  Typography,
  Grid,
  Card,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

export default function Toolbar({
  organization,
  setOrganization,
  organizations,
  getAdminContact,
  getSources,
  getFlocks,
  getMachines,
  setOpenAddOrganizationModal
}) {
  const organizationSelected = event => {
    setOrganization(organizations.find(org => org.id == event.target.value))
    getSources(event.target.value);
    getFlocks(event.target.value);
    getMachines(event.target.value);
    getAdminContact(event.target.value)
  }

  function OrganizationDropdown(props) {
    return (
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="label-select-organization">Organization</InputLabel>
        <Select
          labelId="label-select-organization"
          id="select-organizations"
          value={organization.id}
          label="Organization"
          onChange={organizationSelected}
        >
          {organizations.map((org) => {
            return (
              <MenuItem key={org.id} value={org.id}>{org.name}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
    )
  }

  const handleOpenAddOrganizationModal = () => {
    setOpenAddOrganizationModal(true);
  };

  return (
    <Card>
      <Grid container spacing={1} sx={{p: 2, width: '100%'}}>
        <Grid item xs={12} sm={6}>
          <OrganizationDropdown/>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained">Delete Organization</Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" onClick={handleOpenAddOrganizationModal}>Create New Organization</Button>
        </Grid>
        {organization ? null : (
        <Grid item>
          <Typography>Select an organization to manage.</Typography>
        </Grid>
        )}
      </Grid>
    </Card>
  )}