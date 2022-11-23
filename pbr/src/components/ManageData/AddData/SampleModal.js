import * as React from "react";

import {
  Button,
  Stack,
  Box,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Typography,
  Card,
  Modal,
  FormControlLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  FormControl,
} from "@mui/material";
import SampleIcon from "@mui/icons-material/Science";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { sampleTypes, ageUnits } from "../../../models/enums";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

import useAuth from "../../../services/useAuth";
import useDataView from "../../../services/useDataView";

function getModalStyle() {
  const top = 55;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    overflow: "scroll",
    transform: `translate(-${top}%, -${left}%)`,
    position: "absolute",
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

const filter = createFilterOptions();

export default function DataViewSampleModal(props) {
  const { getData, roles } = props;
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  useTheme();

  const {
    sampleModalVisibility,
    closeSampleModal,
    setError,
    setSampleType,
    setSampleLoading,
  } = useDataView();

  const { checkResponseAuth, user } = useAuth();

  const [organizations, setOrganizations] = React.useState([]);
  const [flocks, setFlocks] = React.useState([]);
  const [sources, setSources] = React.useState([]);
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);
  const [cartridgeType, setCartridgeType] = React.useState({});
  const [machines, setMachines] = React.useState([]);
  const [machine, setMachine] = React.useState({});
  const [flock, setFlock] = React.useState({});
  const [flockInput, setFlockInput] = React.useState("");
  const [source, setSource] = React.useState({});
  const [organization, setOrganization] = React.useState({});
  const [expanded, setExpanded] = React.useState(true);
  const [errorSubmission, setErrorSubmission] = React.useState(false);
  const [SampleDetails, setSampleDetails] = React.useState({
    comments: "",
    flock_age: null,
    flock_age_unit: null,
    sample_type: null,
    batch_id: null,
    measurements: [],
    rotor_lot_number : ""
  });

  React.useEffect(async () => {
    if (sampleModalVisibility) {
      if (user.role === roles["Super_Admin"]) {
        await getOrganizations();
      } else {
        setOrganization({ id: user.organization_id });
      }

      await getCartridgeTypes();
    }
  }, [sampleModalVisibility]);

  React.useEffect(async () => {
    if (sampleModalVisibility) {
      await getSources();
      await getMachines();
    }
  }, [organization]);



  React.useEffect(async () => {
    if (sampleModalVisibility) {
      await getFlocks();
    }
  }, [source]);

  React.useEffect(async () => {
    await handleAnalytes();
    await sampleMeasurements();
  }, [cartridgeType]);


  const getOrganizations = async () => {
    const response = await fetch(`/api/organization/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    setOrganizations(data);
    setOrganization(data[0]);
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

  const handleSampleDetailsChange = (prop) => (event) => {
    setSampleDetails({
      ...SampleDetails,
      [prop]: event.target.value,
    });
  };

  const handleSampleTypeChange = (event) => {
    setSampleType(event.target.value);
  };

  const clearSampleType = () => {
    setSampleType("");
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const sampleMeasurements = () => {
    const {measurements} = SampleDetails;
    const {analytes} = cartridgeType;
    return (
      <>
        <Grid item xs={12}>
          <br></br>
          <Typography gutterBottom variant="button">
            Sample Measurements
          </Typography>
        </Grid>
        <Box>
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
  }

  const renderMeasurement = (measurement, analyte) => {
    if (measurement && analyte  ) {
      return (
        <>
          <TextField
            label={analyte.abbreviation}
            style={{ margin: 4 }}
            value={measurement.value}
            onChange={(e) => {
              const measurements = SampleDetails.measurements;
              const measurement = measurements.find((meas) => meas.analyte_id === analyte.id);
              measurement.value = e.target.value;
              setSampleDetails((prevState) => {
                return { ...prevState, measurements: measurements };
              });
            }}
          />
        </>
      );
    }
  }

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
        setCartridgeType(data[0]);
        const measurements = data[0].analytes.map((analyte) => ({
          analyte_id: analyte.id,
          value: '',
        }));
        setSampleDetails((prevState) => {
          return {
            ...prevState,
            measurements: measurements,
          };
        });
      });
  };

  const getMachines = async () => {
    await fetch(`/api/machine/organization/${organization.id}`)
    .then((response) => {
      return response.json();
    })
    .then(checkResponseAuth)
    .then((data) => {
      setMachines(data);
      setMachine(data[0]);
    });
  };





  function handleFlockInputChange(event, value) {
    setFlockInput(value);
  }

  function handleFlockChange(event, value) {
    setFlock(value);
  }

  const validateSample = () => {
    console.log("validating sample");
    console.log(SampleDetails);
    let valid = true;

    if (isNaN(SampleDetails.flock_age) && SampleDetails.flock_age != "") {
      setAgeError(true);
      valid = false;
    }

    return valid;
  };

  const resetSampleDetails = () => {
    setSampleDetails({
      comments: "",
      flock_age: null,
      flock_age_unit: null,
      sample_type: null,
      measurements: [],
    });
    if (user.role === roles["Super_Admin"]) {
      setOrganization(organizations[0]);
    } else {
      setOrganization({ id: user.organization_id });
    }
    setSource(sources[0]);
    setFlock(flocks[0]);
    setCartridgeType(cartridgeTypes[0]);
  };

  let onSubmit = async () => {
    const newSampleDetails = SampleDetails;
    const measurements = newSampleDetails.measurements;
    measurements.forEach(meas => {
      if (meas.value === '') {
        meas.value = null;
      }
    })

    let payload = {
      comments: SampleDetails.comments,
      flock_age: SampleDetails.flock_age,
      flock_age_unit: SampleDetails.flock_age_unit,
      sample_type: SampleDetails.sample_type,
      batch_id: SampleDetails.batch_id,
      flock_id: flock.id,
      cartridge_type_id: cartridgeType.id,
      rotor_lot_number: SampleDetails.rotor_lot_number,
      machine_id: machine.id,
      measurements: measurements,
      organization_id: organization.id,
    };

    console.log("Submitting!", payload);
    setSampleLoading(true);
    await fetch(`/api/sample/`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkResponseAuth)
      .then((response) => {
        setSampleLoading(false);
        console.log(response);
        if (!response.ok) {
          setError({
            title: `${response.status} - ${response.statusText}`,
            description: `There was an error while uploading the sample. Try again.`,
          });
        } else {
          closeSampleModal();
          resetSampleDetails();
          getData();
          return response.json();
        }
      });
  };

  const handleAnalytes = () => {
    console.log("changing analytes");
    const {analytes} = cartridgeType;
    const measurements = analytes.map((analyte) => ({
      analyte_id: analyte.id,
      value: "",
    }));
    setSampleDetails({
      ...SampleDetails,
      measurements: measurements
    });
  };

  const closeAddSampleModal = () => {
    resetSampleDetails();
    closeSampleModal();
  };

  return (
    <>
      <Modal
        open={sampleModalVisibility}
        icon={<SampleIcon />}
        title="Sample"
        subtitle="Add"
        onClose={closeAddSampleModal}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card
            style={{
              padding: "20px",
            }}
          >
            <>
              <Typography gutterBottom variant="h3">
                Add a New Sample
              </Typography>

              <Typography gutterBottom variant="button">
                General Information
              </Typography>

              <br></br>

              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <InputLabel id="label-select-organization">
                      Cartridge Type
                    </InputLabel>
                    <Select
                      labelId="label-select-cartridge-type"
                      id="select-cartridge-types"
                      value={cartridgeType}
                      label="Cartridge Type"
                      onChange={(e) => {
                        setCartridgeType(e.target.value);
                      }}
                    >
                      {cartridgeTypes.map((ct) => {
                        return (
                          <MenuItem key={ct.id} value={ct}>
                            {ct.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
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
                    <InputLabel id="label-select-organization">
                      Source
                    </InputLabel>
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
                  <Grid item xs={4}>
                    <InputLabel id="label-select-flock">Flock</InputLabel>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={flocks}
                      sx={{ width: 300 }}
                      value={SampleDetails.flock_id}
                      onChange={handleSampleDetailsChange("flock_id")}
                      getOptionLabel={(option) => `${option.name}`}
                      inputValue={flockInput}
                      // defaultValue={flock}
                      onInputChange={handleFlockInputChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </Box>
            </>

            <></>
            <br />

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    error={ageError}
                    label="Age *"
                    value={SampleDetails.flock_age}
                    onChange={handleSampleDetailsChange("flock_age")}
                    helperText={ageError ? "Flock age is number only" : ""}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ width: "100%" }} required>
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

            <></>
            <br />

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    label="Rotor Lot Number"
                    value={SampleDetails.rotor_lot_number}
                    onChange={handleSampleDetailsChange("rotor_lot_number")}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl sx={{ width: "100%" }} required>
                    <InputLabel>Machine</InputLabel>
                    <Select
                      value={machine}
                      label="Machine"
                      onChange={(e) => setMachine(e.target.value)}
                    >
                      {machines.filter((m) => m.machine_type_id === cartridgeType.machine_type_id).map((m, index) => {
                        return (
                          <MenuItem value={m} key={index}>
                            {m.serial_number}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Grid>{sampleMeasurements()}</Grid>
            <br></br>
            <Grid className={classes.container}>
              <Typography gutterBottom variant="button">
                Categorize This Sample:
              </Typography>

              <RadioGroup
                value={SampleDetails.sample_type}
                onChange={handleSampleDetailsChange("sample_type")}
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
                >
                  Clear Selection
                </Button>
              )}
            </Grid>
            <br></br>
            <Typography variant="button">Comments</Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={SampleDetails.comments}
                    onChange={handleSampleDetailsChange("comments")}
                  />
                </Grid>
              </Grid>
            </Box>
            <br></br>
            <br></br>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} columns={16}>
                <Grid item xs={8}>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ width: 200 }}
                    onClick={() => {
                      closeAddSampleModal();
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
                        onSubmit();
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
          </Card>

          <br></br>

          <Grid item xs={12} sm={2}></Grid>
          <br></br>
          <Grid item xs={12} sm={2}></Grid>
          <br></br>

          <Grid>
            <br />
            {errorSubmission ? (
              <Typography
                gutterBottom
                variant="button"
                style={{
                  color: "red",
                  position: "relative",
                  // bottom: 50,
                  // left: 280,
                }}
              >
                Sample has missing fields.
              </Typography>
            ) : null}
          </Grid>
        </div>
      </Modal>
    </>
  );
}
