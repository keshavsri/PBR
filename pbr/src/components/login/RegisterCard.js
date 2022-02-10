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
  InputAdornment,
  FormHelperText,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import brickLogoNCSU from "../../images/NCSU Brick Logo.svg";
import HelpIcon from "@mui/icons-material/Help";

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

export default function RegisterCard() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    password2: "",
    showPassword: false,
    orgCode: "",
  });

  // For Field Validaton Errors
  const [errors, setErrors] = React.useState({});

  // For Sign Up Backend Errors
  const [signUpErrorMessage, setSignUpErrorMessage] = React.useState("Error.");
  const [signUpErrorToggle, setSignUpErrorToggle] = React.useState(false);

  const orgCodeExplainer = `You should have received an Organization Code from an Administrator in order to create an account.`;

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function validateOrgCode() {
    console.log("Validating Org Code");
    return true;
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
    if (values.firstname == "") {
      tempErrors.firstname = "Your First Name is required.";
      console.log("First Name Required.");
    }
    if (values.lastname == "") {
      tempErrors.lastname = "Your Last Name is required.";
      console.log("Last Name Required.");
    }
    if (values.password == "") {
      tempErrors.password = "Your Password is required.";
      console.log("Password Required.");
    }
    if (values.password2 == "") {
      tempErrors.password2 = "Confirm your Password.";
      console.log("Password Not Confirmed.");
    }
    if (
      values.password != "" &&
      values.password2 != "" &&
      values.password != values.password2
    ) {
      tempErrors.password = "Passwords do not match.";
      tempErrors.password2 = "Passwords do not match.";
      console.log("Password do not match.");
    }
    if (values.orgCode == "") {
      tempErrors.orgCode = "Organization Code Required.";
      console.log("Organization Code Required.");
    } else if (!validateOrgCode(values.orgCode)) {
      tempErrors.orgCode = "Invalid Organization Code.";
      console.log("Invalid Organization Code.");
    }

    setErrors({ ...tempErrors });
    if (Object.keys(tempErrors).length === 0) {
      return true; // Valid Data
    } else {
      return false; // Invalid Data
    }
  }

  function signUp() {
    console.log("Signing up user!");
  }

  const [loading, setLoading] = React.useState(false);
  function handleSubmit() {
    console.log("Handling Submission.");
    setSignUpErrorToggle(false);
    setSignUpErrorMessage("");
    setLoading(true);
    if (checkFormFields()) {
      console.log("Form was Valid.");
      signUp(); // Login Action
    }
    setLoading(false);
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
      <Paper
        elevation={12}
        sx={{
          raised: true,
          maxWidth: "sm",
          textAlign: "center",
          padding: 5,
          overflow: "scroll",
        }}
      >
        <Box component="form">
          <Grid
            justifyContent="center"
            container
            direction="row"
            alignItems="center"
            onKeyDown={onKeyDown}
          >
            <img className={classes.ncsuBrickLogo} src={brickLogoNCSU} />
            <Typography variant="h1" sx={{ fontWeight: "bold" }}>
              Poultry Bloodwork Reporting Tool
            </Typography>

            <Box sx={{ mt: 6, mb: 6, width: "100%" }}>
              {signUpErrorToggle && (
                <Alert severity="error" color="error">
                  {signUpErrorMessage}
                </Alert>
              )}
              <FormControl
                sx={{ mt: 2, width: "100%" }}
                required
                variant="outlined"
                error={errors["email"] ? true : false}
              >
                <InputLabel htmlFor="outlined-adornment-email">
                  Email
                </InputLabel>
                <OutlinedInput
                  value={values.email}
                  onChange={handleChange("email")}
                  label="Email"
                />
                {errors["email"] && (
                  <FormHelperText>{errors["email"]}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                sx={{ mt: 2, width: "100%" }}
                required
                variant="outlined"
                error={errors["firstname"] ? true : false}
              >
                <InputLabel htmlFor="outlined-adornment-firstname">
                  First Name
                </InputLabel>
                <OutlinedInput
                  value={values.firstname}
                  onChange={handleChange("firstname")}
                  label="First Name"
                />
                {errors["firstname"] && (
                  <FormHelperText>{errors["firstname"]}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                sx={{ mt: 2, width: "100%" }}
                required
                variant="outlined"
                error={errors["lastname"] ? true : false}
              >
                <InputLabel htmlFor="outlined-adornment-lastname">
                  Last Name
                </InputLabel>
                <OutlinedInput
                  value={values.lastname}
                  onChange={handleChange("lastname")}
                  label="Last Name"
                />
                {errors["lastname"] && (
                  <FormHelperText>{errors["lastname"]}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                sx={{ mt: 2, width: "100%" }}
                required
                variant="outlined"
                error={errors["password"] ? true : false}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {errors["password"] && (
                  <FormHelperText>{errors["password"]}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                sx={{ mt: 2, width: "100%" }}
                required
                variant="outlined"
                error={errors["password2"] ? true : false}
              >
                <InputLabel htmlFor="outlined-adornment-password2">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password2"
                  type={values.showPassword ? "text" : "password"}
                  value={values.password2}
                  onChange={handleChange("password2")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm Password"
                />
                {errors["password2"] && (
                  <FormHelperText>{errors["password2"]}</FormHelperText>
                )}
              </FormControl>
              <FormControl
                sx={{ mt: 2, width: "100%" }}
                required
                variant="outlined"
                error={errors["orgCode"] ? true : false}
              >
                <InputLabel htmlFor="outlined-adornment-orgcode">
                  Organization Code
                </InputLabel>
                <OutlinedInput
                  value={values.username}
                  onChange={handleChange("orgCode")}
                  label="Organization Code"
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title={orgCodeExplainer} placement="left" arrow>
                        <HelpIcon />
                      </Tooltip>
                    </InputAdornment>
                  }
                />
                {errors["orgCode"] && (
                  <FormHelperText>{errors["orgCode"]}</FormHelperText>
                )}
              </FormControl>
            </Box>
            <Stack direction="row" spacing={2}>
              <Link to="/login">Switch to Login Screen</Link>
            </Stack>

            <LoadingButton
              onClick={handleSubmit}
              endIcon={<HowToRegIcon />}
              loading={loading}
              fullWidth={true}
              sx={{ mt: 2 }}
              loadingPosition="end"
              color="secondary"
              variant="contained"
            >
              Sign Up
            </LoadingButton>
          </Grid>
        </Box>
      </Paper>
    </>
  );
}
