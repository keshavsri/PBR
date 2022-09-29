import React from "react";

import {
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Person,
  Email,
  Phone
} from '@mui/icons-material';

export default function AdminContact({
  adminContact
}) {
  if (adminContact) {
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
  } else {
    return (
      <Card>
        <Grid container spacing={1} sx={{padding: '15px'}}>
          <Grid item sm={12}>
            <Typography variant="h4">Admin Contact</Typography>
          </Grid>
          <Grid item sm={12}>
            <Typography variant="h5">Admin does not exist for this organization.</Typography>
          </Grid>
        </Grid>
      </Card>
    )
  }
}