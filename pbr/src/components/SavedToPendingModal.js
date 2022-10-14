import React from "react";
import { useTheme } from "@mui/material/styles";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  Alert,
  Modal,
  MenuItem,
  Select,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

function getModalStyle() {
  const top = 55;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,

    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    height: 500,
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "1em",
    overflowY: "auto",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SavedToPendingModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  useTheme();

  const {
    selectedSamples,
    submitAll,
    submitOne,
    SavedToPendingVisibility,
    setSavedToPendingVisibility,
    setSelectedSamples,
  } = props;


  

const removeFromSelected = (sample) => {
    let newSelected = selectedSamples.filter((s) => s !== sample);
    setSelectedSamples(newSelected);
    if (newSelected.length === 0) {
      setSavedToPendingVisibility(false);
    }

};
  const onSubmitAll = async () => {
    await submitAll();
    setSavedToPendingVisibility(false);
  };

  const onSubmitOne = async (id) => {
    await submitOne(id);
    listSamples();
  };

const IstatORVescan = (sample) => {
    if (sample.measurement_values.length === 13){
      return (
        <Typography gutterBottom variant="body1">
          Istat Data:
        </Typography>
      );
    } else {
      return (
        <Typography gutterBottom variant="body1">
          VetScan Data:
        </Typography>
      );
    }
  };


  const fillMAchineData = (sample) => {
    
    return sample.measurement_values.map((measurement) =>(
      <Grid item xs={12} sm={6}>
        <TextField label={measurement.measurement.measurementtype.abbreviation} value={measurement.value} disabled />
      </Grid>
    ));

  };

  const listSamples = () => {
    return selectedSamples.map((sample) => (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Sample id : {sample.id}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              General{" "}
            </Typography>
          </Grid>
          <br />

          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row" alignItems="center" spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Orgaanization"
                  value={sample.organization.name}
                  disabled
                />
              </Grid>

              <Grid item xs>
                <TextField label="Flock" value={sample.flock.name} disabled />
              </Grid>

              <Grid item xs>
                <TextField
                  label="Source"
                  value={sample.organization.sources[0].name}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Species"
                  value={sample.flock.species}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Production Type"
                  value={sample.flock.production_type}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Strain"
                  value={sample.flock.strain}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  value={sample.flock.gender}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  value={sample.flock_age + " " + sample.flock_age_unit}
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Sample Type"
                  value={sample.sample_type}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>

          <br />

          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              Machine Data{" "}
            </Typography>
            {IstatORVescan(sample)}
            <br />
          </Grid>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row" alignItems="center" spacing={3}>
              {fillMAchineData(sample)}
            </Grid>
          </Box>

          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              Comments{" "}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              label="Comments"
              value={sample.comments}
              disabled
            />
          </Grid>

          <br />

          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              onClick={() => {
                onSubmitOne(sample.id);
                removeFromSelected(sample);
              }}
            >
              Submit
            </Button>
          </Grid>
        </AccordionDetails>
      </Accordion>
    ));
  };

  console.log("from the modal here are the selected samples", selectedSamples);

  return (
    <Modal
      open={SavedToPendingVisibility}
      onClose={() => setSavedToPendingVisibility(false)}
      aria-labelledby="Accept or Reject Modal"
      aria-describedby="Modal Used to accept or reject a  Pending sample"
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <Grid container spacing={2} sx={{ padding: "15px" }}>
            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">
                Submit Samples For Review.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              {listSamples()}
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                onClick={() => {
                  setSavedToPendingVisibility(false);
                }}
              >
                Cancel
              </Button>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={() => {
                  onSubmitAll();
                }}
              >
                Submit All
              </Button>
            </Grid>
          </Grid>
        </Card>
      </div>
    </Modal>
  );
}
