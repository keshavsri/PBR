import React from "react";

import {
  Typography,
  Grid,
  Card,
  TextField,
  Button
} from '@mui/material';

export default function EditOrganization({
  organization,
  setOrganization,
  setEditing
}) {
  const handleEditOrganizationChange = (prop) => (event) => {
    console.log(organization[prop])
    setOrganization({
      ...organization,
      [prop]: event.target.value,
    });
  }

  let onSubmit = async() => {
    console.log("Sumbitting!", organization);
    await fetch(`/api/organization/${organization.id}`, {
      method: "PUT",
      body: JSON.stringify(organization),
    })
      .then((response) => {
        if (!response.ok) {
          console.log("ERROR")
          console.log(response)
        } else {
          console.log(response)
        }
      })
  }

  return (
    <Card>
      <Grid container spacing={2} sx={{padding: '15px'}}>
        <Grid item xs={12} sm={12}>
          <Typography gutterBottom variant="h4">Details</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Name"
            value={organization.name}
            onChange={handleEditOrganizationChange('name')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Street Adress"
            value={organization.street_address}
            onChange={handleEditOrganizationChange('street_address')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="City"
            value={organization.city}
            onChange={handleEditOrganizationChange('city')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="State"
            value={organization.state}
            onChange={handleEditOrganizationChange('state')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Zip"
            value={organization.zip}
            onChange={handleEditOrganizationChange('zip')}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            value={organization.notes}
            onChange={handleEditOrganizationChange('notes')}
          />
        </Grid>
        <Grid item xs={12} sm={8}></Grid>
        <Grid item xs={12} sm={2}>
          <Button
            onClick={() => {
              setEditing(false)
            }}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            onClick={() => {
              onSubmit();
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Card>
  )
}

