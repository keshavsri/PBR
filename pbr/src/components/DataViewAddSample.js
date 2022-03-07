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
  Chip,
  InputAdornment,
  Button,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
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
} from "../models/enums";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import { tooltipClasses } from "@mui/material/Tooltip";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Input = styled("input")({
  display: "none",
});

const useStyles = makeStyles({
  root: {
    "& .MuiTextField-root": {
      width: "100%",
    },
    "& .MuiAccordion-root": {
      backgroundColor: "rgba(0, 0, 0, 0.03)",
      paddingTop: "10px",
      paddingBottom: "10px",
      "& .MuiFormControl-root": {
        backgroundColor: "#ffffff",
      },
      "& .MuiDivider-vertical": {
        height: "50px",
        marginLeft: "15px",
        marginRight: "15px",
      },
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

export default function DataViewAddSample() {
  const classes = useStyles();
  const theme = useTheme();

  // General Section Data

  const [timestamp, setTimestamp] = React.useState(Date.now());

  const handleFlagChange = () => {
    setGeneralDetails({
      ...generalDetails,
      flagged: !generalDetails.flagged,
    });
  };

  const [generalDetails, setGeneralDetails] = React.useState({
    organization: "",
    flockID: "",
    species: "",
    strain: "",
    gender: "",
    source: "",
    productionType: "",
    ageNumber: "",
    ageUnit: "",
    flagged: false,
    comments: "",
  });

  const handleGeneralDetailsChange = (prop) => (event) => {
    console.log("General Details changed: ", event.target.value);
    setGeneralDetails({
      ...generalDetails,
      [prop]: event.target.value,
    });
    console.log(generalDetails);
  };

  const handleFlockChange = (flock) => {
    console.log("Flock changed: ", flock);
    setGeneralDetails({
      ...generalDetails,
      flockID: flock.id,
    });
    console.log(generalDetails);
  };

  const handleTimestampChange = () => (event) => {
    setTimestamp(event.target.value);
  };

  const [machineDetails, setMachineDetails] = React.useState([]);

  // Machine List
  const [machineList, setMachineList] = React.useState([]);

  const getMachineList = () => {
    let mockMachineList = [
      {
        name: "VetScan VS2",
        measurements: [
          { abbrev: "AST", units: "U/L", datatype: "number" },
          { abbrev: "BA", units: "umol/L", datatype: "number" },
          { abbrev: "CK", units: "U/L", datatype: "number" },
          { abbrev: "UA", units: "mg/dL", datatype: "number" },
          {
            name: "Glucose",
            abbrev: "GLU",
            units: "mg/dL",
            datatype: "number",
          },
          {
            name: "Total Calcium",
            abbrev: "CA",
            units: "mg/dL",
            datatype: "number",
          },
          {
            name: "Phosphorus",
            abbrev: "PHOS",
            units: "mg/dL",
            datatype: "number",
          },
          {
            name: "Total Protein",
            abbrev: "TP",
            units: "g/dL",
            datatype: "number",
          },
          {
            name: "Albumen",
            abbrev: "ALB",
            units: "g/dL",
            datatype: "number",
          },
          {
            name: "Globulin",
            abbrev: "GLOB",
            units: "g/dL",
            datatype: "number",
          },
          {
            name: "Potassium",
            abbrev: "K+",
            units: "mmol/L",
            datatype: "number",
          },
          {
            name: "Sodium",
            abbrev: "NA+",
            units: "mmol/L",
            datatype: "number",
          },
          { abbrev: "QC", datatype: "number" },
          { abbrev: "HEM", datatype: "number" },
          { abbrev: "LIP", datatype: "number" },
          { abbrev: "ICT", datatype: "number" },
        ],
      },
    ];

    setMachineList(mockMachineList);
  };

  const [flocks, setFlocks] = React.useState([]);

  const getFlocks = () => {
    let mockFlocks = [{ id: 1852 }, { id: 2531 }, { id: 3491 }];

    setFlocks(mockFlocks);
  };

  // Always run
  React.useEffect(() => {
    getMachineList();
    getFlocks();
    setInterval(() => {
      setTimestamp(Date.now());
    }, 1000);
  }, []);

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
      <Typography paragraph>
        Files must be in .txt, .pdf, .jpg/.jpeg, or .heic format.
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Organization</InputLabel>
              <Select
                value={generalDetails.organization}
                label="Organization"
                onChange={handleGeneralDetailsChange("organization")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="Timestamp"
              fullWidth
              sx={{ width: "100%" }}
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
            <Autocomplete
              value={generalDetails.flockID}
              sx={{ width: "100%", mb: 2 }}
              onChange={(event, newValue) => {
                handleFlockChange(newValue);
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.id
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    title: `Add Flock "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              options={flocks}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                // Regular option
                return `Flock ${option.id}`;
              }}
              renderOption={(props, option) => <li {...props}>{option.id}</li>}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Flock ID" />
              )}
            />
            <FormControl sx={{ width: "100%", mb: 2 }}>
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
            </FormControl>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <InputLabel>Strain</InputLabel>
              <Select
                value={generalDetails.strain}
                label="Strain"
                onChange={handleGeneralDetailsChange("strain")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ width: "100%" }}>
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
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <InputLabel>Source</InputLabel>
              <Select
                value={generalDetails.source}
                label="Source"
                onChange={handleGeneralDetailsChange("source")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%", mb: 2 }}>
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
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Age"
                  value={generalDetails.ageNumber}
                  type="number"
                  onChange={handleGeneralDetailsChange("ageNumber")}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel>D/W/M/Y</InputLabel>
                  <Select
                    value={generalDetails.ageUnit}
                    label="D/W/M/Y"
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
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Typography variant="h4">Machine Data</Typography>

      {machineList.map((machine, machineIndex) => {
        return (
          <Accordion key={machineIndex}>
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
                <label htmlFor="icon-button-file">
                  <Input accept="image/*" id="icon-button-file" type="file" />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
                <label htmlFor="contained-button-file">
                  <Input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                  />
                  <Button variant="contained" size="small" component="span">
                    Upload
                  </Button>
                </label>
              </Stack>
              <Divider orientation="vertical" />
            </AccordionSummary>
            <AccordionDetails>
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
                        >
                          <InputLabel>
                            {measurement.name
                              ? `${measurement.name} (${measurement.abbrev})`
                              : `${measurement.abbrev}`}
                          </InputLabel>
                          <OutlinedInput
                            type={measurement.datatype}
                            value={""}
                            label={
                              measurement.name
                                ? `${measurement.name} (${measurement.abbrev})`
                                : `${measurement.abbrev}`
                            }
                            endAdornment={
                              <InputAdornment position="end">
                                {measurement.units}
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
                        >
                          <InputLabel>
                            {measurement.name
                              ? `${measurement.name} (${measurement.abbrev})`
                              : `${measurement.abbrev}`}
                          </InputLabel>
                          <OutlinedInput
                            type={measurement.datatype}
                            value={""}
                            label={
                              measurement.name
                                ? `${measurement.name} (${measurement.abbrev})`
                                : `${measurement.abbrev}`
                            }
                            endAdornment={
                              <InputAdornment position="end">
                                {measurement.units}
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
