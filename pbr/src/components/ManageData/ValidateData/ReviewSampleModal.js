import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAuth from "../../../services/useAuth";

import {
  Typography,
  Grid,
  Button,
  Card,
  Modal,
  TextField,
  Box,
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
    overflowY: "auto",
  },
}));

export default function ReviewSampleModal({
  openReviewSampleModal,
  setOpenReviewSampleModal,
  selectedSamples,
  acceptSample,
  rejectSample,
  turnPendingFilterOff,
}) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const [editedSamples, setEditedSamples] = React.useState(selectedSamples);
  const { checkResponseAuth, user } = useAuth();

  React.useEffect(() => {
    setEditedSamples(selectedSamples);
  }, [selectedSamples])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const removeFromPending = (sample) => {
    let newSelected = editedSamples.filter((s) => s !== sample);
    setEditedSamples(newSelected);
    if (newSelected.length === 0) {
      setOpenReviewSampleModal(false);
    }
  };

  const onAcceptSample = async (id) => {
    await acceptSample(id);
  };

  const onRejectSample = async (id) => {
    await rejectSample(id);
  };

  const editSample = async (sample) => {

    let payload = {
      comments: editedSamples.find((s) => s.id === sample.id).comments,
    };


    await fetch(`/api/sample/${sample.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkResponseAuth)
      .then((response) => {
        if (!response.ok) {
        } else {
          return response.json();
        }
      });
  };

  const handleSampleDetailsChange = (prop) => (event) => {

    // Shallow copy
    const newModifiedSamples = JSON.parse(JSON.stringify(editedSamples));

    newModifiedSamples.map((sample) => {
      if (sample.id === expanded) {
        sample.comments = event.target.value;
      }
      return sample;
    });
    setEditedSamples(newModifiedSamples);

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

  const listSelectedSamples = () => {

    return editedSamples.map((sample) => (
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
              {/* <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Organization"
                    value={sample.organization.name}
                    disabled
                  />
                </Grid> */}

              <Grid item xs>
                <TextField label="Flock" value={sample.flock.name} disabled />
              </Grid>

              {/* <Grid item xs>
                  <TextField
                    label="Source"
                    value={sample.organization.sources[0].name}
                    disabled
                  />
                </Grid> */}

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
          <br />

          <Grid item xs={12} sm={12}>
            <Typography gutterBottom variant="h5">
              {" "}
              Comments{" "}
            </Typography>
          </Grid>

          {editedSamples.length > 0 ? (
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label="Comments"
                value={
                  editedSamples.find(
                    (modifiedSample) => modifiedSample.id === sample.id
                  ).comments
                }
                onChange={handleSampleDetailsChange("comments")}
              />
            </Grid>
          ) : null}

          <Grid container spacing={2} sx={{ padding: "15px" }}>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={() => {
                  editSample(sample);
                  onAcceptSample(sample.id);
                  turnPendingFilterOff();
                  removeFromPending(sample);
                }}
              >
                Accept
              </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={() => {
                  editSample(sample);
                  onRejectSample(sample.id);
                  turnPendingFilterOff();
                  removeFromPending(sample);
                }}
              >
                Reject
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    ));
  };

  return (
    <Modal
      aria-labelledby="Review Sample Modal"
      aria-describedby="Modal used for reviewing a sample and accepting/rejecting it"
      open={openReviewSampleModal}
      onClose={() => {
        setEditedSamples(selectedSamples);
        setOpenReviewSampleModal(false);
      }}
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <Grid container spacing={2} sx={{ padding: "15px" }}>
            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">
                Review Sample
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              {listSelectedSamples()}
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  position: "absolute",
                  bottom: 50,
                }}
                onClick={() => {
                  setEditedSamples(selectedSamples)
                  setOpenReviewSampleModal(false);
                }}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </Card>
      </div>
    </Modal>
  );
}
