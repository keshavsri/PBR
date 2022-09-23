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
import FlagIcon from "@mui/icons-material/Flag";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
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


// Start of Add Organization Functionality

export default function DataViewAddOrganization({
    organizations,
    sources,
    getSources,
    machineList,
  }) {

    let payload = {

        // Organization Parameters
        /*
        id: unique identifier for the organization
        name: name of the organization
        street: street address of the organization
        city: city of the organization
        state: state enum of the organization
        zip: zip code of the organization
        notes: notes for the organization
        sources: list of sources used by the organization
        */
      };

    const createOrganization = () => {
        console.log(`Creating new Organization`);
        
        // API Call for POST Organization --> Not Complete

        /*
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
                    description: `There was an error while creating the sample. Try again.`,
                });
                } else {
                return response.json();
                }
            });

        */
    
    
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

        </Box>
        </Box>
    )
}