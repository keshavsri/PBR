import * as React from "react";

import {
  Button,
  Box,
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
  ListItemText,
  ListItem,
} from "@mui/material";
import SampleIcon from "@mui/icons-material/Science";
import ErrorIcon from "@mui/icons-material/Error";

import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

import { createFilterOptions } from "@mui/material/Autocomplete";
import { sampleTypes, ageUnits } from "../../../models/enums";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import UploadFileIcon from '@mui/icons-material/UploadFile';

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
    setError,
    setSampleType,
    setSampleModalVisibility,
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
  const [SampleDetails, setSampleDetails] = React.useState({
    comments: "",
    flock_age: null,
    flock_age_unit: null,
    sample_type: null,
    batch_id: null,
    measurements: [],
    rotor_lot_number: "",
  });
  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);

  const [errorSubmission, setErrorSubmission] = React.useState(false);
  const [errorSubmissionMessages, setErrorSubmissionMessages] = React.useState(
    []
  );

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

  const [loading, setLoading] = React.useState(false);

  const [createdSample, setCreatedSample] = React.useState(null);

  const closeModal = async () => {
    let result = await onSampleChange();
    setSampleModalVisibility(false);
    setCreatedSample(null);

    setErrorSubmission(false);
    resetSampleDetails();
    setErrorSubmissionMessages([]);

    getData();
    // setTimeout(() => {
    //   getData();
    // }, 1000);
  };

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

    onSampleChange();
  };

  const clearSampleType = () => {
    setSampleType("");
  };

  const sampleMeasurements = () => {
    const { measurements } = SampleDetails;
    const { analytes } = cartridgeType;
    return (
      <>
        <Grid item xs={12}>
          <br></br>
          <Typography gutterBottom variant="button">
            Sample Measurements
          </Typography>
        </Grid>
        <Box>
          {analytes &&
            analytes.length > 0 &&
            measurements &&
            measurements.length > 0 &&
            analytes.map((a, index) => {
              const measurement = measurements.find(
                (meas) => meas.analyte_id === a.id
              );
              return renderMeasurement(measurement, a);
            })}
        </Box>
      </>
    );
  };
  const renderMeasurement = (measurement, analyte) => {
    if (measurement && analyte) {
      return (
        <>
          <TextField
            label={analyte.abbreviation}
            style={{ margin: 4 }}
            value={measurement.value}
            onChange={(e) => {
              const measurements = SampleDetails.measurements;
              const measurement = measurements.find(
                (meas) => meas.analyte_id === analyte.id
              );
              measurement.value = e.target.value;
              setSampleDetails((prevState) => {
                return { ...prevState, measurements: measurements };
              });
              onSampleChange();
            }}
          />
        </>
      );
    }
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
        setCartridgeType(data[0]);
        const measurements = data[0].analytes.map((analyte) => ({
          analyte_id: analyte.id,
          value: "",
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

  React.useEffect(async () => {
    await onFileUpload();
  }, [selectedFile]);
  
  React.useEffect(async () => {
    if (sampleModalVisibility && createdSample === null) {
      console.log(flock);
      onSubmit();
    }
  }, [flock]);
  

  const validateSample = () => {
    let valid = true;
    let errors = [];

    if (
      (isNaN(SampleDetails.flock_age) && SampleDetails.flock_age != null) ||
      (!isNaN(SampleDetails.flock_age) &&
        SampleDetails.flock_age <= 0 &&
        SampleDetails.flock_age != null)
    ) {
      errors.push("Flock age is positive number only");
      valid = false;
    }

    for (let i = 0; i < SampleDetails.measurements.length; i++) {
      if (
        isNaN(SampleDetails.measurements[i].value) &&
        SampleDetails.measurements[i].value != null
      ) {
        errors.push("Sample measurements must be numbers");
        valid = false;
      }
    }

    if (valid === false) {
      setErrorSubmissionMessages(errors);
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
      rotor_lot_number: "",
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

  const onSampleChange = async () => {
    console.log(flocks);
    let cartridgeTypeId = cartridgeType.id;
    const newSampleDetails = SampleDetails;
    const measurements = newSampleDetails.measurements;
    measurements.forEach((meas) => {
      if (meas.value === "") {
        meas.value = null;
      }
    });

    setLoading(true);

    let payload = {};

    if (validateSample()) {
      payload = {
        cartridge_type_id: cartridgeTypeId,
        comments: SampleDetails.comments,
        sample_type: SampleDetails.sample_type,
        flock_age: SampleDetails.flock_age,
        flock_age_unit: SampleDetails.flock_age_unit,
        organization_id: organization.id,
        rotor_lot_number: SampleDetails.rotor_lot_number,
        machine_id: machine.id,
        flock_id: flock.id,
        measurements: measurements,
      };

      await fetch(`/api/sample/${createdSample}`, {
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
            setTimeout(() => {
              setLoading(false);
            }, 1000);
            return response.json();
          }
        });
    }
  };

  let onSubmit = async () => {
    const newSampleDetails = SampleDetails;
    const measurements = newSampleDetails.measurements;
    measurements.forEach((meas) => {
      if (meas.value === "") {
        meas.value = null;
      }
    });

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
        if (!response.ok) {
          setError({
            title: `${response.status} - ${response.statusText}`,
            description: `There was an error while uploading the sample. Try again.`,
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setCreatedSample(data.id);
      });
  };

  const deleteSample = async () => {
    await fetch(`/api/sample/permanent/${createdSample}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(checkResponseAuth)
      .then((response) => {
        if (!response.ok) {
          setError({
            title: `${response.status} - ${response.statusText}`,
            description: `There was an error while deleting the sample. Try again.`,
          });
        } else {
          resetSampleDetails();

          getData();
        }
      });
  };

  const handleAnalytes = (e) => {
    const { analytes } = cartridgeType;
    const measurements = analytes.map((analyte) => ({
      analyte_id: analyte.id,
      value: "",
    }));
    setSampleDetails({
      ...SampleDetails,
      measurements: measurements,
    });
  };

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const onFileUpload = () => {
    const formData = new FormData();

    formData.append('file', selectedFile);
    fetch(
      'api/sample/parse',
      {
        method: "POST",
        body: formData
      }
      )
    .then(checkResponseAuth)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const formMeasurements = [...SampleDetails.measurements];
      const fileMeasurements = json.data.measurements;
      const abbrevToMeasurements = {};
      formMeasurements.forEach((measurement) => {
        measurement.value = null;
      })

      cartridgeType.analytes.forEach((analyte) => {
        abbrevToMeasurements[analyte.abbreviation] = formMeasurements.find((measurement) => measurement.analyte_id === analyte.id);
      })


      
      fileMeasurements.forEach((fileMeasurement) => {
        const measurement = abbrevToMeasurements[fileMeasurement.key];
        if (measurement) {
          measurement.value = Number(fileMeasurement.value);
        }

      })


      setSampleDetails((prevState) => {
        return { ...prevState, measurements: formMeasurements };
      });
    });
  };


  return (
    <>
      <Modal
        open={sampleModalVisibility}
        icon={<SampleIcon />}
        title="Sample"
        subtitle="Add"
        onClose={closeModal}
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
                        onSampleChange();
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
                            onSampleChange();
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
                        onSampleChange();
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
                    <InputLabel id="label-select-flocks">Flocks</InputLabel>
                    <Select
                      labelId="label-select-flocks"
                      id="select-flocks"
                      value={flock}
                      label="flock"
                      onChange={(e) => {
                        setFlock(e.target.value);
                        onSampleChange();
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
                </Grid>
              </Box>
            </>

            <></>
            <br />

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    error={
                      (isNaN(SampleDetails.flock_age) &&
                        SampleDetails.flock_age != null) ||
                      (!isNaN(SampleDetails.flock_age) &&
                        SampleDetails.flock_age <= 0 &&
                        SampleDetails.flock_age != null)
                    }
                    label="Age *"
                    value={SampleDetails.flock_age}
                    onChange={handleSampleDetailsChange("flock_age")}
                    helperText={
                      (isNaN(SampleDetails.flock_age) &&
                        SampleDetails.flock_age != null) ||
                      (!isNaN(SampleDetails.flock_age) &&
                        SampleDetails.flock_age <= 0 &&
                        SampleDetails.flock_age != null)
                        ? "Age must be positive number"
                        : ""
                    }
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

            <br/>

            {cartridgeType.machine_type_id === 2 &&

            <>
              <Box>
                <Button  component={"label"} variant={'contained'}>
                  <Typography>
                    Upload measurements from a file
                  </Typography>
                  <UploadFileIcon/>
                  <input onChange={onFileChange} type={"file"} hidden/>
                </Button>


              </Box>
            </>
            }

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
                      {machines
                        .filter(
                          (m) =>
                            m.machine_type_id === cartridgeType.machine_type_id
                        )
                        .map((m, index) => {
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
                      deleteSample();
                      closeModal();
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>

                <Grid item xs={8}>
                  {loading ? (
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<SaveIcon />}
                      variant="outlined"
                      style={{ width: 200, border: "1px solid red" }}
                      color="primary"
                    >
                      <Typography
                        gutterBottom
                        variant="button"
                        style={{
                          color: "red",
                        }}
                      >
                        {" "}
                        Saving ...
                      </Typography>
                    </LoadingButton>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ width: 200 }}
                      onClick={() => {
                        if (validateSample()) {
                          onSampleChange();
                          closeModal();
                          setSampleModalVisibility(false);
                          setCreatedSample(null);
                        } else {
                          setErrorSubmission(true);
                        }
                      }}
                    >
                      Save
                    </Button>
                  )}
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
                  <ListItem>
                    <ErrorIcon />
                    <ListItemText primary=" Fix Error before saving Sample" />
                  </ListItem>
                </Typography>
              ) : null}
            </Box>
          </Card>
        </div>
      </Modal>
    </>
  );
}
