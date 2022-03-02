import React from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { Link, useNavigate } from "react-router-dom";

import {
  Grid,
  Typography,
  FormControl,
  Stack,
  OutlinedInput,
  InputLabel,
  Paper,
  FormHelperText,
  Box,
  Alert,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import brickLogoNCSU from "../../images/NCSU Brick Logo.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    ncsuBrickLogo: {
      width: "250px",
      marginBottom: "20px",
    },
    hr: {
      color: "grey",
      margin: "10, 0, 10, 0",
    },
  })
);

export default function RecoveryCard() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    email: "",
  });

  // For Field Validaton Errors
  const [errors, setErrors] = React.useState({});

  // For Toast Message
  const [messageToggle, setMessageToggle] = React.useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  async function sendResetEmail() {
    setMessageToggle(true);
    console.log("Sending Password Reset Email to ", values.email);
  }

  function checkFormFields() {
    let tempErrors = {};
    if (values.email == "") {
      tempErrors.email = "Your Email is required.";
      console.log("Email Required.");
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      tempErrors.email = "Email is not valid.";
      console.log("Email Invalid.");
    }

    setErrors({ ...tempErrors });
    if (Object.keys(tempErrors).length === 0) {
      return true; // Valid Data
    } else {
      return false; // Invalid Data
    }
  }

  const [loading, setLoading] = React.useState(false);
  function handleSubmit() {
    setMessageToggle(false);
    setLoading(true);
    // See if Required Fields are Entered
    if (checkFormFields()) {
      console.log("Form was Valid.");
      sendResetEmail().then(() => {
        setLoading(false);
      });
    }
  }

  const onKeyDown = (event) => {
    // Track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleSubmit();
    }
  };

  return (
    <>
      <Box component="form">
        <Grid
          justifyContent="center"
          container
          direction="row"
          alignItems="center"
          onKeyDown={onKeyDown}
        >
          <img className={classes.ncsuBrickLogo} src={brickLogoNCSU} />
          <Typography variant="h1" sx={{ fontWeight: "bold", width: "100%" }}>
            Reset Password
          </Typography>
          <Box sx={{ mt: 6, mb: 6, width: "100%" }}>
            {messageToggle && (
              <Alert severity="info" color="info">
                If this email is in our system, we have sent it a password reset
                link.
              </Alert>
            )}
            <FormControl
              sx={{ mt: 2, width: "100%" }}
              required
              variant="outlined"
              error={errors["email"] ? true : false}
            >
              <InputLabel>Email</InputLabel>
              <OutlinedInput
                value={values.email}
                onChange={handleChange("email")}
                label="Email"
              />
              {errors["email"] && (
                <FormHelperText>{errors["email"]}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Stack direction="row" spacing={2}>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </Stack>

          <LoadingButton
            onClick={handleSubmit}
            endIcon={<SendIcon />}
            loading={loading}
            fullWidth={true}
            sx={{ mt: 2 }}
            loadingPosition="end"
            variant="contained"
            color="secondary"
          >
            Send Recovery Email
          </LoadingButton>
        </Grid>
      </Box>
    </>
  );
}
