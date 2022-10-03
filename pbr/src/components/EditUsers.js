import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Alert,
  Modal,
  MenuItem,
  Select
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import useAuth from "../services/useAuth";
import {organizationRoles} from '../models/enums'


function getModalStyle() {
  const top = 55;
  const left = 50;
  return {
      top: `${top}%`,
      left: `${left}%`,
      
      transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  paper: {
      position: 'absolute',
      height: 500,
      width: 1000,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
}));

export default function EditUsers(props) {
  const {
    roleMap,
    currentUser,
    user,
    editUser,
    openEditUsersModal,
    setOpenEditUsersModal
  } = props;

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  useTheme();

  const [userDetails, setUserDetails] = React.useState(user);
  console.log(userDetails);
  console.log("Editing user")
  console.log(currentUser);
  console.log(currentUser.role);

  const [errorToggle, setErrorToggle] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const requiredFields = ["first_name", "last_name", "email"]

  const handleUserDetailsChange = (prop) => (event) => {
    console.log("Handling User Details Change");
  
    setUserDetails({
      ...userDetails,
      [prop]: event.target.value,
    });
    
    console.log(userDetails);
  };

  let onSubmit = async () => {

    let error = false;

    requiredFields.forEach(field => {
      if(userDetails[field] === "") {
        error = true;
        setErrorToggle(true)
        setErrorMessage("Required fields * cannot be empty.")
      }
    })
    if(error) {
      return;
    }

    console.log(`Editing existing user`);

    let payload = {
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
      phone_number: userDetails.phone_number,
      role: userDetails.role,
      notes: userDetails.notes
    };

    await editUser(payload)
    setOpenEditUsersModal(false);
  };

  return (

    <Modal
      aria-labelledby="Edit User Modal"
      aria-describedby="Modal used for editing an existing user's information"
      open={openEditUsersModal}
      onClose={() => {
        setOpenEditUsersModal(false);
      }}
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
        <Grid container spacing={2} sx={{padding: '15px'}}>

          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h4">Edit User</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={userDetails.first_name}
              onChange={handleUserDetailsChange("first_name")}
              error = {userDetails.first_name === "" ? true : false}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Last Name"
              value={userDetails.last_name}
              onChange={handleUserDetailsChange("last_name")}
              error = {userDetails.last_name === "" ? true : false}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              value={userDetails.email}
              onChange={handleUserDetailsChange("email")}
              error = {userDetails.email === "" ? true : false}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={userDetails.phone_number}
              onChange={handleUserDetailsChange("phone_number")}
              error = {userDetails.phone_number === "" ? true : false}
            />
          </Grid>

          { currentUser.role === 3 ||
            currentUser.role === 4 ||
            Object.keys(roleMap).find(key => roleMap[key] === user.role) <= currentUser.role ? null : (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Role"
              value={userDetails.role}
              onChange={handleUserDetailsChange('role')}
            >
              {Object.values(organizationRoles).map((value, idx) => {
                return <MenuItem value={idx}>{value}</MenuItem>
              })}
            </TextField>
          </Grid>
          )}

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label="Notes"
              value={userDetails.notes}
              onChange={handleUserDetailsChange("notes")}
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
                setOpenEditUsersModal(false);
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
      </div>
    </Modal>
  )
}