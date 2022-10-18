import * as React from "react";
import { useTheme } from "@mui/material/styles";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
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
    height: 800,
    width: 1000,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "1em",
    "overflow-y": "auto",
  },
}));



export default function SavedToPendingModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [expanded, setExpanded] = React.useState(false);
  const [errorSubmission, setErrorSubmission] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useTheme();

  const {
    selectedSamples,
    submitAll,
    submitOne,
    SavedToPendingVisibility,
    setSavedToPendingVisibility,
    setSelectedSamples,
  } = props;

  const validateSampleBeforeSubmission = (sample) => {

    if (sample.measurement_values.length === 13 || sample.measurement_values.length === 17) {

      return true;
    }

  };

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

  const onSubmitOne = async (sample) => {

    if (validateSampleBeforeSubmission(sample)) {
      await submitOne(sample.id);
      removeFromSelected(sample);
      listSamples();
      setErrorSubmission(false);
    }
    else {
      setErrorSubmission(true);
    }

    

  };

  const IstatORVescan = (sample) => {
    if (sample.measurement_values.length === 13) {
      return (
        <Typography gutterBottom variant="body1">
          Istat Data:
        </Typography>
      );
    } else if (sample.measurement_values.length === 17) {
      return (
        <Typography gutterBottom variant="body1">
          VetScan Data:
        </Typography>
      );
    }
  };

  const fillMachineData = (sample) => {
    return sample.measurement_values.map((measurement) => (
      <Grid item xs={12} sm={6}>
        <TextField
          label={measurement.measurement.measurementtype.abbreviation}
          value={measurement.value}
          disabled
        />
      </Grid>
    ));
  };

 

  const listSamples = () => {
    return selectedSamples.map((sample) => (
      <Accordion
        expanded={expanded === sample.id}
        onChange={handleChange(sample.id)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography variant="button" sx={{ width: "33%", flexShrink: 0 }}>
            {" "}
            Sample ID: {sample.id}
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ "max-height": 450, "overflow-y": "auto" }}>
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
                  label="Organization"
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
            {sample.measurement_values.length === 13 ||
            sample.measurement_values.length == 17 ? (
              IstatORVescan(sample)
            ) : (
              <Typography
                gutterBottom
                variant="button"
                style={{ color: "red" }}
              >
                The Machine Data associated to the sample is incomplete.
              </Typography>
            )}
            <br />
            <br />
            <br />
          </Grid>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row" alignItems="center" spacing={3}>
              {fillMachineData(sample)}
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
                onSubmitOne(sample);
              }}
            >
              Submit
            </Button>
          </Grid>
        </AccordionDetails>
      </Accordion>
    ));
  };


  return (
    <Modal
      open={SavedToPendingVisibility}
      onClose={() => setSavedToPendingVisibility(false)}
      aria-labelledby="Saved to Pending Modal"
      aria-describedby="Modal Used Save a Pending Sample"
      //ref={myRef}
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
          </Grid>
        </Card>

        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="secondary"
            style={{
              position: "absolute",
              bottom: 50,
            }}
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
            style={{
              position: "absolute",
              bottom: 50,
              left: 150,
            }}
            onClick={() => {
              onSubmitAll();
            }}
          >
            Submit All
          </Button>
        </Grid>

        <Grid>
          <br />
          {errorSubmission ? (
            <Typography gutterBottom variant="button" style={{ color: "red", position: "absolute",
              bottom: 50,
              left: 280,}}>
              The Machine Data associated to the sample is incomplete.
            </Typography>
          ) : null}
        </Grid>

      </div>
    </Modal>
  );
}
