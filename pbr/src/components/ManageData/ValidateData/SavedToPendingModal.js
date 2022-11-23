import * as React from "react";
import { useTheme } from "@mui/material/styles";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorIcon from "@mui/icons-material/Error";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  Modal,
  ListItemText,
  ListItem,
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
  const [errorSubmissionAll, setErrorSubmissionAll] = React.useState(false);

  const [errorSubmissionMessages, setErrorSubmissionMessages] = React.useState(
    []
  );

  const [submitAllErrors, setSubmitAllErrors] = React.useState([]);

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
    setErrorSubmissionAll(false);
  };

  const onSubmitOne = async (sample) => {
    await submitOne(sample.id);
    removeFromSelected(sample);
    listSamples();
    setErrorSubmission(false);
  };

  const setErrorMessage = (error) => {
    let newErrorMessages = errorSubmissionMessages;
    newErrorMessages.push(error);
    setErrorSubmissionMessages(newErrorMessages);
  };

  const validateSample = (sample) => {
    let errors = [];
    console.log("Validating sample", sample.id);
    console.log(sample);
    let valid = true;
    setErrorSubmission(false);
    setErrorSubmissionAll(false);

    if (sample.flock_age === null) {
      let err = "Sample " + sample.id + ": " + "Flock age is required";
      errors.push(err);
      setSubmitAllErrors((submitAllErrors) => [...submitAllErrors, err]);
      valid = false;
    }
    if (sample.flock_age_unit === null) {
      let err = "Sample " + sample.id + ": " + "Flock age unit is required";
      errors.push(err);
      setSubmitAllErrors((submitAllErrors) => [...submitAllErrors, err]);
      valid = false;
    }

    if (valid === false) {
      setErrorSubmissionMessages(errors);
    }

    return valid;
  };

  const fillMachineData = (sample) => {
    return sample.measurements.map((measurement) => (
      <Grid item xs={12} sm={6}>
        <TextField
          label={measurement.analyte.abbreviation}
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
              <Grid item xs>
                <TextField label="Flock" value={sample.flock.name} disabled />
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
              Measurements{" "}
            </Typography>

            <br />
          </Grid>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row" alignItems="center" spacing={3}>
              {fillMachineData(sample)}
            </Grid>
          </Box>
          <br />
          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              Comments{" "}
            </Typography>
            <br />
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
                console.log("submitting one sample");
                if (validateSample(sample)) {
                  onSubmitOne(sample);
                } else {
                  setErrorSubmission(true);
                }
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

          <Box sx={{ flexGrow: 1 }} style={{ padding: "15px" }}>
            <Grid container spacing={2} columns={16}>
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ width: 200 }}
                  onClick={() => {
                    setSavedToPendingVisibility(false);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: 200 }}
                  onClick={() => {
                    let valid = true;
                    setSubmitAllErrors([]);

                    console.log("submitting all samples");

                    selectedSamples.forEach((sample) => {
                      if (!validateSample(sample)) {
                        setErrorSubmissionAll(true);
                        valid = false;
                      }
                    });

                    if (valid) {
                      onSubmitAll();
                    }

                    console.log("all errors", submitAllErrors);
                  }}
                >
                  Submit All
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ flexGrow: 1 }} style={{ padding: "15px" }}>
            {errorSubmission ? (
              <Typography
                gutterBottom
                variant="button"
                style={{
                  color: "red",
                }}
              >
                Fix Error before Submitting:
                {errorSubmissionMessages.map((message) => (
                  <ListItem>
                    <ErrorIcon />
                    <ListItemText primary={message} />
                  </ListItem>
                ))}
              </Typography>
            ) : null}
          </Box>

          <Box sx={{ flexGrow: 1 }} style={{ padding: "15px" }}>
            {errorSubmissionAll ? (
              <Typography
                gutterBottom
                variant="button"
                style={{
                  color: "red",
                }}
              >
                Fix Error before Submitting:
                {submitAllErrors.map((message) => (
                  <ListItem>
                    <ErrorIcon />
                    <ListItemText primary={message} />
                  </ListItem>
                ))}
              </Typography>
            ) : null}
          </Box>
        </Card>
      </div>
    </Modal>
  );
}
