import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useAuth from "../../../services/useAuth";
import { sampleTypes, ageUnits } from "../../../models/enums";

import {
  Typography,
  Grid,
  TextField,
  InputLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Button,
  Box,
  Card,
  Select,
  MenuItem,
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

  const { checkResponseAuth, user } = useAuth();

  const [modalStyle] = React.useState(getModalStyle);

  const [flocks, setFlocks] = React.useState([]);
  const [flock, setFlock] = React.useState({});
  const [flockInput, setFlockInput] = React.useState("");

  const [sources, setSources] = React.useState([]);
  const [source, setSource] = React.useState({});

  const [organization, setOrganization] = React.useState({});
  const [organizations, setOrganizations] = React.useState([]);

  const [errorSubmission, setErrorSubmission] = React.useState(false);
  const [SampleDetails, setSampleDetails] = React.useState({
    comments: "",
    flock_age: null,
    flock_age_unit: null,
    batch_id: null,
    measurements: [],
  });

  useTheme();

  const {
    SampleToEdit,
    editSampleModalVisiblity,
    setEditSampleModalVisibility,
    Organization,
    roles,
  } = props;

  const [sampleType, setSampleType] = React.useState(SampleToEdit.sample_type);
  const [ageUnit, seAgeUnit] = React.useState(SampleToEdit.flock_age_unit);

  const editSample = () => {
    console.log("submitting eidted Sample");
  };

  const handleSampleDetailsChange = (prop) => (event) => {
    setSampleDetails({
      ...SampleDetails,
      [prop]: event.target.value,
    });
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


  const getFlocks = async () => {
    await fetch(`/api/flock/source/${source.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.forEach((flock) => {
          flock.label = flock.name;
        });
        setFlocks(data);
        setFlock(data[0]);
      });
  };

  const getSources = async () => {
    await fetch(`/api/source/organization/${organization.id}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSource(data[0]);
        setSources(data);
      });
  };

  const getOrganizations = async () => {
    const response = await fetch(`/api/organization/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    setOrganizations(data);
    setOrganization(data.filter((org) => org.id === Organization.id)[0]);
  };

  React.useEffect(async () => {
    if (editSampleModalVisiblity) {
      if (user.role === roles["Super_Admin"]) {
        await getOrganizations();
      } else {
        setOrganization({ id: user.organization_id });
      }

      // await getCartridgeTypes();
    }
  }, [editSampleModalVisiblity]);

  React.useEffect(async () => {
    if (editSampleModalVisiblity) {
      await getSources();
    }
  }, [organization]);

  const clearSampleType = () => {
    setSampleType("");
  };

  React.useEffect(async () => {
    if (editSampleModalVisiblity) {
      await getFlocks();
    }
  }, [source]);

  const listSamples = () => {
    console.log(SampleToEdit);
    return (
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
            <Grid item xs={4}>
              {user.role === roles["Super_Admin"] && (
                <>
                  <InputLabel id="label-select-organization">
                    Organization
                  </InputLabel>
                  <Select
                    labelId="label-select-organization"
                    id="select-organization"
                    value={organization}
                    label="Source"
                    onChange={(e) => {
                      setOrganization(e.target.value);
                    }}
                  >
                    {organizations.map((org) => {
                      return (
                        <MenuItem key={org.id} value={org}>
                          {org.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </>
              )}
            </Grid>

            <Grid item xs={8}>
              <InputLabel id="label-select-flocks">Flocks</InputLabel>
              <Select
                labelId="label-select-flocks"
                id="select-flocks"
                value={flock}
                label="flock"
                onChange={(e) => {
                  setFlock(e.target.value);
                }}
              >
                {flocks.map((f) => {
                  return (
                    <MenuItem key={f.id} value={f}>
                      {f.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>

            <Grid item xs={8}>
              <InputLabel id="label-select-organization">Source</InputLabel>
              <Select
                labelId="label-select-source"
                id="select-sources"
                value={source}
                label="Source"
                onChange={(e) => {
                  setSource(e.target.value);
                }}
              >
                {sources.map((s) => {
                  return (
                    <MenuItem key={s.id} value={s}>
                      {s.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel id="label-select-organization">Species</InputLabel>
              <TextField value={flock.species} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel id="label-select-organization">
                Production Type
              </InputLabel>
              <TextField value={flock.production_type} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel id="label-select-organization">Strain</InputLabel>
              <TextField value={flock.strain} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel id="label-select-organization">Gender</InputLabel>
              <TextField value={flock.gender} disabled />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="Age" value={SampleToEdit.flock_age} />
            </Grid>

            <Grid item xs={4}>
              <FormControl sx={{ width: "100%" }} required>
                <InputLabel>D/W/M/Y</InputLabel>
                <Select
                  value={ageUnit}
                  label="D/W/M/Y *"
                  onChange={handleSampleDetailsChange("flock_age_unit")}
                >
                  {Object.values(ageUnits).map((unit, index) => {
                    return (
                      <MenuItem value={unit} key={index}>
                        {unit}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
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
            {fillMachineData(SampleToEdit)}
          </Grid>
        </Box>
        <br />

        <Grid className={classes.container}>
          <Typography gutterBottom variant="button">
            Categorize This Sample:
          </Typography>

          <RadioGroup value={sampleType} onChange={setSampleType}>
            <FormControlLabel
              value="Surveillance"
              label={`${sampleTypes.SURVEILLANCE} Sample (Healthy)`}
              control={<Radio />}
            />
            <FormControlLabel
              value="Diagnostic"
              label={`${sampleTypes.DIAGNOSTIC} Sample (Sick)`}
              control={<Radio />}
            />
          </RadioGroup>
          {SampleDetails.sample_type != null && (
            <Button
              sx={{ mt: "0.5rem", ml: "-0.25rem" }}
              size="small"
              onClick={clearSampleType}
            >
              Clear Selection
            </Button>
          )}
        </Grid>

        <Grid item xs={12} sm={12}>
          <Typography gutterBottom variant="h5">
            {" "}
            Comments{" "}
          </Typography>
          <br />
        </Grid>

        <Grid item xs={12} sm={12}>
          <TextField fullWidth label="Comments" value={SampleToEdit.comments} />
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
    );
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
