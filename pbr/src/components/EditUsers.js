import React from "react";

import {
  Typography,
  Grid,
  Card,
  TextField,
  Button,
  Alert
} from '@mui/material';

export default function EditUserForm({
  user,
  editUser,
  setEditForm
}) {

  const [editedUser, setEditedUser] = React.useState(user)
  const [errorToggle, setErrorToggle] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const requiredFields = ["first_name", "last_name", "organization", "email", "phone", "role", "notes"]

  const handleEditUserChange = (prop) => (event) => {
    console.log(editedUser[prop])
    setEditedUser({
      ...editedUser,
      [prop]: event.target.value,
    });
  }

  let onSubmit = async() => {
    let error = false;
    requiredFields.forEach(field => {
      if(editedUser[field] === "") {
        error = true;
        setErrorToggle(true)
        setErrorMessage("Required fields * cannot be empty.")
      }
    })
    if(error) {
      return;
    }
    editUser(editedUser);
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
              value={editedUser.firstname}
              onChange={handleEditUserChange('firstname')}
              error = {editedUser.firstname === "" ? true : false}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Street Adress"
            value={editedUser.lastname}
            onChange={handleEditUserChange('lastname')}
            error = {editedUser.lastname === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="City"
            value={editedUser.organization}
            onChange={handleEditUserChange('organization')}
            error = {editedUser.organization === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="State"
            value={editedUser.email}
            onChange={handleEditUserChange('email')}
            error = {editedUser.email === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Zip"
            value={editedUser.phone}
            onChange={handleEditUserChange('phone')}
            error = {editedUser.phone === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Zip"
            value={editedUser.role}
            onChange={handleEditUserChange('role')}
            error = {editedUser.role === "" ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            value={editedUser.notes}
            onChange={handleEditUserChange('notes')}
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
              setEditForm(false)
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