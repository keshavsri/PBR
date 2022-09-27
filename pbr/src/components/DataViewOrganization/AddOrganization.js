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
  organizationRoles
} from "../../models/enums";
import { tooltipClasses } from "@mui/material/Tooltip";
import { createFilterOptions } from "@mui/material/Autocomplete";
import useAuth from "../../services/useAuth";
import useDataView from "../../services/useDataView";

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

const [organizationDetails, setOrganizationDetails] = React.useState({
  name: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  notes: ""
});

const handleOrganizationDetailsChange = (prop) => (event) => {
  console.log("Handling Organization Details Change");

  setOrganizationDetails({
    ...organizationDetails,
    [prop]: event.target.value,
  });
  
  console.log(organizationDetails);
};

const getOrganizationData = async () => {
  await fetch(`/api/organization/`, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .then(checkResponseAuth)
    .then((data) => {
      console.log(data);
      // denestMachineData(data.rows);
      // assignRowHtml(data.rows);
      // setRowList(data.rows);
      // getHeadCells(data.types);

      // Do something with data
    });
};


// Start of Add Organization Functionality

export default function DataViewAddOrganization({
    organizations
  }) {
    const classes = useStyles();
    useTheme();
    const {
      sampleValidationErrors,
    } = useDataView();
    const { checkResponseAuth } = useAuth();



      let onSubmit = async () => {
        console.log(`Creating new Organization`);

        let payload = {

          // Organization Parameters

          name: organizationDetails.name,
          street: organizationDetails.street,
          city: organizationDetails.city,
          state: organizationDetails.state,
          zip: organizationDetails.zip,
          notes: organizationDetails.notes

        };
        
        // API Call for POST Organization

        
        await fetch(`/api/organization/`, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
            })
            .then(checkResponseAuth)
            .then((response) => {
                console.log(response);
                if (!response.ok) {
                setError({
                    title: `${response.status} - ${response.statusText}`,
                    description: `There was an error while creating the organization. Try again.`,
                });
                } else {
                getOrganizationData();
                return response.json();
                }
            });

        
    
    
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
            <Typography variant="h3">Add Organization</Typography>

            {/* Name Field */}
            <Box sx={{ flexGrow: 1 }}>
              <FormControl
                required
                sx={{ width: "100%", mb: 2 }}
                error={
                  organizationDetails.name === ""
                    ? true
                    : false
                }
              >
                  <TextField
                    error={
                      organizationDetails.name === ""
                        ? true
                        : false
                    }
                    label="Organization Name *"
                    value={organizationDetails.name}
                    type="text"
                    onChange={handleOrganizationDetailsChange("name")}
                  />
                  {organizationDetails.name === "" (
                      <FormHelperText>
                        {"Organization name field is required."}
                      </FormHelperText>
                    )}
              </FormControl>
            </Box>

            {/* Street Field */}
            <Box sx={{ flexGrow: 1 }}>
              <FormControl
                required
                sx={{ width: "100%", mb: 2 }}
                error={
                  organizationDetails.street === ""
                    ? true
                    : false
                }
              >
                  <TextField
                    error={
                      organizationDetails.street === ""
                        ? true
                        : false
                    }
                    label="Street *"
                    value={organizationDetails.street}
                    type="text"
                    onChange={handleOrganizationDetailsChange("street")}
                  />
                  {organizationDetails.street === "" (
                      <FormHelperText>
                        {"Street field is required."}
                      </FormHelperText>
                    )}
              </FormControl>
            </Box>
              
              {/* City Field */}
              <Box sx={{ flexGrow: 1 }}>
              <FormControl
                required
                sx={{ width: "100%", mb: 2 }}
                error={
                  organizationDetails.city === ""
                    ? true
                    : false
                }
              >
                  <TextField
                    error={
                      organizationDetails.city === ""
                        ? true
                        : false
                    }
                    label="City *"
                    value={organizationDetails.city}
                    type="text"
                    onChange={handleOrganizationDetailsChange("city")}
                  />
                  {organizationDetails.city === "" (
                      <FormHelperText>
                        {"City field is required."}
                      </FormHelperText>
                    )}
              </FormControl>
            </Box>

            {/* State Field */}
            <Box sx={{ flexGrow: 1 }}>
              <FormControl
                required
                sx={{ width: "100%", mb: 2 }}
                error={
                  organizationDetails.state === ""
                    ? true
                    : false
                }
              >
                  <TextField
                    error={
                      organizationDetails.state === ""
                        ? true
                        : false
                    }
                    label="State *"
                    value={organizationDetails.stetae}
                    type="text"
                    onChange={handleOrganizationDetailsChange("state")}
                  />
                  {organizationDetails.state === "" (
                      <FormHelperText>
                        {"State field is required."}
                      </FormHelperText>
                    )}
              </FormControl>
            </Box>

            {/* Zip Field */}
            <Box sx={{ flexGrow: 1 }}>
              <FormControl
                required
                sx={{ width: "100%", mb: 2 }}
                error={
                  organizationDetails.zip === ""
                    ? true
                    : false
                }
              >
                  <TextField
                    error={
                      organizationDetails.zip === ""
                        ? true
                        : false
                    }
                    label="Zip *"
                    value={organizationDetails.zip}
                    type="text"
                    onChange={handleOrganizationDetailsChange("zip")}
                  />
                  {organizationDetails.zip === "" (
                      <FormHelperText>
                        {"Zip field is required."}
                      </FormHelperText>
                    )}
              </FormControl>
            </Box>

          </Box>
        </Box>
    )
}