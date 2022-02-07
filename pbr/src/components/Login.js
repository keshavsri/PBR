import React from "react";
// import "./Login.css";
import LoginIcon from "@mui/icons-material/Login";
import { makeStyles, createStyles } from "@mui/styles";

import {
  Grid,
  Typography,
  FormControl,
  Stack,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  Paper,
  Link,
  IconButton,
  Box,
  Grow,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImage from "../images/CVM-Building.jpeg";
import brickLogoNCSU from "../images/NCSU Brick Logo.svg";

const useStyles = makeStyles((theme) =>
  createStyles({
    ncsuBrickLogo: {
      width: "250px",
      marginBottom: "20px",
    },
    loginBackdrop: {
      backgroundImage: `url("${backgroundImage}")`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      height: "100vh",
      width: "100%",
      filter: "blur(8px)",
      webkitFilter: "blur(8px)",
      position: "absolute",
      left: "0",
      top: "0",
      zIndex: "-1",
      transition: "all .6s",
    },
    root: {
      backgroundColor: theme.palette.background.default,
      height: "100%",
      textAlign: "center",
      width: "100%",
    },
    hr: {
      color: "grey",
      margin: "10, 0, 10, 0",
    },
  })
);

export default function Login() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    username: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

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

  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
  }

  return (
    <>
      <div className={classes.loginBackdrop}></div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <Grow in={true}>
          <Paper
            elevation={12}
            sx={{
              raised: true,
              maxWidth: "sm",
              textAlign: "center",
              padding: 5,
              maxHeight: "100vh",
              overflow: "scroll",
            }}
          >
            <Box component="form">
              <Grid
                justifyContent="center"
                container
                direction="row"
                alignItems="center"
              >
                <img className={classes.ncsuBrickLogo} src={brickLogoNCSU} />
                <Typography variant="h1" sx={{ fontWeight: "bold" }}>
                  Poultry Bloodwork Reporting Tool
                </Typography>
                <Box sx={{ mt: 6, mb: 6, width: "100%" }}>
                  <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Username
                    </InputLabel>
                    <OutlinedInput
                      value={values.username}
                      onChange={handleChange("username")}
                      label="Username"
                    />
                  </FormControl>
                  <FormControl sx={{ mt: 2, width: "100%" }} variant="outlined">
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
                  </FormControl>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Link href="/forgot-password">Forgot Password</Link>
                  <Link href="/register">Sign Up</Link>
                </Stack>

                <LoadingButton
                  onClick={handleClick}
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
          </Paper>
        </Grow>
      </Grid>
    </>
  );
}
