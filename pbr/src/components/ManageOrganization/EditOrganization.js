import React from "react";

import {
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Alert
} from '@mui/material';

export default function EditOrganization({
  organization,
  setOrganization,
  setOrganizations,
  setEditing
}) {
  const [organizationEdit, setOrganizationEdit] = React.useState(organization)
  const [errorToggle, setErrorToggle] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const requiredFields = ["name", "street_address", "city", "state", "zip"]

  const handleEditOrganizationChange = (prop) => (event) => {
    setOrganizationEdit({
      ...organizationEdit,
      [prop]: event.target.value,
    });
  }

  let onSubmit = async() => {
    let error = false;
    requiredFields.forEach(field => {
      if(organizationEdit[field] === "") {
        error = true;
        setErrorToggle(true)
        setErrorMessage("Required fields * cannot be empty.")
      }
    })
    if(error) {
      return;
    }
    await fetch(`/api/organization/${organization.id}`, {
      method: "PUT",
      body: JSON.stringify(organizationEdit),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        if (!response.ok) {
          setErrorToggle(true)
          setErrorMessage("Error updating organization.")
          return
        }
      })
    await fetch(`/api/organization`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setOrganizations(data);
      });
    await fetch(`/api/organization/${organization.id}`, { method: "GET" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setOrganizationEdit(data);
        setOrganization(data);
      });
    setEditing(false);
      
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
              value={organizationEdit.name}
              onChange={handleEditOrganizationChange('name')}
              error = {organizationEdit.name === "" ? true : false}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Street Adress"
            value={organizationEdit.street_address}
            onChange={handleEditOrganizationChange('street_address')}
            error = {organizationEdit.street_address === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="City"
            value={organizationEdit.city}
            onChange={handleEditOrganizationChange('city')}
            error = {organizationEdit.city === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="State"
            value={organizationEdit.state}
            onChange={handleEditOrganizationChange('state')}
            error = {organizationEdit.state === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Zip"
            value={organizationEdit.zip}
            onChange={handleEditOrganizationChange('zip')}
            error = {organizationEdit.zip === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            value={organizationEdit.notes}
            onChange={handleEditOrganizationChange('notes')}
          />
        </Grid>
        {errorToggle ? 
        (<Grid item xs={12} sm={12}>
          <Alert severity="error" color="error">
            {errorMessage}
          </Alert>
        </Grid>) : null}
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

