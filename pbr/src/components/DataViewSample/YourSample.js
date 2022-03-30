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
  Checkbox,
  MenuItem,
  Switch,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  switchStack: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row !IMPORTANT",
  },
  compareSection: {
    minHeight: "56px",
  },
  compareTitle: {
    marginBottom: "0px !IMPORTANT",
    fontWeight: "700 !IMPORTANT",
    textAlign: "center",
  },
  reportSection: {
    border: "lightgrey 1px solid",
    height: "700px",
  },
});

export default function YourSample({ errorTitle, errorMessage }) {
  const classes = useStyles();
  useTheme();

  const [pdfReport, setPdfReport] = React.useState(
    "http://www.africau.edu/images/default/sample.pdf"
  );
  const [orgSwitch, setOrgSwitch] = React.useState(false);

  const handleOrgSwitchChange = (event) => {
    setOrgSwitch(event.target.checked);
  };

  return (
    <>
      <Typography variant="h3">Your Sample Entry</Typography>
      <Typography paragraph>
        Let’s see how your sample stacks up. Select a Measurement to observe,
        and whether or not you want to compare it against all flocks within the
        organization or all flocks in the system from all organizations.
      </Typography>
      <Box>
        <Grid container spacing={2} sx={{ mb: -2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%", mb: 2 }}>
              <InputLabel>Measurement</InputLabel>
              <Select label="Measurement">
                <MenuItem value={""}></MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.compareSection}>
            <Typography variant="h4" className={classes.compareTitle}>
              Compare To:
            </Typography>
            <Stack directon="row" className={classes.switchStack}>
              <Typography>Just This Org</Typography>
              <Switch
                checked={orgSwitch}
                onChange={handleOrgSwitchChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <Typography>All Orgs</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box className={classes.reportSection}></Box>
    </>
  );
}
