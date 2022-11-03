import React from "react";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

import {
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  Divider,
  OutlinedInput,
  Accordion,
  Autocomplete,
  AccordionSummary,
  Tooltip,
  Stack,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  Checkbox,
  FormHelperText,
  MenuItem,
  IconButton,
} from "@mui/material";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  genders,
  ageUnits,
  productionTypes,
  speciesTypes,
} from "../../../models/enums";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import { tooltipClasses } from "@mui/material/Tooltip";
import { createFilterOptions } from "@mui/material/Autocomplete";
import VetScanUpload from "./VetScanUpload";
import IStatUpload from "./IStatUpload";
import useAuth from "../../../services/useAuth";
import useDataView from "../../../services/useDataView";

const filter = createFilterOptions();

const Input = styled("input")({
  display: "none",
});

const useStyles = makeStyles({
  root: {
    "& .Mui-disabled": {
      backgroundColor: "#efefef",
    },
    "& .MuiTextField-root": {
      width: "100%",
    },
    "& .MuiAccordion-root": {
      backgroundColor: "rgba(0, 0, 0, 0.03)",

      "& .MuiFormControl-root": {
        backgroundColor: "#ffffff",
      },
      "& .MuiDivider-vertical": {
        height: "50px",
        margin: "0 15px",
      },
      "& .MuiInputLabel-root": {
        color: "grey !IMPORTANT",
      },
      "& .MuiInputAdornment-root .MuiTypography-root": {
        color: "grey !IMPORTANT",
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "0px",
    },
  },
  autoFilled: {
    "& .MuiInputBase-root": {
      backgroundColor: "rgb(37, 185, 0, 0.1) !IMPORTANT",
    },
  },
  headerWithButton: {
    marginBottom: "20px",
    "& .MuiTypography-h3": {
      marginBottom: "0px !IMPORTANT",
      flexGrow: 1,
    },
    "& .MuiTypography-h4": {
      marginBottom: "0px !IMPORTANT",
      flexGrow: 1,
    },
  },
  accordion: {
    minHeight: "48px",
  },
});

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function DataViewAddSample({
  organizations,
  sources,
  getSources,
  flocks,
  getFlocks,
  machineList,
}) {
  const classes = useStyles();
  useTheme();
  const {
    machineDetails,
    setMachineDetails,
    generalDetails,
    setGeneralDetails,
    timestamp,
    setTimestamp,
    sampleValidationErrors,
  } = useDataView();
  const { checkResponseAuth } = useAuth();

  // General Section Data

  const [errorMessage, setErrorMessage] = React.useState("Error.");
  const [errorToggle, setErrorToggle] = React.useState(false);
  const [loadingFile, setLoadingFile] = React.useState(false);

  const handleFlagChange = () => {
    setGeneralDetails({
      ...generalDetails,
      flagged: !generalDetails.flagged,
    });
  };

  const [flockNames, setFlockNames] = React.useState([]);
  const [strains, setStrains] = React.useState([]);

  const getStrains = async (species) => {
    console.log("Getting Strains");
    await fetch(`/api/flock/strains/${species}`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setStrains(data);
      });
  };

  const handleGeneralDetailsChange = (prop) => (event) => {
    console.log("Handling General Details Change");
    if (prop === "species") {
      setGeneralDetails({
        ...generalDetails,
        species: event.target.value,
        strain: "",
      });
      getStrains(event.target.value);
    } else if (prop === "organizationID") {
      console.log("Changing Organization");
      setGeneralDetails({
        ...generalDetails,
        organizationID: event.target.value,
        flockName: "",
        species: "",
        strain: "",
        gender: "",
        sourceID: "",
        productionType: "",
        ageUnit: "",
        ageNumber: "",
      });
      getFlocks();
      getSources();
    } else {
      setGeneralDetails({
        ...generalDetails,
        [prop]: event.target.value,
      });
    }
    console.log(generalDetails);
  };

  const handleFlockChange = (flockName) => {
    console.log("FLOCK NAME CHANGED:", flockName);
    if (flockName == null) {
      return;
    }
    if (flockName.inputValue) {
      console.log("NEW FLOCK");
      setGeneralDetails({
        ...generalDetails,
        flockName: flockName.inputValue,
        species: "",
        strain: "",
        gender: "",
        sourceID: "",
        productionType: "",
        ageNumber: "",
        ageUnit: "",
      });
    } else {
      let matchedFlock = flocks.find((flock) => flock.name === flockName);
      console.log("FOUND FLOCK:", matchedFlock);

      getStrains(matchedFlock.species);
      setGeneralDetails({
        ...generalDetails,
        flockName: matchedFlock.name,
        species: matchedFlock.species,
        strain: matchedFlock.strain,
        gender: matchedFlock.gender,
        sourceID: matchedFlock.source_id,
        productionType: matchedFlock.production_type,
        ageNumber: "",
        ageUnit: "",
      });
    }
    console.log(generalDetails);
  };

  const handleTimestampChange = () => (event) => {
    setTimestamp(event.target.value);
  };

  const getMachineByID = (machineID) => {
    return machineDetails.find((m) => m.id === machineID);
  };
  const getMeasurementByID = (machine, measID) => {
    return machine.measurements.find((meas) => meas.metadata.id === measID);
  };
  const getMachineInfoByID = (machine, infoID) => {
    return machine.info.find((info) => info.metadata.id === infoID);
  };
  const handleMeasurementChange = (machineID, measID) => (event) => {
    let newMachineDetails = [...machineDetails];
    console.log("Machine ID: " + machineID + " | Measurement ID: " + measID);
    let machine = getMachineByID(machineID);
    let meas = getMeasurementByID(machine, measID);
    meas.value = event.target.value;
    meas.metadata.inputSource = "manual";
    console.log(machine);
    for (let i = 0; i < newMachineDetails.length; i++) {
      if (newMachineDetails.id === machineID) {
        newMachineDetails[i] = machine;
        break;
      }
    }
    setMachineDetails(newMachineDetails);
  };

  const handleMachineInfoChange = (machineID, infoID) => (event) => {
    let newMachineDetails = [...machineDetails];
    console.log("Machine ID: " + machineID + " | Info ID: " + infoID);
    console.log("Event: ", event);
    let machine = getMachineByID(machineID);
    let machInfo = getMachineInfoByID(machine, infoID);
    machInfo.value = event.target.value;
    machInfo.metadata.inputSource = "manual";

    console.log(machine);
    for (let i = 0; i < newMachineDetails.length; i++) {
      if (newMachineDetails.id === machineID) {
        newMachineDetails[i] = machine;
        break;
      }
    }
    setMachineDetails(newMachineDetails);
  };

  const handleMachineTimestampChange = (machineID, infoID, newTimestamp) => {
    let newMachineDetails = [...machineDetails];
    console.log("Machine ID: " + machineID + " | Info ID: " + infoID);
    console.log("New Timestamp: ", newTimestamp);
    let machine = getMachineByID(machineID);
    let machInfo = getMachineInfoByID(machine, infoID);
    machInfo.value = newTimestamp;
    machInfo.metadata.inputSource = "manual";

    console.log(machine);
    for (let i = 0; i < newMachineDetails.length; i++) {
      if (newMachineDetails.id === machineID) {
        newMachineDetails[i] = machine;
        break;
      }
    }
    setMachineDetails(newMachineDetails);
  };

  const clearMachineData = (machine, autoOnly = false) => {
    console.log(`Clearing data for ${machine.name} - Auto Only? ${autoOnly}`);
    let newMachineDetails = [...machineDetails];
    let updatedMachine = { ...machine };
    console.log("Before: ", updatedMachine);
    for (let i = 0; i < updatedMachine.info.length; i++) {
      if (autoOnly && updatedMachine.info[i].metadata.inputSource === "file") {
        if (
          updatedMachine.info[i].metadata.type &&
          updatedMachine.info[i].metadata.type === "timestamp"
        ) {
          updatedMachine.info[i].value = null;
        } else {
          updatedMachine.info[i].value = "";
        }
        updatedMachine.info[i].metadata.inputSource = null;
      } else if (!autoOnly) {
        if (
          updatedMachine.info[i].metadata.type &&
          updatedMachine.info[i].metadata.typeame === "timestamp"
        ) {
          updatedMachine.info[i].value = null;
        } else {
          updatedMachine.info[i].value = "";
        }
        updatedMachine.info[i].metadata.inputSource = null;
      }

      console.log(
        `Set ${updatedMachine.info[i].metadata.name} to ${updatedMachine.info[i].value}`
      );
    }
    for (let i = 0; i < updatedMachine.measurements.length; i++) {
      updatedMachine.measurements[i].value = "";
      updatedMachine.measurements[i].metadata.inputSource = "";
      console.log(
        `Set ${updatedMachine.measurements[i].metadata.name} to ${updatedMachine.measurements[i].value}`
      );
    }
    console.log("After: ", updatedMachine);

    for (let i = 0; i < newMachineDetails.length; i++) {
      if (newMachineDetails.id === updatedMachine.id) {
        newMachineDetails[i] = updatedMachine;
        break;
      }
    }
    console.log(newMachineDetails);
    setMachineDetails(newMachineDetails);
  };

  const loadMachineData = (data, machine) => {
    console.log(data, machine);
    console.log("Loading in data.");
    console.log("Detected Machine was:", data.name);
    let newMachineDetails = [...machineDetails];
    let updatedMachine = { ...machine };
    if (machine.name === "VetScan VS2") {
      console.log("Loading in VetScan Info Data.");
      console.log(data.info);
      console.log(data.info.length);
      for (let i = 0; i < data.info.length; i++) {
        let inf = updatedMachine.info.find(
          (inf) => inf.metadata.name === data.info[i].key
        );
        if (inf) {
          inf.value = data.info[i].value;
          inf.metadata.inputSource = "file";
        }
      }

      console.log("Loading in VetScan Measurement Data.");
      console.log(data.measurements);
      for (let i = 0; i < data.measurements.length; i++) {
        let meas = updatedMachine.measurements.find(
          (meas) => meas.metadata.abbreviation === data.measurements[i].key
        );
        if (meas) {
          meas.value = data.measurements[i].value;
          meas.metadata.inputSource = "file";
          console.log("MEAS:", meas);
        }
      }

      for (let i = 0; i < newMachineDetails.length; i++) {
        if (newMachineDetails.id === updatedMachine.id) {
          newMachineDetails[i] = updatedMachine;
          break;
        }
      }

      console.log(newMachineDetails);
    }

    setMachineDetails(newMachineDetails);
    console.log(machineDetails);
  };

  let parseFilesAndAddData = async (files, machine) => {
    console.log("Parsing files -> Sending to API", files, machine);
    var data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("file", files[i]);
    }
    setLoadingFile(true);
    await fetch("/api/sample/parse", {
      method: "POST",
      body: data,
    })
      .then(checkResponseAuth)
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        console.log(body);
        console.log("Received body data. Clearing and loading");
        clearMachineData(machine);
        loadMachineData(body.data, machine);
        setLoadingFile(false);
      })
      .catch((error) => {
        setErrorMessage("Error: " + error);
        setErrorToggle(true);
        setLoadingFile(false);
      });
  };

  const parseMachineDetails = () => {
    console.log("Parsing Machine Details");
    let tmpMachineDetails = [];
    for (let i = 0; i < machineList.length; i++) {
      let currentMachine = machineList[i];
      let currentMachineDetails = {
        name: currentMachine.name,
        type: currentMachine.type ? currentMachine.type : "",
        id: currentMachine.id,
        info: [],
        measurements: [],
      };
      for (let j = 0; j < currentMachine.info.length; j++) {
        let currentInfo = currentMachine.info[j];
        let value = "";
        if (currentInfo.type && currentInfo.type === "timestamp") {
          value = null;
        }
        let currentInfoData = {
          metadata: currentInfo,
          value: value,
        };
        currentMachineDetails.info.push(currentInfoData);
      }
      for (let j = 0; j < currentMachine.measurements.length; j++) {
        let currentMeasurement = currentMachine.measurements[j];
        let currentMeasurementData = {
          metadata: currentMeasurement,
          value: "",
        };
        currentMachineDetails.measurements.push(currentMeasurementData);
      }
      tmpMachineDetails.push(currentMachineDetails);
    }
    setMachineDetails(tmpMachineDetails);
  };
  React.useEffect(() => {
    console.log("Rendering Add Sample: ", generalDetails, machineDetails);
    parseMachineDetails();
  }, []);

  React.useEffect(() => {
    parseMachineDetails();
  }, [machineList]);

  React.useEffect(() => {
    let flockNamesRet = [];
    for (let i = 0; i < flocks.length; i++) {
      flockNamesRet.push(flocks[i].name);
    }
    setFlockNames(flockNamesRet);
  }, [flocks]);

  const [accordionExpanded, setAccordionExpanded] = React.useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    console.log(panel);
    setAccordionExpanded(isExpanded ? panel : false);
  };
  const expandPanel = (panel) => {
    setAccordionExpanded(panel);
  };

  return (
    <Box className={classes.root}>
      <Box
        className={classes.headerWithButton}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Add Sample Entry</Typography>
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="inherit">FLAG SAMPLE</Typography>
              <u>
                {"Click this to draw a"} <b>{"Validator"}</b> {"or"}{" "}
                <b>{"Admin's"}</b> {"attention to this sample."}
              </u>{" "}
              {
                "Append any concerns or issues to the end of the Comments section of this sample entry."
              }
            </React.Fragment>
          }
        >
          <Checkbox
            icon={<OutlinedFlagIcon />}
            checked={generalDetails.flagged}
            onChange={handleFlagChange}
            checkedIcon={<FlagIcon />}
          />
        </HtmlTooltip>
      </Box>
      <Typography paragraph>
        Add data directly, or alternatively upload a file or photo of a machine
        report to autofill bloodwork data for that machine.
      </Typography>
      {/* <Typography paragraph>
        Files must be in .txt, .pdf, .jpg/.jpeg, or .heic format.
      </Typography> */}
      <Typography paragraph>Files must be in .txt format.</Typography>
      <Box>
        <Grid container spacing={2} sx={{ mb: -2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl
              sx={{ width: "100%", mb: 2 }}
              required
              error={
                sampleValidationErrors["organizationID"] &&
                generalDetails.organizationID === ""
                  ? true
                  : false
              }
            >
              <InputLabel>Organization</InputLabel>
              <Select
                value={generalDetails.organizationID}
                label="Organization"
                onChange={handleGeneralDetailsChange("organizationID")}
              >
                {console.log(organizations)}
                {organizations.map((org, index) => {
                  return (
                    <MenuItem value={org.id} key={index}>
                      {org.name} ({org.street_address}, {org.city}, {org.state}{" "}
                      {org.zip})
                    </MenuItem>
                  );
                })}
              </Select>
              {sampleValidationErrors["organizationID"] &&
                generalDetails.organizationID === "" && (
                  <FormHelperText>
                    {sampleValidationErrors["organizationID"]}
                  </FormHelperText>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Timestamp"
              fullWidth
              sx={{ width: "100%", mb: 2 }}
              readOnly
              value={timestamp}
              onChange={handleTimestampChange()}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Typography variant="h4">General</Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl
              required
              sx={{ width: "100%", mb: 2 }}
              error={
                sampleValidationErrors["flockName"] &&
                generalDetails.flockName === ""
                  ? true
                  : false
              }
            >
              <Autocomplete
                value={generalDetails.flockName}
                onChange={(event, newFlock) => {
                  console.log("NEW NAME:", newFlock);
                  handleFlockChange(newFlock);
                }}
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === "reset") {
                    setGeneralDetails({
                      ...generalDetails,
                      flockName: "",
                      species: "",
                      strain: "",
                      gender: "",
                      sourceID: "",
                      productionType: "",
                      ageUnit: "",
                      ageNumber: "",
                    });
                    return;
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  console.log(`Filtering: ${options}, ${inputValue}`);

                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.name
                  );

                  console.log(`isExisting: ${isExisting}`);
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      name: `Add "${inputValue}"`,
                    });
                  }

                  console.log("Finished Filter");
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={flockNames}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    console.log("Value from Existing");
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    console.log("Value from New Input");
                    return option.inputValue;
                  }
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.inputValue ? option.name : option}</li>
                )}
                sx={{ width: "100%" }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={
                      sampleValidationErrors["flockName"] &&
                      generalDetails.flockName === ""
                        ? true
                        : false
                    }
                    label="Flock Name *"
                  />
                )}
              />
              {sampleValidationErrors["flockName"] &&
                generalDetails.flockName === "" && (
                  <FormHelperText>
                    {sampleValidationErrors["flockName"]}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl
              required
              sx={{ width: "100%", mb: 2 }}
              error={
                sampleValidationErrors["species"] &&
                generalDetails.species === ""
                  ? true
                  : false
              }
            >
              <InputLabel>Species</InputLabel>
              <Select
                value={generalDetails.species}
                label="Species"
                onChange={handleGeneralDetailsChange("species")}
              >
                {Object.values(speciesTypes).map((species, index) => {
                  return (
                    <MenuItem value={species} key={index}>
                      {species}
                    </MenuItem>
                  );
                })}
              </Select>
              {sampleValidationErrors["species"] &&
                generalDetails.species === "" && (
                  <FormHelperText>
                    {sampleValidationErrors["species"]}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl
              required
              sx={{ width: "100%", mb: 2 }}
              error={
                sampleValidationErrors["strain"] && generalDetails.strain === ""
                  ? true
                  : false
              }
            >
              <InputLabel>Strain</InputLabel>
              <Select
                value={generalDetails.strain}
                disabled={!generalDetails.species ? true : false}
                label="Strain"
                onChange={handleGeneralDetailsChange("strain")}
              >
                {strains.map((strain, index) => {
                  return (
                    <MenuItem value={strain} key={index}>
                      {strain}
                    </MenuItem>
                  );
                })}
              </Select>
              {sampleValidationErrors["strain"] &&
                generalDetails.strain === "" && (
                  <FormHelperText>
                    {sampleValidationErrors["strain"]}
                  </FormHelperText>
                )}
            </FormControl>

            <FormControl
              required
              sx={{ width: "100%" }}
              error={
                sampleValidationErrors["gender"] && generalDetails.gender === ""
                  ? true
                  : false
              }
            >
              <InputLabel>Gender</InputLabel>
              <Select
                value={generalDetails.gender}
                label="Gender"
                onChange={handleGeneralDetailsChange("gender")}
              >
                {Object.values(genders).map((gender, index) => {
                  return (
                    <MenuItem value={gender} key={index}>
                      {gender}
                    </MenuItem>
                  );
                })}
              </Select>
              {sampleValidationErrors["gender"] &&
                generalDetails.gender === "" && (
                  <FormHelperText>
                    {sampleValidationErrors["gender"]}
                  </FormHelperText>
                )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              required
              sx={{ width: "100%", mb: 2 }}
              error={
                sampleValidationErrors["sourceID"] &&
                generalDetails.sourceID === ""
                  ? true
                  : false
              }
            >
              <InputLabel>Source</InputLabel>
              <Select
                value={generalDetails.sourceID}
                label="Source"
                onChange={handleGeneralDetailsChange("sourceID")}
              >
                {sources.map((source, index) => {
                  return (
                    <MenuItem value={source.id} key={index}>
                      {source.name} ({source.street_address}, {source.city},{" "}
                      {source.state} {source.zip})
                    </MenuItem>
                  );
                })}
              </Select>
              {sampleValidationErrors["sourceID"] &&
                generalDetails.sourceID === "" && (
                  <FormHelperText>
                    {sampleValidationErrors["sourceID"]}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl
              required
              sx={{ width: "100%", mb: 2 }}
              error={
                sampleValidationErrors["productionType"] &&
                generalDetails.productionType === ""
                  ? true
                  : false
              }
            >
              <InputLabel>Production Type</InputLabel>
              <Select
                value={generalDetails.productionType}
                label="Production Type"
                onChange={handleGeneralDetailsChange("productionType")}
              >
                <MenuItem value={""}></MenuItem>
                {Object.values(productionTypes).map((productionType, index) => {
                  return (
                    <MenuItem value={productionType} key={index}>
                      {productionType}
                    </MenuItem>
                  );
                })}
              </Select>
              {sampleValidationErrors["productionType"] &&
                generalDetails.productionType === "" && (
                  <FormHelperText>
                    {sampleValidationErrors["productionType"]}
                  </FormHelperText>
                )}
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl
                  required
                  sx={{ width: "100%" }}
                  error={
                    sampleValidationErrors["ageNumber"] &&
                    generalDetails.ageNumber === ""
                      ? true
                      : false
                  }
                >
                  <TextField
                    error={
                      sampleValidationErrors["ageNumber"] &&
                      generalDetails.ageNumber === ""
                        ? true
                        : false
                    }
                    label="Age *"
                    value={generalDetails.ageNumber}
                    type="number"
                    onChange={handleGeneralDetailsChange("ageNumber")}
                  />
                  {sampleValidationErrors["ageNumber"] &&
                    generalDetails.ageNumber === "" && (
                      <FormHelperText>
                        {sampleValidationErrors["ageNumber"]}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  sx={{ width: "100%" }}
                  required
                  error={
                    sampleValidationErrors["ageUnit"] &&
                    generalDetails.ageUnit === ""
                      ? true
                      : false
                  }
                >
                  <InputLabel>D/W/M/Y</InputLabel>
                  <Select
                    value={generalDetails.ageUnit}
                    label="D/W/M/Y *"
                    onChange={handleGeneralDetailsChange("ageUnit")}
                  >
                    {Object.values(ageUnits).map((unit, index) => {
                      return (
                        <MenuItem value={unit} key={index}>
                          {unit}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {sampleValidationErrors["ageUnit"] &&
                    generalDetails.ageUnit === "" && (
                      <FormHelperText>
                        {sampleValidationErrors["ageUnit"]}
                      </FormHelperText>
                    )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Typography variant="h4">Machine Data</Typography>

      {machineDetails.map((machine, machineIndex) => {
        return (
          <Accordion
            key={machineIndex}
            expanded={accordionExpanded === machine.id}
            onChange={handleAccordionChange(machine.id)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ width: "100%" }}
              >
                <Typography sx={{ flexGrow: 1 }}>
                  {machine.name} Data
                </Typography>
                {machine.name === "VetScan VS2" && (
                  <VetScanUpload
                    clearMachineData={clearMachineData}
                    expandPanel={expandPanel}
                    parseFilesAndAddData={parseFilesAndAddData}
                    machine={machine}
                  />
                )}
                {machine.name === "iStat" && (
                  <IStatUpload
                    parseFilesAndAddData={parseFilesAndAddData}
                    expandPanel={expandPanel}
                    machine={machine}
                  />
                )}
              </Stack>
              <Divider orientation="vertical" />
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2} sx={{ mb: -2 }}>
                <Grid item xs={12} sm={6}>
                  {machine.info
                    .slice(0, Math.ceil(machine.info.length / 2))
                    .map((data, dataIndex) => {
                      return (
                        <Box key={dataIndex}>
                          {data.metadata.type &&
                            data.metadata.type === "timestamp" && (
                              <Box
                                sx={{ mb: 2, width: "100%" }}
                                className={
                                  data.metadata.inputSource === "file"
                                    ? classes.autoFilled
                                    : ""
                                }
                              >
                                <DateTimePicker
                                  label={data.metadata.name}
                                  fullWidth
                                  renderInput={(props) => (
                                    <TextField {...props} />
                                  )}
                                  value={data.value}
                                  onChange={(newValue) => {
                                    handleMachineTimestampChange(
                                      machine.id,
                                      data.metadata.id,
                                      newValue
                                    );
                                  }}
                                />
                              </Box>
                            )}
                          {(!data.metadata.type ||
                            (data.metadata.type &&
                              data.metadata.type !== "timestamp")) && (
                            <FormControl
                              key={dataIndex}
                              sx={{ mb: 2, width: "100%" }}
                              variant="outlined"
                              className={
                                data.metadata.inputSource === "file"
                                  ? classes.autoFilled
                                  : ""
                              }
                            >
                              <InputLabel>{data.metadata.name}</InputLabel>
                              <OutlinedInput
                                value={data.value}
                                label={data.metadata.name}
                                onChange={handleMachineInfoChange(
                                  machine.id,
                                  data.metadata.id
                                )}
                              />
                            </FormControl>
                          )}
                        </Box>
                      );
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {machine.info
                    .slice(
                      Math.ceil(machine.info.length / 2),
                      machine.info.length
                    )
                    .map((data, dataIndex) => {
                      return (
                        <Box key={dataIndex}>
                          {data.metadata.key === "timestamp" && (
                            <Box
                              sx={{ mb: 2, width: "100%" }}
                              className={
                                data.metadata.inputSource === "file"
                                  ? classes.autoFilled
                                  : ""
                              }
                            >
                              <DateTimePicker
                                label={data.metadata.name}
                                fullWidth
                                value={data.value}
                                onChange={handleMachineInfoChange(
                                  machine.id,
                                  data.metadata.id
                                )}
                                renderInput={(params) => (
                                  <TextField {...params} />
                                )}
                              />
                            </Box>
                          )}
                          {data.metadata.key !== "timestamp" && (
                            <FormControl
                              key={dataIndex}
                              sx={{ mb: 2, width: "100%" }}
                              variant="outlined"
                              className={
                                data.metadata.inputSource === "file"
                                  ? classes.autoFilled
                                  : ""
                              }
                            >
                              <InputLabel>{data.metadata.name}</InputLabel>
                              <OutlinedInput
                                value={data.value}
                                label={data.metadata.name}
                                onChange={handleMachineInfoChange(
                                  machine.id,
                                  data.metadata.id
                                )}
                              />
                            </FormControl>
                          )}
                        </Box>
                      );
                    })}
                </Grid>
              </Grid>
              <Divider />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {machine.measurements
                    .slice(0, Math.ceil(machine.measurements.length / 2))
                    .map((measurement, measurementIndex) => {
                      return (
                        <FormControl
                          key={measurementIndex}
                          sx={{ mb: 2, width: "100%" }}
                          variant="outlined"
                          className={
                            measurement.metadata.inputSource === "file"
                              ? classes.autoFilled
                              : ""
                          }
                        >
                          <InputLabel>
                            {measurement.metadata.name &&
                            measurement.metadata.name != ""
                              ? measurement.metadata.abbreviation
                                ? `${measurement.metadata.name} (${measurement.metadata.abbreviation})`
                                : `${measurement.metadata.name}`
                              : `${measurement.metadata.abbreviation}`}
                          </InputLabel>
                          <OutlinedInput
                            type={measurement.metadata.datatype}
                            value={measurement.value}
                            onChange={handleMeasurementChange(
                              machine.id,
                              measurement.metadata.id
                            )}
                            label={
                              measurement.metadata.name &&
                              measurement.metadata.name != ""
                                ? `${measurement.metadata.name} (${measurement.metadata.abbreviation})`
                                : `${measurement.metadata.abbreviation}`
                            }
                            endAdornment={
                              <InputAdornment position="end">
                                {measurement.metadata.units
                                  ? measurement.metadata.units
                                  : ""}
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      );
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {machine.measurements
                    .slice(
                      Math.ceil(machine.measurements.length / 2),
                      machine.measurements.length
                    )
                    .map((measurement, measurementIndex) => {
                      return (
                        <FormControl
                          key={measurementIndex}
                          sx={{ mb: 2, width: "100%" }}
                          variant="outlined"
                          className={
                            measurement.metadata.inputSource === "file"
                              ? classes.autoFilled
                              : ""
                          }
                        >
                          <InputLabel>
                            {measurement.metadata.name &&
                            measurement.metadata.name != ""
                              ? measurement.metadata.abbreviation
                                ? `${measurement.metadata.name} (${measurement.metadata.abbreviation})`
                                : `${measurement.metadata.name}`
                              : `${measurement.metadata.abbreviation}`}
                          </InputLabel>
                          <OutlinedInput
                            type={measurement.metadata.datatype}
                            value={measurement.value}
                            onChange={handleMeasurementChange(
                              machine.id,
                              measurement.metadata.id
                            )}
                            label={
                              measurement.metadata.name &&
                              measurement.metadata.name != ""
                                ? `${measurement.metadata.name} (${measurement.metadata.abbreviation})`
                                : `${measurement.metadata.abbreviation}`
                            }
                            endAdornment={
                              <InputAdornment position="end">
                                {measurement.metadata.units
                                  ? measurement.metadata.units
                                  : ""}
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      );
                    })}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
      <Divider />
      <Box
        className={classes.headerWithButton}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Comments</Typography>
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="inherit">FLAG SAMPLE</Typography>
              <u>
                {"Click this to draw a"} <b>{"Validator"}</b> {"or"}{" "}
                <b>{"Admin's"}</b> {"attention to this sample."}
              </u>{" "}
              {
                "Append any concerns or issues to the end of the Comments section of this sample entry."
              }
            </React.Fragment>
          }
        >
          <Checkbox
            icon={<OutlinedFlagIcon />}
            checked={generalDetails.flagged}
            onChange={handleFlagChange}
            checkedIcon={<FlagIcon />}
          />
        </HtmlTooltip>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={generalDetails.comments}
              onChange={handleGeneralDetailsChange("comments")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}