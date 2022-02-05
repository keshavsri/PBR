import React from "react";
import "../styles/Login.css";
import {
  Grid,
  Typography,
  TextField,
  Container,
  FormControl,
  FormHelperText,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  Card,
  IconButton,
  Box,
} from "@mui/material";
import { useEffect } from "react";

import LoadingButton from "@mui/lab/LoadingButton";

import SendIcon from "@mui/icons-material/Send";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
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

  let style = {
    "background-image": "../images/CVM-Building.jpeg",
    "background-position": "center",
    "background-size": "cover",
    "background-repeat": "no-repeat",
    height: "100%",
    position: "absolute",
    left: 0,
    width: "100%",
    overflow: "hidden",
  };

  useEffect(() => {
    for (var key in style) {
      window.document.body.style[key] = style[key];
    }
    return () => {
      window.document.body.style[key] = "";
    };
  }, [style]);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ pt: 10 }}
    >
      <Card sx={{ maxWidth: "sm", textAlign: "center", padding: 5 }}>
        <Box component="form">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h1" sx={{ fontWeight: "bold" }}>
              Poultry Bloodwork Reporting Tool
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
              Login
            </Typography>

            <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Username
              </InputLabel>
              <OutlinedInput
                value={values.username}
                onChange={handleChange("username")}
                label="Username"
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
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
            </FormControl>
            <LoadingButton
              onClick={handleClick}
              endIcon={<SendIcon />}
              loading={loading}
              fullWidth={true}
              sx={{ mt: 10 }}
              loadingPosition="end"
              variant="contained"
            >
              Login
            </LoadingButton>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
}
