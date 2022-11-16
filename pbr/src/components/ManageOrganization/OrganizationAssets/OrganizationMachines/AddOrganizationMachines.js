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


// Start of Add Organization's Machines Functionality

export default function AddOrganizationMachines({
    getMachines,
    openAddOrganizationMachineModal,
    setOpenAddOrganizationMachineModal,
    organization
  }) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    useTheme();
    const { checkResponseAuth } = useAuth();

    const [machineDetails, setMachineDetails] = React.useState({
      serial_number: "",
      machine_type: "",
    });
    const [machineTypes, setMachineTypes] = React.useState([]);


    const [errorToggle, setErrorToggle] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const requiredFields = ["serial_number", "machine_type"]

    React.useEffect(async () => {
      await getMachineTypes();
    }, [])

    const handleMachineDetailsChange = (prop) => (event) => {    
      setMachineDetails({
        ...machineDetails,
        [prop]: event.target.value,
      });
    };

    const clearMachineDetails = () => {
      setMachineDetails({
        serial_number: "",
        machine_type: "",
      })
    };

    let onSubmit = async () => {

      let error = false;

      requiredFields.forEach(field => {
        if(machineDetails[field] === "") {
          error = true;
          setErrorToggle(true)
          setErrorMessage("Required fields * cannot be empty.")
        }
      })
      if(error) {
        return;
      }

      let payload = {

        // Machine Parameters

        serial_number: machineDetails.serial_number,
        machine_type_id: machineDetails.machine_type.id,
        organization_id: organization.id
      };
      
      // API Call for POST Machine
      await fetch(`/api/machine/`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        })
        .then(checkResponseAuth)
        .then((response) => {
          if (!response.ok) {
            setErrorToggle(true)
            setErrorMessage("Unable to create machine.")
            return
          } else {
            getMachines(organization.id);
            closeAddMachineModal();
            return response.json();
          }
        })
    };

    const getMachineTypes = async () => {
      const response = await fetch(`/api/machine-type/`, {
        method: "GET",
      }).then(checkResponseAuth);
      const data = await response.json();
      setMachineTypes(data);
    };

    const closeAddMachineModal = () => {
      setOpenAddOrganizationMachineModal(false);
      setErrorToggle(false);
      clearMachineDetails();
    };

    return (

      <Modal
        aria-labelledby="Add Organization Machine Modal"
        aria-describedby="Modal used for adding an organization's machine to the application"
        open={openAddOrganizationMachineModal}
        onClose={() => {
          closeAddMachineModal();
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card>
          <Grid container spacing={2} sx={{padding: '15px'}}>


            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">Add Machine</Typography>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Serial Number"
                value={machineDetails.serial_number}
                onChange={handleMachineDetailsChange("serial_number")}
                error = {machineDetails.name === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Machine Type"
                value={machineDetails.machine_type}
                onChange={handleMachineDetailsChange("machine_type")}
              >
                {Object.values(machineTypes).map((machine_type) => {
                  return <MenuItem value={machine_type}>{machine_type.name}</MenuItem>
                })}
              </TextField>
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
                  closeAddMachineModal();
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