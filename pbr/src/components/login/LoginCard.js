import React from "react";
// import "./Login.css";
import LoginIcon from "@mui/icons-material/Login";
import { makeStyles, createStyles } from "@mui/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthConsumer from "../../services/useAuth";

import {
  Grid,
  Typography,
  FormControl,
  Stack,
  OutlinedInput,
  Alert,
  InputLabel,
  InputAdornment,
  FormHelperText,
  Paper,
  IconButton,
  Box,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import brickLogoNCSU from "../../images/NCSU Brick Logo.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    ncsuBrickLogo: {
      width: "250px",
      marginBottom: "20px",
    },
    loginText: {
      color: "#CC0000",
    },
    hr: {
      color: "grey",
      margin: "10, 0, 10, 0",
    },
  })
);

export default function LoginCard() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = AuthConsumer();
  const { state } = useLocation();

  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const [loading, setLoading] = React.useState(false);

  // For Field Validaton Errors
  const [errors, setErrors] = React.useState({});

  // For User Authentication Errors
  const [loginErrorMessage, setLoginErrorMessage] = React.useState("Error.");
  const [loginErrorToggle, setLoginErrorToggle] = React.useState(false);

  async function submitLogin() {
    await login(values.email, values.password)
      .then(() => {
        setLoading(false);
        navigate(state?.path || "/data-view");
      })
      .catch((error) => {
        setLoginErrorMessage("Error: " + error);
        setLoginErrorToggle(true);
        setLoading(false);
      });
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = (prop) => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function checkFormFields() {
    let tempErrors = {};
    if (values.email === "") {
      tempErrors.email = "Your Email is required.";
      console.log("Email Required.");
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      tempErrors.email = "Email is not valid.";
      console.log("Email Invalid.");
    }
    if (values.password === "") {
      tempErrors.password = "Your Password is required.";
      console.log("Password Required.");
    }

    setErrors({ ...tempErrors });
    if (Object.keys(tempErrors).length === 0) {
      return true; // Valid Data
    } else {
      return false; // Invalid Data
    }
  }

  function handleLoginClick() {
    setLoginErrorToggle(false);
    setLoginErrorMessage("");
    setLoading(true);
    // See if Required Fields are Entered
    if (checkFormFields()) {
      // Login Action
      submitLogin();
    }
  }

  const onKeyDown = (event) => {
    // Track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleLoginClick();
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
          <img
            className={classes.ncsuBrickLogo}
            src={brickLogoNCSU}
            alt="NCSU Brick Logo"
          />

          <Typography
            variant="h1"
            sx={{ fontWeight: "bold", width: "100%", textAlign: "center" }}
          >
            Poultry Bloodwork Reporting Tool
          </Typography>

          <Box sx={{ mt: 6, mb: 6, width: "100%" }}>
            {loginErrorToggle && (
              <Alert severity="error" color="error">
                {loginErrorMessage}
              </Alert>
            )}
            <FormControl
              sx={{ mt: 2, width: "100%" }}
              variant="outlined"
              required
              error={errors["email"] ? true : false}
            >
              <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
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
              variant="outlined"
              required
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
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {errors["password"] && (
                <FormHelperText>{errors["password"]}</FormHelperText>
              )}
            </FormControl>
          </Box>
          <Stack direction="row" spacing={2}>
            <Link to="/forgot-password">Forgot Password</Link>
            <Link to="/register">Sign Up</Link>
          </Stack>

          <LoadingButton
            onClick={handleLoginClick}
            endIcon={<LoginIcon />}
            loading={loading}
            fullWidth={true}
            sx={{ mt: 2 }}
            loadingPosition="end"
            variant="contained"
          >
            Login
          </LoadingButton>
        </Grid>
      </Box>
    </>
  );
}
