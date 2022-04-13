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
  Accordion,
  Autocomplete,
  AccordionSummary,
  Tooltip,
  Stack,
  AccordionDetails,
  TextField,
  InputAdornment,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  MenuItem,
  Switch,
  IconButton,
} from "@mui/material";
import DataViewConsumer from "../../services/useDataView";

import { sampleTypes } from "../../models/enums";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  container: {
    height: "15rem",
  },
});

export default function CategorizeSample() {
  const classes = useStyles();
  useTheme();
  const { sampleType, setSampleType } = DataViewConsumer();

  const handleSampleTypeChange = (event) => {
    setSampleType(event.target.value);
  };

  const clearSampleType = () => {
    setSampleType("");
  };

  return (
    <Box className={classes.container}>
      <Typography variant="h3">Categorize This Sample</Typography>
      <Typography paragraph>
        Before we can submit this sample entry, let’s categorize it!
      </Typography>
      <RadioGroup value={sampleType} onChange={handleSampleTypeChange}>
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
      {sampleType != "" && (
        <Button
          sx={{ mt: "0.5rem", ml: "-0.25rem" }}
          size="small"
          onClick={clearSampleType}
        >
          Clear Selection
        </Button>
      )}
    </Box>
  );
}
