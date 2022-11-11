import React from "react";
import { useTheme } from "@mui/material/styles";
import {states} from '../../../../models/enums'


import {
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Alert,
  Modal,
  MenuItem
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import useAuth from "../../../../services/useAuth";


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


// Start of Add Organization's Sources Functionality

export default function AddOrganizationSources({
    getSources,
    openAddOrganizationSourceModal,
    setOpenAddOrganizationSourceModal,
    organization
  }) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    useTheme();
    const { checkResponseAuth } = useAuth();

    const [sourceDetails, setSourceDetails] = React.useState({
      name: "",
      street_address: "",
      city: "",
      state: "",
      zip: "",
      organization_id: null
    });

    const [errorToggle, setErrorToggle] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const requiredFields = ["name", "street_address", "city", "state", "zip"]

    const handleSourceDetailsChange = (prop) => (event) => {    
      setSourceDetails({
        ...sourceDetails,
        [prop]: event.target.value,
      });
    };

    const clearSourceDetails = () => {
      setSourceDetails({
        name: "",
        street_address: "",
        city: "",
        state: "",
        zip: "",
        organization_id: null
      })
    };


    let onSubmit = async () => {

      let error = false;

      requiredFields.forEach(field => {
        if(sourceDetails[field] === "") {
          error = true;
          setErrorToggle(true)
          setErrorMessage("Required fields * cannot be empty.")
        }
      })
      if(error) {
        return;
      }

      let payload = {

        // Source Parameters

        name: sourceDetails.name,
        street_address: sourceDetails.street_address,
        city: sourceDetails.city,
        state: sourceDetails.state,
        zip: sourceDetails.zip,
        organization_id: organization.id
      };
      
      // API Call for POST Source
      await fetch(`/api/source/`, {
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
            setErrorToggle(true)
            setErrorMessage("Unable to create source.")
            return
          } else {
            getSources();
            setOpenAddOrganizationSourceModal(false);
            clearSourceDetails();
            setErrorToggle(false);
            return response.json();
          }
        })
    };

    return (

      <Modal
        aria-labelledby="Add Organization Source Modal"
        aria-describedby="Modal used for adding an organization's source to the application"
        open={openAddOrganizationSourceModal}
        onClose={() => {
          setOpenAddOrganizationSourceModal(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card>
          <Grid container spacing={2} sx={{padding: '15px'}}>


            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">Add Source</Typography>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={sourceDetails.name}
                onChange={handleSourceDetailsChange("name")}
                error = {sourceDetails.name === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Street"
                value={sourceDetails.street_address}
                onChange={handleSourceDetailsChange("street_address")}
                error = {sourceDetails.street_address === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="City"
                value={sourceDetails.city}
                onChange={handleSourceDetailsChange("city")}
                error = {sourceDetails.city === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                select
                label="State"
                value={sourceDetails.state}
                onChange={handleSourceDetailsChange('state')}
              >
                {Object.values(states).map((value) => {
                  return <MenuItem value={value}>{value}</MenuItem>
                })}
              </TextField>
            </Grid>


            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Zip"
                value={sourceDetails.zip}
                onChange={handleSourceDetailsChange("zip")}
                error = {sourceDetails.zip === "" ? true : false}
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
                  setOpenAddOrganizationSourceModal(false);
                  setErrorToggle(false);
                  clearSourceDetails();
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