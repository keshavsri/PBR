import * as React from "react";
import { useTheme } from "@mui/material/styles";

import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Card,
  Modal,
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

export default function EditSampleModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [errorSubmission, setErrorSubmission] = React.useState(false);

  useTheme();

  const {
    selectedSamples,
    editSampleModalVisiblity,
    setEditSampleModalVisibility,
    Organization,
  } = props;

  const editSample = () => {
    console.log("submitting eidted Sample");
  };

  const fillMachineData = (sample) => {
    return sample.measurements.map((measurement) => (
      <Grid item xs={12} sm={6}>
        <TextField
          label={measurement.analyte.abbreviation}
          value={measurement.value}
        />
      </Grid>
    ));
  };

  const listSamples = () => {
    return selectedSamples.map((sample) => (
      <>
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
                value={Organization.name}
                disabled
              />
            </Grid>

            <Grid item xs>
              <TextField label="Flock" value={sample.flock.name} />
            </Grid>

            {/* <Grid item xs>
                <TextField
                  label="Source"
                  value={sample.organization.sources[0].name}
                />
              </Grid> */}

            <Grid item xs={12} sm={6}>
              <TextField label="Species" value={sample.flock.species} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Production Type"
                value={sample.flock.production_type}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Strain" value={sample.flock.strain} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Gender" value={sample.flock.gender} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                value={sample.flock_age + " " + sample.flock_age_unit}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Sample Type" value={sample.sample_type} />
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
          <TextField fullWidth label="Comments" value={sample.comments} />
        </Grid>

        <br />

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} columns={16}>
            <Grid item xs={8}>
              <Button
                variant="contained"
                color="secondary"
                style={{ width: 200 }}
                onClick={() => {
                  setEditSampleModalVisibility(false);
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
                  editSample();
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </>
    ));
  };

  return (
    <Modal
      open={editSampleModalVisiblity}
      onClose={() => setEditSampleModalVisibility(false)}
      aria-labelledby="Edit Sample Modal"
      aria-describedby="Modal Used to Edit a Sample"
      //ref={myRef}
    >
      <div style={modalStyle} className={classes.paper}>
        <Card>
          <Grid container spacing={2} sx={{ padding: "15px" }}>
            <Grid item xs={12} sm={12}>
              <Typography gutterBottom variant="h4">
                Edit Sample
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              {listSamples()}
            </Grid>
          </Grid>
        </Card>

        <Grid>
          <br />
          {errorSubmission ? (
            <Typography
              gutterBottom
              variant="button"
              style={{
                color: "red",
                position: "absolute",
                bottom: 50,
                left: 280,
              }}
            >
              The Machine Data associated to the sample is incomplete.
            </Typography>
          ) : null}
        </Grid>
      </div>
    </Modal>
  );
}
