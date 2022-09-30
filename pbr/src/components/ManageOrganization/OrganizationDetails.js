import React from "react";

import {
  Typography,
  Grid,
  Card,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'


export default function OrganizationDetails({
  organization,
  setEditing,
  userRole
}) {
  return (
    <Card>
      <Grid container spacing={2} sx={{padding: '15px'}}>
        <Grid item xs={12} sm={10}>
          <Typography gutterBottom variant="h4">Details</Typography>
        </Grid>
        {userRole === 0 || userRole == 1 ? (
          <Grid item xs={12} sm={2}>
            <Button
              sx={{ borderRadius: 10 }}
              startIcon={<EditIcon />}
              onClick={() => {
                setEditing(true)
              }}
            >
              Edit
            </Button>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Name</Typography>
          <Typography variant="body1">{organization.name}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Street Address</Typography>
          <Typography variant="body1">{organization.street_address}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">City</Typography>
          <Typography variant="body1">{organization.city}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">State</Typography>
          <Typography variant="body1">{organization.state}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">Zip</Typography>
          <Typography variant="body1">{organization.zip}</Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6">Notes</Typography>
          <Typography variant="body1">{organization.notes}</Typography>
        </Grid>
      </Grid>
    </Card>
  )
}