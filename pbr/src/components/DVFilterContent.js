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
  Autocomplete,
  TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  genders,
  validationStates,
  sampleTypes,
  productionTypes,
  ageUnits,
  speciesTypes,
} from "../models/enums";
import { createFilterOptions } from "@mui/material/Autocomplete";

import useDataView from "../services/useDataView";
import useAuth from "../services/useAuth";

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

const useStyles = makeStyles({});

function getStyles(name, filterList, theme) {
  return {
    fontWeight:
      filterList.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function DataViewFilterContent(props) {
  const {
    rows,
  } = props;
  const classes = useStyles();
  const theme = useTheme();

  const parseRows = () => {
    let orgIDList = [];
    rows.map((row, index) => {
      row.organization.map((org) => {
        if (!orgIDList.includes(org.id)){
          let temp = organizationsList;
          temp.append(org);
          setOrganizationsList(temp);
        }
      })
    });
  }

  // General Section Data

  const {
    generalFilterState,
    setGeneralFilterState
  } = useDataView();
  const { checkResponseAuth } = useAuth();

  const handleGeneralFilterChange = (prop) => (event) => {
    console.log("General Filter changed: ", prop, event.target.value);

    if (prop === "species") {
      setGeneralFilterState({
        ...generalFilterState,
        species: event.target.value,
        strain: "",
      });
      getStrains(event.target.value);
    } else if (prop === "organizationID") {
      setGeneralFilterState({
        ...generalFilterState,
        organizationID: event.target.value,
        flockID: null,
      });
      getSources(event.target.value);
    } else {
      setGeneralFilterState({
        ...generalFilterState,
        [prop]: event.target.value,
      });
      console.log(generalFilterState);
    }
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
  let prodTypesArray = Object.values(productionTypes);
  const [prodTypesList, setProdTypesList] = React.useState(prodTypesArray);
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
  const [flocks, setFlocks] = React.useState([]);
  const [strains, setStrains] = React.useState([]);
  const [batches, setBatches] = React.useState([]);
  const [sources, setSources] = React.useState([]);
  const [organizations, setOrganizations] = React.useState([]);

  const getSources = async (organization) => {
    console.log("Getting sources for " + organization.name);
    // await fetch(`/api/source`, {
    //   method: "GET",
    // })
    //   .then(handleAPIResponse)
    //   .then((response)=> {
    //     return response.json()
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     setSources(data);
    //   });
    let mockSources = [
      {
        id: "1",
        name: "Source A",
        street_address: "123 Main Street",
        city: "Raleigh",
        state: "NC",
        zip: "27606",
      },
      {
        id: "2",
        name: "Source B",
        street_address: "456 Main Street",
        city: "Raleigh",
        state: "NC",
        zip: "27606",
      },
    ];
    setSources(mockSources);
  };

  const getFlocks = () => {
    let mockFlocks = [{ id: 1852 }, { id: 2531 }, { id: 3491 }];
    setFlocks(mockFlocks);
  };

  const handleFlockChange = (id) => {

    setGeneralFilterState({
      ...generalFilterState,
      flockID: id,
    });
  };
  const getStrains = async (species) => {
    await fetch(`/api/sample/strains/${species}`, {
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

  const getBatches = async () => {
    await fetch(`/api/datapoint/batch`, {
      method: "GET",
    })
      .then(checkResponseAuth)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setBatches(data);
      });
  };

  const getOrganizations = async () => {
    // await fetch(`/api/organization`, {
    //   method: "GET",
    // })
    //   .then(handleAPIResponse)
    //   .then((response)=> {
    //     return response.json()
    //   })
    //   .then((data) => {
    //     console.log(data);
    //     setSources(data);
    //   });
    let mockOrganizations = [
      {
        id: "1",
        name: "Organization A",
        street_address: "123 Main Street",
        city: "Raleigh",
        state: "NC",
        zip: "27606",
        default: "true",
      },
      {
        id: "2",
        name: "Organization B",
        street_address: "456 Main Street",
        city: "Raleigh",
        state: "NC",
        zip: "27606",
      },
    ];
    setOrganizations(mockOrganizations);
  };
  // Always run
  React.useEffect(() => {
    getOrganizations();
    getFlocks();
    getBatches();
  }, []);

  return (
    <>
      <Typography variant="h3">Filter Table Data</Typography>
      <Typography variant="h4">General</Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <Autocomplete
              value={generalFilterState.flockID}
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
                if (option.id) {
                  return `Flock ${option.id}`;
                }
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
                value={generalFilterState.species}
                label="Species"
                onChange={handleGeneralFilterChange("species")}
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
                value={generalFilterState.strain}
                disabled={!generalFilterState.species ? true : false}
                label="Strain"
                onChange={handleGeneralFilterChange("strain")}
              >
                {strains.map((strain, index) => {
                  return (
                    <MenuItem value={strain} key={index}>
                      {strain}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={generalFilterState.gender}
                label="Gender"
                onChange={handleGeneralFilterChange("gender")}
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
                {Object.values(batches).map((batch, index) => {
                  return (
                    <MenuItem value={batch} key={index}>
                      {batch.id}
                    </MenuItem>
                  );
                })}
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
                value={generalFilterState.organizationID}
                label="Organization"
                onChange={handleGeneralFilterChange("organizationID")}
              >
                {organizations.map((org, index) => {
                  return (
                    <MenuItem value={org} key={index}>
                      {org.name} ({org.street_address}, {org.city}, {org.state}{" "}
                      {org.zip})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
