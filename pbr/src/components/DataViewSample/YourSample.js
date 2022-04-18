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
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});

export default function YourSample() {
  const classes = useStyles();
  useTheme();

  const [orgSwitch, setOrgSwitch] = React.useState(false);

  const reportData = React.useState({});

  React.useEffect(() => {
    console.log("Rendered Sample Entry.");
  }, []);

  const handleOrgSwitchChange = (event) => {
    setOrgSwitch(event.target.checked);
    console.log(
      "Switching Org:",
      !event.target.checked ? "Just this org" : "All Orgs"
    );
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
          <Grid item xs={12} sm={12} className={classes.compareSection}>
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
      <Box className={classes.reportSection}>
        <Typography>Insert Data Here</Typography>
      </Box>
    </>
  );
}
