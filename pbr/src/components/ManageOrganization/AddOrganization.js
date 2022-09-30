import React from "react";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

import {
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Alert,
  Modal
} from "@mui/material";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  organizationRoles
} from "../../models/enums";
import { tooltipClasses } from "@mui/material/Tooltip";
import { createFilterOptions } from "@mui/material/Autocomplete";
import useAuth from "../../services/useAuth";
import useDataView from "../../services/useDataView";


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
      height: 550,
      width: 1000,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
  },
}));


// Start of Add Organization Functionality

export default function AddOrganization({
    getOrganizations,
    openAddOrganizationModal,
    setOpenAddOrganizationModal
  }) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    useTheme();
    const { checkResponseAuth } = useAuth();

    const [organizationDetails, setOrganizationDetails] = React.useState({
      name: "",
      street_address: "",
      city: "",
      state: "",
      zip: "",
      notes: ""
    });

    const [errorToggle, setErrorToggle] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const requiredFields = ["name", "street_address", "city", "state", "zip"]

    const handleOrganizationDetailsChange = (prop) => (event) => {
      console.log("Handling Organization Details Change");
    
      setOrganizationDetails({
        ...organizationDetails,
        [prop]: event.target.value,
      });
      
      console.log(organizationDetails);
    };

    let onSubmit = async () => {

      let error = false;

      requiredFields.forEach(field => {
        if(organizationDetails[field] === "") {
          error = true;
          setErrorToggle(true)
          setErrorMessage("Required fields * cannot be empty.")
        }
      })
      if(error) {
        return;
      }

      console.log(`Creating new Organization`);

      let payload = {

        // Organization Parameters

        name: organizationDetails.name,
        street_address: organizationDetails.street_address,
        city: organizationDetails.city,
        state: organizationDetails.state,
        zip: organizationDetails.zip,
        notes: organizationDetails.notes

      };
      
      // API Call for POST Organization

      
      await fetch(`/api/organization/`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
              "Content-Type": "application/json",
          },
          })
          .then(checkResponseAuth)
          .then((response) => {
              console.log(response);
              if (!response.ok) {
                console.log("Unable to create Organization");
                setErrorToggle(true)
                setErrorMessage("Unable to create organization.")
          return
              } else {
              getOrganizations();
              return response.json();
              }
          });

          //setOrganization and orgAdmin to the newly created organization
          /*
            setOrganization(event.target.value)
            console.log(event.target.value.id)
            getAdminContact(event.target.value.id)
          */

            setOpenAddOrganizationModal(false);

    };

    console.log("Add Organization's open modal value is:" + openAddOrganizationModal);

    return (

      <Modal
        aria-labelledby="Add Organization Modal"
        aria-describedby="Modal used for adding an organization to the application"
        open={openAddOrganizationModal}
        onClose={() => {
          setOpenAddOrganizationModal(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card>
          <Grid container spacing={2} sx={{padding: '15px'}}>


            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">Add Organization</Typography>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={organizationDetails.name}
                onChange={handleOrganizationDetailsChange("name")}
                error = {organizationDetails.name === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Street"
                value={organizationDetails.street_address}
                onChange={handleOrganizationDetailsChange("street_address")}
                error = {organizationDetails.street_address === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                value={organizationDetails.city}
                onChange={handleOrganizationDetailsChange("city")}
                error = {organizationDetails.city === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                value={organizationDetails.state}
                onChange={handleOrganizationDetailsChange("state")}
                error = {organizationDetails.state === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zip"
                value={organizationDetails.zip}
                onChange={handleOrganizationDetailsChange("zip")}
                error = {organizationDetails.zip === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Notes"
                value={organizationDetails.notes}
                onChange={handleOrganizationDetailsChange("notes")}
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
                  setOpenAddOrganizationModal(false);
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