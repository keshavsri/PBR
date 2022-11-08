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
import CloseIcon from "@mui/icons-material/Close";
import SampleIcon from "@mui/icons-material/Science";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import PrevIcon from "@mui/icons-material/ArrowBackIos";
import SubmitIcon from "@mui/icons-material/Publish";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { sampleTypes, ageUnits } from "../../../models/enums";

import NewAddSample from "./NewAddSample";

import CustomDialog from "../../CustomDialog";
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
  const { getData } = props;
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  useTheme();

  const {
    sampleModalVisibility,
    sampleModalScreen,
    closeSampleModal,

    samplePrevAction,
    sampleNextAction,
    error,
    setError,

    restartSample,
    timestamp,
    machineDetails,
    setSamplePayload,
    setSampleValidationErrors,
    sampleType,
    setSampleType,
    sampleLoading,
    setSampleLoading,
  } = useDataView();

  const { checkResponseAuth, user } = useAuth();

  const [organizations, setOrganizations] = React.useState([]);
  const [flocks, setFlocks] = React.useState([]);
  const [sources, setSources] = React.useState([]);
  const [cartridgeTypes, setCartridgeTypes] = React.useState([]);
  const [cartridgeType, setCartridgeType] = React.useState({});
  const [flock, setFlock] = React.useState({});
  const [flockInput, setFlockInput] = React.useState("");
  const [source, setSource] = React.useState({});
  const [organization, setOrganization] = React.useState({});
  const [expanded, setExpanded] = React.useState(true);
  const [roles, setRoles] = React.useState({});
  const [errorSubmission, setErrorSubmission] = React.useState(false);
  const [SampleDetails, setSampleDetails] = React.useState({
    comments: "",
    flock_age: null,
    flock_age_unit: null,
    sample_type: null,
    batch_id: null,
    measurements: [],
  });

    React.useEffect(() => {
    getRoles();
  }, [])

  const getOrganizations = async () => {
    const response = await fetch(`/api/organization/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    setOrganizations(data);
    setOrganization(data[0]);
  };

  const getRoles = async () => {
    const response = await fetch(`/api/enum/roles/`, {
      method: "GET",
    }).then(checkResponseAuth);
    const data = await response.json();
    setRoles(data);
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
    return (
      <>
        <Accordion
          defaultExpanded={true}
          expanded={expanded === 1}
          onChange={handleChange(1)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            {" "}
            <Typography variant="button" sx={{ width: "33%", flexShrink: 0 }}>
              Manual Entry:
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {cartridgeType.analytes &&
              SampleDetails.measurements &&
              SampleDetails.measurements.length > 0 &&
              cartridgeType.analytes.map((a, index) => {
                return (
                  <>
                    <TextField
                      label={a.abbreviation}
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
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 2} onChange={handleChange(2)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            {" "}
            <Typography variant="button" sx={{ width: "33%", flexShrink: 0 }}>
              Via OCR:
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="body2"> Coming Soon! </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 3} onChange={handleChange(3)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            {" "}
            <Typography variant="button" sx={{ width: "33%", flexShrink: 0 }}>
              Via File Upload:
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="body2"> Coming Soon! </Typography>
          </AccordionDetails>
        </Accordion>
      </>
    );
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
        console.log(measurements);
        setSampleDetails((prevState) => {
          return {
            ...prevState,
            measurements: measurements,
          };
        });
      });
  };



  React.useEffect(async () => {
    if (sampleModalVisibility) {
      if (user.role === roles["Super_Admin"]) {
        await getOrganizations();
      } else {
        setOrganization({id: user.organization_id});
      }

      await getCartridgeTypes();
    }
  }, [sampleModalVisibility]);

  React.useEffect(async () => {
    if (sampleModalVisibility) {
      await getSources();
    }
  }, [organization]);

  React.useEffect(async () => {
    if (sampleModalVisibility) {
      await getFlocks();
    }
  }, [source]);

  function handleFlockInputChange(event, value) {
    setFlockInput(value);
  }

  function handleFlockChange(event, value) {
    setFlock(value);
  }

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
      setOrganization({id: user.organization_id});
    }
    setSource(sources[0]);
    setFlock(flocks[0]);
    setCartridgeType(cartridgeTypes[0]);
  };

  let onSubmit = async () => {
    let payload = {
      comments: SampleDetails.comments,
      flock_age: SampleDetails.flock_age,
      flock_age_unit: SampleDetails.flock_age_unit,
      sample_type: SampleDetails.sample_type,
      batch_id: SampleDetails.batch_id,
      flock_id: flock.id,
      cartridge_type_id: cartridgeType.id,
      machine_id: SampleDetails.machine_id,
      measurements: SampleDetails.measurements,
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

  const handleAnalytes = (e) => {
    console.log("changing analytes");
    console.log(e.target.value.analytes);

    const measurements = e.target.value.analytes.map((analyte) => ({
      analyte_id: analyte.id,
      value: "",
    }));

    setSampleDetails((prevState) => {
      console.log("setting new analytes");
      return {
        ...prevState,
        measurements: measurements,
      };
    });

    console.log("new measurements", SampleDetails.measurements);
  };

  return (
    <>
      <Modal
        open={sampleModalVisibility}
        icon={<SampleIcon />}
        title="Sample"
        subtitle="Add"
        handleClose={closeSampleModal}
      >
        <div style={modalStyle} className={classes.paper}>
          <Card>
            <>
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
                        console.log("cartridge type", e.target.value);
                        handleAnalytes(e);
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
                    label="Age *"
                    value={SampleDetails.flock_age}
                    type="number"
                    onChange={handleSampleDetailsChange("flock_age")}
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
                  label={`${sampleTypes.SURVEILLANCE} Sample (Healthy)`}
                  control={<Radio />}
                />
                <FormControlLabel
                  value={sampleTypes.DIAGNOSTIC}
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
          </Card>

          <br></br>

          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              color="secondary"
              style={{
                position: "static",
                bottom: 50,
              }}
              onClick={() => {
                closeSampleModal();
                resetSampleDetails();
              }}
            >
              Cancel
            </Button>
          </Grid>
          <br></br>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              style={{
                position: "static",
                bottom: 50,
                left: 150,
              }}
              onClick={() => {
                onSubmit();
              }}
            >
              Save
            </Button>
          </Grid>
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
