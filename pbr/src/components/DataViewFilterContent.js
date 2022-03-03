import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  Divider,
  OutlinedInput,
  Chip,
  Button,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  MenuItem,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { genders, validationStates, sampleTypes } from "../models/enums";

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

const useStyles = makeStyles({});

function getStyles(name, filterList, theme) {
  return {
    fontWeight:
      filterList.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function DataViewFilterContent() {
  const classes = useStyles();
  const theme = useTheme();

  // General Section Data

  const [generalFilterState, setGeneralFilterState] = React.useState({
    flockID: "",
    species: "",
    strain: "",
    gender: "",
    ageRange: "",
    validationStatus: "",
    sampleType: "",
    batch: "",
    dataCollector: "",
    organiztion: "",
  });

  const handleGeneralFilterChange = (prop) => (event) => {
    console.log("General Filter changed: ", prop, event.target.value);
    setGeneralFilterState({
      ...generalFilterState,
      [prop]: event.target.value,
    });
    console.log(generalFilterState);
  };

  const handleValidationStatusChange = () => (event) => {
    if (event.target.value != validationStates.VALIDATED) {
      setGeneralFilterState({
        ...generalFilterState,
        ...{ sampleType: "", validationStatus: event.target.value },
      });
      console.log("Remove Sample Types from Filter", generalFilterState);
    } else {
      setGeneralFilterState({
        ...generalFilterState,
        validationStatus: event.target.value,
      });
      console.log("Change Validation State", generalFilterState);
    }
  };

  // Sources Section Data

  const [sourcesList, setSourcesList] = React.useState(
    Array.from(Array(50).keys()).map((x) => `Checkbox ${x}`)
  );
  const [sourcesFilter, setSourcesFilter] = React.useState([]);

  const handleSourcesFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setSourcesFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Production Types Section Data

  const [prodTypesList, setProdTypesList] = React.useState(
    Array.from(Array(5).keys()).map((x) => `Checkbox ${x}`)
  );
  const [prodTypesFilter, setProdTypesFilter] = React.useState([]);

  const handleProdTypesFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setProdTypesFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Supervisory Section Data

  const [dataCollectorsList, setDataCollectorsList] = React.useState([]);
  const [dataCollectorsFilter, setDataCollectorsFilter] = React.useState([]);
  const [organizationsList, setOrganizationsList] = React.useState([]);
  const [organizationsFilter, setOrganizationsFilter] = React.useState([]);

  const handleDataCollectorsFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setDataCollectorsFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleOrganizationsFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setOrganizationsFilter(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // API Call Example

  const getSomethingAPICall = () => {
    // fetch(`/api/organization/orgCode/${selectedOrganization.id}`, {method: "GET",})
    //   .then((response) => {
    //     return response.json();
    //   }).then((data) => {
    //     console.log(data);
    //     setOrgCodeData(data);
    //   })
    // let mockedOrgCode = {
    //   orgCode: "873450",
    //   validTill: "2021-12-10T13:45:00.000Z",
    // };
    // console.log(mockedOrgCode);
    // setOrgCodeData(mockedOrgCode);
  };

  // Always run

  React.useEffect(() => {}, []);

  return (
    <>
      <Typography variant="h3">Filter Table Data</Typography>
      <Typography variant="h4">General</Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <InputLabel>Flock ID</InputLabel>
              <Select
                value={generalFilterState.flockID}
                label="Flock ID"
                onChange={handleGeneralFilterChange("flockID")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <InputLabel>Species</InputLabel>
              <Select
                value={generalFilterState.species}
                label="Species"
                onChange={handleGeneralFilterChange("species")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <InputLabel>Strain</InputLabel>
              <Select
                value={generalFilterState.strain}
                label="Strain"
                onChange={handleGeneralFilterChange("strain")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={generalFilterState.gender}
                label="Gender"
                onChange={handleGeneralFilterChange("gender")}
              >
                <MenuItem value={""}></MenuItem>
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
              <InputLabel>Age Range</InputLabel>
              <Select
                value={generalFilterState.ageRange}
                label="Age Range"
                onChange={handleGeneralFilterChange("ageRange")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <InputLabel>Validation Status</InputLabel>
              <Select
                value={generalFilterState.validationStatus}
                label="Validation Status"
                onChange={handleValidationStatusChange()}
              >
                <MenuItem value={""}></MenuItem>
                {Object.values(validationStates).map((state, index) => {
                  return (
                    <MenuItem value={state} key={index}>
                      {state}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl
              sx={{ width: "100%", mb: 2 }}
              disabled={
                generalFilterState.validationStatus !==
                validationStates.VALIDATED
              }
            >
              <InputLabel>Sample Type</InputLabel>
              <Select
                value={generalFilterState.sampleType}
                label="Sample Type"
                onChange={handleGeneralFilterChange("sampleType")}
              >
                <MenuItem value={""}></MenuItem>
                {Object.values(sampleTypes).map((type, index) => {
                  return (
                    <MenuItem value={type} key={index}>
                      {type}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Batch</InputLabel>
              <Select
                value={generalFilterState.batch}
                label="Batch"
                onChange={handleGeneralFilterChange("batch")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ flexGrow: 1, marginBottom: 0 }} variant="h4">
          Sources
        </Typography>

        {sourcesFilter.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSourcesFilter([])}
          >
            Clear All
          </Button>
        )}
        {sourcesFilter.length == 0 && (
          <Button
            variant="contained"
            size="small"
            onClick={() => setSourcesFilter(sourcesList)}
          >
            Select All
          </Button>
        )}
      </Box>
      <FormControl sx={{ mt: 2, width: "100%" }}>
        <InputLabel id="demo-multiple-chip-label">
          Sources to Display
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={sourcesFilter}
          onChange={handleSourcesFilterChange}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Sources to Display"
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.length != sourcesList.length && (
                <>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </>
              )}
              {selected.length == sourcesList.length && (
                <>All Available Sources</>
              )}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {sourcesList.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, sourcesFilter, theme)}
            >
              <Checkbox checked={sourcesFilter.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ flexGrow: 1, marginBottom: 0 }} variant="h4">
          Production Types
        </Typography>

        {prodTypesFilter.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setProdTypesFilter([])}
          >
            Clear All
          </Button>
        )}
        {prodTypesFilter.length == 0 && (
          <Button
            variant="contained"
            size="small"
            onClick={() => setProdTypesFilter(prodTypesList)}
          >
            Select All
          </Button>
        )}
      </Box>
      <FormControl sx={{ mt: 2, width: "100%" }}>
        <InputLabel id="demo-multiple-chip-label">
          Production Types to Display
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={prodTypesFilter}
          onChange={handleProdTypesFilterChange}
          input={
            <OutlinedInput
              id="select-multiple-chip"
              label="Production Types to Display"
            />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.length != prodTypesList.length && (
                <>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </>
              )}
              {selected.length == prodTypesList.length && (
                <>All Available Production Types</>
              )}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {prodTypesList.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, prodTypesFilter, theme)}
            >
              <Checkbox checked={prodTypesFilter.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider />

      <Typography variant="h4">Additional Filters</Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Data Collector</InputLabel>
              <Select
                value={generalFilterState.dataCollector}
                label="Data Collector"
                onChange={handleGeneralFilterChange("dataCollector")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Organization</InputLabel>
              <Select
                value={generalFilterState.organization}
                label="Organization"
                onChange={handleGeneralFilterChange("organization")}
              >
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
