import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useAuth from "../../../services/useAuth";
import { sampleTypes, ageUnits } from "../../../models/enums";
import ErrorIcon from "@mui/icons-material/Error";

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

export default function EditSampleModal(props) {
  const {
    SampleToEdit,
    editSampleModalVisiblity,
    setEditSampleModalVisibility,
    roles,
    getData,
    currentCartridgeType,
    setSelected,
    currentOrganization,
  } = props;

  const classes = useStyles();

  const { checkResponseAuth, user } = useAuth();

  const [modalStyle] = React.useState(getModalStyle);

  const [flocks, setFlocks] = React.useState([]);
  const [flock, setFlock] = React.useState({});

  const [sources, setSources] = React.useState([]);
  const [source, setSource] = React.useState({});

  const [organization, setOrganization] = React.useState({});
  const [organizations, setOrganizations] = React.useState([]);

  const [cartridgeType, setCartridgeType] = React.useState({});
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);

  const [errorSubmission, setErrorSubmission] = React.useState(false);
  const [errorSubmissionMessages, setErrorSubmissionMessages] = React.useState(
    []
  );

  const [SampleDetails, setSampleDetails] = React.useState({
    comments: SampleToEdit.comments,
    sample_type: SampleToEdit.sample_type,
    flock_age: SampleToEdit.flock_age,
    flock_age_unit: SampleToEdit.flock_age_unit,
    measurements: [],
  });

  useTheme();

  const passMesearments = () => {
    let values = [];
    SampleToEdit.measurements.forEach((measurement) => {
      values.push({
        analyte_id: measurement.analyte.id,
        value: measurement.value,
      });
    });

    return values;
  };

  const editSample = async () => {
    let newMeasurements = passMesearments();

    let payload = {
      comments: SampleDetails.comments,
      sample_type: SampleDetails.sample_type,
      flock_age: SampleDetails.flock_age,
      flock_age_unit: SampleDetails.flock_age_unit,
      organization_id: organization.id,
      flock_id: flock.id,
      measurements: newMeasurements,
    };

    await fetch(`/api/sample/${SampleToEdit.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkResponseAuth)
      .then((response) => {
        if (!response.ok) {
          console.log("Editing Error");
          console.log(response);
          setErrorSubmission(true);
        } else {
          setEditSampleModalVisibility(false);
          setSelected([]);
          getData();
          return response.json();
        }
      });
  };

  const handleSampleDetailsChange = (prop) => (event) => {
    setSampleDetails({
      ...SampleDetails,
      [prop]: event.target.value,
    });
  };

  const sampleMeasurements = () => {
    return (
      <>
        <Box style={{ margin: "25px" }}>
          {cartridgeType.analytes &&
            SampleDetails.measurements &&
            SampleDetails.measurements.length > 0 &&
            cartridgeType.analytes.map((a, index) => {
              return (
                <>
                  <TextField
                    label={a.abbreviation}
                    style={{ margin: 4 }}
                    value={SampleDetails.measurements[index].value}
                    onChange={(e) => {
                      const measurements = SampleDetails.measurements;
                      measurements[index].value = e.target.value;
                      setSampleDetails((prevState) => {
                        return { ...prevState, measurements: measurements };
                      });
                    }}
                  />
                </>
              );
            })}
        </Box>
      </>
    );
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

  const getCartridgeTypes = async () => {
    await fetch(`/api/cartridge-type`)
      .then((response) => {
        return response.json();
      })
      .then(checkResponseAuth)
      .then((data) => {
        setCartridgeTypes(data);
        setCartridgeType(
          data.filter((c) => c.id === currentCartridgeType.id)[0]
        );

        setSampleDetails((prevState) => {
          return {
            ...prevState,
            measurements: SampleToEdit.measurements,
          };
        });
      });
  };

  const getOrganizations = async () => {
    const response = await fetch(`/api/organization/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    setOrganizations(data);
    setOrganization(data.filter((org) => org.id === currentOrganization.id)[0]);
  };

  const validateSample = () => {
    let errors = [];
    let valid = true;
    setErrorSubmission(false);

    SampleDetails.measurements.forEach((measurement) => {
      console.log("value: " + measurement.value, isNaN(measurement.value));
      if (isNaN(measurement.value) && measurement.value != "") {
        let err =
          "Measurement for" +
          " " +
          measurement.analyte.abbreviation +
          " must be a number";
        errors.push(err);
        valid = false;
      }
    });

    if (valid === false) {
      setErrorSubmissionMessages(errors);
    }

    return valid;
  };

  React.useEffect(async () => {
    if (editSampleModalVisiblity) {
      if (user.role === roles["Super_Admin"]) {
        await getOrganizations();
      } else {
        setOrganization({ id: user.organization_id });
      }

      await getCartridgeTypes();
    }
  }, [editSampleModalVisiblity]);

  React.useEffect(async () => {
    if (editSampleModalVisiblity) {
      await getSources();
    }
  }, [organization]);

  const clearSampleType = () => {
    setSampleDetails({
      ...SampleDetails,
      ["sample_type"]: null,
    });
  };

  React.useEffect(async () => {
    if (editSampleModalVisiblity) {
      await getFlocks();
    }
  }, [source]);

  const selectedSample = () => {
    return (
      <>
        <Grid item xs={12} sm={12}>
          <Typography gutterBottom variant="button">
            General Information
          </Typography>
        </Grid>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} style={{ padding: "25px" }}>
            <Grid item xs={8}>
              {user.role === roles["Super_Admin"] ? (
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
                      setFlocks([]);
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
              ) : (
                <>
                  <InputLabel id="label-select-organization">
                    Organization
                  </InputLabel>
                  <TextField
                    value={currentOrganization.name}
                    style={{ width: "300px" }}
                    disabled
                  />
                </>
              )}
            </Grid>

            <Grid item xs={4}>
              <InputLabel id="label-select-organization">
                Cartridge Type
              </InputLabel>
              <TextField
                value={cartridgeType.name}
                disabled
                style={{ width: "300px" }}
              />
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

            <Grid item xs={4}>
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
          </Grid>

          {flock !== undefined ? (
            <>
              <Grid container spacing={2} style={{ padding: "25px" }}>
                <Grid item xs={8}>
                  <InputLabel id="label-select-organization">
                    Species
                  </InputLabel>
                  <TextField value={flock.species} disabled />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel id="label-select-organization">
                    Production Type
                  </InputLabel>
                  <TextField value={flock.production_type} disabled />
                </Grid>
                <Grid item xs={8}>
                  <InputLabel id="label-select-organization">Strain</InputLabel>
                  <TextField value={flock.strain} disabled />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel id="label-select-organization">Gender</InputLabel>
                  <TextField value={flock.gender} disabled />
                </Grid>
              </Grid>
            </>
          ) : (
            <Typography
              gutterBottom
              variant="button"
              style={{ color: "red", padding: "25px" }}
            >
              There are no flocks associated with the selected source{" "}
            </Typography>
          )}

          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={2}
            style={{ padding: "25px" }}
          >
            <Grid item xs={8}>
              <TextField
                label="Age"
                value={SampleDetails.flock_age}
                onChange={handleSampleDetailsChange("flock_age")}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>D/W/M/Y</InputLabel>
                <Select
                  value={SampleDetails.flock_age_unit}
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

        <Grid item xs={12} sm={12}>
          <Typography gutterBottom variant="button">
            {" "}
            Measurements{" "}
          </Typography>
        </Grid>

        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={3}
            style={{ padding: "25px" }}
          >
            {sampleMeasurements()}
          </Grid>
        </Box>

        <Grid className={classes.container}>
          <Typography gutterBottom variant="button">
            Categorize This Sample:
          </Typography>

          <RadioGroup
            value={SampleDetails.sample_type}
            onChange={handleSampleDetailsChange("sample_type")}
            style={{ marginLeft: "25px" }}
          >
            <FormControlLabel
              value={sampleTypes.SURVEILLANCE}
              label={`${sampleTypes.SURVEILLANCE} Sample`}
              control={<Radio />}
            />
            <FormControlLabel
              value={sampleTypes.DIAGNOSTIC}
              label={`${sampleTypes.DIAGNOSTIC} Sample`}
              control={<Radio />}
            />
          </RadioGroup>
          {SampleDetails.sample_type != null && (
            <Button
              sx={{ mt: "0.5rem", ml: "-0.25rem" }}
              size="small"
              onClick={clearSampleType}
              style={{ marginLeft: "25px" }}
            >
              Clear Selection
            </Button>
          )}
        </Grid>

        <Typography gutterBottom variant="button" style={{ marginTop: "25px" }}>
          Comments:
        </Typography>

        <Grid item xs={12} sm={12} style={{ padding: "25px" }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            label="Comments"
            value={SampleDetails.comments}
            onChange={handleSampleDetailsChange("comments")}
          />
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
                  if (validateSample()) {
                    editSample();
                    setEditSampleModalVisibility(false);
                  } else {
                    setErrorSubmission(true);
                  }
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
              {selectedSample()}
            </Grid>
          </Grid>
        </Card>

        <Box sx={{ flexGrow: 1 }} style={{ padding: "15px" }}>
          {errorSubmission ? (
            <Typography
              gutterBottom
              variant="button"
              style={{
                color: "red",
              }}
            >
              Fix Error before saving Sample:
              {errorSubmissionMessages.map((message) => (
                <ListItem>
                  <ErrorIcon />
                  <ListItemText primary={message} />
                </ListItem>
              ))}
            </Typography>
          ) : null}
        </Box>
      </div>
    </Modal>
  );
}
