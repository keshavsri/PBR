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
  getAdminContact
}) {
  const organizationSelected = event => {
    setOrganization(event.target.value)
    console.log(event.target.value.id)
    getAdminContact(event.target.value.id)
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
          <Button variant="contained">Create New Organization</Button>
        </Grid>
        {organization ? null : (
        <Grid item>
          <Typography>Select an organization to manage.</Typography>
        </Grid>
        )}
      </Grid>
    </Card>
  )}