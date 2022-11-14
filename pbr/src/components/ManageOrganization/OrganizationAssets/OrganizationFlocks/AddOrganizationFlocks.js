import React from "react";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider, DateTimePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

import {
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  Alert,
  Modal,
  MenuItem,
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


// Start of Add Organization's Flocks Functionality

export default function AddOrganizationFlocks({
    getFlocks,
    openAddOrganizationFlockModal,
    setOpenAddOrganizationFlockModal,
    sources,
  }) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    useTheme();
    const { checkResponseAuth } = useAuth();

    const [flockDetails, setFlockDetails] = React.useState({
      name: "",
      strain: "",
      species: "",
      production_type: "",
      gender: "",
      source: "",
    });

    const [errorToggle, setErrorToggle] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const requiredFields = ["name", "strain", "species", "production_type", "gender", "birthday"]
    const [species, setSpecies] = React.useState([]);
    const [selectedSpecies, setSelectedSpecies] = React.useState("");
    const [strains, setStrains] = React.useState([]);
    const [productionTypes, setProductionTypes] = React.useState([]);
    const [genders, setGenders] = React.useState([]);
    const [birthday, setBirthday] = React.useState("");

    
    React.useEffect(async () => {
      await getSpecies();
      await getProductionTypes();
      await getGenders();
      setBirthday(new Date().toJSON());
    }, [])

    React.useEffect(async () => {
      await getStrains();
    }, [selectedSpecies])


    const handleFlockDetailsChange = (prop) => (event) => {  
      
      if (prop == "species") {
        setSelectedSpecies(event.target.value);
        setFlockDetails({
          ...flockDetails,
          [prop]: event.target.value,
        });
      }
      else {
        setFlockDetails({
          ...flockDetails,
          [prop]: event.target.value,
        });
      }

      console.log(flockDetails)
    };

    const clearFlockDetails = () => {
      setFlockDetails({
        name: "",
        strain: "",
        species: "",
        production_type: "",
        gender: "",
        source: "",
      })
    };


    let onSubmit = async () => {

      let error = false;

      requiredFields.forEach(field => {
        if(flockDetails[field] === "") {
          error = true;
          setErrorToggle(true)
          setErrorMessage("Required fields * cannot be empty.")
        }
      })
      if(error) {
        return;
      }

      let payload = {

        // Flock Parameters

        name: flockDetails.name,
        strain: flockDetails.strain,
        species: flockDetails.species,
        production_type: flockDetails.production_type,
        gender: flockDetails.gender,
        source_id: flockDetails.source.id,
        birthday: birthday
      };
      
      // API Call for POST Flock
      await fetch(`/api/flock/`, {
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
            setErrorMessage("Unable to create flock.")
            return
          } else {
            getFlocks();
            setOpenAddOrganizationFlockModal(false);
            clearFlockDetails();
            setErrorToggle(false);
            return response.json();
          }
        })
    };

    const getSpecies = async () => {
      const response = await fetch(`/api/enum/species`, {
        method: "GET",
      }).then(checkResponseAuth);
      const data = await response.json();
      setSpecies(Object.values(data));
      setSelectedSpecies(Object.values(data)[0])
    };

    const getStrains = async () => {
      const response = await fetch(`/api/enum/strain/${selectedSpecies}`, {
        method: "GET",
      }).then(checkResponseAuth);
      const data = await response.json();
      setStrains(Object.values(data));
    };

    const getProductionTypes = async () => {
      const response = await fetch(`/api/enum/production-type`, {
        method: "GET",
      }).then(checkResponseAuth);
      const data = await response.json();
      setProductionTypes(Object.values(data));
    };

    const getGenders = async () => {
      const response = await fetch(`/api/enum/gender`, {
        method: "GET",
      }).then(checkResponseAuth);
      const data = await response.json();
      setGenders(Object.values(data));
    };

    return (

      <Modal
        aria-labelledby="Add Organization Flock Modal"
        aria-describedby="Modal used for adding an organization's flock to the application"
        open={openAddOrganizationFlockModal}
        onClose={() => {
          setOpenAddOrganizationFlockModal(false);
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card>
          <Grid container spacing={2} sx={{padding: '15px'}}>


            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">Add Flock</Typography>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Name"
                value={flockDetails.name}
                onChange={handleFlockDetailsChange("name")}
                error = {flockDetails.name === "" ? true : false}
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Species"
                value={flockDetails.species}
                onChange={handleFlockDetailsChange('species')}
              >
                {Object.values(species).map((species) => {
                  return <MenuItem value={species}>{species}</MenuItem>
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Strain"
                value={flockDetails.s}
                onChange={handleFlockDetailsChange('strain')}
              >
                {Object.values(strains).map((strain) => {
                  return <MenuItem value={strain}>{strain}</MenuItem>
                })}
              </TextField>
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Production Type"
                value={flockDetails.production_type}
                onChange={handleFlockDetailsChange('production_type')}
              >
                {Object.values(productionTypes).map((prodType) => {
                  return <MenuItem value={prodType}>{prodType}</MenuItem>
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Gender"
                value={flockDetails.gender}
                onChange={handleFlockDetailsChange('gender')}
              >
                {Object.values(genders).map((gender) => {
                  return <MenuItem value={gender}>{gender}</MenuItem>
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Source"
                value={sources}
                onChange={handleFlockDetailsChange('source')}
              >
                {Object.values(sources).map((source) => {
                  return <MenuItem value={source}>{source.name}</MenuItem>
                })}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Birthday"
                  value={birthday}
                  onChange={(newValue) => {
                    setBirthday(newValue);
                  }}
                />
              </LocalizationProvider>
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
                  setOpenAddOrganizationFlockModal(false);
                  setErrorToggle(false);
                  clearFlockDetails();
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