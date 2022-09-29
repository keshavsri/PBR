import React from "react";

import {
  Typography,
  Grid,
  Card
} from '@mui/material';
import {Refresh} from '@mui/icons-material'

export default function OrganizationCode(
  organizationCode
) {
  let expirationDate = new Date(2022, 8, 30, 5, 0, 0, 0);
  return (
    <Card>
      <Grid container rowSpacing={1} columnSpacing={1} sx={{padding: '15px'}}>
        <Grid item sm={12}>
          <Typography variant="h4">Organization Join Code</Typography>
        </Grid>
        <Grid container item columnSpacing={3}>
          <Grid item>
            <Typography variant="h4">123456</Typography>
          </Grid>
          <Grid item sx={{mt: '10px'}}>
            <Refresh/>
          </Grid>
          <Grid item sx={{mt: '10px'}}>
            <Typography>{`Valid till: ${expirationDate.toUTCString()}`}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}